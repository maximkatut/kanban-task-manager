import { Task } from "@prisma/client";
import { z } from "zod";
import { createRouter } from "./context";

export const taskRouter = createRouter()
  .query("getAll", {
    input: z.object({
      columnsDataIds: z.string().array(),
    }),
    async resolve({ ctx, input }) {
      const getTasksByColumnId = async () => {
        let allTasks = <Task[]>[];
        for (let i = 0; i < input.columnsDataIds.length; i++) {
          const tasks = await ctx.prisma.task.findMany({
            where: {
              columnId: input.columnsDataIds[i],
            },
          });
          allTasks.push(...tasks);
        }
        return allTasks;
      };
      return getTasksByColumnId();
    },
  })
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
      title: z.string().optional(),
      columnId: z.string().optional(),
      description: z.string().optional().nullish(),
      status: z.string().optional(),
      order: z.number().optional(),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.task.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          status: input.status,
          description: input.description,
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
