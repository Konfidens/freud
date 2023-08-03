import React from "react";
import { api } from "~/utils/api";
import { type WeaviateClass } from "weaviate-ts-client";
import { IndexMetadata } from "./IndexMetadata";
import { IndexObjectList } from "./IndexObjectList";

type Props = {
  weaviateClass: WeaviateClass;
};

export const IndexViewContainer = ({ weaviateClass }: Props) => {
  const [showMetadata, setShowMetadata] = React.useState(false);
  const [showFiles, setShowFiles] = React.useState(false);

  return (
    <div className="mb-6">
      <h3
        className="mb-2 mt-2 cursor-pointer text-xl font-semibold"
        onClick={() => setShowMetadata(!showMetadata)}
      >
        {showMetadata ? "-" : "+"} Metadata
      </h3>
      {showMetadata && (
        <IndexMetadata
          weaviateClass={weaviateClass}
          setShow={setShowMetadata}
        />
      )}
      <h3
        className="mb-2 mt-2 cursor-pointer text-xl font-semibold"
        onClick={() => setShowFiles(!showFiles)}
      >
        {showFiles ? "-" : "+"} Dokumenter
      </h3>

      {showFiles && weaviateClass.class && <IndexObjectList weaviateclass={weaviateClass.class} />}

      {!weaviateClass.class && <p>weaviateClass.class er udefinert</p>}
    </div>
  );
};
