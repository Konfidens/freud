import path from "path";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { JSDOM } from "jsdom";
import fs from "fs";
import { Document } from "langchain/document";
import { type OpenAIEmbeddings } from "langchain/embeddings/openai";
import { embeddings } from "~/utils/weaviate/embeddings";
import { WeaviateStore } from "langchain/vectorstores/weaviate";
import { client } from "~/utils/weaviate/client";
import { MergerRetriever } from "~/utils/weaviate/MergerRetriever";
import { z } from "zod";
import { Configuration, OpenAIApi } from "openai";
import { env } from "~/env.mjs";

const configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const dirPath = path.join(process.cwd(), "public", "documents", "DSM");
const dsmWebPagePath = path.join(process.cwd(), "public");

export const dsmRouter = createTRPCRouter({

  createFileAndEmbedd: publicProcedure.mutation(async () => {

    // Creating the file
    const arrDiagnosis = findDiagnosisChunks();
    createOneFilesFromArray(arrDiagnosis);

    // Embedd to weaviate vectorStore
    const docs = arrDiagnosis.map((elem) => {
      return new Document({
        pageContent: elem.text,
        metadata: {
          diagnosisName: elem.diagnosis,
          categoryName: elem.category,
        },
      });
    });

    await createVectorStoreFromDocuments("DSM", docs, embeddings);
  }),

  queryTheDatabase: publicProcedure

    .input(z.string())

    .mutation(async ({ input }) => {
      const query_description = input;

      const symptoms = await openai.createChatCompletion({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `Extract a list of symptoms from this description of a psychosomatic or psychological disease: ${query_description}.`,
          },
        ],
        temperature: 1,
      });

      const symptoms_response = symptoms.data.choices[0]?.message?.content;
      console.debug("symptoms_response:\n", symptoms_response);

      const metadataKeys: string[] = ["diagnosisName", "categoryName"];

      const indexName = "DSM";

      const arrayOfVectorStores = await WeaviateStore.fromExistingIndex(
        embeddings,
        {
          client,
          indexName,
          metadataKeys,
        }
      );

      const NUM_SOURCES = 3;
      const SIMILARITY_THRESHOLD = 0.3;

      const retriever = new MergerRetriever(
        [arrayOfVectorStores],
        NUM_SOURCES,
        SIMILARITY_THRESHOLD
      );

      const documents = await retriever.getRelevantDocuments(
        symptoms_response as string
      );

      // Making chatGPT evaluate the correlation between the symptoms and the
      const listOfEvaluations = await Promise.all(
        documents.map(async (elem) => {
          const completion = await openai.createChatCompletion({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content: `Give an evaluation of how much the given input description matches the diagnosis description. Finally in your response, give a match score on the format: (#/100), where "#" is a score of how much the descriptions match out of a hundred\n\n. Input description: ${query_description}. \n\n Diagnosis: ${elem.pageContent}. \n\n Evaluation with score at the end: `,
              },
            ],
            temperature: 1,
          });

          return completion.data.choices[0]?.message?.content as string;
        })
      );
    
      console.debug("\n QUERY RESULTS: ");
      for (let i = 0 ; i < NUM_SOURCES ; i++){
        console.debug("\n", i.toString(), ". Diagnosis:\n", documents[i]);
        console.debug("ChatGPT evaluation:\n", listOfEvaluations[i]);
      }
    }),
});

async function createVectorStoreFromDocuments(
  indexName: string,
  splits: Document<Record<string, any>>[],
  embeddings: OpenAIEmbeddings
) {
  // Create the vector store
  console.debug(
    `- Create vector store (this may take a while...) (${indexName})`
  );
  await WeaviateStore.fromDocuments(splits, embeddings, {
    client,
    indexName,
  })
    .then(() => {
      console.debug(`- Vector store created (${indexName})`);
    })
    .catch((error: Error) => console.error(error));
}

function html2text(html: string): string {
  const dom = new JSDOM();
  const tag = dom.window.document.createElement("div");
  tag.innerHTML = html;
  return tag.textContent || "";
}

function checkForWordInString(
  text: string,
  word: string,
  fromIndex: number,
  toIndex?: number
): number {
  // Gives starting index of the word in the string
  let wordIndex = 0;
  if (toIndex == undefined) {
    toIndex = text.length;
  }
  for (let i = fromIndex; i < toIndex; i++) {
    if (text[i] == word[wordIndex]) {
      wordIndex++;
      if (wordIndex == word.length) {
        return i - wordIndex + 1;
      }
    } else if (text[i] == word[0]) {
      wordIndex = 1;
    } else {
      wordIndex = 0;
    }
  }
  return -1;
}

