import React from "react";
import { Button } from "../ui/button/Button";
import { InputField } from "../ui/inputField/InputField";
import { api } from "~/utils/api";
import { Document } from "@prisma/client";

type Props={
  document: Document,
}
export const IndexdocumentItem = ({ document } : Props) => {
  const [edit, setEdit] = React.useState(false);
  const [title, setTitle] = React.useState(document.title);
  const [author, setAuthor] = React.useState(document.author);
  const [url, setUrl] = React.useState(document.url);

  const updateRow = api.updatemetadata.updateSingleRow.useMutation({
    onError: (error) => {
      console.error(error);
    },
    onSuccess: (data) => {
      console.log("Success!");
    },
  });

  function handleUpdate() {
    updateRow.mutate({ 
      index: document.index, 
      filename: document.filename,
      title: title,
      author: author,
      url: url,
    });
  }

  return (
    <>
      <div>
        <li className="mt-5"> Fra {document.filename}:</li>
        <span>
          {document.title ?? "undefined"} av {document.author ?? "undefined"}
        </span>
        <Button
          color={edit ? "green" : "white"}
          className="mb-2 ml-4 mt-2"
          onClick={() => setEdit(!edit)}
        >
          Edit
        </Button>
      </div>
      <div>
        {edit && (
          <>
            <InputField
              disabled={updateRow.isLoading}
              label="Title"
              value={title as string}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setTitle(e.target.value);
              }}
              className="mb-1 mr-1 mt-1"
              maxLength={200}
              placeholder="Title"
            />
            <InputField
              disabled={updateRow.isLoading}
              label="Author"
              value={author as string}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setAuthor(e.target.value);
              }}
              className="mb-1 mr-1 mt-1"
              maxLength={200}
              placeholder="Author"
            />
            <InputField
              disabled={updateRow.isLoading}
              label="URL"
              value={url}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setUrl(e.target.value);
              }}
              className="mb-1 mr-1 mt-1"
              maxLength={200}
              placeholder="URL"
            />
            <Button disabled={updateRow.isLoading} className="mb-10 mr-1 mt-1" onClick={handleUpdate}>
              Update
            </Button>
          </>
        )}
      </div>
    </>
  );
};
