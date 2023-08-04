import React from "react";
import { api } from "~/utils/api";
import { type WeaviateClass } from "weaviate-ts-client";
import { IndexMetadata } from "./IndexMetadata";
import { IndexObjectList } from "./IndexObjectList";
import { Button } from "../ui/button/Button";

type Props = {
  weaviateClass: WeaviateClass;
};

export const IndexViewContainer = ({ weaviateClass }: Props) => {
  const [showMetadata, setShowMetadata] = React.useState(false);
  const [showFiles, setShowFiles] = React.useState(false);

  const updateIndex = api.weaviate.updateVectorStoreIndex.useMutation();
  const deleteIndex = api.weaviate.deleteSchema.useMutation();

  function deleteVectorIndex() {
    const indexName = weaviateClass.class!;
    console.debug("Deleting " + indexName);
    deleteIndex.mutate(indexName);
  }

  function updateVectorIndex() {
    const indexName = weaviateClass.class!;
    console.debug("Updating " + indexName);
    updateIndex.mutate(indexName);
  }

  return (
    <div className="mb-6 ml-4">
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

      {showFiles && weaviateClass.class && (
        <IndexObjectList weaviateclass={weaviateClass.class} />
      )}

      <Button
        color={"green"}
        className="mr-4 mt-4"
        size={"small"}
        loading={updateIndex.isLoading}
        disabled={updateIndex.isLoading}
        onClick={() => updateVectorIndex()}
      >
        Oppdater
      </Button>

      <Button
        color={"red"}
        size={"small"}
        loading={deleteIndex.isLoading}
        disabled={deleteIndex.isLoading}
        onClick={() => deleteVectorIndex()}
      >
        Slett
      </Button>

      {!weaviateClass.class && <p>weaviateClass.class er udefinert</p>}
    </div>
  );
};
