import { z } from "zod";
import { FileType } from "@prisma/client";


//This Document is meant to be a zod object corresponding to the Document class in our prisma.schema.
// Want to update Document in schema from index to category.
export const Document = z.object({
  category: z.string(),
  filename: z.string(),
  filetype: z.enum(["epub", "json", "pdf"]),
  author: z.string().nullish(),
  title: z.string().nullish(),
  url: z.string().nullish()
})

export const Excerpt = z.object({
  location: z.object({
    chapter: z.optional(z.string()),
    href: z.optional(z.string()),
    pageNr: z.optional(z.number()),
    lineFrom: z.number(),
    lineTo: z.number(),
  }),
  content: z.string(),
  document: Document,
  score: z.number(),
});

export type Excerpt = z.infer<typeof Excerpt>;
