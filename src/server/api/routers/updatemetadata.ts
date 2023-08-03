import { prisma } from "db";
import { readdirSync } from "fs";
import path from "path";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getExistingSchemas } from "./weaviate";

const ROOTPATH = path.join(process.cwd(), "documents");

type FileMetadata = {
  year: number | undefined;
  author: string | undefined;
  title: string | undefined;
  filename: string;
};

const getLocalFilesData = (index: string) => {
  const fs = require("fs");
  const files: string[] = fs.readdirSync(ROOTPATH + "/" + index);

  const table: FileMetadata[] = [];

  files.slice(0).forEach((file: string) => {
    const filename = file;
    const splitfilename = file.split("__");

    let year: number | undefined;
    let title: string | undefined;
    let author: string | undefined;

    try {
      year = parseInt(splitfilename[0]!);
    } catch (error) {
      throw new Error("Not able to parse year for file: " + file);
    }

    try {
      title = splitfilename[1]?.replaceAll("_", " ");
    } catch (error) {
      throw new Error("Not able to parse title for file: " + file);
    }

    try {
      if (splitfilename.length == 3) {
        author = splitfilename[2];
      } else {
        author = splitfilename[3];
      }

      author = author?.replaceAll("_", " ");

      if (author?.split(".") != undefined && author?.split(".").length >= 1) {
        author = author.split(".").slice(0, -1).toString();
      }
    } catch (error) {
      throw new Error("Not able to parse author for file: " + file);
    }

    table.push({ year, title, author, filename });
  });
  return table;
};

export const updatemetadataRouter = createTRPCRouter({
  updatemetadata: publicProcedure.mutation(async () => {
    const indexesFromDirectories: string[] = readdirSync(ROOTPATH, {
      withFileTypes: true,
    })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    indexesFromDirectories.forEach(async (dir) => {
      const localMetadatas = getLocalFilesData(dir);

      localMetadatas.forEach(async (metadata) => {
        await prisma.document.updateMany({
          where: {
            index: dir,
            filename: metadata.filename,
            author: null,
          },
          data: {
            author: metadata.author,
          },
        });
        await prisma.document.updateMany({
          where: {
            index: dir,
            filename: metadata.filename,
            title: null,
          },
          data: {
            title: metadata.title,
          },
        });
        //TODO expand with year
      });
    });
  }),

  updateSingleRow: publicProcedure

    .input(
      z.object({
        index: z.string(),
        filename: z.string(),
        title: z.optional(z.string()),
        author: z.optional(z.string()),
        url: z.optional(z.string()),
      })
    )

    .mutation(async ({ input }) => {
      await prisma.document.update({
        where: {
          index_filename: { index: input.index, filename: input.filename },
        },
        data: {
          title: input.title,
          author: input.author,
          url: input.url,
        },
      });
    }),

  getAllRowsWithIndex: publicProcedure

    .input(z.string())

    .mutation(async ({ input }) => {
      const results = await prisma.document.findMany({
        where: {
          index: input,
        },
      });

      return results;
    }),
});
