import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { SimpleSequentialChain, LLMChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";

const categories = {
    istdp: "intensive short-term dynamic psychotherapy (ISTDP)",
    cpt: "cognitive processing therapy (CPT)"
}


// This is an LLMChain to write a synopsis given a title of a play.
const llm = new OpenAI({ temperature: 0 });
const istdptemplate = `You are an expert psychologist who is helping a colleague. You both practice {method}, a form of short-term psychotherapy. They have a work-related question and you are to answer as an helpful and professional supervisor.
 
  Question: {question}
  Helpful and professional answer: `;
const promptTemplate = new PromptTemplate({
    template: istdptemplate,
    inputVariables: ["question", "method"],
});
const istdpchain = new LLMChain({ llm, prompt: promptTemplate });






const cptLLM = new OpenAI({ temperature: 0 });
const cptTemplate = `You are an expert psychologist who is helping a colleague. You both practice {method}, a form of psychotherapy. They have a work-related question and you are to answer as an helpful and professional supervisor.
 
Question: {question}
Helpful and professional answer: `;
const cptPromptTemplate = new PromptTemplate({
    template: cptTemplate,
    inputVariables: ["question", "method"],
});
const cptChain = new LLMChain({
    llm: cptLLM,
    prompt: cptPromptTemplate,
});

// const overallChain = new SimpleSequentialChain({
//     chains: [synopsisChain, reviewChain],
//     verbose: true,
// });


const comparisonLLM = new OpenAI({ temperature: 0 });
const comparisonTemplate = `You are an expert psychologist who is helping a colleague. They ask you to compare two answers to a question, given as "Answer to {method1}" and "Answer to {method2}" below. You must give a comparison of the two answers and be totally objective. Do not use anything else than the given answers in your comparison.
 
Answer to {method1}: {answer1}
Answer to {method2}: {answer2}
Objective comparison: `;
const comparisonPromptTemplate = new PromptTemplate({
    template: comparisonTemplate,
    inputVariables: ["answer1", "answer2", "method1", "method2"],
});
const comparisonChain = new LLMChain({
    llm: comparisonLLM,
    prompt: comparisonPromptTemplate,
});




export const sequentialChainRouter = createTRPCRouter({
    callSeqChain: publicProcedure
        .input(z.string())
        .mutation(async ({ input }) => {
            const method1 = categories.cpt;
            const method2 = categories.istdp;

            const cpt = cptChain.call({ question: input, method: method1 })
            const istdp = istdpchain.call({ question: input, method: method2 })

            const cptanswer = await cpt;
            const istdpanswer = await istdp;

            const comparison = await comparisonChain.call({ answer1: cptanswer.text, answer2: istdpanswer.text, method1: method1, method2: method2 })
            return { istdpanswer, cptanswer, comparison }
        }),
});
