import { z } from "zod";
import { createRouter } from "./context";

export const subtaskRouter = createRouter()
  .query("getByTaskId", {
    input: z.object({
      taskId: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.subtask.findMany({
        where: {
          taskId: input.taskId,
        },
      });
    },
  })
  .mutation("create", {
    input: z.object({
      title: z.string(),
      taskId: z.string(),
      isCompleted: z.boolean(),
      order: z.number(),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.subtask.create({
        data: {
          title: input.title,
          taskId: input.taskId,
          isCompleted: input.isCompleted,
          order: input.order,
        },
      });
    },
  })
  .mutation("update", {
    input: z.object({
      id: z.string(),
      title: z.string().optional(),
      taskId: z.string().optional(),
      isCompleted: z.boolean().optional(),
      order: z.number().optional(),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.subtask.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          taskId: input.taskId,
          isCompleted: input.isCompleted,
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
      return await ctx.prisma.subtask.delete({
        where: {
          id: input.id,
        },
      });
    },
  });
