import { readdirSync } from "fs";
import type { Document } from "langchain/dist/document";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
// import { EPubLoader } from "langchain/document_loaders/fs/epub";
import { EPubLoader } from "~/server/document_loaders/epub";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { type OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { WeaviateStore } from "langchain/vectorstores/weaviate";
import path from "path";
import { type WeaviateObject, type WeaviateSchema } from "weaviate-ts-client";
import { z } from "zod";
import { metadataDictionaryCBT } from "~/metadata/CBT";
import { metadataDictionaryISTDP } from "~/metadata/ISTDP";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { type weaviateMetadataDictionary } from "~/types/weaviateMetadata";
import { client } from "~/utils/weaviate/client";
import { embeddings } from "~/utils/weaviate/embeddings";
import { metadataKeys } from "~/utils/weaviate/getRetriever";

// Combine metadata dictionaries into one dictionary
const metadataDictionary: weaviateMetadataDictionary = Object.assign(
  {},
  metadataDictionaryISTDP,
  metadataDictionaryCBT
);

// Define metadata for vetor store indexes
const indexDescriptions: { [key: string]: string } = {
  ISTDP: "Initial batch of ISTDP works for Freud",
  CBT: "CBT documents to test framework comparisons in Freud",
};

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

          const promises = res.data.Aggregate[input].map((item) => {
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
          });

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
  generateVectorStoreFromDisk: publicProcedure.mutation(async () => {
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
      if (existingSchemas.includes(indexName)) {
        console.debug(`-> Index ${indexName} already exists`);

        // Load document
        const docs = await loadDocuments(indexName);

        // Return early if no new documents
        if (docs?.length === 0) {
          console.debug(`** Ending procedure for ${indexName}`);
          continue;
        }

        try {
          // Create vector store from documents
          await createVectorStoreFromDocuments(indexName, docs, embeddings);
        } catch (error) {
          console.error(error);
        }
      } else {
        console.debug(`** Creating index ${indexName}`);
        try {
          // Create index
          await createIndex(indexName);

          // Load document
          const docs = await loadDocuments(indexName);

          // Return early if no new documents
          if (docs?.length === 0) {
            continue;
          }

          // Add documents to vector store
          await createVectorStoreFromDocuments(indexName, docs, embeddings);

          console.debug(`** Index ${indexName} updated`);
        } catch (error) {
          console.error(`** Failed to create index: ${indexName}`);
          console.error(error);
        }
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
    description: indexDescriptions[indexName],
    vectorIndexType: "hnsw",
    vectorizeClassName: true,
    properties: [
      {
        name: "title",
        dataType: ["string"],
        description: "Book title",
        vectorizePropertyName: true,
        index: true,
      },
      {
        name: "author",
        dataType: ["string"],
        description: "Author of book",
      },
      {
        name: "filename",
        dataType: ["string"],
        description: "Name of source document",
      },
      {
        name: "filetype",
        dataType: ["string"],
        description: "Type of source document",
      },
      {
        name: "category",
        dataType: ["string"],
        description: "Psychotherapy framework",
      },
      {
        name: "text",
        dataType: ["text"],
        description: "Text content",
      },
      {
        name: "pageNumber",
        dataType: ["int"],
        description: "Page number of text split (only PDF)",
      },
      {
        name: "chapter",
        dataType: ["string"],
        description: "Chapter of text split (only Epub)",
      },
      {
        name: "href",
        dataType: ["string"],
        description: "Hyperlink to the chapter a snippet is from (only Epub)",
      },
      {
        name: "loc_lines_from",
        dataType: ["int"],
        description: "Text split beginning",
      },
      {
        name: "loc_lines_to",
        dataType: ["int"],
        description: "Text split end",
      },
      {
        name: "splitCount",
        dataType: ["int"],
        description: "Original number of splits",
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
    .withGroupBy(["title"])
    .withFields("groupedBy { value } meta {count} splitCount {minimum} ")
    .do()
    .then(
      (res: {
        data: {
          Aggregate: {
            [classname: string]: Array<{
              groupedBy: { value: string };
              meta: { count: number };
              splitCount: { minimum: number };
            }>;
          };
        };
      }) => {
        const documents: {
          title: string;
          dbCount: number;
          splitCount: number;
        }[] =
          res.data.Aggregate[schema]?.map((obj) => {
            return {
              title: obj.groupedBy.value,
              dbCount: obj.meta.count,
              splitCount: obj.splitCount.minimum,
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

  // Add custom metadata
  console.debug(`- Clean document list and add metadata (${indexName})`);

  const validKeys = [
    "author",
    "category",
    "chapter",
    "filename",
    "filetype",
    "href",
    "splitCount",
    "pageNumber",
    "title",
  ];
  let splits: Array<Document<Record<string, any>>> = [];

  // Define splitter
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1536,
    chunkOverlap: 200,
  });

  // Retrieve the titles of the existing documents in the index
  // Only documents with non-existing titles are added
  const existingDocuments = await getDocumentsFromSchema(indexName);

  const pathSeparator = path.sep;

  await Promise.all(
    allDocs.map(async (document) => {
      if (
        document.metadata?.source === undefined ||
        typeof document.metadata?.source !== "string"
      ) {
        console.error(document);
        throw new Error("Missing or corrupted source metadata");
      }

      const file: string =
        document.metadata?.source?.split(pathSeparator).pop() ?? "";

      const filename = file.split(".")[0] ?? "";
      const filetype = file.split(".")[1] ?? "";

      if (metadataDictionary[filename] === undefined) {
        throw new Error(
          `Missing metadata in dictionary for ${filename} in ${indexName}`
        );
      }

      const title: string = metadataDictionary[filename]!.title;

      if (
        !existingDocuments ||
        existingDocuments.some((doc) => doc.title === title)
      ) {
        // console.debug(`-> ${title} already exists in ${indexName}`);
        return;
      }

      // console.debug(`-> Added ${filename} to ${indexName}`);

      // Add metadata to document
      document.metadata.author = metadataDictionary[filename]!.author;
      document.metadata.category = indexName;
      document.metadata.chapter =
        (document.metadata?.chapter_title as string) ?? "";
      document.metadata.filename = file;
      document.metadata.filetype = filetype;
      document.metadata.href =
        (document.metadata?.chapter_href as string) ?? "";
      document.metadata.title = title;
      document.metadata.pageNumber =
        (document.metadata.loc as { pageNumber?: number })?.pageNumber ?? 0;

      // Remove remainding metadata
      Object.keys(document.metadata).forEach(
        (key) => validKeys.includes(key) || delete document.metadata[key]
      );

      // Split document
      const split = await splitter.splitDocuments([document]);

      // Add splitCount metadata to each split
      const splitCount = split.length;
      split.forEach(
        (textSplit) => (textSplit.metadata.splitCount = splitCount)
      );

      // Push to cleaned document array
      splits = [...splits, ...split];
    })
  );

  // Return early if there are no new documents
  if (splits.length === 0) {
    console.debug("-> No new documents in " + indexName);
  }

  return splits;
}

async function isObjectInIndex(indexName: string, title: string) {
  return await client.graphql
    .get()
    .withClassName(indexName)
    .withFields("title")
    .withWhere({
      operator: "Equal",
      path: ["title"],
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
