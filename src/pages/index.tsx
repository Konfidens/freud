import Head from "next/head";
import React, { useEffect, useState } from "react";
import Chat from "~/components/Chat";
import Header from "~/components/Header";
import SelectCategories from "~/components/SelectCategories";
import { SidebarFreud } from "~/components/SidebarFreud";
import { VectorStoreSettings } from "~/components/VectorStoreSettings";
import { env } from "~/env.mjs";
import { type Message } from "~/interfaces/message";
import type { Categories } from "~/types/categories";
import { api } from "~/utils/api";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [categories, setCategories] = useState<Categories>({});

  const fetchedCategories = api.weaviate.listSchemas.useMutation({
    onSuccess: (data) => {
      //Fetch categories from vector db. Set either false or value from localstore.
      if (!data) {
        throw new Error("Data not defined in OnSuccess");
      }

      const fetched_keys: string[] = [];

      data.classes?.forEach((item) => {
        let name: string;
        if (!item.class) {
          name = "Kategori uten navn";
        } else {
          name = item.class;
        }
        fetched_keys.push(name);
      });

      let localstore_categories: { [name: string]: boolean } = {};
      let localstore_keys: string[] = [];

      localstore_categories = JSON.parse(
        localStorage.getItem("categories") as string
      ) as { [name: string]: boolean };

      localstore_keys = Object.keys(
        localstore_categories
      );


      fetched_keys.map((name) => {
        if (localstore_keys.includes(name)) {
          setCategories((prevState) => ({
            ...prevState,
            [name]: localstore_categories[name]!,
          }));
        } else {
          setCategories((prevState) => ({
            ...prevState,
            [name]: false,
          }));

        }
      });
    },
  });

  useEffect(() => {
    fetchedCategories.mutate();
  }, []);


  return (
    <>
      <Head>
        <title>Freud</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/sigmund_freud_avatar.png" />
      </Head>
      <main
        className={`flex min-h-screen flex-col items-center justify-between bg-beige100 pb-8`}
      >
        <SidebarFreud
          showSettings={showSettings}
          setShowSettings={setShowSettings}
        >
          <>
            <SelectCategories categories={categories} myfunc={setCategories} />
            {env.NEXT_PUBLIC_NODE_ENV == "development" && (
              <VectorStoreSettings vectorStoreSchemas={fetchedCategories} />
            )}
          </>
        </SidebarFreud>
        {/* get content in center at start */}
        <div />
        <div />
        <Header chatStarted={messages.length > 0} />
        <Chat
          messages={messages}
          setMessages={setMessages}
          categories={categories}
        />
      </main>
    </>
  );
}
