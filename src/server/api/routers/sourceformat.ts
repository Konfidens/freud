import { type WeaviateStore } from "langchain/vectorstores/weaviate";
import { Configuration, OpenAIApi } from "openai";
import { z } from "zod";
import { env } from "~/env.mjs";
import { Message, Role } from "~/interfaces/message";
import { type Source } from "~/interfaces/source";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Categories } from "~/types/categories";
import { MergerRetriever } from "~/utils/weaviate/MergerRetriever";
import { calcPrice } from "~/utils/usagecalc";
import { getRetrieverFromIndex } from "~/utils/weaviate/getRetriever";

const configuration = new Configuration({
    apiKey: env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const NUM_SOURCES = 5;
const SIMILARITY_THRESHOLD = 0.3;

export const sourceRouter = createTRPCRouter({
    ask: publicProcedure
        .input(z.object({ messages: z.array(Message), categories: Categories }))
        .mutation(async ({ input }) => {
            const question = input.messages[input.messages.length - 1]?.content;

            if (!question) {
                throw new Error("Question is undefined");
            }

            const arrayOfActiveCategories: string[] = [];
            for (const key in input.categories) {
                if (input.categories[key]) {
                    arrayOfActiveCategories.push(key);
                }
            }

            const useAllCategories: boolean = arrayOfActiveCategories.length == 0;

            const arrayOfVectorStores: WeaviateStore[] = [];
            for (const key in input.categories) {
                if (input.categories[key] || useAllCategories) {
                    arrayOfVectorStores.push(await getRetrieverFromIndex(key));
                }
            }

            const retriever = new MergerRetriever(
                arrayOfVectorStores,
                NUM_SOURCES,
                SIMILARITY_THRESHOLD
            );

            const documentswithscores = await retriever.getRelevantDocumentsWithScore(
                question
            );

            documentswithscores.sort((a, b) => {
                return a[0].metadata.title.localeCompare(b[0].metadata.title);
            });

            const documents = documentswithscores.map(([doc, _]) => doc);

            // Sort documents for later grouping

            let stuffString = "";

            documents.map((doc, index) => {
                stuffString +=
                    "Source " + (index + 1) + ":\n---\n" + doc.pageContent + "\n---\n\n";
            });

            const formatedmessages = input.messages.map((message) => {
                return {
                    role: message.role,
                    content: message.content,
                };
            });



            let startQA = performance.now();

            const completion = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [{ role: "system", content: `You are a chatbot used by a professional psychiatrist. They have a work-related question. Only use the ${documents.length} sources below to answer the question. If the question can't be answered based on the sources, just say \"I don't know\". Show usage of each source with in-text citations. Do this with square brackets with ONLY the number of the source. \n\n${stuffString}` },
                ...formatedmessages],
                temperature: 0,
                // stream: true, For streaming: https://github.com/openai/openai-node/discussions/182
            });

            const response = completion.data.choices[0]?.message?.content;
            let timeTakenQA = performance.now() - startQA;

            if (!response) {
                throw new Error("Reply is not defined");
            }

            console.log("QA: " + calcPrice(completion.data.usage!).toPrecision(3) + "$")

            if (!response) {
                throw new Error("Reply is not defined")
            }

            const sources: Source[] = documentswithscores.map(
                ([doc, score]) => {
                    return {
                        content: doc.pageContent,
                        author: doc.metadata.author,
                        category: doc.metadata.category,
                        filename: doc.metadata.filename,
                        filetype: doc.metadata.filetype,
                        title: doc.metadata.title,
                        location: {
                            chapter: doc.metadata.chapter,
                            href: doc.metadata.href,
                            pageNr: doc.metadata.pageNumber,
                            lineFrom: doc.metadata.loc_lines_from
                                ? doc.metadata.loc_lines_from
                                : 0,
                            lineTo: doc.metadata.loc_lines_to
                                ? doc.metadata.loc_lines_to
                                : 0,
                        },
                        score: score,
                    };
                }
            );

            const reply: Message = {
                role: Role.Assistant,
                content: response,
                sources: sources,
            };



            return reply;
        }),
})
