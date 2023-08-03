import React from "react";
import { api } from "~/utils/api";
import { IndexObjectItem } from "./IndexObjectItem";
import { Icon } from "../ui/icon/Icon";
import { type Document } from "@prisma/client";

type Props = {
  streng: string;
};

export const IndexObjectList = ({ streng }: Props) => {
  const [documents, setDocuments] = React.useState<Document[]>([]);

  const getObjects = api.updatemetadata.getAllRowsWithIndex.useMutation({
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
    getObjects.mutate(streng);
  }, []);

  return (
    <div>
      {getObjects.isLoading && <Icon name="spinner" />}
      {documents.map((document, idx) => {
        return <IndexObjectItem key={idx} document={document} />;
      })}
    </div>
  );
};
