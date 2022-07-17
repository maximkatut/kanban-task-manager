import { z } from "zod";
import { createRouter } from "./context";

export const boardRouter = createRouter()
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.board.findMany();
    },
  })
  .mutation("create", {
    input: z.object({
      name: z.string(),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.board.create({
        data: {
          name: input.name,
        },
      });
    },
  })
  .mutation("edit", {
    input: z.object({
      boardId: z.string(),
      boardName: z.string(),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.board.update({
        where: {
          id: input.boardId,
        },
        data: {
          name: input.boardName,
        },
      });
    },
  })
  .mutation("delete", {
    input: z.object({
      boardId: z.string(),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.board.delete({
        where: {
          id: input.boardId,
        },
      });
    },
  });
