import React, { useMemo } from "react";
import type { Excerpt } from "~/interfaces/source";
import SourceGroup from "./SourceGroup";

type Prop = {
  excerpts: Excerpt[];
  scrollToId: number,
  setScrollToId: React.Dispatch<React.SetStateAction<number>>
};

const SourceList = ({ excerpts, scrollToId, setScrollToId }: Prop) => {


  let excerptGroupIdx = 0

  let from = 0
  let to = 0


  const excerptGroups = useMemo(() => {

    excerpts.sort((a, b) =>
      a.document.filename.localeCompare(b.document.filename)
    );
    //Group sources togheter. This requires that they are sorted
    let excerptGroups: Excerpt[][] = []
    for (let i = 1; i < excerpts.length; i++) {
      if (excerpts[i]?.document.filename !== excerpts[i - 1]?.document.filename!) {
        excerptGroupIdx += 1
      }
      if (!excerptGroups[excerptGroupIdx]) {
        excerptGroups[excerptGroupIdx] = []
      }
      excerptGroups[excerptGroupIdx]!.push(excerpts[i]!)
    }
    return excerptGroups
  }, [excerpts]

  )

  return (
    <div className="mb-3 mt-5 rounded-lg p-2">
      {excerpts == undefined || excerpts?.length == 0 ? (
        <p className="bold py-2 font-bold text-yellow550">
          Fant ingen kilder til dette spørsmålet
        </p>
      ) : (
        <div>
          <p className="ml-3 text-lg font-bold">Kilder</p>
          {excerptGroups.map((excerpts: Excerpt[], index) => {
            from = to
            to = from + excerpts.length
            return <SourceGroup from={from} excerpts={excerpts} scrollToId={scrollToId} setScrollToId={setScrollToId} key={index} />
          })}
        </div>
      )
      }
    </div>
  );
};

export default SourceList;
