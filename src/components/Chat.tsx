import React, {
  type Dispatch,
  type FormEvent,
  type SetStateAction,
  createRef,
  useEffect,
  useRef,
  useState,
} from "react";
import { type Message, Role } from "~/interfaces/message";
import { colors } from "~/stitches/colors";
import { api } from "~/utils/api";
import useAutosizeTextArea from "./useAutosizeTextArea";
import MessageList from "./MessageList";
import { Button } from "./ui/button/Button";
import { Icon } from "./ui/icon/Icon";
import { Spinner } from "./ui/icon/icons/Spinner";
import { TextArea } from "./ui/textArea/TextArea";
import QuickAsk from "./QuickAsk";

type Prop = {
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
};

const Chat = ({ messages, setMessages }: Prop) => {
  const [isLoadingReply, setIsLoadingReply] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = React.useState<string[]>([
    "How can I help my patient with anxiety?",
    "How do I assess trauma in a patient?",
    "What do I do if my patient is very silent?",
  ]);
  const [query, setQuery] = useState("");

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

  const mutation = api.langchain.conversation.useMutation({
    onError: (error) => {
      console.error(error);
      setIsLoadingReply(false);
    },
    onSuccess: (message) => {
      if (!message) {
        return;
      }
      setMessages([...messages, message.reply]);
      setQuery("");
      setIsLoadingReply(false);

      setSuggestedQuestions(message.generated_followup_questions);
    },
  });

  function handleQuickSubmit(n: number) {
    const question = suggestedQuestions[n];
    if (!question) {
      throw new Error("Index of clicked question is out of bounds");
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
    mutation.mutate([...messages, message]);
  }

  return (
    <>
      <div
        className={`min-h-[1rem] w-full text-2xl transition-all duration-1000 ${messages.length > 0 ? "grow" : ""
          } flex flex-col items-center`}
      >
        <MessageList messages={messages} />
        {isLoadingReply && (
          <Spinner className={"p-10"} size="7em" color="green" />
        )}
      </div>

      <div className="align-center flex w-[100%] flex-col items-center">
        <QuickAsk
          suggestedQuestions={suggestedQuestions}
          onClick={handleQuickSubmit}
          isLoadingReply={isLoadingReply}
        />
        <form
          onSubmit={handleSubmit}
          className="mb-0 mt-8 flex w-[50%] flex-row gap-3"
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
            placeholder="What is your question for Freud?"
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
