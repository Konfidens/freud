import React, { useEffect, useRef, useState } from "react";
import { env } from "~/env.mjs";
import { Excerpt } from "~/interfaces/source";
import { SourceContent } from "./SourceContent";

type Prop = {
  excerpts: Excerpt[];
  from: number;
  scrollToId: number;
  setScrollToId: React.Dispatch<React.SetStateAction<number>>;
};

const SourceGroup = ({ excerpts, from, scrollToId, setScrollToId }: Prop) => {
  const sourceRef = useRef<null | HTMLDivElement>(null);
  const document = excerpts[0]!.document;
  const to = from + excerpts.length; //TODO get "to" from parent

  const [lastSelected, setLastSelected] = useState<number>(from);
  const [open, setOpen] = useState<boolean>();

  useEffect(() => {
    if (scrollToId < to && scrollToId >= from && sourceRef.current) {
      setOpen(true);
      setLastSelected(scrollToId);
      sourceRef.current.scrollIntoView({
        // TODO minor problem is that on first click of in-text reference, div is not open and it does not scroll completely down.
        behavior: "smooth",
        block: "center",
      });
      setScrollToId(-1); //Necessary for triggering useEffect.
    }
  }, [scrollToId]);

  return (
    <div
      className={`m-3  min-h-fit w-fit min-w-[60%] list-disc rounded-lg bg-gray50 pb-2 pl-5 pr-10 pt-2 text-base font-light `}
      ref={sourceRef}
    >
      <div
        className="flex cursor-pointer flex-row justify-between gap-3"
        onClick={(e) => setOpen(!open)}
      >
        <div>
          {excerpts.length == 1 ? (
            <span>[{from + 1}] </span>
          ) : (
            <span>
              [{from + 1} - {to}]{" "}
            </span>
          )}
          <span className="font-bold">{document.title} <span className="font-normal">av</span> {document.author}</span>
        </div>
        <div className="flex flex-col">
          {env.NEXT_PUBLIC_NODE_ENV == "development" &&
            excerpts.map((excerpt, idx) => {
              return <span key={idx}>{excerpt.score.toPrecision(3)}</span>;
            })}
        </div>
        {/* {source.filetype === "pdf" && (
        <span> (s. {source.location.pageNr})</span>
      )}
      {source.filetype === "epub" && (
        <>
          <br />
          <span>{source.location.chapter}</span>
        </>
      )} */}
      </div>
      {open && (
        <div className="flex flex-row gap-2">
          {excerpts.map((_, index) => {
            return (
              <button
                key={index}
                className={`${from + index == lastSelected ? "font-bold" : "font-normal"
                  }`}
                onClick={(e) => {
                  setLastSelected(from + index);
                }}
              >
                [{from + 1 + index}]
              </button>
            );
          })}
        </div>
      )}
      {open && (
        <SourceContent
          excerpt={excerpts[lastSelected - from]}
        />
      )}
    </div>
  );
};

export default SourceGroup;
