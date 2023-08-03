import React from "react";
import { api } from "~/utils/api";
import { IndexObjectItem } from "./IndexObjectItem";
import { Icon } from "../ui/icon/Icon";
import { type Document } from "@prisma/client";

type Props = {
  weaviateclass: string;
};

export const IndexObjectList = ({ weaviateclass }: Props) => {
  const [documents, setDocuments] = React.useState<Document[]>([]);

  const getFiles = api.updatemetadata.getAllFilesFromIndex.useMutation({
    onError: (error) => {
      console.error(error);
    },
    onSuccess: (data) => {
      if (!data) {
        throw new Error("Data is not defined");
      }
      setDocuments(data);
    },
  });

  React.useEffect(() => {
    getFiles.mutate(weaviateclass);
  }, []);

  return (
    <div>
      {getFiles.isLoading && <Icon name="spinner" />}
      {documents.map((document, idx) => {
        return <IndexObjectItem key={idx} document={document} />;
      })}
    </div>
  );
};
