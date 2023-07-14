import { OpenAI, PromptTemplate } from "langchain";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import {
  ConversationalRetrievalQAChain,
  RetrievalQAChain,
  SequentialChain,
  VectorDBQAChain,
  MultiRetrievalQAChain,
  LLMChain,
} from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PlanAndExecuteAgentExecutor } from "langchain/experimental/plan_and_execute";
import { BufferMemory } from "langchain/memory";
import { ChainTool } from "langchain/tools";
import { WeaviateStore } from "langchain/vectorstores/weaviate";
import weaviate from "weaviate-ts-client";
import { z } from "zod";
import { env } from "~/env.mjs";
import { Message } from "~/interfaces/message";
import { createTRPCRouter, publicProcedure } from "../trpc";

const model = new ChatOpenAI({
  temperature: 0,
  modelName: "gpt-3.5-turbo",
  verbose: true,
});

const embeddings = new OpenAIEmbeddings();

const client = weaviate.client({
  scheme: env.WEAVIATE_SCHEME,
  host: env.WEAVIATE_HOST,
  apiKey: new weaviate.ApiKey(env.WEAVIATE_API_KEY),
});

const CUSTOM_QUESTION_GENERATOR_CHAIN_PROMPT = `Given the following conversation and a follow up question, return the conversation history excerpt that includes any relevant context to the question if it exists and rephrase the follow up question to be a standalone question.
Chat History:
{chat_history}
Follow Up Input: {question}
Your answer should follow the following format:
\`\`\`
Use the following pieces of context to answer the users question.
If you don't know the answer, just say that you don't know, don't try to make up an answer.
----------------
<Relevant chat history excerpt as context here>
Standalone question: <Rephrased question here>
\`\`\`
Your answer:`;

const prompt_template = `You are an expert psychologist who are helping a colleague. They have a work-related question. Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say you don't know. DO NOT try to make up an answer.
If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.

Context: {context}

Question: {question}:

Helpful answer:`;

const PROMPT = new PromptTemplate({
  template: prompt_template,
  inputVariables: ["context", "question"],
});

const NUM_SOURCES = 5;
const SIMILARITY_THRESHOLD = 0.3;

async function getVectorStore(indexName: string) {
  return await WeaviateStore.fromExistingIndex(embeddings, {
    client,
    indexName: indexName,
  });
}

async function getConversationalRetrievalChain(indexName: string) {
  const vectorStore = await getVectorStore(indexName);

  console.debug("created vector store");
  const prompt_template = `You are an expert psychologist who are helping a colleague. They have a work-related question. Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say you don't know. DO NOT try to make up an answer.
If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.

Context: {context}

Question: question_${indexName}:

Helpful answer:`;

  const PROMPT = new PromptTemplate({
    template: prompt_template,
    inputVariables: ["context", `question_${indexName}`],
  });

  const chain = ConversationalRetrievalQAChain.fromLLM(
    model,
    vectorStore.asRetriever(NUM_SOURCES, {
      distance: SIMILARITY_THRESHOLD,
      where: {
        operator: "NotEqual",
        path: ["author"],
        valueText: "Aslak",
      },
    }),
    {
      memory: new BufferMemory({
        memoryKey: "chat_history", // Must be set to "chat_history"
        inputKey: `question_${indexName}`,
        outputKey: `text_${indexName}`,
        returnMessages: true,
      }),
      qaTemplate: prompt_template,
      qaChainOptions: {
        type: "stuff",
        prompt: PROMPT,
      },
      // questionGeneratorTemplate: prompt_template,
      // questionGeneratorChainOptions: {
      //   template: CUSTOM_QUESTION_GENERATOR_CHAIN_PROMPT,
      // },
      returnSourceDocuments: false,
      outputKey: `text_${indexName}`,
      inputKey: `question_${indexName}`,
    }
  );

  console.debug("chain created");

  return chain;
}

const PREFIX = "";

const SUFFIX =
  "Do not use the same tool and action repeatedly. Remember that multiple tools are often relevant for a question. If so, it is wise to select a tool you have not used before.";

async function getTools() {
  // Define vector stores
  // const vectorStoreISTDP = await getVectorStore("ISTDP");
  // const vectorStoreCBT = await getVectorStore("CBT");

  // Define chains
  // 1. Using VectorDBQAChain
  // const chainISTDP = VectorDBQAChain.fromLLM(model, vectorStoreISTDP);
  // const chainCBT = VectorDBQAChain.fromLLM(model, vectorStoreCBT);

  //2. Using ConversationalRetrievalQAChain
  const chainISTDP = await getConversationalRetrievalChain("ISTDP");
  const chainCBT = await getConversationalRetrievalChain("CBT");

  // Define tools
  const toolISTDP = new ChainTool({
    name: "istdp-qa",
    description:
      "useful for psychotherapy questions related to Intensive short-term dynamic psychotherapy (ISTDP)",
    chain: chainISTDP,
    returnDirect: true,
  });

  const toolCBT = new ChainTool({
    name: "cbt-qa",
    description:
      "useful for psychotherapy questions related to Cognitive behavioral therapy (CBT)",
    chain: chainCBT,
    returnDirect: true,
  });

  const tools = [toolISTDP, toolCBT];
  return tools;
}

export const agentRouter = createTRPCRouter({
  chat: publicProcedure

    // Input validation
    .input(z.array(Message))

    // Mutation
    .mutation(async ({ input }) => {
      // Get tools
      const tools = await getTools();

      // Executor agent
      const executor = await initializeAgentExecutorWithOptions(tools, model, {
        agentType: "chat-zero-shot-react-description",
        verbose: false,
        agentArgs: {
          prefix: PREFIX,
          suffix: SUFFIX,
        },
      });

      const question = input.pop()?.content;

      const res = await executor.call({ input: question });
      console.debug(res);
    }),

  sequential: publicProcedure

    // Input validation
    .input(z.array(Message))

    // Mutation
    .mutation(async ({ input }) => {
      // const vectorStoreISTDP = await getVectorStore("ISTDP");
      // const vectorStoreCBT = await getVectorStore("CBT");
      const question = input.pop()?.content;
      console.debug(question);

      const chainISTDP = await getConversationalRetrievalChain("ISTDP");
      const chainCBT = await getConversationalRetrievalChain("CBT");

      const summaryChain = new SequentialChain({
        chains: [chainISTDP, chainCBT],
        inputVariables: [
          "question_ISTDP",
          "question_CBT",
          "chat_history",
          "text_ISTDP",
          "text_CBT",
        ],
        outputVariables: ["text"],
      });

      const res = await summaryChain.call({ question_ISTDP: question });
      console.debug(res);
    }),

  plan: publicProcedure

    .input(z.array(Message))

    .mutation(async ({ input }) => {
      const question = input.pop()?.content;
      const tools = await getTools();

      const executor = PlanAndExecuteAgentExecutor.fromLLMAndTools({
        llm: model,
        tools,
        memory: new BufferMemory({
          memoryKey: "chat_history", // Must be set to "chat_history"
          inputKey: "memoryKey",
          outputKey: "text",
        }),
      });

      const result = await executor.call({ input: question });

      console.debug(result);
    }),

  multi: publicProcedure

    .input(z.array(Message))

    .mutation(async ({ input }) => {
      const question = input.pop()?.content;
      const tools = await getTools();
    }),
});
