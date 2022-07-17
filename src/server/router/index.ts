import { columnRouter } from "./column";
import { taskRouter } from "./task";
// src/server/router/index.ts
import superjson from "superjson";
import { createRouter } from "./context";

import { authRouter } from "./auth";
import { boardRouter } from "./board";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("board.", boardRouter)
  .merge("auth.", authRouter)
  .merge("column.", columnRouter)
  .merge("task.", taskRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
