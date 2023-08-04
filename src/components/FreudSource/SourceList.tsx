import React from "react";
import type { Source } from "~/interfaces/source";
import SourceGroup from "./SourceGroup";

type Prop = {
  sources: Source[];
  scrollToId: number,
  setScrollToId: React.Dispatch<React.SetStateAction<number>>
};

const SourceList = ({ sources, scrollToId, setScrollToId }: Prop) => {


  let sourceItemsIndex = 0

  let from = 0
  let to = 0

  sources.sort((a, b) => 
    a.filename.localeCompare(b.filename)
  );

  //Group sources togheter. This requires that they are sorted
  let sourceItems: [Source[]] = [[sources[0]!]]
  for (let i = 1; i < sources.length; i++) {
    if (sources[i]?.filename !== sources[i - 1]?.filename!) {
      sourceItemsIndex += 1
    }
    if (!sourceItems[sourceItemsIndex]) {
      sourceItems[sourceItemsIndex] = []
    }
    sourceItems[sourceItemsIndex]!.push(sources[i]!)
  }

  return (
    <div className="mb-3 mt-5 rounded-lg p-2">
      {sources == undefined || sources?.length == 0 ? (
        <p className="bold py-2 font-bold text-yellow550">
          Fant ingen kilder til dette spørsmålet
        </p>
      ) : (
        <div>
          <p className="ml-3 text-lg font-bold">Kilder</p>
          {sourceItems.map((sources: Source[], index) => {
            from = to
            to = from + sources.length
            return <SourceGroup from={from} sources={sources} scrollToId={scrollToId} setScrollToId={setScrollToId} key={index} />
          })}
        </div>
      )
      }
    </div>
  );
};

export default SourceList;
