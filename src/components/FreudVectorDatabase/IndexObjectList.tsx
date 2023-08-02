import React from "react";
import { type WeaviateObjectsList } from "weaviate-ts-client";
import { api } from "~/utils/api";
import { IndexObjectItem } from "./IndexObjectItem";
import { Icon } from "../ui/icon/Icon";

type Props = {
  classname: string;
};

export const IndexObjectList = ({ classname }: Props) => {
  const [objects, setObjects] = React.useState([]);

  const getObjects = api.weaviate.listObjects2.useMutation({
    onError: (error) => {
      console.error(error);
    },
    onSuccess: (data) => {
      setObjects(data);
    },
  });

  React.useEffect(() => {
    getObjects.mutate(classname);
  }, []);

  return (
    <div>
      {getObjects.isLoading && <Icon name="spinner" />}
      {objects.map((object, idx) => {
        return <IndexObjectItem key={idx} object={object} />;
      })}
    </div>
  );
};
