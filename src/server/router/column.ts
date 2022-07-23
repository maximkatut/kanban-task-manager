import { z } from "zod";
import { createRouter } from "./context";

export const columnRouter = createRouter()
  .query("getByBoardId", {
    input: z.object({
      boardId: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.column.findMany({
        where: {
          boardId: input.boardId,
        },
      });
    },
  })
  .mutation("create", {
    input: z.object({
      name: z.string(),
      boardId: z.string(),
      order: z.number(),
      color: z.string(),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.column.create({
        data: {
          name: input.name,
          boardId: input.boardId,
          order: input.order,
          color: input.color,
        },
      });
    },
  })
  .mutation("update", {
    input: z.object({
      id: z.string(),
      name: z.string(),
      order: z.number(),
      color: z.string(),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.column.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          order: input.order,
          color: input.color,
        },
      });
    },
  })
  .mutation("delete", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.column.delete({
        where: {
          id: input.id,
        },
      });
    },
  });
