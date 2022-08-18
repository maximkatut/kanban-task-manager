import { Task } from "@prisma/client";
import produce from "immer";
import { DraggableLocation } from "react-beautiful-dnd";
import create from "zustand";
import { addTask, changePositonTasks, removeTask } from "../utils";

interface TasksState {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  updateTaskStatus: (columnId: string, taskId: string, status: string) => void;
  setTasks: (tasks: Task[] | undefined) => void;
  setTask: (draggableId: string, destination: DraggableLocation, source: DraggableLocation, status?: string) => void;
}

export const useTasksStore = create<TasksState>((set) => ({
  tasks: [],

  addTask: (task) =>
    set((state) => {
      const tasks = [...state.tasks, task];
      return { tasks };
    }),

  setTasks: (tasks) => set((state) => ({ tasks })),

  updateTaskStatus: (columnId, taskId, status) =>
    set(
      produce((state: TasksState) => {
        const tasksCount = state.tasks.filter((t) => t.columnId === columnId).length;
        const task = state.tasks.find((t) => t.id === taskId);
        const sourceColumnId = task?.columnId;
        if (task) {
          task.order = tasksCount;
          task.columnId = columnId;
          task.status = status;
        }
        const tasksNeedToBeUpdated = state.tasks.filter((t) => t.columnId === sourceColumnId);
        state.tasks.forEach((t) => {
          tasksNeedToBeUpdated.forEach((taskToUpdate, i) => {
            if (t.id === taskToUpdate.id) {
              t.order = i;
            }
          });
        });
      })
    ),

  updateTask: (task) => {
    return set(
      produce((state: TasksState) => {
        const newTask = state.tasks.find((t) => t.id === task.id);
        if (newTask) {
          newTask.columnId = task.columnId;
          newTask.status = task.status;
          newTask.order = task.order;
          newTask.description = task.description;
          newTask.title = task.title;
        }
      })
    );
  },

  setTask: (draggableId, destination, source, status) =>
    set(
      produce((state: TasksState) => {
        const draggableTask = state.tasks.find((t) => t.id === draggableId);
        if (state.tasks) {
          const droppableToColumnTasks = state.tasks
            .filter((t) => t.columnId === destination.droppableId)
            .sort((a, b) => a.order - b.order);
          const droppableFromColumnTasks = state.tasks
            .filter((t) => t.columnId === source.droppableId)
            .sort((a, b) => a.order - b.order);

          if (destination.droppableId === source.droppableId) {
            const newDrobbableColumnTasks = changePositonTasks(
              droppableFromColumnTasks,
              source.index,
              destination.index
            );
            state.tasks.forEach((t) => {
              newDrobbableColumnTasks.forEach((newT) => {
                if (t.id === newT.id) {
                  t.order = newT.order;
                }
              });
            });
          } else {
            if (status && draggableTask) {
              draggableTask.status = status;
            }
            const newDrobbableFromColumnTasks = removeTask(droppableFromColumnTasks, source.index);
            const newDrobbableToColumnTasks = addTask(droppableToColumnTasks, draggableTask, destination.index);
            state.tasks.forEach((t) => {
              newDrobbableFromColumnTasks.forEach((newT) => {
                if (t.id === newT.id) {
                  t.order = newT.order;
                }
              });
              newDrobbableToColumnTasks.forEach((newT) => {
                if (t.id === newT.id) {
                  t.order = newT.order;
                  t.columnId = destination.droppableId;
                }
              });
            });
          }
        }
      })
    ),
}));
