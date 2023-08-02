import React from "react";
import { api } from "~/utils/api";
import { type WeaviateClass } from "weaviate-ts-client";
import { IndexMetadata } from "./IndexMetadata";
import { IndexObjectList } from "./IndexObjectList";

type Props = {
  weaviateClass: WeaviateClass;
};

export const IndexViewContainer = ({ weaviateClass }: Props) => {
  const [objects, setObjects] = React.useState([]);
  const [showMetadata, setShowMetadata] = React.useState(false);
  const [showObjects, setShowObjects] = React.useState(false);

  const vectorStoreListObjects = api.weaviate.listObjectsFromSchema.useMutation(
    {
      onError: (error) => {
        console.error(error);
      },
      onSuccess: (data) => {
        if (data?.index !== undefined && data?.titles !== undefined) {
          setObjects({
            ...objects,
            [data.index]: data.titles,
          });
        }
      },
    }
  );

  {
  }
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
        onClick={() => setShowObjects(!showObjects)}
      >
        {showObjects ? "-" : "+"} Dokumenter
      </h3>

      {showObjects && <IndexObjectList classname={weaviateClass.class} />}
    </div>
  );
};
