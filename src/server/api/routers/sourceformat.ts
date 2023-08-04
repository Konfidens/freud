import { type WeaviateStore } from "langchain/vectorstores/weaviate";
import { Configuration, OpenAIApi } from "openai";
import { boolean, string, z } from "zod";
import { env } from "~/env.mjs";
import { Message, Role } from "~/interfaces/message";
import { Excerpt } from "~/interfaces/source";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Categories } from "~/types/categories";
import { MergerRetriever } from "~/utils/weaviate/MergerRetriever";
import { calcPrice } from "~/utils/usagecalc";
import { getRetrieverFromIndex } from "~/utils/weaviate/getRetriever";
import fsPromises from "fs/promises";
import { type Document } from "langchain/dist/document";
import path from "path";
import { prisma } from "db";

const configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const NUM_SOURCES = 5;
const SIMILARITY_THRESHOLD = 0.23;

const defaultStandAlonePrompt = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question, if the follow up question is already a standalone question, just return the follow up question.`;
const defaultQAPrompt =
  "You are a chatbot used by a professional psychiatrist. They have a work-related question. Only use the ${0} sources below to answer the question. If the question can't be answered based on the sources, just say \"I don't know\". Show usage of each source with in-text citations. Do this with square brackets with ONLY the number of the source. \n\n${1}";

const getStandAlone = async (
  messages: { role: Role; content: string }[],
  prompt: string
) => {
  // make standalone question to get better sources
  const standaloneCompletion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: prompt,
      },
      ...messages,
    ],
    temperature: 0,
  });

  return standaloneCompletion;
};

const getExcerpts = async (standalone: string, categories: Categories) => {
  const arrayOfActiveCategories: string[] = [];
  for (const key in categories) {
    if (categories[key]) {
      arrayOfActiveCategories.push(key);
    }
  }

  const useAllCategories: boolean = arrayOfActiveCategories.length == 0;

  const arrayOfVectorStores: WeaviateStore[] = [];
  for (const key in categories) {
    if (categories[key] || useAllCategories) {
      arrayOfVectorStores.push(await getRetrieverFromIndex(key));
    }
  }

  const retriever = new MergerRetriever(
    arrayOfVectorStores,
    NUM_SOURCES,
    SIMILARITY_THRESHOLD
  );

  const weaviateExcerptsWithScore = await retriever.getRelevantDocumentsWithScore(
    standalone
  );


  const excerpts: Excerpt[] = []

  weaviateExcerptsWithScore.forEach(async (wexcerpt) => {
    const dbDoc = await prisma.document.findUnique(
      {
        where: {
          index_filename: { index: wexcerpt[0].metadata.category, filename: wexcerpt[0].metadata.filename },
        }
      }
    )

    if (!dbDoc) {
      throw new Error("dbDoc is not undefined")
    }

    const excerpt: Excerpt = {
      //TODO change schema to use "category" and not "index"
      document: {
        ...dbDoc, category: dbDoc.index
      },
      location: {
        lineFrom: wexcerpt[0].metadata.loc_lines_from ?? 0,
        lineTo: wexcerpt[0].metadata.loc_lines_to ?? 0,
      },
      content: wexcerpt[0].pageContent,
      score: wexcerpt[1]
    }

    excerpts.push(excerpt)

  })

  return excerpts;
};

const formatPrompt = (text: string, ...usedvariables: string[]) => {
  Object.keys(usedvariables).forEach((_, idx) => {
    text = text.replace(`\$\{${idx}\}`, usedvariables[idx]!);
  });
  return text;
};

const getResponse = async (
  excerpts: Excerpt[],
  messages: { role: Role; content: string }[],
  prompt: string
) => {
  let stuffString = "";

  excerpts.forEach((excerpt, index) => {
    stuffString +=
      "Source " + (index + 1) + ":\n---\n" + excerpt.content + "\n---\n\n";
  });

  // Can either use chat (...messages) or standalone question in completion below. Chat is more robust, costs more, and reaches input-limit quicker.
  // Standalone is not as robust, but can save money and hinder reaching input-limit.
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: prompt,
      },
      ...messages,
    ],
    temperature: 0,
    // stream: true, For streaming: https://github.com/openai/openai-node/discussions/182
  });

  return completion;
};

export const sourceRouter = createTRPCRouter({
  ask: publicProcedure
    //TODO Maybe move prompts and so on to an options object.
    .input(
      z.object({
        messages: z.array(Message),
        categories: Categories,
        saveTo: z
          .string()
          .optional()
          .describe("Name of file to save output to e.g 'mytestrun'"),
        standalonePrompt: z.string().optional(),
        qaPrompt: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const question = input.messages[input.messages.length - 1]?.content;

      if (!question) {
        throw new Error("Question is undefined");
      }

      const formatedmessages = input.messages.map((message) => {
        return {
          role: message.role,
          content: message.content,
        };
      });

      const startStandAlone = performance.now();
      const standalonePrompt: string =
        input.standalonePrompt ?? defaultStandAlonePrompt;
      const standaloneCompletion = await getStandAlone(
        formatedmessages,
        standalonePrompt
      );
      const standalone = standaloneCompletion.data.choices[0]?.message?.content;
      if (!standalone) {
        throw new Error("Standalone is not defined");
      }
      const timeTakenStandAlone = performance.now() - startStandAlone;

      const excerpts = await getExcerpts(
        standalone,
        input.categories
      );


      const documentsString = excerpts.reduce(
        (accumulator, currentValue, currentIndex) => {
          return (
            accumulator +
            "Source " +
            (currentIndex + 1) +
            ":\n---\n" +
            currentValue.content +
            "\n---\n\n"
          );
        },
        ""
      );

      const qaPrompt = formatPrompt(
        input.qaPrompt ?? defaultQAPrompt,
        excerpts.length.toString(),
        documentsString
      );

      const startQA = performance.now();
      const completion = await getResponse(
        excerpts,
        formatedmessages,
        qaPrompt
      );
      const timeTakenQA = performance.now() - startQA;

      const response = completion.data.choices[0]?.message?.content;

      console.log(response?.substring(0, 10));

      if (!response) {
        throw new Error("Response is not defined");
      }

      const reply: Message = {
        role: Role.Assistant,
        content: response,
        excerpts
      };

      const standalonePrice =
        calcPrice(standaloneCompletion.data.usage!).toPrecision(3) + "$";
      const qaPrice = calcPrice(completion.data.usage!).toPrecision(3) + "$";

      if (input.saveTo) {
        const dataFilePath = path.join(
          process.cwd(),
          `src/server/api/json/${input.saveTo}.json`
        );

        let objectData: object[];
        try {
          const jsonData = await fsPromises.readFile(dataFilePath, "utf8");
          objectData = JSON.parse(jsonData);
        } catch {
          objectData = [];
        }

        const toSave = {
          question,
          response,
          qaPrompt,
          standalonePrompt,
          standaloneAnswer: standalone,
          timeTakenQA,
          timeTakenStandAlone,
          usage: {
            qa: { ...completion.data.usage, qaPrice },
            standalone: { ...standaloneCompletion.data.usage, standalonePrice },
          },
        };

        objectData.push(toSave);

        await fsPromises.writeFile(dataFilePath, JSON.stringify(objectData));
      }

      return reply;
    }),
});
