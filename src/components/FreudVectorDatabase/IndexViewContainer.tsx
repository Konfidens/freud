import React from "react";
import { api } from "~/utils/api";
import { type WeaviateClass } from "weaviate-ts-client";
import { IndexMetadata } from "./IndexMetadata";
import { IndexObjectList } from "./IndexObjectList";

type Props = {
  weaviateClass: WeaviateClass;
  showDetails: boolean;
};

export const IndexViewContainer = ({ weaviateClass, showDetails }: Props) => {
  const [objects, setObjects] = React.useState<{
    [key: string]: { title: string; dbCount: number; splitCount: number }[];
  }>({});

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

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold">{weaviateClass.class}</h2>
      {showDetails && (
        <>
          <IndexMetadata weaviateClass={weaviateClass} />
          <IndexObjectList classname={weaviateClass.class} />
        </>
      )}
    </div>
  );
};
