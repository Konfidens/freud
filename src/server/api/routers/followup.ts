import { LLMChain, OpenAI, PromptTemplate } from "langchain";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { calcPrice, Usage } from "~/utils/usagecalc";



let usage: Usage = {
  prompt_tokens: 0,
  completion_tokens: 0,
  total_tokens: 0
}

export const model = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  callbacks: [
    {
      handleLLMEnd: (output) => {
        const { completionTokens, promptTokens, totalTokens } = output.llmOutput?.tokenUsage;
        usage.prompt_tokens += completionTokens ?? 0;
        usage.total_tokens += promptTokens ?? 0;
        usage.completion_tokens += totalTokens ?? 0;
      },
    },
  ],
});

function textToFollowUps(str: string | undefined): string[] {
  if (str == undefined) {
    return [];
  }
  const followUpQuestions: string[] = [];
  for (let i = 1; i < 4; i++) {
    let question = "";
    let start_found = false;
    let start_index = 0;
    for (let j = 0; j < str.length; j++) {
      if (str[j] == i.toString() && !start_found) {
        start_index = j + 3;
        start_found = true;
      }
      if (str[j] == "?" && start_found) {
        question = str.substring(start_index, j + 1);
        followUpQuestions.push(question);
        break;
      }
    }
  }
  return followUpQuestions;
}

const template_followUp = `Based on the following, previous answer to a question, create three follow-up questions that are asked as if you were a professional psychiatrist asking another professional for guidance or info. You should only give the the three questions and nothing else.

Previous answer: {previous_answer}

Exception: However, if the answer says 'I don't know', or 'I don't understand', or 'not related to context', or if it is a question, or similar; then give one word questions only.

Three follow-up questions on the strict form: '1. Follow-up question one.\n2. Follow-up question two.\n3. Follow-up question three.'`;

const prompt_followUp = new PromptTemplate({
  template: template_followUp,
  inputVariables: ["previous_answer"],
});

const chain_followUp = new LLMChain({
  llm: model,
  prompt: prompt_followUp,
});

export async function makeFollowUpQuestionsForText(text: string) {
  const llm_response = await chain_followUp.call({ previous_answer: text });
  let generated_followup_questions: string[] = textToFollowUps(llm_response.text as string);

  let letterCount = 0;
  generated_followup_questions.forEach((element) => {
    letterCount += element.length;
  });
  if (letterCount < 50) { // Because it should give one word questions if answer is bad!
    generated_followup_questions = [
      "How can I help my patient with anxiety?",
      "How do I assess trauma in a patient?",
      "What do I do if my patient is very silent?",
    ];
  }

  console.log("Followups: " + calcPrice(usage).toPrecision(3) + "$")
  return generated_followup_questions;
}

export const followUpRouter = createTRPCRouter({

  makeFollowUps: publicProcedure

    // Input validation
    .input(z.string())

    // Mutation
    .mutation(async ({ input }) => {
      return makeFollowUpQuestionsForText(input);
    }),
});