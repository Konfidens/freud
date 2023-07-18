import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";


export const llmchoiceRouter = createTRPCRouter({
    getTool: publicProcedure
        .input(z.string())
        .mutation(async ({ input }) => {
            return input;
        }),
});
