import { ConsoleCallbackHandler } from "langchain/callbacks";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";
import { BufferMemory } from "langchain/memory";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { WeaviateStore } from "langchain/vectorstores/weaviate";
import path from "path";
import weaviate from "weaviate-ts-client";
import { z } from "zod";
import { Message, Role, type Source } from "~/interfaces/message";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

// Specify language model, embeddings and prompts
const model = new OpenAI({
  callbacks: [new ConsoleCallbackHandler()],
});

const CONDENSE_PROMPT = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`;

const QA_PROMPT = `You are an expert psychologist who are helping a colleague. They have a work-related question. Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say you don't know. DO NOT try to make up an answer.
If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.

{context}

Question: {question}:

Helpful answer:`;

const THRESHOLD = 0.15;
const NUM_LOADED = 10;

// Setup weaviate client
const client = (weaviate as any).client({
  scheme: process.env.WEAVIATE_SCHEME || "http",
  host: process.env.WEAVIATE_HOST || "localhost:8080",
  apiKey: new (weaviate as any).ApiKey(
    process.env.WEAVIATE_API_KEY || "default-api-key"
  ),
});

// Connect to weaviate vector store
const embeddings = new OpenAIEmbeddings();

const vectorStore = await WeaviateStore.fromExistingIndex(embeddings, {
  client,
  indexName: "ISTDP_initial",
  metadataKeys: ["source", "author", "title", "pageNumber"],
});

// Setup langchain: Conversational Retriever QA
const chain = ConversationalRetrievalQAChain.fromLLM(
  model,
  vectorStore.asRetriever(),
  {
    memory: new BufferMemory({
      memoryKey: "chat_history", // Must be set to "chat_history"
      inputKey: "memoryKey",
      outputKey: "text",
    }),
    returnSourceDocuments: true,
    qaTemplate: QA_PROMPT,
    questionGeneratorTemplate: CONDENSE_PROMPT,
  }
);

// Define TRPCRouter endpoint
export const langchainRouter = createTRPCRouter({
  conversation: publicProcedure

    // Validate input
    .input(z.array(Message))

    .mutation(async ({ input }) => {
      const question = input[input.length - 1]?.content;

      try {
        // Chain call
        const res = await chain.call({ question });

        // Sources used for answering
        const sources: Source[] = res.sourceDocuments.map((source) => {
          return {
            author: source.metadata.author,
            title: source.metadata.title,
            location: {
              pageNr: source.metadata.pageNumber,
              lineFrom: 0,
              lineTo: 0,
            },
            content: source.pageContent,
          };
        });

        // Reply
        const reply: Message = {
          role: Role.Assistant,
          content: res.text,
          sources: sources,
        };

        // Return reply
        return reply;
      } catch (error) {
        console.error(error);
      }
    }),
});
