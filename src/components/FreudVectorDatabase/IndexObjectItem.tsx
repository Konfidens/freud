import React from "react";
import { Button } from "../ui/button/Button";
import { InputField } from "../ui/inputField/InputField";
import { api } from "~/utils/api";
import { type Document } from "@prisma/client";

type Props={
  document: Document,
}
export const IndexObjectItem = ({ document } : Props) => {
  const [edit, setEdit] = React.useState(false);
  const [title, setTitle] = React.useState(document?.title);
  const [author, setAuthor] = React.useState(document?.author);
  const [url, setUrl] = React.useState(document?.url);

  const updateRow = api.updatemetadata.updateSingleRow.useMutation({
    onError: (error) => {
      console.error(error);
    },
    onSuccess: () => {
      console.log("Success!");
    },
  });

  function handleUpdate() {
    updateRow.mutate({ 
      index: document.index, 
      filename: document.filename,
      title: title ?? undefined,
      author: author ?? undefined,
      url: url ?? undefined,
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
              id="Title"
              disabled={updateRow.isLoading}
              label="Title"
              value={title ?? "<undefined>"}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              className="mb-1 mr-1 mt-1"
              maxLength={200}
              placeholder="Title"
            />
            <InputField
              id="Author"
              disabled={updateRow.isLoading}
              label="Author"
              value={author ?? "<undefined>"}
              onChange={(e) => {
                setAuthor(e.target.value);
              }}
              className="mb-1 mr-1 mt-1"
              maxLength={200}
              placeholder="Author"
            />
            <InputField
              id="URL"
              disabled={updateRow.isLoading}
              label="URL"
              value={url ?? "<undefined>"}
              onChange={(e) => {
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
