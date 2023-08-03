import { ThumbState } from "@prisma/client";
import { z } from "zod";
import { prisma } from "~/../lib/prisma";
import { Message } from "~/interfaces/message";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const prismaRouter = createTRPCRouter({
  /* Submit messages to be logged
   * - Generate new ChatId for new chats
   * - Otherwise append messages to existing ChatId
   * */
  logChat: publicProcedure
    .input(
      z.object({
        chatId: z.union([z.null(), z.string()]),
        messages: z.array(Message),
      })
    )

    .mutation(async ({ input }) => {
      const { chatId, messages } = input;
      if (chatId === null) {
        return await createChatLog(messages);
      } else {
        return await updateChatLog(chatId, messages);
      }
    }),

  /* Submit feedback
   * - Feedback will be created or updated, depending on whether feedback exist for a given message
   * - (One message cannot have multiple Feedbacks)
   * - This is handled via Prisma's upsert function
   *   https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#upsert
   * */
  submitFeedback: publicProcedure
    .input(
      z.object({
        chatId: z.string(),
        messageId: z.number(),
        thumb: z.nativeEnum(ThumbState),
        name: z.optional(z.string()),
        email: z.optional(z.string()),
        comment: z.optional(z.string()),
      })
    )

    .mutation(async ({ input }) => {
      const { chatId, messageId } = input;
      return await prisma.feedback.upsert({
        where: {
          chatId_messageId: {
            chatId,
            messageId,
          },
        },
        create: input,
        update: input,
      });
    }),

  /* Delete feedback
   * - Returns an error if Feedback doesn't exist
   * */
  deleteFeedback: publicProcedure
    .input(
      z.object({
        chatId: z.string(),
        messageId: z.number(),
      })
    )

    .mutation(async ({ input }) => {
      const { chatId, messageId } = input;
      return await prisma.feedback.delete({
        where: {
          chatId_messageId: {
            chatId,
            messageId,
          },
        },
      });
    }),
});

async function createChatLog(messages: Message[]) {
  return await prisma.chat.create({
    data: {
      messages: {
        create: messages.map((message, id) => {
          const { role, content } = message;
          return {
            id,
            role,
            content,
            sources: {
              create: message?.sources?.map((source, sid) => {
                const { author, content, title } = source;
                return {
                  id: sid,
                  author,
                  content,
                  title,
                };
              }),
            },
          };
        }),
      },
    },
  });
}

async function updateChatLog(chatId: string, messages: Message[]) {
  try {
    let messageId = 0;
    for (const message of messages) {
      const { role, content, sources } = message;
      await prisma.message.upsert({
        where: {
          chatId_id: {
            chatId,
            id: messageId,
          },
        },
        update: {},
        create: {
          id: messageId,
          chat: {
            connect: {
              id: chatId,
            },
          },
          role,
          content,
          sources: {
            create: [], // Use an empty array to prevent direct creation of sources during message upsert
          },
        },
        include: {
          sources: true,
        },
      });

      // Handle the sources separately using nested upserts
      if (Array.isArray(sources)) {
        let sourceId = 0;
        for (const source of sources) {
          const { author, content, title } = source;
          await prisma.source.upsert({
            where: {
              chatId_messageId_id: {
                chatId,
                messageId,
                id: sourceId,
              },
            },
            update: {},
            create: {
              id: sourceId,
              message: {
                connect: {
                  chatId_id: {
                    chatId,
                    id: messageId,
                  },
                },
              },
              author,
              content,
              title,
            },
          });
        }
        sourceId++;
      }
      messageId++;
    }
  } catch (error) {
    console.error(error);
  }
}
