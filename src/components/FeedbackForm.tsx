import React from "react";
import { InputField } from "./ui/inputField/InputField";
import { Label } from "./ui/label/Label";
import { TextArea } from "./ui/textArea/TextArea";
import { ButtonMinimal } from "./ui/buttonMinimal/ButtonMinimal";

type Props = {
  name: string;
  email: string;
  comment: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setComment: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: () => void;
  closeForms: () => void;
};

export const FeedbackForm = ({
  name,
  email,
  comment,
  setName,
  setEmail,
  setComment,
  handleSubmit,
  closeForms,
}: Props) => {
  const labelStyle = { fontSize: "var(--fontSizes-xxs)", fontWeight: "bold" };
  const inputStyle = {
    fontSize: "var(--fontSizes-xxs)",
    marginBottom: "0.4rem",
  };

  return (
    <div>
      <form className="pb-10">
        <Label htmlFor="feedback" style={labelStyle}>
          Kommentar
        </Label>
        <p className="mb-1">Både din kommentar og samtale vil bli sendt.</p>
        <TextArea
          id="feedback"
          style={inputStyle}
          onChange={(e) => setComment(e.target.value)}
          value={comment}
        />
        <Label htmlFor="name" style={labelStyle}>
          Navn (valgfritt)
        </Label>
        <InputField
          id="name"
          label=""
          style={inputStyle}
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <Label htmlFor="email" style={labelStyle}>
          Epost (valgfritt)
        </Label>
        <InputField
          id="email"
          label=""
          style={inputStyle}
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSubmit();
              closeForms();
            }
          }}
        />
        <ButtonMinimal
          className="float-right"
          color={"green"}
          style={{
            color: "white",
            background: "var(--colors-green700)",
            padding: "5px 12px",
            borderRadius: "5px",
          }}
          onClick={(e) => {
            e.preventDefault();
            handleSubmit();
            closeForms();
          }}
        >
          Send
        </ButtonMinimal>
      </form>
    </div>
  );
};
