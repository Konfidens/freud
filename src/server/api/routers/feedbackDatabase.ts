import { z } from "zod";
import { prisma } from "~/../lib/prisma";
import { Feedback } from "~/interfaces/feedback";
import { Message, Role } from "~/interfaces/message";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
// import { type Feedback } from ".prisma/client"; //TODO: import type from Prisma client
import { ThumbState } from ".prisma/client";
import axios from "axios";
import { env } from "~/env.mjs";

export const feedbackRouter = createTRPCRouter({
  create: publicProcedure.input(Feedback).mutation(async ({ input }) => {
    const feedback = await prisma.feedback.create({
      data: {
        name: input.name,
        email: input.email,
        thumb: input.thumb,
        messages: {
          create: input.messages.map((message) => message),
        },
      },
    });
    return feedback;
  }),

  setComment: publicProcedure
    .input(z.object({ feedbackID: z.number(), comment: z.string() }))
    .mutation(async ({ input }) => {
      const feedback = await prisma.feedback.update({
        where: {
          id: input.feedbackID,
        },
        data: {
          comment: input.comment,
        },
      });
      await postToSlack(feedback);
    }),

  setThumb: publicProcedure
    .input(
      z.object({ feedbackID: z.number(), thumb: z.nativeEnum(ThumbState) })
    )
    .mutation(async ({ input }) => {
      await prisma.feedback.update({
        where: {
          id: input.feedbackID,
        },
        data: {
          thumb: input.thumb,
        },
      });
    }),

  delete: publicProcedure
    .input(z.object({ feedbackID: z.number() }))
    .mutation(async ({ input }) => {
      await prisma.feedback.delete({
        where: {
          id: input.feedbackID,
        },
      });
    }),

  addMessage: publicProcedure
    .input(z.object({ message: Message, feedbackId: z.number() }))
    .mutation(async ({ input }) => {
      try {
        const messageID = await prisma.message.create({
          data: {
            content: input.message.content,
            role: input.message.role,
            feedback: {
              connect: {
                id: input.feedbackId,
              },
            },
          },
        });
        return messageID;
      } catch (e) {
        console.log(e);
      }
    }),

  getAllData: publicProcedure.query(async () => {
    const output = await prisma.feedback.findMany();
    return output;
  }),
});

async function postToSlack(feedback: Feedback) {
  if (feedback === null) {
    console.error("Invalid feedback");
    console.error(feedback);
    return;
  }

  // Get thumb, name and email from feedback
  const thumb = feedback?.thumb === ThumbState.up ? "👍" : "👎";
  const name = feedback?.name ?? "Skybert";
  const email = feedback?.email ?? "sky@bert.no";

  // Set sentiment for slack message
  const sentiment = feedback?.thumb === ThumbState.up ? "HAPPY" : "SAD";

  // Set basic components of slack message
  const message: MessageEvent = {
    sentiment: sentiment,
    title: `${thumb} fra ${name} (${email})`,
    channel: "#feedback",
  };

  // Add user's feedback comment if it exists
  if (feedback.comment) {
    message.description = `*Tilbakemelding*: ${feedback.comment}`;
  }

  // Append chat log
  const chat = await prisma.message.findMany({
    where: {
      feedbackId: feedback.id,
    },
  });

  message.subtext = chat
    .map((message) => {
      return `*${message.role === Role.User ? name : "Freud"}*\n${
        message.content
      }`;
    })
    .join("\n\n");

  // Make POST request
  const url = `${env.SLACK_WEBHOOK_URL as string}?token=${
    env.SLACK_WEBHOOK_TOKEN as string
  }`;

  await axios.post(url, message);
}

type MessageEvent = {
  sentiment: "HAPPY" | "NEUTRAL" | "SAD";
  url?: {
    href: string;
    title: string;
  };
  title: string;
  description?: string;
  subtext?: string;
  tags?: Record<string, string>;
  channel?: string; // ikke støtta enda
};
