import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { DynamicStructuredTool } from "langchain/tools";
import weaviate from "weaviate-ts-client";
import { z } from "zod";
import { env } from "~/env.mjs";
import { Message } from "~/interfaces/message";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { WeaviateStore } from "langchain/vectorstores/weaviate";
import { BufferMemory } from "langchain/memory";
import { PromptTemplate } from "langchain";

const model = new ChatOpenAI({
  temperature: 0,
  modelName: "gpt-3.5-turbo",
  verbose: false,
});

const embeddings = new OpenAIEmbeddings();

const client = weaviate.client({
  scheme: env.WEAVIATE_SCHEME,
  host: env.WEAVIATE_HOST,
  apiKey: new weaviate.ApiKey(env.WEAVIATE_API_KEY),
});

async function getConversationalRetriever(indexName: string) {
  const vectorStore = await WeaviateStore.fromExistingIndex(embeddings, {
    client,
    indexName: indexName,
  });

  const prompt_template = `You are an expert psychologist who are helping a colleague. They have a work-related question. Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say you don't know. DO NOT try to make up an answer.
If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.

Context: {context}

Question: {question}:

Helpful answer:`;

  const PROMPT = new PromptTemplate({
    template: prompt_template,
    inputVariables: ["context", `question`],
  });

  const NUM_SOURCES = 5;
  const SIMILARITY_THRESHOLD = 0.3;

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
        inputKey: `question`,
        outputKey: `text`,
        returnMessages: true,
      }),
      qaTemplate: prompt_template,
      qaChainOptions: {
        type: "stuff",
        prompt: PROMPT,
      },
      returnSourceDocuments: false,
    }
  );

  return chain;
}

export const decisionRouter = createTRPCRouter({
  initial: publicProcedure

    // Input validation
    .input(z.array(Message))

    // Mutation
    .mutation(async ({ input }) => {
      /* --- END TEMPORARY */

      // Get question
      const question = input.pop()?.content;
      console.debug("Question: ", question);

      // Define available tools
      const tools = [
        // New research
        new DynamicStructuredTool({
          name: "find-new-research",
          description:
            "lists recent scientific publications related to a topic",
          schema: z.object({
            topic: z
              .string()
              .describe("The scientific topic/area/field of interest"),
          }),
          func: async ({ topic }) => {
            const reply = `Asked about new research related to ${topic}`;
            console.debug(reply);
            return reply;
          },
        }),

        // Diagnosis
        new DynamicStructuredTool({
          name: "suggest-diagnosis",
          description:
            "suggests an appropriate diagnosis that matches a list of symptoms",
          schema: z.object({
            symptoms: z.array(
              z.object({
                symptom: z
                  .string()
                  .describe(
                    "a symptom that is relevant for setting a diagnosis related to psychotherapy or mental illness"
                  ),
              })
            ),
          }),
          func: async ({ symptoms }) => {
            const symptomList: string[] = symptoms.map((e) => e.symptom);
            const reply = `Find diagnosis given the following symptoms: ${symptomList.join(
              ", "
            )}.`;
            console.debug(reply);
            return reply;
          },
        }),

        // General subject
        new DynamicStructuredTool({
          name: "answer-psychotherapy-question",
          description:
            "answers questions related to psychology and psychotherapy that is NOT about new research or determining the correct diagnosis",
          schema: z.object({
            question: z
              .string()
              .describe("a question about psychology or psychotherapy"),
          }),
          func: async ({ question }) => {
            console.debug(`This is a general psychotherapy question`);

            const chain = await getConversationalRetriever("ISTDP");
            const reply = await chain.call({ question });
            console.debug(reply);
            return reply.text;
          },
        }),

        // Unrelated / not a question
        new DynamicStructuredTool({
          name: "catch-unrelated-question",
          description:
            "replies to conversations that has nothing to do with psychology or psychotherapy",
          schema: z.object({
            message: z
              .string()
              .describe(
                "question or message that is unrelated to psychology or psychotherapy"
              ),
          }),
          func: async ({ message }) => {
            const reply = `Freud does not reply to these types of messages`;
            console.debug(reply);
            return reply;
          },
        }),
      ];

      // const SUFFIX = `Your final answer should be exactly identical to the last observation you've seen. Do not add or remove anything. Only return the final observatio.`;

      const executor = await initializeAgentExecutorWithOptions(tools, model, {
        agentType: "structured-chat-zero-shot-react-description",
        verbose: true,
        returnIntermediateSteps: false,
        // agentArgs: {
        //   suffix: SUFFIX,
        // },
      });
      console.debug("Agent loaded");

      const result = await executor.call({ input: question });
      console.debug("Agent returned:\n" + JSON.stringify(result));
    }),
});
