/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ConsoleCallbackHandler } from "langchain/callbacks";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";
import { BufferMemory } from "langchain/memory";
import { WeaviateStore } from "langchain/vectorstores/weaviate";
import weaviate from "weaviate-ts-client";
import { z } from "zod";
import { Message, Role, type Source } from "~/interfaces/message";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

// Kristian testing follow up questions:
import { FollowUps } from "~/interfaces/followup";

function textToFollowUps(str: string | undefined): string[] {
  if (str == undefined) {
    return [];
  }
  const followUpQuestions: string[] = [];
  let counter = 0;
  for (let i = 0; i < 3 ; i++){
    let question = "";
    for (let j = counter; counter < str.length ; j++ ){
      if (str[j] != '\n'){
        question += str[j];
      } 
      else {
        counter = j + 1;
        followUpQuestions.push(question);
        break;
      }
    }
  }
  return followUpQuestions;
}

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

const NUM_SOURCES = 5;
const SIMILARITY_THRESHOLD = 0.3;

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

// Define TRPCRouter endpoint
export const langchainRouter = createTRPCRouter({
  conversation: publicProcedure

    // Validate input
    .input(z.array(Message))

    .mutation(async ({ input }) => {
      const question = input[input.length - 1]?.content;

      try {
        // Call to langchain Conversational Retriever QA
        // For filtering, see https://weaviate.io/developers/weaviate/api/graphql/filters
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
              inputKey: "memoryKey",
              outputKey: "text",
            }),
            returnSourceDocuments: true,
            qaTemplate: QA_PROMPT,
            questionGeneratorTemplate: CONDENSE_PROMPT,
          }
        );

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

        // Follow up questions (only testing):
        let context_string = "";
        sources.map((s) => {context_string += s.content;})
        const followup_prompt = `Based on the following, previous answer to a question, create three followup questions. You should only give the the three questions and nothing else. 
However, if the answer is saying 'I don't know' or similar, look at the context instead and ask three questions that are very related to this context.
                            
Previous answer: {reply.content}
                            
Context: {context_string}
                            
Three follow-up questions on the strict form: '\n1. Follow-up question one.\n2. Follow-up question two.\n3. Follow-up question three.'`; 

        const questions_response = await model.call(followup_prompt);
        const generated_followup_questions = textToFollowUps(questions_response);
        console.log(generated_followup_questions);

        // Return reply
        return reply;
      } catch (error) {
        console.error(error);
      }
    }),
});
