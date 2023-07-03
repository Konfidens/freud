import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { UnstructuredDirectoryLoader } from "langchain/document_loaders/fs/unstructured";
import { UnstructuredLoader } from "langchain/document_loaders/fs/unstructured";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { EPubLoader } from "langchain/document_loaders/fs/epub";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import path from "path";
import fs from "fs";

const metadataDictionary = {
  a_revolutionary_method_of_dynamic_psychotherapy: {
    title: "Lives Transformed: A Revolutionary Method of Dynamic Psychotherapy",
    author: "David H. Malan, David Malan, and Patricia Coughlin Della Selva",
    isbn: 1855753782,
  },
  attachment_in_psychotherapy: {
    title: "Attachment in Psychotherapy",
    author: "David J. Wallin",
    isbn: 1593854560,
  },
  co_creating_creating_change_effective_dynamic_therapy_techniques: {
    title: "Co-Creating Change: Effective Dynamic Therapy Techniques",
    author: "Jon Frederickson",
    isbn: 9780988378841,
  },
  istd_psychotherapy_theory_and_technique: {
    title:
      "Intensive Short Term Dynamic Psychotherapy: Theory and Technique Synopsis",
    author: "Patricia Coughlin Della Selva",
    isbn: 1855753022,
  },
  its_not_always_depression: {
    title: "It's Not Always Depression",
    author: "Hilary Jacobs Hendel",
    isbn: 399588140,
  },
  maximizing_effectiveness_in_dynamic_psychotherapy: {
    title: "Maximizing Effectiveness in Dynamic Psychotherapy",
    author: "Patricia Coughlin",
    isbn: 9781138824966,
  },
  psychoanalytic_case_formulation: {
    title: "Psychoanalytic Case Formulation",
    author: "Nancy McWilliams",
    isbn: 1572304626,
  },
  psychoanalytic_psychotherapy_a_practitioners_guide: {
    title: "Psychoanalytic Psychotherapy: A Practitioner's Guide",
    author: "Nancy McWilliams",
    isbn: 9781606235829,
  },
  reaching_through_resistance_advanced_psyc: {
    title: "Reaching Through Resistance: Advanced Psychotherapy Techniques",
    author: "Allan Abbass",
    isbn: 988378868,
  },
  understanding_personality_structure_in_the_clinical_process: {
    title:
      "Psychoanalytic Diagnosis: Understanding Personality Structure in the Clinical Process",
    author: "Nancy McWilliams",
    isbn: 1609184947,
  },
  psychoneurotic_disorders: {
    title:
      "Intensive Short-Term Dynamic Psychotherapy: Spectrum of Psychoneurotic Disorders",
    author: "Habib Davanloo",
    isbn: 123456789012,
  },
};

export const vectorRouter = createTRPCRouter({
  create: publicProcedure.input(z.string()).mutation(async () => {
    try {
      // Load documents
      // See https://js.langchain.com/docs/modules/indexes/document_loaders/examples/file_loaders/directory
      const sourceDirectoryPath = path.join(process.cwd(), "documents");
      //
      // const body = new FormData();
      // const file = fs.readFileSync(
      //   sourceDirectoryPath + "/psychoneurotic_disorders.pdf",
      //   "binary"
      // );
      //
      // body.append("files", file);
      // body.append("strategy", "hi_res");
      // console.log(body);

      // fetch("http://localhost:8000/general/v0/general", {
      //   body,
      //   headers: {
      //     Accept: "application/json",
      //     // "Content-Type": "multipart/form-data",
      //   },
      //   method: "POST",
      // })
      // .then((res) => res.json())
      // .then((json) => console.log(json));

      // curl -X 'POST' 'http://localhost:8000/general/v0/general' -H 'accept: application/json' -H 'Content-Type: multipart/form-data' -F 'files=@documents/psychoneurotic_disorders.pdf' -F 'strategy=hi_res'

      console.info("Create loader");

      // const loader = new UnstructuredLoader(
      //   path.join(sourceDirectoryPath + "/attachment_in_psychotherapy.pdf"),
      //   {
      //     // apiUrl: "http://localhost:8000",
      //     apiUrl: "https://api.unstructured.io/general/v0/general",
      //     apiKey: "L521L3G5ERyfMsYGMmjpi2HJLlWwQE",
      //     strategy: "fast",
      //     // strategy: "hi_res",
      //   }
      // );

      // const loader = new PDFLoader(
      //   sourceDirectoryPath + "/attachment_in_psychotherapy.pdf"
      // );

      // const loader = new DirectoryLoader(path.join(sourceDirectoryPath), {
      //   ".pdf": (sourceDirectoryPath) =>
      //     new PDFLoader(sourceDirectoryPath, { splitPages: true }),
      //   ".txt": (sourceDirectoryPath) => new TextLoader(sourceDirectoryPath),
      //   ".epub": (sourceDirectoryPath) =>
      //     new EPubLoader(sourceDirectoryPath, {
      //       splitChapters: false,
      //     }),
      // });

      const loader = new UnstructuredDirectoryLoader(
        path.join(sourceDirectoryPath),
        {
          // apiUrl: "http://localhost:8000",
          apiKey: "L521L3G5ERyfMsYGMmjpi2HJLlWwQE",
          strategy: "auto",
        }
      );

      const docs = await loader.load();

      // return;

      console.info("Add custom metadata to documents");

      docs.forEach((document) => {
        console.log(document);
        // Extract file name
        const file = document.metadata.source.split("/").pop().split(".")[0];

        // Get metadata from dictionary
        const metadata = metadataDictionary[file];

        // Add metadata to document
        document.metadata.info = metadata;
      });

      // // Split the text into chunks
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1536,
        chunkOverlap: 200,
      });

      console.info("Split documents into chunks");
      const splits = await splitter.splitDocuments(docs);

      console.info("Create vector store (this may take a while...)");

      // Create the vectorStore
      const vectorStore = await HNSWLib.fromDocuments(
        splits,
        new OpenAIEmbeddings()
      );

      console.info("Vector store created");

      // Save the vectorStore to disk
      const databaseDirectoryPath = path.join(process.cwd(), "db");
      await vectorStore.save(databaseDirectoryPath);

      console.info("Vector store saved to disk");

      return;
    } catch (error) {
      console.error(error);
    }
  }),
});
