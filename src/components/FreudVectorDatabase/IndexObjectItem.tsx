import React from "react";
import { WeaviateObject } from "weaviate-ts-client";

export const IndexObjectItem = ({ object }) => {
  return (
    <div>
      <span>
        {object.title} av {object.author}
      </span>
    </div>
  );
};
