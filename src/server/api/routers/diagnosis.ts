import path from "path";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { JSDOM } from "jsdom";
import fs from "fs";
import { Document } from "langchain/document";
import { type OpenAIEmbeddings } from "langchain/embeddings/openai";
import { embeddings } from "~/utils/weaviate/embeddings";
import { WeaviateStore } from "langchain/vectorstores/weaviate";
import { client_diagnosis } from "~/utils/weaviate/client";
import { MergerRetriever } from "~/utils/weaviate/MergerRetriever";
import { z } from "zod";
import { Configuration, OpenAIApi } from "openai";
import { env } from "~/env.mjs";

const configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const NUM_SOURCES = 5;
const SIMILARITY_THRESHOLD = 0.27;

const maxSymptomsFollowUpQuestions = 4;
const satisfyingSimilarityLimit = 0.12;

const numberOfDiagnosisToDisplay = 3;

const dirPath = path.join(process.cwd(), "public", "documents", "DSM");
const dsmWebPagePath = path.join(process.cwd(), "public");

type DiagnosisAndEval = {
  diagnosis: string;
  evaluation: string;
  score: number;
  similarityScore: number;
};

// Query database variables:
const metadataKeys: string[] = ["diagnosisName", "categoryName"];

const indexName = "DSM";

const arrayOfVectorStores = await WeaviateStore.fromExistingIndex(embeddings, {
  client: client_diagnosis,
  indexName,
  metadataKeys,
});

export const diagnosisRouter = createTRPCRouter({
  createFileAndEmbedd: publicProcedure.mutation(async () => {
    // Creating the file
    const arrDiagnosis = findDiagnosisChunks();
    createOneFilesFromArray(arrDiagnosis);

    // Make documents, aka splits
    const docs = arrDiagnosis.map((elem) => {
      return new Document({
        pageContent: elem.text,
        metadata: {
          diagnosisName: elem.diagnosis,
          categoryName: elem.category,
        },
      });
    });

    // Embedd to vectorStore
    await createDiagnosisVectorStoreFromDocuments("DSM", docs, embeddings);
  }),

  queryTheDatabase: publicProcedure

    .input(z.object({ qa: z.array(z.string()), symptoms: z.array(z.string()) }))

    .mutation(async ({ input }) => {

      const retriever = new MergerRetriever(
        [arrayOfVectorStores],
        NUM_SOURCES,
        SIMILARITY_THRESHOLD
      );

      // Even though copies of the input arrays are made, no changes are made to these copies
      const qaCopied = input.qa.slice();
      const symptomsCopied = input.symptoms.slice();
      
      // The new symptom is just the first user input if this is initial call of this API endpoint
      let newSymptom: string = qaCopied[0] as string;

      // If this is not initial call of this API endpoint, create symptom from user answering the symptom questioning
      if (qaCopied.length > 1) {
        const followUpSymptomGPTCompletion = await openai.createChatCompletion({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `For det følgende spørsmålet og det gitte svaret lag en kort setning som oppsummerer informasjonen som gis fra svaret i henhold til spørsmålet som er stilt. Men hvis svaret er kun et kort "nei", "vet ikke", eller lignende, returner ingenting.\n\nSpørsmål: ${
                qaCopied[qaCopied.length - 2] as string
              }\nSvar: ${
                qaCopied[qaCopied.length - 1] as string
              }\nOppsummerende setning (med mindre svaret var "nei", "vet ikke" eller lignende):`,
            },
          ],
          temperature: 0,
        });

        const followUpSymptomToAdd = followUpSymptomGPTCompletion.data
          .choices[0]?.message?.content as string;

        // Add the resulting symptom if GPT returned anything.
        // Length > emptyMargin, because GPT may return some spacings instead of absolutely no characters
        const emptyMargin = 3;

        if (followUpSymptomToAdd.length > emptyMargin) {
          newSymptom = followUpSymptomToAdd;
        } else {
          newSymptom = "";
        }
      }

      const totalSearchString = symptomsCopied.reduce((text, symptom, i) => {
        if (i === 0) {
          return symptom + ".";
        }
        return text + " " + symptom;
      }, "") + " " + newSymptom;

      const diagnosesSearchResult =
        await retriever.getRelevantDocumentsWithScore(totalSearchString);

      let giveDiagnosesAndEndSearch = false;

      if (qaCopied.length >= maxSymptomsFollowUpQuestions * 2 + 1) {
        giveDiagnosesAndEndSearch = true;
      }

      // Check if top search result has a good enough "cosine similarity" score
      if (
        diagnosesSearchResult[0] !== undefined &&
        diagnosesSearchResult[0][1] < satisfyingSimilarityLimit
      ) {
        giveDiagnosesAndEndSearch = true;
      }

      if (!giveDiagnosesAndEndSearch) {
        // Make chatGPT produce a differencial-diagnosis question based on the different diagnoses from the search result
        const diffDiagnosisQueryText = createDifferentiatingQuestion(
          diagnosesSearchResult,
          qaCopied
        );

        const diffCompletion = await openai.createChatCompletion({
          model: "gpt-4",
          messages: [{ role: "system", content: diffDiagnosisQueryText }],
          temperature: 0,
        });

        const diffFollowUp = diffCompletion.data.choices[0]?.message
          ?.content as string;

        return {
          response: diffFollowUp.replace(/^["']|["']$/g, ''),
          newSymptom: newSymptom,
          finishSuggestion: giveDiagnosesAndEndSearch,
        };
      }

      // Give diagnoses and end search: make chatGPT evaluate the correlation between the symptoms and the diagnosis
      const topDiagnoses = diagnosesSearchResult.slice(0, numberOfDiagnosisToDisplay);
      const listOfEvaluations = await Promise.all(
        topDiagnoses.map(async (elem) => {
          const completion = await openai.createChatCompletion({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content: `Gi en evaluering på hvor mye den gitte input beskrivelsen stemmer overens med diagnose-beskrivelsen. Til slutt i svaret ditt, gi en matching-score på formatet: (#/100), hvor "#" er en score på hvor mye beskrivelsene stemmer overens ut av hundre.\n\nInput beskrivelse: ${totalSearchString}.\n\nDiagnose: ${elem[0].pageContent}. \n\nEvaluering med score på slutten: `,
              },
            ],
            temperature: 1,
          });

          return completion.data.choices[0]?.message?.content as string;
        })
      );

      const combinedData: DiagnosisAndEval[] = listOfEvaluations.map((elem, i) => {
        return {
          diagnosis: (topDiagnoses[i]?.at(0) as Document<Record<string, any>>).metadata.diagnosisName as string,
          evaluation: elem,
          score: findScore(elem),
          similarityScore: topDiagnoses[i]?.at(1) as number,
        }
      }).sort((a, b) => b.score - a.score);

      let formattedOutput =
        "Diagnoser og prosent-matching med gitte input symptomer:\n";
      combinedData.forEach((elem, i) => {
        formattedOutput +=
          "\n" + (i + 1).toString() + ". Diagnose-kode og navn:\n" +
          elem.diagnosis +
          "\n\nMatching evaluering:\n" +
          elem.evaluation +
          "\n\n";
      });

      return {
        response: formattedOutput,
        newSymptom: newSymptom,
        finishSuggestion: giveDiagnosesAndEndSearch,
      };
    }),
});

