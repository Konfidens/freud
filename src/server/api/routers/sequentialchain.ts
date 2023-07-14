import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { SimpleSequentialChain, LLMChain, RetrievalQAChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { VectorStore } from "langchain/dist/vectorstores/base";
import { WeaviateStore } from "langchain/vectorstores/weaviate";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import weaviate from "weaviate-ts-client";
import { ConsoleCallbackHandler } from "langchain/callbacks";

const categories = {
    istdp: "intensive short-term dynamic psychotherapy (ISTDP)",
    cbt: "Cognitive behavioral therapy (CBT)"
}




const embeddings = new OpenAIEmbeddings();

// Setup weaviate client
const client = (weaviate as any).client({
    scheme: process.env.WEAVIATE_SCHEME || "http",
    host: process.env.WEAVIATE_HOST || "localhost:8080",
    apiKey: new (weaviate as any).ApiKey(
        process.env.WEAVIATE_API_KEY || "default-api-key"
    ),
});

const vectorStore1 = await WeaviateStore.fromExistingIndex(embeddings, {
    client,
    indexName: "ISTDP",
    metadataKeys: [
        "title",
        "author",
        "source",
        "pageNumber",
        "loc_lines_from",
        "loc_lines_to",
    ],
});

const vectorStore2 = await WeaviateStore.fromExistingIndex(embeddings, {
    client,
    indexName: "CBT",
    metadataKeys: [
        "title",
        "author",
        "source",
        "pageNumber",
        "loc_lines_from",
        "loc_lines_to",
    ],
});
const model = new OpenAI({
    callbacks: [new ConsoleCallbackHandler()],
});




const comparisonTemplate = `You are an expert psychologist who is helping a colleague. They ask you to compare two answers to a question, given as "Answer to {method1}" and "Answer to {method2}" below. You must give a comparison of the two answers and be totally objective. Do not use anything else than the given answers in your comparison.
 
Answer to {method1}: {answer1}
Answer to {method2}: {answer2}
Objective comparison: `;
const comparisonPromptTemplate = new PromptTemplate({
    template: comparisonTemplate,
    inputVariables: ["answer1", "answer2", "method1", "method2"],
});
const comparisonChain = new LLMChain({
    llm: new OpenAI({ temperature: 0 }),
    prompt: comparisonPromptTemplate,
});




export const sequentialChainRouter = createTRPCRouter({
    callSeqChain: publicProcedure
        .input(z.string())
        .mutation(async ({ input }) => {
            const method1 = categories.istdp;
            const method2 = categories.cbt;

            const method1template = `You are an expert psychologist who is helping a colleague. You both practice ${method1}, a form of psychotherapy. They have a work-related question and you are to answer as an helpful and professional supervisor.
 
  Question: {question}
  Helpful and professional answer: `;
            const prompt1Template = new PromptTemplate({
                template: method1template,
                inputVariables: ["question"],
            });

            const method2template = `You are an expert psychologist who is helping a colleague. You both practice ${method2}, a form of psychotherapy. They have a work-related question and you are to answer as an helpful and professional supervisor.
 
  Question: {question}
  Helpful and professional answer: `;
            const prompt2Template = new PromptTemplate({
                template: method2template,
                inputVariables: ["question"],
            });


            const chain1 = RetrievalQAChain.fromLLM(model, vectorStore1.asRetriever(), { prompt: prompt1Template, returnSourceDocuments: true })
            const chain2 = RetrievalQAChain.fromLLM(new OpenAI({ temperature: 0 }), vectorStore2.asRetriever(), { prompt: prompt2Template, returnSourceDocuments: true })


            const responseA = await prompt1Template.format({ question: "What do I do with a silent patient" });
            console.log({ responseA });

            const response1 = await chain1.call({ query: input })
            const response2 = await chain2.call({ query: input })


            const comparison = await comparisonChain.call({ answer1: response1.text, answer2: response2.text, method1: method1, method2: method2 })

            return { response1, response2, comparison } //cptanswer, comparison
        }),
});
