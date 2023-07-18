import { LLMChain, OpenAI, PromptTemplate } from "langchain";


export const model = new OpenAI({
  temperature: 0.5,
  modelName: "gpt-3.5-turbo",
  verbose: true,
});

// Template, prompt and chain used for deciding direction in psychology
export const template_directionInPsychology = `Based on the following question or statement decide whether it is more related to CBT (Cognitive Behavioural Therapy) or ISTDP (Intensive Short Term Dynamic Psychotherapy).
          
Question or statement: {question}

Answer on the strict form with only the abbreviated letters. For example: "CBT"`;

export const prompt_directionInPsychology = new PromptTemplate({
  template: template_directionInPsychology,
  inputVariables: ["question"],
});

export const chain_directionInPsychology = new LLMChain({
  llm: model,
  prompt: prompt_directionInPsychology,
});

// Template, prompt and chain used for deciding language that should be used
const template_language = `Based on the following question or statement decide whether it is written in english or norwegian. You should answer only what language with one word and nothing more.
          
Question or statement: {question}

Answer on the strict form of only "English" or "Norwegian" or "N/A". For example: "Norwegian"`;

export const prompt_language = new PromptTemplate({
  template: template_language,
  inputVariables: ["question"],
});

export const chain_language = new LLMChain({
  llm: model,
  prompt: prompt_language,
});


