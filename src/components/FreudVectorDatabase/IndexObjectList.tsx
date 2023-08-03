import React from "react";
import { api } from "~/utils/api";
import { IndexObjectItem } from "./IndexObjectItem";
import { Icon } from "../ui/icon/Icon";
import { type Document } from "@prisma/client";

type Props = {
  classname: string;
};

export const IndexObjectList = ({ classname }: Props) => {
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
    getObjects.mutate(classname);
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
