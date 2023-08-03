import { z } from "zod";
import { FileType } from "@prisma/client";

export const Source = z.object({
  location: z.object({
    chapter: z.optional(z.string()),
    href: z.optional(z.string()),
    pageNr: z.optional(z.number()),
    lineFrom: z.number(),
    lineTo: z.number(),
  }),
  content: z.string(),
  filename: z.string(),
  filetype: z.nativeEnum(FileType),
  category: z.string(),
  score: z.number(),
});

export type Source = z.infer<typeof Source>;
