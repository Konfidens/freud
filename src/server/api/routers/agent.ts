import { LLMChain, OpenAI, PromptTemplate } from "langchain";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { DynamicStructuredTool, DynamicTool } from "langchain/tools";
import weaviate from "weaviate-ts-client";
import { WeaviateStore } from "langchain/vectorstores/weaviate";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RetrievalQAChain } from "langchain/chains";

const embeddings = new OpenAIEmbeddings();
// Setup weaviate client
const client = (weaviate as any).client({
    scheme: process.env.WEAVIATE_SCHEME || "http",
    host: process.env.WEAVIATE_HOST || "localhost:8080",
    apiKey: new (weaviate as any).ApiKey(
        process.env.WEAVIATE_API_KEY || "default-api-key"
    ),
});

const NUM_SOURCES = 5;
const SIMILARITY_THRESHOLD = 0.3;



export const agentRouter = createTRPCRouter({
    getAnswer: publicProcedure
        .input(z.string())
        .mutation(async ({ input }) => {

            const model = new ChatOpenAI({ temperature: 0 });
            let sources: any[] = [];




            const tools = [

                // new DynamicStructuredTool({
                //     name: "Compare",
                //     description: "Creates a comparison of two answers from two different methods",
                //     schema: z.object({
                //         method1: z.string().describe("The name of the first method"),
                //         method2: z.string().describe("The name of the second method"),
                //         answer1: z.string().describe("The answer from the first method"),
                //         answer2: z.string().describe("The answer from the second method"),
                //     }),
                //     func: async ({ answer1, answer2 }) => {

                //         return "Dette var en bra sammenligning!"
                //     }
                // }),

                new DynamicStructuredTool({
                    name: "random-number-generator",
                    description: "generates a random number between two input numbers",
                    schema: z.object({
                        low: z.number().describe("The lower bound of the generated number"),
                        high: z.number().describe("The upper bound of the generated number"),
                    }),
                    func: async ({ low, high }) =>
                        (Math.random() * (high - low) + low).toString(), // Outputs still must be strings
                }),


                new DynamicStructuredTool({
                    name: "Research psychology question",
                    description:
                        "Call this to get the answer for psychology question based on a psychotherapy method",
                    schema: z.object({
                        question: z.string().describe("The question to be answered"),
                        method: z.string().describe("The psychotherapy method to base the answer on. Should be either ISTDP or CBT")
                    }),
                    returnDirect: true,
                    func: async ({ question, method }) => {
                        sources = [];
                        const vectorStore = await WeaviateStore.fromExistingIndex(embeddings, {
                            client,
                            indexName: method,
                            metadataKeys: [
                                "title",
                                "author",
                                "source",
                                "pageNumber",
                                "loc_lines_from",
                                "loc_lines_to",
                            ],
                        });


                        console.log("Going in for research pschology question")
                        // We can construct an LLMChain from a PromptTemplate and an LLM.
                        const model = new OpenAI({ temperature: 0 });
                        const template: string = `You are an expert psychologist who is helping a colleague. You both practice ${method}, a form of psychotherapy. They have a work-related question and you are to answer as an helpful and professional supervisor. You can only use the following context in your answer. If it is not stated in the context, just say you dont know.

                        Context:
                        {context}

                        Question: {question}
                        Helpful and professional answer: `;

                        const mytemplate: string = `You are an expert psychologist who are helping a colleague. They have a work-related question. Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say you don't know. DO NOT try to make up an answer.
If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.

{context}

Question: {question}:

Helpful answer:`;




                        const prompt = new PromptTemplate({ template: mytemplate, inputVariables: ["question", "context"] });

                        const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever(NUM_SOURCES, {
                            distance: SIMILARITY_THRESHOLD, where: {
                                operator: "NotEqual",
                                path: ["author"],
                                valueText: "Aslak",
                            },
                        }), { returnSourceDocuments: true })

                        // The result is an object with a `text` property.
                        const resA = await chain.call({ query: question });
                        sources.push(resA.sourceDocuments);
                        console.log({ resA });
                        return resA.text
                    },
                }),

            ];

            const executor = await initializeAgentExecutorWithOptions(tools, model, {
                agentType: "structured-chat-zero-shot-react-description",
                verbose: true,
            });

            console.log("Loaded agent.");

            console.log(`Executing with input "${input}"...`);

            const result = await executor.call({ input });

            console.log(`Got output ${result.output}`);

            console.log(result)

            return { result, sources, intermediatesteps: result.intermediateSteps };

        }),
});

