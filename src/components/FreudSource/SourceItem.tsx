import React, { useEffect, useRef } from "react";
import { type Source } from "~/interfaces/source";
// import { SourceContent } from "./SourceContent";

type Prop = {
  source: Source;
  active: boolean;
  id: number;
  setActiveSources: React.Dispatch<React.SetStateAction<boolean[]>>;
  scrollToId: number;
  setScrollToId: React.Dispatch<React.SetStateAction<number>>;
};

const SourceItem = ({
  source,
  setActiveSources,
  // active,
  id,
  scrollToId,
  setScrollToId,
}: Prop) => {
  const sourceRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (scrollToId == id && sourceRef.current) {
      sourceRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      setScrollToId(-1);
    }
  }, [scrollToId]);

  return (
    <div
      className="m-3 w-fit min-w-[60%] list-disc rounded-lg bg-gray50 pb-2 pl-5 pr-10 pt-2 text-base font-light"
      ref={sourceRef}
    >
      <div
        // className="cursor-pointer"
        onClick={() =>
          setActiveSources((prevState) =>
            prevState.map((active, index) => (index === id ? !active : active))
          )
        }
      >
        <span>[{id + 1}] </span>
        <span className="font-bold">{source.title}</span> av{" "}
        <span className="font-normal">{source.author}</span>
        {source.filetype === "pdf" && (
          <span> (s. {source.location.pageNr})</span>
        )}
        {source.filetype === "epub" && (
          <>
            <br />
            <span>{source.location.chapter}</span>
          </>
        )}
      </div>
      {/* <div> */}
      {/*   {active && ( */}
      {/*     <SourceContent */}
      {/*       category={source.category} */}
      {/*       content={source.content} */}
      {/*       filename={source.filename} */}
      {/*       filetype={source.filetype} */}
      {/*       location={source.location} */}
      {/*     /> */}
      {/*   )} */}
      {/* </div> */}
    </div>
  );
};

export default SourceItem;
