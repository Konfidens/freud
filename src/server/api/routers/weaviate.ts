import { readdirSync } from "fs";
import type { Document } from "langchain/dist/document";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
// import { EPubLoader } from "langchain/document_loaders/fs/epub";
import { FileType, type Prisma } from "@prisma/client";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { type OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { WeaviateStore } from "langchain/vectorstores/weaviate";
import path from "path";
import { type WeaviateObject, type WeaviateSchema } from "weaviate-ts-client";
import { z } from "zod";
import { prisma } from "~/../lib/prisma";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { EPubLoader } from "~/server/document_loaders/epub";
import { client } from "~/utils/weaviate/client";
import { embeddings } from "~/utils/weaviate/embeddings";
import { metadataKeys } from "~/utils/weaviate/getRetriever";

// Root directory containing source documents
const rootDirectoryPath = path.join(process.cwd(), "documents");

/* tRPC router
- createSchema
- listSchemas
- deleteSchema
- listObjectsFromSchema
- generateVectorStoreFromDisk
*/

export const weaviateRouter = createTRPCRouter({
  /* Create schema */
  createSchema: publicProcedure

    // Input validation
    .input(z.string())

    // Create index
    .mutation(async ({ input }) => createIndex(input)),

  /* List all schemas */
  listSchemas: publicProcedure.mutation(async () => {
    try {
      return await client.schema.getter().do();
    } catch (error) {
      console.error(error);
    }
  }),

  /* Delete a schema */
  deleteSchema: publicProcedure

    // Input validation
    .input(z.string())

    // Delete schema
    .mutation(async ({ input }) => {
      console.debug("Deleting " + input);
      try {
        await client.schema
          .classDeleter()
          .withClassName(input)
          .do()
          .then(() => {
            console.debug("Deleted " + input);
          });
      } catch (error) {
        console.error(error);
      }
    }),

  /* List objects contained in given schema, grouped by title */
  listObjectsFromSchema: publicProcedure

    // Input validation
    .input(z.string())

    // Get and return objects
    .mutation(async ({ input }) => {
      console.debug("Getting objects in: " + input);
      try {
        const titles = await getDocumentsFromSchema(input);

        return {
          index: input,
          titles: titles,
        };
      } catch (error) {
        console.error(error);
      }
    }),

  listObjects2: publicProcedure

    .input(z.string())

    .mutation(async ({ input }) => {
      return await client.graphql
        .aggregate()
        .withClassName(input)
        .withGroupBy(["filename"])
        .withFields("groupedBy {value}")
        .do()
        .then((res) => {
          // For each file, get a corresponding single object (text snippet)
          // Notes:
          // - Each snippet that shares a filename is supposed to have the same metadata
          // - There won't be duplicate filenames within an index
          // - It is probably better to store such metadata in a separate table than to duplicate it across all objects

          const promises =
            res.data.Aggregate[input]?.map((item) => {
              const filename = item.groupedBy.value;

              // Get first object with this filename
              return client.graphql
                .get()
                .withClassName(input)
                .withFields(`${metadataKeys.join(" ")}`)
                .withWhere({
                  operator: "Equal",
                  path: ["filename"],
                  valueText: filename,
                })
                .withLimit(1)
                .do()
                .then((res) => {
                  return res.data.Get[input][0];
                })
                .catch((error) => {
                  console.error(error);
                });
            }) ?? [];

          // Wait for all the promises to resolve and return the array of objects
          return Promise.all(promises);
        })
        .catch((error) => {
          console.error(error);
        });
    }),

  /*
   * For each directory with documents:
   * - Create a new index per directory (unless it already exists)
   * - Add documents contained in directory to the index (unless already added)
   */
  generateVectorStore: publicProcedure.mutation(async () => {
    console.debug("Called create vector store procedure");

    // Find existing classes
    const existingSchemas: string[] = await getExistingSchemas();

    // Iterate through directories on disk
    // Each directory represents an index
    const indexesFromDirectories: string[] = readdirSync(rootDirectoryPath, {
      withFileTypes: true,
    })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    for (const indexName of indexesFromDirectories) {
      if (!existingSchemas.includes(indexName)) {
        // Create index
        console.debug(`** Creating index ${indexName}`);
        try {
          await createIndex(indexName);
        } catch (error) {
          console.error(`** Failed to create index: ${indexName}`);
          console.error(error);
        }
      } else {
        console.debug(`-> Index ${indexName} already exists`);
      }

      // Load documents
      const docs = await loadDocuments(indexName);

      // Return early if no new documents
      if (docs?.length === 0) {
        console.debug(`** Ending procedure for ${indexName}`);
        continue;
      }

      try {
        // Create vector store from documents
        await createVectorStoreFromDocuments(indexName, docs, embeddings);
        console.debug(`** Index ${indexName} updated`);
      } catch (error) {
        console.error(error);
      }
    }
  }),
});

/*
 * Helper functions
 * - createIndex()
 * - getExistingSchemas()
 * - getDocumentsFromSchema()
 * - loadDocuments()
 * - isObjectInIndex()
 * - createVectorStoreFromDocuments()
 */

async function createIndex(indexName: string) {
  const weaviateClassObj = {
    class: indexName,
    description: "Index description",
    vectorIndexType: "hnsw",
    vectorizeClassName: true,
    properties: [
      {
        name: "filename",
        dataType: ["string"],
        description: "Filename of original source document",
      },
      {
        name: "category",
        dataType: ["string"],
        description: "Psychotherapy framework",
      },
      {
        name: "text",
        dataType: ["text"],
        description: "Text snippet",
      },
    ],
  };

  return await client.schema.classCreator().withClass(weaviateClassObj).do();
}

export async function getExistingSchemas() {
  const existingSchemas: string[] = [];

  return await client.schema
    .getter()
    .do()
    .then((res: WeaviateSchema) => {
      res.classes?.map((c) => {
        if (c.class === undefined) {
          throw new Error("Corrupted Weaviate class schema (class undefined)");
        }
        existingSchemas.push(c.class);
      });
    })
    .then(() => {
      return existingSchemas;
    })
    .catch((error: Error) => {
      console.error(error);
      throw new Error("Failed to get existing schemas");
    });
}

async function getDocumentsFromSchema(schema: string) {
  return client.graphql
    .aggregate()
    .withClassName(schema)
    .withGroupBy(["filename"])
    .withFields("groupedBy { value }")
    .do()
    .then(
      (res: {
        data: {
          Aggregate: {
            [classname: string]: Array<{
              groupedBy: { value: string };
            }>;
          };
        };
      }) => {
        const documents: {
          filename: string;
        }[] =
          res.data.Aggregate[schema]?.map((obj) => {
            return {
              filename: obj.groupedBy.value,
            };
          }) ?? [];

        return documents;
      }
    )
    .catch((error: Error) => {
      console.error(error);
    });
}

async function loadDocuments(indexName: string) {
  // Load documents
  // See https://js.langchain.com/docs/modules/indexes/document_loaders/examples/file_loaders/directory
  console.debug(`- Load documents (${indexName})`);
  const sourceDirectoryPath = path.join(rootDirectoryPath, indexName);
  const pathSeparator = path.sep;

  const loader = new DirectoryLoader(path.join(sourceDirectoryPath), {
    ".pdf": (sourceDirectoryPath) =>
      new PDFLoader(sourceDirectoryPath, {
        splitPages: true,
      }),
    ".epub": (sourceDirectoryPath) =>
      new EPubLoader(sourceDirectoryPath, {
        splitChapters: true,
      }),
  });
  const allDocs = await loader.load();

  const validKeys = ["category", "filename", "loc"];
  const splits: Array<Document<Record<string, any>>> = [];

  // Define splitter
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1536,
    chunkOverlap: 200,
  });

  // Retrieve the titles of the existing documents in the index
  // Only documents with non-existing titles are added
  const existingDocuments = await getDocumentsFromPrisma(indexName);

  // Dictionary holding documents that later will be added to the Document table in Prisma
  const insertManyDocumentData: Record<string, Prisma.DocumentCreateManyInput> =
    {};

  await Promise.all(
    allDocs.map(async (document) => {
      if (
        document.metadata?.source === undefined ||
        typeof document.metadata?.source !== "string"
      ) {
        console.error(document);
        throw new Error("Missing or corrupted source metadata");
      }

      const filename: string =
        document.metadata?.source?.split(pathSeparator).pop() ?? "";

      // Add metadata to document
      document.metadata.category = indexName;
      document.metadata.filename = filename;

      // Remove remainding metadata
      Object.keys(document.metadata).forEach(
        (key) => validKeys.includes(key) || delete document.metadata[key]
      );

      // Split document
      const split = await splitter.splitDocuments([document]);
      splits.push(...split);

      const documentExistsInPrisma = existingDocuments.some(
        (doc) => doc.filename === filename
      );

      if (!documentExistsInPrisma) {
        try {
          const filetype = getFileType(filename);
          insertManyDocumentData[filename] = {
            index: indexName,
            filename,
            filetype,
          };
        } catch (error) {
          console.error(error);
        }
      }
    })
  );

  // Insert all new documents in the "Document" Prisma table
  await prisma.document.createMany({
    data: Object.values(insertManyDocumentData),
    skipDuplicates: true,
  });

  // Console debug to inform that there are no new documents
  if (splits.length === 0) {
    console.debug("-> No new documents in " + indexName);
  }

  return splits;
}

