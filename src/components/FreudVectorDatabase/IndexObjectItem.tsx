import React from "react";
import { Button } from "../ui/button/Button";
import { InputField } from "../ui/inputField/InputField";
import { Input } from "../ui/input/Input";

export const IndexObjectItem = ({ object }) => {
  const [edit, setEdit] = React.useState(false);
  const [title, setTitle] = React.useState(object.title);
  const [author, setAuthor] = React.useState(object.author);
  const [url, setUrl] = React.useState("");

  function handleUpdate() {
    // TODO:
    // Call API to update the title, author, url
    console.log("\nTitle: ", title);
    console.log("\nAuthor: ", author);
    console.log("\nURL: ", url);
    console.log("Type of url: ", typeof(url) );
  }

  return (
    <>
      <div>
        <span>
          {object.title} av {object.author}
        </span>
        <Button color={edit ? "green" : "white"} className="mb-2 ml-4 mt-2" onClick={() => setEdit(!edit)}>
          Edit
        </Button>
      </div>
      <div>
        {edit && (
          <>
            <InputField
              label="Title"
              value={title as string}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setTitle(e.target.value);
              }}
              className="mt-1 mb-1 mr-1"
              maxLength={200}
              placeholder="Title"
            />
            <InputField
              label="Author"
              value={author as string}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setAuthor(e.target.value);
              }}
              className="mt-1 mb-1 mr-1"
              maxLength={200}
              placeholder="Author"
            />
            <InputField
              label="URL"
              value={url}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setUrl(e.target.value);
              }}
              className="mt-1 mb-1 mr-1"
              maxLength={200}
              placeholder="URL"
            />
            <Button className="mt-1 mb-10 mr-1" onClick={handleUpdate}> Update </Button>
          </>
        )}
      </div>
    </>
  );
};
