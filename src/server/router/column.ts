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
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.column.create({
        data: {
          name: input.name,
          boardId: input.boardId,
          order: input.order,
        },
      });
    },
  })
  .mutation("update", {
    input: z.object({
      columnId: z.string(),
      columnName: z.string(),
      order: z.number(),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.column.update({
        where: {
          id: input.columnId,
        },
        data: {
          name: input.columnName,
          order: input.order,
        },
      });
    },
  })
  .mutation("delete", {
    input: z.object({
      columnId: z.string(),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.column.delete({
        where: {
          id: input.columnId,
        },
      });
    },
  });
