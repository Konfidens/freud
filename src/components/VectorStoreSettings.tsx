import React from "react";
import { api } from "~/utils/api";
import { Button } from "./ui/button/Button";

type Props = {
  vectorStoreSchemas: any;
  setDiagnosisMode: React.Dispatch<React.SetStateAction<boolean>>,
  diagnosisMode: boolean,
}

export const VectorStoreSettings = ({ vectorStoreSchemas, setDiagnosisMode, diagnosisMode }: Props) => {
  const [showObjectsInDatabase, setShowObjectsInDatabase] = React.useState<{
    [key: string]: boolean;
  }>({});
  const [weaviateClassObjects, setWeaviateClassObjects] = React.useState<{
    [key: string]: { title: string; dbCount: number; splitCount: number }[];
  }>({});

  const vectorStoreCreation =
    api.weaviate.generateVectorStoreFromDisk.useMutation({
      onError: (error) => {
        console.error(error);
      },
      onSuccess: () => {
        console.info("Vector store create request submitted");
      },
    });

  const vectorStoreClassDeletion = api.weaviate.deleteSchema.useMutation();

  const vectorStoreListObjects = api.weaviate.listObjectsFromSchema.useMutation(
    {
      onError: (error) => {
        console.error(error);
      },
      onSuccess: (data) => {
        if (data?.index !== undefined && data?.titles !== undefined) {
          setWeaviateClassObjects({
            ...weaviateClassObjects,
            [data.index]: data.titles,
          });
        }
      },
    }
  );

  function createVectorStore() {
    vectorStoreCreation.mutate();
  }

  function deleteVectorClass(classname: string) {
    console.debug("Deleting " + classname);
    vectorStoreClassDeletion.mutate(classname);
  }

  function getObjectsFromClass(classname: string) {
    console.debug("Get objects from " + classname);
    vectorStoreListObjects.mutate(classname);
  }

  function addObjectsVisibilityKey(classname: string) {
    if (classname in showObjectsInDatabase) {
      return;
    }

    setShowObjectsInDatabase({
      ...showObjectsInDatabase,
      [classname]: false,
    });
  }

  return (
    <>
      <Button color={diagnosisMode ? "green" : "white"} onClick={() => setDiagnosisMode(!diagnosisMode)} className="ml-4">Diagnosis mode</Button>
      <div className="p-10">
        {vectorStoreSchemas.isLoading ||
          !vectorStoreSchemas.data ||
          !vectorStoreSchemas.data?.classes
          ? "..."
          : vectorStoreSchemas.data.classes.map((data: any, tidx: number) => {
            if (data.class === undefined || typeof data.class !== "string") {
              return "";
            } else {
              addObjectsVisibilityKey(data.class);
              return (
                <div className="pb-10" key={"schema-" + tidx.toString()}>
                  <h2 className="font-extrabold">{data.class}</h2>
                  Beskrivelse: {data.description}
                  <br />
                  Indekseringsmetode: {data.vectorIndexType}
                  <br />
                  Distanse:{" "}
                  {(data.vectorIndexConfig?.distance as string) ??
                    "undefined"}
                  <h3 className="pt-5 font-bold">Metadata</h3>
                  <table className="border">
                    <tbody>
                      <tr className="border">
                        <th
                          className="border"
                          key={"name-" + tidx.toString()}
                        >
                          Navn
                        </th>
                        <th className="border">Datatype</th>
                        <th className="border">Beskrivelse</th>
                        <th className="border">Filtrerbar</th>
                        <th className="border">Søkbar</th>
                      </tr>
                      {data.properties?.map((property: any, ridx: number) => {
                        return (
                          <tr
                            key={
                              "schema" +
                              tidx.toString() +
                              "-metadata-" +
                              ridx.toString()
                            }
                          >
                            <td className="border">{property.name}</td>
                            <td className="border">{property.dataType}</td>
                            <td className="border">{property.description}</td>
                            <td className="border">
                              {property.indexFilterable?.valueOf().toString()}
                            </td>
                            <td className="border">
                              {property.indexSearchable?.valueOf().toString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <br />
                  <Button
                    size={"small"}
                    onClick={() => {
                      if (!showObjectsInDatabase[data.class!]) {
                        getObjectsFromClass(data.class!);
                      }
                      setShowObjectsInDatabase({
                        ...showObjectsInDatabase,
                        [data.class!]: !showObjectsInDatabase[data.class!],
                      });
                    }}
                  >
                    Vis titler
                  </Button>
                  <div className="p-5">
                    {vectorStoreListObjects.isLoading ||
                      !weaviateClassObjects[data.class] ||
                      !showObjectsInDatabase[data.class] ? (
                      ""
                    ) : (
                      <div className={data.class + "-objects"}>
                        {weaviateClassObjects[data.class]?.length === 0 ? (
                          "Ingen dokumenter"
                        ) : (
                          <ul className="list-disc">
                            {weaviateClassObjects[data.class]?.map(
                              (obj, idx: number) => {
                                return (
                                  <li key={idx}>
                                    {obj.title} ({obj.splitCount}/
                                    {obj.dbCount})
                                  </li>
                                );
                              }
                            )}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                  <Button
                    color={"red"}
                    size={"small"}
                    loading={vectorStoreClassDeletion.isLoading}
                    disabled={vectorStoreClassDeletion.isLoading}
                    onClick={() => deleteVectorClass(data.class!)}
                  >
                    Slett {data.class}
                  </Button>
                </div>
              );
            }
          })}
        <div className="pt-5">
          <Button
            size={"small"}
            color={"green"}
            loading={vectorStoreCreation.isLoading}
            disabled={vectorStoreCreation.isLoading}
            onClick={createVectorStore}
          >
            Oppdater vektordatabase
          </Button>
        </div>
      </div>
    </>
  );
};
