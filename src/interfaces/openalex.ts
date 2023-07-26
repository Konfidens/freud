import { z } from "zod";

export const OpenAlexWork = z.object({
  doi: z.string(),
  title: z.string(),
  authorships: z.any(),
  publication_date: z.string(),
  cited_by_count: z.number(),
  primary_location: z.any(),
});

export type OpenAlexWork = z.infer<typeof OpenAlexWork>;
