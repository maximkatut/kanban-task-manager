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
      name: z.string(),
      columnId: z.string(),
      columnName: z.string(),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.task.create({
        data: {
          title: input.name,
          columnId: input.columnId,
          status: input.columnName,
        },
      });
    },
  });
