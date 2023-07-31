import Head from "next/head";
import React from "react";
import { type WeaviateClass } from "weaviate-ts-client";
import { IndexViewContainer } from "~/components/FreudVectorDatabase/IndexViewContainer";
import Header from "~/components/Header";
import { api } from "~/utils/api";
import { Icon } from "~/components/ui/icon/Icon";
import { ButtonMinimal } from "~/components/ui/buttonMinimal/ButtonMinimal";

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
      setVectorSchemas(data?.classes);
    },
  });

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
        className={`flex min-h-screen flex-col justify-between bg-beige100 pb-36 pl-36 pr-36`}
      >
        <Header chatStarted={true} />
        {vectorSchemas !== null ? (
          vectorSchemas.map((schema, idx) => {
            if (!(idx in showDetails)) {
              setShowDetails({ ...showDetails, [idx]: false });
            }
            return (
              <>
                <div
                  key={"div-container-" + idx.toString()}
                  className="flex cursor-pointer items-baseline"
                  onClick={() =>
                    setShowDetails({
                      ...showDetails,
                      [idx]: !showDetails[idx],
                    })
                  }
                >
                  <ButtonMinimal
                    key={"button-" + idx.toString()}
                    className="mr-2 text-xl font-bold"
                  >
                    {showDetails[idx] ? "-" : "+"}
                  </ButtonMinimal>
                  <h2 className="text-2xl font-bold">{schema.class}</h2>
                </div>
                {showDetails[idx] && (
                  <IndexViewContainer
                    key={"index-" + idx.toString()}
                    weaviateClass={schema}
                  />
                )}
              </>
            );
          })
        ) : (
          <Icon name="spinner" />
        )}
      </main>
    </>
  );
};

export default Dashboard;
