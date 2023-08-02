import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter } from "~/server/api/trpc";
import { openAIRouter } from "~/server/api/routers/openai";
import { langchainRouter } from "./routers/langchain";
import { weaviateRouter } from "./routers/weaviate";
import { sourceRouter } from "./routers/sourceformat";
import { followUpRouter } from "./routers/followup";
import { prismaRouter } from "./routers/prisma";
import { diagnosisRouter } from "./routers/diagnosis";

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
  source: sourceRouter,
  followup: followUpRouter,
  prisma: prismaRouter,
  diagnosis: diagnosisRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
