import React from "react";
import { type OpenAlexWork } from "~/interfaces/openalex";

export const OpenAlexItem = ({
  doi,
  title,
  authorships,
  publication_date,
  cited_by_count,
  primary_location,
}: OpenAlexWork) => {
  return (
    <li className="mb-2">
      <a className="text-blue600" href={doi}>
        {title}
      </a>
      <br />
      By {authorships.map((a) => a.author.display_name).join(", ")} (
      {publication_date})<br />
      {cited_by_count} citations
    </li>
  );
};
