import React from "react";
import { type Message } from "~/interfaces/message";
import FeedbackButtons from "./FeedbackButtons";
import MessageComponent from "./MessageComponent";
import CopyButton from "./CopyButton";

type Prop = {
  chatId: string | null;
  messages: Message[];
};

const MessageList = ({ chatId, messages }: Prop) => {
  return (
    <div>
      {messages.map((message, idx) => (
        <MessageComponent message={message} key={"message-" + idx.toString()}>
          <FeedbackButtons
            chatId={chatId}
            messageId={idx}
            key={"feedback-" + idx.toString()}
          />
          <CopyButton message={message} key={"copy-button-" + idx.toString()} />
        </MessageComponent>
      ))}
    </div>
  );
};

export default MessageList;
