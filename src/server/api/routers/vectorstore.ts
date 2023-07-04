import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { UnstructuredDirectoryLoader } from "langchain/document_loaders/fs/unstructured";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { env } from "~/env.mjs";
import path from "path";

export const vectorRouter = createTRPCRouter({
  create: publicProcedure.input(z.string()).mutation(async () => {
    try {
      // Load documents
      console.info("Load documents (this may take a while...)");
      const sourceDirectoryPath = path.join(process.cwd(), "documents");

      const loader = new UnstructuredDirectoryLoader(
        path.join(sourceDirectoryPath),
        {
          apiKey: env.UNSTRUCTURED_API_KEY,
          strategy: "auto",
        }
      );
      const docs = await loader.load();
      console.info(docs.length.toString() + " documents loaded");

      // Add metadata
      console.info("Add metadata to documents");
      docs.forEach((document) => {
        const filename = document.metadata.filename.split(".")[0];
        document.metadata.info = metadata;
      });

      // // Split the text into chunks
      console.info("Split documents into chunks");
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1536,
        chunkOverlap: 200,
      });
      const splits = await splitter.splitDocuments(docs);

      // Create the vectorStore
      console.info("Create vector store (this may take a while...)");
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
