import { ThumbState } from "@prisma/client";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import React, { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { ButtonWithTooltip } from "./ButtonWithTooltip";
import { FeedbackForm } from "./FeedbackForm";
import { Icon } from "./ui/icon/Icon";
import { Popover } from "./ui/popover/Popover";
import { env } from "~/env.mjs";


type Props = {
  chatId: string | null;
  messageId: number;
};

// Delay before a de-selected thumb actually deletes the entry in the database
const THUMB_DELETE_DELAY = 1000; // 1 second

const FeedbackButtons = ({ chatId, messageId }: Props) => {
  const [name, setName] = useState(localStorage.getItem("name") || "");
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [thumb, setThumb] = useState<ThumbState>(ThumbState.none);
  const [comment, setComment] = useState("");
  const [showForm, setShowForm] = useState({
    up: false,
    down: false,
  });
  const [feedbackIsSubmitted, setFeedbackIsSubmitted] = useState(false);

  useEffect(() => {
    // Assume we should delete feedback if thumb set to ThumbState.none (i.e. unselected)
    let deleteSignal = true;

    if (thumb === ThumbState.none) {
      // We do not want to open form when deselecting a thumb-button
      closeForms();

      // Delete feedback after a delay (if it exists)
      if (feedbackIsSubmitted) {
        const deleteTimeout = setTimeout(() => {
          // ... unless the delete signal is cancelled by a new thumb selection
          if (deleteSignal) {
            deleteFeedback();
          }
        }, THUMB_DELETE_DELAY);

        return () => clearTimeout(deleteTimeout);
      }

      // Thumb is set to up or down
    } else {
      submitFeedback();

      return () => {
        // Cancel the delete signal
        deleteSignal = false;
      };
    }
  }, [thumb])

  const closeForms = () => {
    setShowForm({ up: false, down: false })
  }

  const form = (
    <FeedbackForm
      name={name}
      email={email}
      comment={comment}
      setName={setName}
      setEmail={setEmail}
      setComment={setComment}
      handleSubmit={submitFeedback}
      closeForms={closeForms}
    />
  );

  const submitFeedbackMutation = api.prisma.submitFeedback.useMutation({
    onError: (error) => {
      console.error(error);
    },
    onSuccess: () => {
      setFeedbackIsSubmitted(true);
    },
  });

  const deleteFeedbackMutation = api.prisma.deleteFeedback.useMutation({
    onError: (error) => {
      console.error(error);
    },
    onSuccess: () => {
      console.info("Feedback deleted");
    },
  });

  function submitFeedback() {


    setFeedbackIsSubmitted(true);
    localStorage.setItem("email", email);
    localStorage.setItem("name", name);

    if (env.NEXT_PUBLIC_NODE_ENV === "development") return //We do not want to send data if we are in development


    if (!chatId) {
      throw new Error("Cannot submit feedback because chatId is not set");
    }

    submitFeedbackMutation.mutate({
      chatId,
      messageId,
      thumb,
      name,
      email,
      comment,
    });

  }

  function deleteFeedback() {
    setFeedbackIsSubmitted(false);

    if (chatId) {
      deleteFeedbackMutation.mutate({
        chatId,
        messageId,
      });
    }
  }

  return (
    <div className="float-right ml-4">
      <RadixTooltip.Provider delayDuration={0}>
        <Popover
          content={form}
          side="bottom"
          closeButton={true}
          open={showForm.up}
          onOpenChange={() => {
            setShowForm({ up: !showForm.up, down: false })
          }}
        >
          <ButtonWithTooltip
            tooltip={"Good answer"}
            color={thumb === ThumbState.up ? "green" : "transparent"}
            onClick={() => {
              thumb === ThumbState.up
                ? setThumb(ThumbState.none)
                : setThumb(ThumbState.up);
            }}
          >
            <Icon name={"handThumbsUp"} />
          </ButtonWithTooltip>
        </Popover>
        <Popover
          content={form}
          side="bottom"
          closeButton={true}
          open={showForm.down && thumb !== ThumbState.none}
          onOpenChange={() => setShowForm({ up: false, down: !showForm.down })}
        >
          <ButtonWithTooltip
            tooltip={"Unsatisfactory answer"}
            color={thumb === ThumbState.down ? "red" : "transparent"}
            onClick={() => {
              thumb === ThumbState.down
                ? setThumb(ThumbState.none)
                : setThumb(ThumbState.down);
            }}
          >
            <Icon name={"handThumbsDown"} />
          </ButtonWithTooltip>
        </Popover>
      </RadixTooltip.Provider>
      {!showForm.up && !showForm.down && feedbackIsSubmitted && (
        <span className="absolute ml-4 w-fit text-base text-green750">
          Takk for tilbakemelding!
        </span>
      )}
    </div>
  );
};

export default FeedbackButtons;
