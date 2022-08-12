import { Task } from "@prisma/client";
import produce from "immer";
import { DraggableLocation } from "react-beautiful-dnd";
import create from "zustand";
import { addTask, changePositonTasks, removeTask } from "../utils";

interface TasksState {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  setTasks: (tasks: Task[] | undefined) => void;
  setTask: (draggableId: string, destination: DraggableLocation, source: DraggableLocation) => void;
}

export const useTasksStore = create<TasksState>((set) => ({
  tasks: [],
  addTask: (task) =>
    set((state) => {
      const tasks = state.tasks.slice();
      tasks.push(task);
      return { tasks };
    }),
  setTasks: (tasks) => set((state) => ({ tasks })),
  updateTask: (task) => {
    return set(
      produce((state: TasksState) => {
        const tasksCount = state.tasks.filter((t) => t.columnId === task.columnId).length;
        const newTask = state.tasks.find((t) => t.id === task.id) as Task;
        newTask.columnId = task.columnId;
        newTask.status = task.status;
        newTask.order = tasksCount;
        newTask.description = task.description;
        newTask.title = task.title;
      })
    );
  },
  setTask: (draggableId, destination, source) =>
    set((state: TasksState) => {
      const tasks = [...state.tasks];
      const draggableTask = tasks.find((t) => t.id === draggableId) as Task;
      if (tasks) {
        const droppableToColumnTasks = tasks
          .filter((t) => t.columnId === destination.droppableId)
          .sort((a, b) => a.order - b.order);
        const droppableFromColumnTasks = tasks
          .filter((t) => t.columnId === source.droppableId)
          .sort((a, b) => a.order - b.order);
        if (destination.droppableId === source.droppableId) {
          const newDrobbableColumnTasks = changePositonTasks(droppableFromColumnTasks, source.index, destination.index);
          tasks.forEach((t) => {
            newDrobbableColumnTasks.forEach((newT) => {
              if (t.id === newT.id) {
                t.order = newT.order;
              }
            });
          });
        } else {
          const status = droppableToColumnTasks[0]?.status;
          const newDrobbableFromColumnTasks = removeTask(droppableFromColumnTasks, source.index);
          const newDrobbableToColumnTasks = addTask(droppableToColumnTasks, draggableTask, destination.index);
          tasks.forEach((t) => {
            newDrobbableFromColumnTasks.forEach((newT) => {
              if (t.id === newT.id) {
                t.order = newT.order;
              }
            });
            newDrobbableToColumnTasks.forEach((newT) => {
              if (t.id === newT.id) {
                t.order = newT.order;
                t.columnId = destination.droppableId;
                t.status = status as string;
              }
            });
          });
        }
      }
      return { tasks };
    }),
}));
