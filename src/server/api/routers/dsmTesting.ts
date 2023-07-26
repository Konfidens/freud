// import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
// import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import path from "path";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { JSDOM } from "jsdom";
import fs from "fs";

const dirPath = path.join(
  process.cwd(),
  "public",
  "documents",
  "DSM",
);

const dsmWebPagePath = path.join(
  process.cwd(),
  "public",
);

export const dsmRouter = createTRPCRouter({
  testing: publicProcedure.mutation(() => {
    console.log("testing!");
    // return "testing tittes!";
    // return countCharacters();
    // return htmlDocSplitter(`<h1>This is heading 1</h1>`);
    // return checkForWordInString("Hei jejeg har det velveldig bra!", "veldig", 0);
    // return findEndOfTag(`<p clas<p></p></p>`, 0);
    // return findAllCategoryIntervals();
    const arrCategories = generateDoc();
    createManyFilesFromArray(arrCategories);
    return 5;
  }),
});

function html2text(html: string): string {
  const dom = new JSDOM();
  const tag = dom.window.document.createElement("div");
  tag.innerHTML = html;

  return tag.textContent || "";
}


function checkForWordInString(text: string, word: string, fromIndex: number, toIndex?: number): number { // Gives starting index of the word in the string
  let wordIndex = 0;
  if (toIndex == undefined) {
    toIndex = text.length;
  }
  for (let i = fromIndex; i < toIndex ; i++ ) {
    if (text[i] == word[wordIndex]){
      wordIndex++;
      if (wordIndex == word.length) {
        return i - wordIndex + 1;
      }
    } else if (text[i] == word[0]){
      wordIndex = 1;
    } else {
      wordIndex = 0;
    }
  }
  return -1;
}


function findEndOfTag(text: string, fromIndex: number): number {
  // assume <p></p> tag
  let endingTagsLeft = 0;
  for (let i = fromIndex; i < text.length ; i++) {
    if (text.substring(i, i + 2) == `<p`) {
      endingTagsLeft++;
    } else if (text.substring(i, i + 4) == `</p>`) {
      endingTagsLeft--;
      if (endingTagsLeft == 0){
        return i + 4;
      }
    }
  }
  return -1;
}

type CategoryInterval = {
  fromInclusive: number,
  toExclusive: number,
  categoryName: string,
}

function findAllCategoryIntervals(): CategoryInterval[] {
  const text = fs.readFileSync(path.join(dsmWebPagePath, "dsm_norsk_nettside.html"), 'utf-8');
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
      // console.debug("-1 from finding index of category.");
      categories.push({fromInclusive: startIndex, toExclusive: text.length, categoryName: currentCategory});
      break;
    }
    categories.push({fromInclusive: startIndex, toExclusive: currentIndex, categoryName: currentCategory});

    // Set next
    endOfTagIndex = findEndOfTag(text, currentIndex);
    currentCategory = html2text(text.substring(currentIndex, endOfTagIndex));
  }
  // console.log(categories);
  return categories;
}

type Chunk = {
  text: string,
  category: string,
  diagnosis: string,
};

function generateDoc(): Chunk[] {
  const text = fs.readFileSync(path.join(dsmWebPagePath, "dsm_norsk_nettside.html"), 'utf-8');
  const DIAGNOSIS_TAG = `<p class="firetegnoverskrift0">`;

  const generatedChunks: Chunk[] = [];

  const foundCategoryIntervals = findAllCategoryIntervals();

  for (let i = 0 ; i < foundCategoryIntervals.length ; i++ ) {
    let currentDiagnosis = ``;
    let currentIndex = checkForWordInString(text, DIAGNOSIS_TAG, foundCategoryIntervals[i]?.fromInclusive as number);
    let endOfTagIndex = findEndOfTag(text, currentIndex);
    currentDiagnosis = html2text(text.substring(currentIndex, endOfTagIndex));

    while( true ) {
      const startIndex = currentIndex;
      currentIndex = checkForWordInString(text, DIAGNOSIS_TAG, endOfTagIndex, foundCategoryIntervals[i]?.toExclusive);
      if (currentIndex == -1) {
        // console.debug("-1 from finding index of diagnosis.");
        generatedChunks.push({text: html2text(text.substring(startIndex, foundCategoryIntervals[i]?.toExclusive as number)), category: foundCategoryIntervals[i]?.categoryName as string, diagnosis: currentDiagnosis });
        break;
      }
      generatedChunks.push({text: html2text(text.substring(startIndex, currentIndex)), category: foundCategoryIntervals[i]?.categoryName as string, diagnosis: currentDiagnosis });

      // Set next
      endOfTagIndex = findEndOfTag(text, currentIndex);
      currentDiagnosis = html2text(text.substring(currentIndex, endOfTagIndex));
    }
  }
  // console.log(JSON.stringify(generatedChunks));
  return generatedChunks;
}


function removeSpacingInString(text: string): string {
  return text.replace(/\s/g,'');
}

function createManyFilesFromArray(diagnosisArray: Chunk[]): void {
  diagnosisArray.forEach((elem)=>{
    fs.writeFileSync(path.join(dirPath, elem.diagnosis.replace(/\s/g,'').replace(/[\/\\?%*:|"<>\.]/g, '_')).concat(".json"), JSON.stringify(elem), {flag: 'w'});
  })
}