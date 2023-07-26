import React from "react";
import { type OpenAlexWork } from "~/interfaces/openalex";
import { OpenAlexItem } from "./OpenAlexItem";

export const OpenAlexList = ({ works }: OpenAlexWork[]) => {
  return (
    <div className="text-base">
      <ul className="list-disc">
        {works.map((work, idx) => {
          return (
            <OpenAlexItem
              key={idx}
              doi={work.doi}
              title={work.title}
              authorships={work.authorships}
              publication_date={work.publication_date}
              cited_by_count={work.cited_by_count}
              primary_location={work.primary_location}
            />
          );
        })}
      </ul>
    </div>
  );
};
