import React from "react";
import { type WeaviateClass } from "weaviate-ts-client";
import { Table } from "../ui/table/Table";

export const IndexMetadata = ({ weaviateClass }: WeaviateClass) => {
  const columns = [
    {
      accessorKey: "name",
      header: "Attributt",
    },
    {
      accessorKey: "description",
      header: "Beskrivelse",
    },
    {
      accessorKey: "indexFilterable",
      header: "Filtrerbar",
    },
    {
      accessorKey: "indexSearchable",
      header: "Søkbar",
    },
  ];

  return (
    <div>
      <JSONTreeView data={{ weaviateClass }} />
      <Table columns={columns} data={weaviateClass.properties} />
    </div>
  );
};

const TreeNode = ({ data, depth }) => {
  const MAX_DEPTH = 10;
  const DEPTH_OPENED = 5;

  const [isOpen, setIsOpen] = React.useState(
    depth <= DEPTH_OPENED ? true : false
  );

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const renderValue = (key, value) => {
    if (typeof value === "object") {
      return (
        <div key={key} style={{ marginLeft: `${depth * 20}px` }}>
          <span onClick={toggleOpen}>{isOpen ? "-" : "+"}</span>
          <span>
            {key}: {typeof value}
          </span>
          {isOpen &&
            depth < MAX_DEPTH &&
            value !== null &&
            typeof value !== "undefined" && (
              <div style={{ marginLeft: "20px" }}>
                {Object.entries(value).map(([innerKey, innerValue]) => (
                  <TreeNode
                    key={innerKey}
                    data={{ [innerKey]: innerValue }}
                    depth={depth + 1}
                  />
                ))}
              </div>
            )}
        </div>
      );
    } else {
      return (
        <div key={key} style={{ marginLeft: `${depth * 20}px` }}>
          <span>
            {key}: {JSON.stringify(value)}
          </span>
        </div>
      );
    }
  };

  return renderValue(Object.keys(data), Object.values(data)[0]);
};

const JSONTreeView = ({ data }) => {
  return <TreeNode data={data} depth={0} />;
};
