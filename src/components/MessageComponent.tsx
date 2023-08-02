import React, { useState } from "react";
import Image from "next/image";
import { type Message, Role } from "~/interfaces/message";
import SourceList from "./FreudSource/SourceList";

type Prop = {
  message: Message;
  children: React.ReactNode;
};

const AVATAR_IMAGE_SIZE = 50;

const MessageComponent = ({ message, children }: Prop) => {
  //initializes with length of sources (if sources are available) or is empty array
  const [scrollToId, setScrollToId] = useState<number>(-1);

  const formatLinks = (input: string): React.JSX.Element => {
    try {
      //Sometimes gpt wrongly outputs [Source 1] instead of [1], so we include it in regex.
      var regex = /\[[Source 0-9]+\]/i;

      if (!regex.test(input)) {
        // If it does not contain any source references
        return <p className="whitespace-pre-wrap">{input}</p>;

        throw new Error("No sources found");
      }

      const goodspaces = input.replaceAll("\n", " \n");
      const moregoodspaces = goodspaces.replaceAll("]", "] ");

      const splittext = moregoodspaces.split(" ");

      let outputlist: any[] = [];

      let mystring = "";
      splittext.map((split, idx) => {
        if (regex.test(split.trim())) {
          outputlist.push(mystring);
          mystring = "";
          for (let i = 0; i < message.sources!.length; i++) {
            if (parseInt(split.trim().charAt(1)) == i + 1) {
              outputlist.push(
                <button
                  key={idx}
                  className="text-blue600"
                  onClick={() => {
                    setScrollToId(i);
                  }}
                >
                  [{i + 1}]
                </button>
              );
            }
          }
        } else {
          mystring += split + " ";
        }
      });
      outputlist.push(mystring);

      const output = <p className="whitespace-pre-wrap">{outputlist}</p>;

      return output;
    } catch (error) {
      // Code above is bad. So if it breaks, sources wont be clickable.
      console.log(error);
      return <p className="whitespace-pre-wrap">{input}</p>;
    }
  };

  return (
    <div className="container border-b-2 border-gray900 py-10">
      {message.role === Role.User ? (
        <div className="flex items-start space-x-4">
          <Image
            className="mt-3"
            src="/chatter_avatar_2.png"
            alt="This is text"
            width={AVATAR_IMAGE_SIZE}
            height={AVATAR_IMAGE_SIZE}
          />
          <p className="whitespace-pre-wrap pt-5">{message.content}</p>
        </div>
      ) : (
        <div>
          <div className="relative">
            <Image
              className="float-left mr-4"
              src="/sigmund_freud_avatar.png"
              alt="This is text"
              width={AVATAR_IMAGE_SIZE}
              height={AVATAR_IMAGE_SIZE}
            />
            {children}
            {formatLinks(message.content)}
          </div>
          {message.sources && (
            <SourceList
              sources={message.sources}
              scrollToId={scrollToId}
              setScrollToId={setScrollToId}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default MessageComponent;
