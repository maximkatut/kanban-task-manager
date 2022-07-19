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
      name: z.string(),
      taskId: z.string(),
      isCompleted: z.boolean(),
      order: z.number(),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.subtask.create({
        data: {
          title: input.name,
          taskId: input.taskId,
          isCompleted: input.isCompleted,
          order: input.order,
        },
      });
    },
  });
