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
    [key: string]: boolean;
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

  function handleSetShowDetails(idx: number, value: boolean) {
    setShowDetails((prevShowDetails) => {
      return { ...prevShowDetails, [idx]: value };
    });
  }

  return (
    <>
      <Head>
        <title>Freud</title>
        <link rel="icon" href="/sigmund_freud_avatar.png" />
      </Head>
      <main
        className={`flex min-h-screen flex-col items-center justify-between bg-beige100 pb-8`}
      >
        <Header chatStarted={true} />
        {vectorSchemas !== null ? (
          vectorSchemas.map((schema, idx) => {
            if (!(idx in showDetails)) {
              setShowDetails({ ...showDetails, [idx]: false });
            }
            return (
              <div
                key={"div-container-" + idx.toString()}
                className="flex items-baseline"
              >
                <ButtonMinimal
                  key={"button-" + idx.toString()}
                  className="mr-2 text-xl font-bold"
                  onClick={() =>
                    setShowDetails({
                      ...showDetails,
                      [idx]: !showDetails[idx],
                    })
                  }
                >
                  {showDetails[idx] ? "-" : "+"}
                </ButtonMinimal>
                <IndexViewContainer
                  key={"index-" + idx.toString()}
                  weaviateClass={schema}
                  showDetails={showDetails[idx] ?? false}
                  onClick={() =>
                    setShowDetails({
                      ...showDetails,
                      [idx]: !showDetails[idx],
                    })
                  }
                />
              </div>
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
