import React from "react";
import { ViewPDF } from "./ViewPDF";
import { ViewEpub } from "./ViewEpub";
import { env } from "~/env.mjs";
import type { Excerpt } from "~/interfaces/source";

type Prop = {
  excerpt: Excerpt
}

export const SourceContent = ({ excerpt }: { excerpt: Excerpt | undefined }) => {
  if (!excerpt) {
    throw new Error("Excerpt is not defined in SourceContent")
  }
  return (
    <div className="bg-250 m-3 w-[100%] rounded-lg p-2">
      {excerpt.content}

      {env.NEXT_PUBLIC_NODE_ENV == "development" && excerpt.document.filetype === "pdf" && (
        <ViewPDF category={excerpt.document.category} filename={excerpt.document.filename} location={excerpt.location} />
      )}
      {env.NEXT_PUBLIC_NODE_ENV == "development" && excerpt.document.filetype === "epub" && (
        <ViewEpub category={excerpt.document.category} filename={excerpt.document.filename} location={excerpt.location} />
      )}
    </div>
  );
};
