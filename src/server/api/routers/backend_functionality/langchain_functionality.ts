import { LLMChain, OpenAI, PromptTemplate } from "langchain";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import weaviate from "weaviate-ts-client";
import { env } from "~/env.mjs";

// Model
export const model = new OpenAI({ // TODO: Same model is used many places, maybe make that cleaner
  temperature: 0.5,
  modelName: "gpt-3.5-turbo",
  verbose: true,
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
const client = weaviate.client({
  scheme: env.WEAVIATE_SCHEME,
  host: env.WEAVIATE_HOST,
  apiKey: new weaviate.ApiKey(env.WEAVIATE_API_KEY),
});


// Connect to weaviate vector store
const embeddings = new OpenAIEmbeddings();


// Followup code

// Function for retrieving an array of the three questions that chatGPT returns
export function textToFollowUps(str: string | undefined): string[] {
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

export const chain_followUp = new LLMChain({
  llm: model,
  prompt: prompt_followUp,
});

export function getFollowUpQuestionsForText(text: string): string[] {
  const llm_response = chain_followUp.call({ previous_answer: text});
  // const questions_arr = textToFollowUps(llm_response.output as string);
}