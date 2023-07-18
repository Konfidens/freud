/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Message } from "~/interfaces/message";
import * as Backend from "./backend_functionality/llm_testing_functions";

export const llm_testing = createTRPCRouter({

  analyze_question: publicProcedure

    // Input validation
    .input(z.array(Message))

    // Mutation
    .mutation(async ({ input }) => {
        const question = input[input.length - 1]?.content as string;

        const directionInPsychology = await Backend.chain_directionInPsychology.call({question: question});
        const language = await Backend.chain_language.call({question: question});

        console.log(directionInPsychology);
        console.log(language);
        // Copy paste from langchain.ts start *** 
        
        // Copy paste from langchain.ts end *** 
    }),
});
