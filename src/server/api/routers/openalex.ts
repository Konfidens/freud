import axios, { type AxiosResponse } from "axios";
import { OpenAI } from "langchain";
import { CommaSeparatedListOutputParser } from "langchain/output_parsers";
import { PromptTemplate } from "langchain/prompts";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

const parser = new CommaSeparatedListOutputParser();

const formatInstructions = parser.getFormatInstructions();

const prompt = new PromptTemplate({
  template:
    "Extract the most important psychotherapy related keywords that will be useful for searching for scientific articles to find more relevant papers, given the following answer to a question and the sources used in answering. Answer: {answer}\n\nSources: {sources}.\n{format_instructions}",
  inputVariables: ["answer", "sources"],
  partialVariables: { format_instructions: formatInstructions },
});

const model = new OpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0,
  verbose: true,
  cache: true,
});

// API endpoint constants
const baseURL = "https://api.openalex.org";
const auth = "mailto=fredrik@konfidens.no";

export const openAlexRouter = createTRPCRouter({
  keywords: publicProcedure

    // Validate input
    .input(z.any())

    // query
    .mutation(async ({ input }) => {
      const sources = input.message.sources
        .map((source) => source)
        .join("\n\n");
      const query = await prompt.format({
        answer: input.message.content,
        sources: sources,
      });
      const keywords = await model.call(query);
      const list = await parser.parse(keywords);
      const alex = await searchAlex(list.slice(0, 8));
      return alex;
    }),
});

async function searchAlex(keywords: string[]) {
  const keywordsList = keywords.map((word) => `"${word}"`).join(" OR ");
  const search = `search=${keywordsList}`;
  const filter = `filter=cited_by_count:>100,concepts.id:C15744967,type:article,language:en`;
  const select = `select=doi,title,authorships,publication_date,cited_by_count,primary_location`;
  const sort = `sort=relevance_score:desc,cited_by_count:desc,publication_date:desc`;
  const nrOfResults = `per-page=10`;
  const url = `${baseURL}/works?${search}&${filter}&${select}&${sort}&${nrOfResults}&${auth}`;
  // console.debug(keywords);
  // console.debug(url);
  return makeHttpRequest(url)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error(error);
    });
}

async function makeHttpRequest(url: string): Promise<AxiosResponse> {
  try {
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw new Error("Error making HTTP request");
  }
}
