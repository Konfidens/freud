import Head from "next/head";
import React from "react";
import { type WeaviateClass } from "weaviate-ts-client";
import { IndexViewContainer } from "~/components/FreudVectorDatabase/IndexViewContainer";
import Header from "~/components/Header";
import { api } from "~/utils/api";
import { Icon } from "~/components/ui/icon/Icon";

const Dashboard = ({}) => {
  const [vectorSchemas, setVectorSchemas] = React.useState<
    WeaviateClass[] | null
  >(null);

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
        className={`flex min-h-screen flex-col items-center justify-between bg-beige100 pb-8`}
      >
        <Header chatStarted={true} />
        {vectorSchemas !== null ? (
          vectorSchemas.map((schema, idx) => (
            <IndexViewContainer key={idx} weaviateClass={schema} />
          ))
        ) : (
          <Icon name="spinner" />
        )}
      </main>
    </>
  );
};

export default Dashboard;
