import { z } from "zod";

export const Source = z.object({
  title: z.string(),
  author: z.string(),
  location: z.object({
    chapter: z.optional(z.string()),
    href: z.optional(z.string()),
    pageNr: z.optional(z.number()),
    lineFrom: z.number(),
    lineTo: z.number(),
  }),
  content: z.string(),
  filename: z.string(),
  filetype: z.string(),
  category: z.string(),
  score: z.number(),
});

export type Source = z.infer<typeof Source>;
