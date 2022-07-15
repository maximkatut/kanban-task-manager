import { createRouter } from "./context";

export const boardRouter = createRouter().query("getAll", {
  async resolve({ ctx }) {
    return await ctx.prisma.board.findMany();
  },
});
