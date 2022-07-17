import { columnRouter } from "./column";
import { subtaskRouter } from "./subtask";
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
  .merge("task.", taskRouter)
  .merge("subtask.", subtaskRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
