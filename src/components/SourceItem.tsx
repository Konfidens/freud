import React, { useState } from "react";
import { type Source } from "~/interfaces/message";

type SourceProps = {
    source: Source;
};

//Component with button for hiding and showing 'content'
const SourceComponent = ({ source }: SourceProps) => {
    const [shown, setShown] = useState(false);
    return (
        <li className="bg-gray50 my-2 rounded-md cursor-pointer" onClick={() => { setShown(!shown) }}>
            {source.title} av {source.author}, s. {source.location.pageNr} (linje{" "}
            {source.location.lineFrom}-{source.location.lineTo})
            <br />
            <button
                className="text-blue"
            >
                {shown ? "Skjul" : "Vis mer"}
            </button>
            <p>{shown ? source.content : ""}</p>
        </li>
    );
};

export default SourceComponent;
