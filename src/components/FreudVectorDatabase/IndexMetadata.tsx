import React from "react";
import { type WeaviateClass } from "weaviate-ts-client";
import { Table } from "../ui/table/Table";

export const IndexMetadata = ({ weaviateClass }: WeaviateClass) => {
  const { class: _a, properties: _b, ...classSchema } = weaviateClass;
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
      <div className="mb-4">
        <JSONTreeView data={{ classSchema }} />
      </div>
      <Table className="" columns={columns} data={weaviateClass.properties} />
    </div>
  );
};

const TreeNode = ({ data, depth }) => {
  const MAX_DEPTH = 10;
  const DEPTH_OPENED = 5;

  const [isOpen, setIsOpen] = React.useState(
    depth > 1 && depth <= DEPTH_OPENED ? true : false
  );

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const renderValue = (key, value) => {
    if (typeof value === "object") {
      return (
        <div key={key} style={{ marginLeft: `${depth * 5}px` }}>
          <div onClick={toggleOpen} className="cursor-pointer">
            <span>{isOpen ? "- " : "+ "}</span>
            <span className="font-medium">{key}</span>
          </div>
          {isOpen &&
            depth < MAX_DEPTH &&
            value !== null &&
            typeof value !== "undefined" && (
              <div style={{ marginLeft: "5px" }}>
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
        <div key={key} style={{ marginLeft: `${depth * 5}px` }}>
          <span className="font-medium">{key}:</span>
          <span> {JSON.stringify(value)}</span>
        </div>
      );
    }
  };

  return renderValue(Object.keys(data), Object.values(data)[0]);
};

const JSONTreeView = ({ data }) => {
  return <TreeNode data={data} depth={0} />;
};
