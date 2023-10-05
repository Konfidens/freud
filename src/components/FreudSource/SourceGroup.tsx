import React, { useEffect, useRef, useState } from "react";
import { env } from "~/env.mjs";
import { type Source } from "~/interfaces/source";
import { SourceContent } from "./SourceContent";

type Prop = {
  sources: Source[];
  from: number;
  scrollToId: number;
  setScrollToId: React.Dispatch<React.SetStateAction<number>>;
};

const SourceGroup = ({ sources, from, scrollToId, setScrollToId }: Prop) => {
  const sourceRef = useRef<null | HTMLDivElement>(null);
  const source = sources[0]!;
  const to = from + sources.length;

  const [lastSelected, setLastSelected] = useState<number>(from);
  const [open, setOpen] = useState<boolean>();

  useEffect(() => {
    if (scrollToId < to && scrollToId >= from && sourceRef.current) {
      setOpen(true);
      setLastSelected(scrollToId);
      sourceRef.current.scrollIntoView({
        // minor problem is that on first click of in-text reference, div is not open and it does not scroll completely down.
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
          {sources.length == 1 ? (
            <span>[{from + 1}] </span>
          ) : (
            <span>
              [{from + 1} - {to}]{" "}
            </span>
          )}
          <span className="font-bold">{source.filename}</span>
        </div>
        <div className="flex flex-col">
          {env.NEXT_PUBLIC_NODE_ENV == "development" &&
            sources.map((source, idx) => {
              return <span key={idx}>{source.score.toPrecision(3)}</span>;
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
          {sources.map((_, index) => {
            return (
              <button
                key={index}
                className={`${
                  from + index == lastSelected ? "font-bold" : "font-normal"
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
          category={
            sources[lastSelected - from]?.category ?? "Klarte ikke å hente"
          }
          content={
            sources[lastSelected - from]?.content ?? "Klarte ikke å hente"
          }
          filename={
            sources[lastSelected - from]?.filename ?? "Klarte ikke å hente"
          }
          location={
            sources[lastSelected - from]?.location ?? {
              lineFrom: 0,
              lineTo: 0,
            }
          }
          score={sources[lastSelected - from]?.score ?? 0}
        />
      )}
    </div>
  );
};

export default SourceGroup;
