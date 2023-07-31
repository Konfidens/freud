import React, {
  createRef,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from "react";
import { Role, type Message } from "~/interfaces/message";
import { colors } from "~/stitches/colors";
import { type Categories } from "~/types/categories";
import { api } from "~/utils/api";
import MessageList from "./MessageList";
import QuickAsk from "./QuickAsk";
import { Button } from "./ui/button/Button";
import { Icon } from "./ui/icon/Icon";
import { Spinner } from "./ui/icon/icons/Spinner";
import { TextArea } from "./ui/textArea/TextArea";
import useAutosizeTextArea from "./useAutosizeTextArea";

type Prop = {
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
  categories: Categories;
};

const Chat = ({ messages, setMessages, categories }: Prop) => {
  const [isLoadingReply, setIsLoadingReply] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = React.useState<string[]>([
    "How can I help my patient with anxiety?",
    "How do I assess trauma in a patient?",
    "What do I do if my patient is very silent?",
  ]);
  const [isLoadingFollowUps, setIsLoadingFollowUps] = useState(false);
  const [query, setQuery] = useState("");

  const [diagnosisMode, setDiagnosisMode] = useState(false);
  const [queryMessages, setQueryMessages] = useState<string[]>([]);

  // Autosize textarea (grow height with input)
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  useAutosizeTextArea(textAreaRef.current, query);

  // Used for textarea commit on enter. Shift-enter is new line.
  const myFormRef = createRef<HTMLFormElement>();
  const onEnterPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.shiftKey == false) {
      e.preventDefault();
      myFormRef.current?.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }
  };

  //Auto scrolldown on new messages
  const bottomRef = useRef<null | HTMLDivElement>(null);
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages]);

  const makeFollowUps = api.followup.makeFollowUps.useMutation({
    onError: (error) => {
      console.error(error);
      setIsLoadingFollowUps(false);
    },
    onSuccess: (followUpQuestions) => {
      if (!followUpQuestions) {
        return;
      }
      setSuggestedQuestions(followUpQuestions);
      setIsLoadingFollowUps(false);
    },
  });

  const mutation = api.source.ask.useMutation({
    onError: (error) => {
      console.error(error);
      setIsLoadingReply(false);
    },
    onSuccess: (message) => {
      if (!message) {
        return;
      }
      setMessages([...messages, message]);
      setQuery("");
      setIsLoadingReply(false);

      // Call followUp api
      makeFollowUps.mutate(message.content);
    },
  });

  function handleQuickSubmit(n: number) {
    const question = suggestedQuestions[n];
    if (!question) {
      throw new Error("Index of clicked question is out of bounds");
    }
    setQuery(question);

    setIsLoadingReply(true);
    setIsLoadingFollowUps(true);
    const message = {
      role: Role.User,
      content: question,
    };
    setMessages([...messages, message]);
    mutation.mutate({ messages: [...messages, message], categories });
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
    if (!diagnosisMode) {
      mutation.mutate({ messages: [...messages, message], categories });
    }
    else {
      // Also set the queryMessages
      setQueryMessages([...queryMessages, query]);
      console.log("\nQuerying!");
      console.log("from chat, queryMessages:", queryMessages);
      queryDSM.mutate([...queryMessages, query]);
    }
  }

  const queryDSM = api.diagnosis.queryTheDatabase.useMutation({
    onError: (error) => {
      console.error(error);
      setIsLoadingReply(false);
    },
    onSuccess: (data) => {
      if (!data) {
        throw new Error("Data not defined in OnSuccess")
      }
      setQuery("");
      setIsLoadingReply(false);
      const messageFromData: Message = {
        role: Role.Assistant,
        content: data.messageOutput, // Then I might have to change here too :)
      }
      setMessages([...messages, messageFromData]);

      // Also set queryMessages
      if (data.clearQueryMessages) {
        setQueryMessages([]);
      } else {
        setQueryMessages([...queryMessages, data.messageOutput]); // TODO: Might have to change data here! Maybe I want a boolean return value as well!
      }
    }
  })

  function toggleSymptomsMode() {
    setDiagnosisMode(!diagnosisMode);
  }

  return (
    <>
      <Button onClick={toggleSymptomsMode}> Toggle symptoms-mode </Button>
      <div
        className={`min-h-[1rem] w-2/3 text-2xl transition-all duration-1000 ${
          messages.length > 0 ? "grow" : ""
        } flex flex-col items-center`}
      >
        <MessageList messages={messages} />
        {isLoadingReply && (
          <Spinner className={"p-10"} size="7em" color="green" />
        )}
      </div>

      <div className="align-center mt-5 flex w-[100%] flex-col items-center">
        <QuickAsk
          suggestedQuestions={suggestedQuestions}
          onClick={handleQuickSubmit}
          isLoadingReply={isLoadingReply}
          isLoadingFollowUps={isLoadingFollowUps}
        />
        <form
          onSubmit={handleSubmit}
          className="w-100% mb-0 mt-8 flex flex-row gap-3 md:w-[50%]"
          ref={myFormRef}
        >
          <TextArea
            disabled={isLoadingReply}
            value={query}
            ref={textAreaRef}
            rows={1}
            onKeyDown={onEnterPress}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              setQuery(e.target.value);
            }}
            style={{
              resize: "none",
              transition: "border-color 150ms ease",
              padding: "1rem",
            }}
            placeholder= {diagnosisMode ? "Skriv inn pasientens symptomer..." : "What is your question for Freud?"}
            id={"submitquestion"}
          />
          <Button
            type="submit"
            color={"lightGreen"}
            withBorder={true}
            disabled={isLoadingReply}
            className="h-10 self-center"
          >
            <Icon name={"arrowNarrowRight"} color={colors.green600}></Icon>
          </Button>
        </form>
        <div ref={bottomRef} />
      </div>
    </>
  );
};

export default Chat;
