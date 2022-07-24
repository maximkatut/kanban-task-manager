import { z } from "zod";
import { createRouter } from "./context";

export const taskRouter = createRouter()
  .query("getByColumnId", {
    input: z.object({
      columnId: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.task.findMany({
        where: {
          columnId: input.columnId,
        },
      });
    },
  })
  .mutation("create", {
    input: z.object({
      title: z.string(),
      description: z.string().optional(),
      order: z.number(),
      columnId: z.string(),
      status: z.string(),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.task.create({
        data: {
          title: input.title,
          description: input.description,
          order: input.order,
          columnId: input.columnId,
          status: input.status,
        },
      });
    },
  })
  .mutation("update", {
    input: z.object({
      id: z.string(),
      title: z.string(),
      columnId: z.string(),
      columnName: z.string(),
      order: z.number(),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.task.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          status: input.columnName,
          columnId: input.columnId,
          order: input.order,
        },
      });
    },
  })
  .mutation("delete", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.task.delete({
        where: {
          id: input.id,
        },
      });
    },
  });
