import Head from "next/head";
import React, { type FormEvent, useState } from "react";
import { SidebarFreud } from "~/SidebarFreud";
import { VectorStoreSettings } from "~/components/VectorStoreSettings";
import { Button } from "~/components/button/Button";
import { colors } from "~/stitches/colors";
import { Icon } from "~/components/icon/Icon";
import { api } from "~/utils/api";
import { Role, type Message } from "~/interfaces/message";
import SourceComponent from "~/components/sourceComponent";
import { LogoWordmark } from "~/components/logo/LogoWordmark";
import { InputField } from "~/components/inputField/InputField";

import Image from "next/image";
import FeedbackComponent from "~/components/feedbackComponent";
import { env } from "~/env.mjs";

import QuickAskComponent from "~/components/quickAskComponent";

const AVATAR_IMAGE_SIZE = 50;

export default function Home() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingReply, setIsLoadingReply] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const [suggestedQuestions, setSuggestedQuestions] = React.useState<string[]>([
    "How can I help my patient with anxiety?",
    "How do I assess trauma in a patient?",
    "What do I do if my patient is very silent?",
  ]);

  // const getAll = api.feedback.getAllData.useQuery()
  // console.log(getAll.data);

  const mutation = api.langchain.conversation.useMutation({
    onError: (error) => {
      console.error(error);
      setIsLoadingReply(false);
    },
    onSuccess: (message) => {
      setMessages([...messages, message!.reply]);
      setQuery("");
      setIsLoadingReply(false);

      setSuggestedQuestions(message!.generated_followup_questions);
    },
  });

  const agent = api.agent.plan.useMutation({
    onError: (error) => {
      console.error(error);
      setIsLoadingReply(false);
    },
    onSuccess: (data) => {
      console.debug(data);
    },
  });

  // const feedbacks = api.feedback.getAllData.useQuery();

  const queryResult = api.feedback.createNewFeedback.useMutation({
    // temporary test
    onError: (error: any) => console.error(error),
    onSuccess: () => console.info("Data sent!"),
  });

  function handleQuickSubmit(n: number) {
    const question = suggestedQuestions[n];
    if (!question) {
      throw new Error("Index of clicked question is out of bounds")
    }
    setQuery(question);

    setIsLoadingReply(true);
    const message = {
      role: Role.User,
      content: question,
    };
    setMessages([...messages, message]);
    mutation.mutate([...messages, message]);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    //Quickfix for empty query
    if (query.length == 0) {
      return;
    }

    setIsLoadingReply(true);
    const message = {
      role: Role.User,
      content: query,
    };
    setMessages([...messages, message]);
    // mutation.mutate([...messages, message]);
    agent.mutate([...messages, message]);
  }

  return (
    <>
      <Head>
        <title>Freud</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/sigmund_freud_avatar.png" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-beige100">
        {env.NEXT_PUBLIC_NODE_ENV == "development" && (
          <SidebarFreud
            showSettings={showSettings}
            setShowSettings={setShowSettings}
          >
            <VectorStoreSettings />
          </SidebarFreud>
        )}

        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <div className="flex flex-row items-end gap-1">
            <h1 className="text-5xl font-extrabold tracking-tight text-green750 sm:text-[5rem]">
              Freud
            </h1>
            <p className="pb-[0.3rem] text-green750">by</p>
            <div className="h-6 w-16">
              <LogoWordmark color={colors.green750} />
            </div>
          </div>
          <div className="container text-2xl">
            {messages.map((message, idx) => {
              return (
                <div
                  key={idx.toString()}
                  className="container border-b-2 border-gray900 py-10"
                >
                  {message.role === Role.User ? (
                    <div key={idx} className="flex items-start space-x-4">
                      <Image
                        className="mt-3"
                        src="/chatter_avatar_2.png"
                        alt="This is text"
                        width={AVATAR_IMAGE_SIZE}
                        height={AVATAR_IMAGE_SIZE}
                      />
                      <p className="pt-5" key={idx}>
                        {message.content}
                      </p>
                    </div>
                  ) : (
                    <div key={idx}>
                      <div className="relative">
                        <Image
                          className="float-left mr-4"
                          src="/sigmund_freud_avatar.png"
                          alt="This is text"
                          width={AVATAR_IMAGE_SIZE}
                          height={AVATAR_IMAGE_SIZE}
                        />
                        <FeedbackComponent chat={messages} />
                        <p
                          color={colors.beige400}
                          className=""
                          key={"reply-" + idx.toString()}
                        >
                          {message.content}
                        </p>
                      </div>

                      <div className="mb-3">
                        {message.sources == undefined ||
                          message.sources?.length == 0 ? (
                          <p className="bold py-2 font-bold text-yellow550">
                            Fant ingen kilder til dette spørsmålet
                          </p>
                        ) : (
                          <div>
                            <p className="bold py-2 font-bold">Kilder</p>

                            <ul>
                              {message.sources.map((source, sourceIdx) => {
                                return (
                                  <SourceComponent
                                    key={sourceIdx}
                                    source={source}
                                  ></SourceComponent>
                                );
                              })}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <QuickAskComponent
            suggestedQuestions={suggestedQuestions}
            onClick={handleQuickSubmit}
            isLoadingReply={isLoadingReply}
          />
        </div>
        <form onSubmit={handleSubmit} className="mb-0 flex flex-row gap-3">
          <InputField
            disabled={isLoadingReply}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
            }}
            label={""}
            id={"submitquestion"}
          />
          <Button
            type="submit"
            color={"lightGreen"}
            withBorder={true}
            disabled={isLoadingReply}
            className="mb-[0.4rem] mt-1"
          >
            <Icon name={"arrowNarrowRight"} color={colors.green600}></Icon>
          </Button>
        </form>
      </main>
    </>
  );
}
