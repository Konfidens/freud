import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import path from "path";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const rootDirectoryPath = path.join(process.cwd(), "documents");

const dsmPath = "DSM";

export const dsmRouter = createTRPCRouter({

  testing: publicProcedure

    .mutation(async () => {

      return "HEI 123";
    })
});


function htmlDocSplitter(html_text: string): void {
  return;
}