async function isObjectInIndex(indexName: string, title: string) {
  return await client.graphql
    .get()
    .withClassName(indexName)
    .withFields("filename")
    .withWhere({
      operator: "Equal",
      path: ["filename"],
      valueText: title,
    })
    .withLimit(1)
    .do()
    .then(
      (res: {
        data: {
          Get: {
            [classname: string]: Array<WeaviateObject>;
          };
        };
      }) => {
        return res.data.Get[indexName]!.length > 0;
      }
    )
    .catch((error: Error) => {
      console.error(error);
    });
}

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
    indexName: indexName,
  })
    .then(() => {
      console.debug(`- Vector store created (${indexName})`);
    })
    .catch((error: Error) => console.error(error));
}

function getFileType(filename: string) {
  const fileExtension = filename.split(".").pop();

  if (fileExtension === undefined) {
    throw new Error(`File extension undefined for file ${filename}`);
  }

  if (fileExtension === "epub") {
    return FileType.epub;
  } else if (fileExtension === "json") {
    return FileType.json;
  } else if (fileExtension === "pdf") {
    return FileType.pdf;
  } else {
    throw new Error(`Unknown filetype ${fileExtension} from file ${filename}`);
  }
}

async function getDocumentsFromPrisma(index: string) {
  return await prisma.document.findMany({
    where: {
      index,
    },
    select: {
      filename: true,
    },
  });
}
