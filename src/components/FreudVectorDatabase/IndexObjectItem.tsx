import React from "react";

export const IndexObjectItem = ({ object }) => {
  return (
    <div>
      <span>
        {object.title} av {object.author}
      </span>
    </div>
  );
};