function findEndOfTag(
  text: string,
  fromIndex: number,
  startTag?: string,
  endTag?: string
): number {
  // assume <p></p> tag
  if (startTag == undefined) {
    startTag = `<p`;
  }
  if (endTag == undefined) {
    endTag = `</p>`;
  }
  let endingTagsLeft = 0;
  for (let i = fromIndex; i < text.length; i++) {
    if (text.substring(i, i + startTag.length) == startTag) {
      endingTagsLeft++;
    } else if (text.substring(i, i + endTag.length) == endTag) {
      endingTagsLeft--;
      if (endingTagsLeft == 0) {
        return i + endTag.length;
      }
    }
  }
  return -1;
}

type CategoryInterval = {
  fromInclusive: number;
  toExclusive: number;
  categoryName: string;
};

function findAllCategoryIntervals(): CategoryInterval[] {
  const webpageFileName = "dsm_norsk_nettside.html";
  const text = fs.readFileSync(
    path.join(dsmWebPagePath, webpageFileName),
    "utf-8"
  );
  const CATEGORY_TAG = `<p class="tretegnoverskrift">`;

  const categories: CategoryInterval[] = [];

  let currentCategory = ``;
  let currentIndex = checkForWordInString(text, CATEGORY_TAG, 0);
  let endOfTagIndex = findEndOfTag(text, currentIndex);
  currentCategory = html2text(text.substring(currentIndex, endOfTagIndex));

  while (true) {
    const startIndex = currentIndex;
    currentIndex = checkForWordInString(text, CATEGORY_TAG, endOfTagIndex);
    if (currentIndex == -1) {
      categories.push({
        fromInclusive: startIndex,
        toExclusive: text.length,
        categoryName: currentCategory,
      });
      break;
    }
    categories.push({
      fromInclusive: startIndex,
      toExclusive: currentIndex,
      categoryName: currentCategory,
    });

    // Set next
    endOfTagIndex = findEndOfTag(text, currentIndex);
    currentCategory = html2text(text.substring(currentIndex, endOfTagIndex));
  }
  return categories;
}

type Chunk = {
  text: string;
  category: string;
  diagnosis: string;
};

function findDiagnosisChunks(): Chunk[] {
  const webpageFileName = "dsm_norsk_nettside.html";
  const text = fs.readFileSync(
    path.join(dsmWebPagePath, webpageFileName),
    "utf-8"
  );
  const DIAGNOSIS_TAG = `<p class="firetegnoverskrift0">`;

  const generatedChunks: Chunk[] = [];

  const foundCategoryIntervals = findAllCategoryIntervals();

  for (let i = 0; i < foundCategoryIntervals.length; i++) {
    let currentDiagnosis = ``;
    let currentIndex = checkForWordInString(
      text,
      DIAGNOSIS_TAG,
      foundCategoryIntervals[i]?.fromInclusive as number
    );
    let endOfTagIndex = findEndOfTag(text, currentIndex);
    currentDiagnosis = html2text(text.substring(currentIndex, endOfTagIndex));

    while (true) {
      const startIndex = currentIndex;
      currentIndex = checkForWordInString(
        text,
        DIAGNOSIS_TAG,
        endOfTagIndex,
        foundCategoryIntervals[i]?.toExclusive
      );
      if (currentIndex == -1) {
        generatedChunks.push({
          text: html2text(
            text.substring(
              startIndex,
              foundCategoryIntervals[i]?.toExclusive as number
            )
          ),
          category: foundCategoryIntervals[i]?.categoryName as string,
          diagnosis: currentDiagnosis,
        });
        break;
      }
      generatedChunks.push({
        text: html2text(text.substring(startIndex, currentIndex)),
        category: foundCategoryIntervals[i]?.categoryName as string,
        diagnosis: currentDiagnosis,
      });

      // Set next
      endOfTagIndex = findEndOfTag(text, currentIndex);
      currentDiagnosis = html2text(text.substring(currentIndex, endOfTagIndex));
    }
  }
  return generatedChunks;
}

function createManyFilesFromArray(diagnosisArray: Chunk[]): void {
  diagnosisArray.forEach((elem) => {
    fs.writeFileSync(
      path
        .join(
          dirPath,
          elem.diagnosis.replace(/\s/g, "").replace(/[\/\\?%*:|"<>\.]/g, "_")
        )
        .concat(".json"),
      JSON.stringify(elem),
      { flag: "w" }
    );
  });
}

function createOneFilesFromArray(diagnosisArray: Chunk[]): void {
  fs.writeFileSync(
    path.join(dirPath, "all_diagnosis.json"),
    JSON.stringify(diagnosisArray),
    { flag: "w" }
  );
}
