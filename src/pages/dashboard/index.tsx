import Head from "next/head";
import React from "react";
import { type WeaviateClass } from "weaviate-ts-client";
import { IndexViewContainer } from "~/components/FreudVectorDatabase/IndexViewContainer";
import Header from "~/components/Header";
import { api } from "~/utils/api";
import { Icon } from "~/components/ui/icon/Icon";
import { ButtonMinimal } from "~/components/ui/buttonMinimal/ButtonMinimal";
import { Button } from "~/components/ui/button/Button";

const Dashboard = ({}) => {
  const [vectorSchemas, setVectorSchemas] = React.useState<
    WeaviateClass[] | null
  >(null);
  const [showDetails, setShowDetails] = React.useState<{
    [key: number]: boolean;
  }>({});

  const vectorStoreSchemas = api.weaviate.listSchemas.useMutation({
    onError: (error) => {
      console.error(error);
    },
    onSuccess: (data) => {
      setVectorSchemas(data?.classes ?? null);
    },
  });

  const updatemetadata = api.updatemetadata.updatemetadata.useMutation({});

  React.useEffect(() => {
    vectorStoreSchemas.mutate();
  }, []);

  return (
    <>
      <Head>
        <title>Freud</title>
        <link rel="icon" href="/sigmund_freud_avatar.png" />
      </Head>
      <main
        className={`min-h-screen flex-col justify-between bg-beige100 pb-36 pl-36 pr-36`}
      >
        <Header chatStarted={true} />
        {vectorSchemas !== null ? (
          vectorSchemas.map((schema, idx) => {
            if (!(idx in showDetails)) {
              setShowDetails({ ...showDetails, [idx]: false });
            }
            return (
              <div key={idx}>
                <div
                  className="flex cursor-pointer items-baseline"
                  onClick={() =>
                    setShowDetails({
                      ...showDetails,
                      [idx]: !showDetails[idx],
                    })
                  }
                >
                  <ButtonMinimal className="mr-2 text-xl font-bold">
                    {showDetails[idx] ? "-" : "+"}
                  </ButtonMinimal>
                  <h2 className="mb-4 text-2xl font-bold">{schema.class}</h2>
                </div>
                {showDetails[idx] && (
                  <IndexViewContainer weaviateClass={schema} />
                )}
              </div>
            );
          })
        ) : (
          <Icon name="spinner" />
        )}
        <Button
          className="mt-4"
          size={"small"}
          color={"green"}
          onClick={() => updatemetadata.mutate()}
        >
          Oppdater metadata i vektordatabase
        </Button>
      </main>
    </>
  );
};

export default Dashboard;
