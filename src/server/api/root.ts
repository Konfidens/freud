import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter } from "~/server/api/trpc";
import { openAIRouter } from "~/server/api/routers/openai";
import { langchainRouter } from "./routers/langchain";
import { weaviateRouter } from "./routers/weaviate";
import { feedbackRouter } from "./routers/feedbackDatabase";
import { llm_testing } from "./routers/llm_testing";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  openai: openAIRouter,
  langchain: langchainRouter,
  weaviate: weaviateRouter,
  feedback: feedbackRouter,
  llm_testing: llm_testing
});

// export type definition of API
export type AppRouter = typeof appRouter;