function createDifferentiatingQuestion(
  docs: [Document<Record<string, any>>, number][],
  earlierQA: string[]
): string {
  let diffDiagnosisQueryText = `Basert på følgende liste med diagnoser, gi totalt ett enkelt ja/nei oppfølgingsspørsmål som skal forsøke å differensiere mellom diagnosene. Gi kun ett spørsmål og ikke noe mer. Ikke rett spørsmålet mot en "du", still heller spørsmålet om en pasient. For eksempel: "Opplever pasienten 'eksempel-symptom'?".\n\nListe med diagnoser:\n`;
  docs.forEach((doc, counter) => {
    diffDiagnosisQueryText +=
      `\nDiagnose ${counter + 1}:\n` + doc[0].pageContent + "\n";
  });

  // If there has been asked questions from before, they should not be asked again.
  // ealierQA array contains both questions and answers.
  const earlierQuestionsExist = earlierQA.length > 1;
  if (earlierQuestionsExist) {
    diffDiagnosisQueryText += `\nIkke still et spørsmål som ligner på de følgende, da de allerede har vært stilt:\n`;
    earlierQA.forEach((qOrA, i) => {
      // Every other element is a question
      if (i % 2 !== 0) {
        diffDiagnosisQueryText += (Math.floor(i / 2) + 1).toString() + ". " + qOrA + "\n";
      }
    });
  }

  diffDiagnosisQueryText += `\n\nEtt differensierende spørsmål`;
  if (earlierQuestionsExist) {
    diffDiagnosisQueryText += ` som spør om noe helt annet en de tidligere stilte spørsmålene: `;
  } else {
    diffDiagnosisQueryText += `: `;
  }
  return diffDiagnosisQueryText;
}

function findScore(input: string): number {
  const regex = /(\d{1,2})\/100/;
  const match = input.match(regex);
  if (match) {
    return parseInt(match[1] as string);
  } else {
    return NaN;
  }
}

// All code below is for creating the embeddings in a weaviate DB, and making the Documents (aka splits) from the html document in a specific manner
async function createDiagnosisVectorStoreFromDocuments(
  indexName: string,
  splits: Document<Record<string, any>>[],
  embeddings: OpenAIEmbeddings
) {
  // Create the vector store
  console.debug(
    `- Create vector store (this may take a while...) (${indexName})`
  );
  await WeaviateStore.fromDocuments(splits, embeddings, {
    client: client_diagnosis,
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
