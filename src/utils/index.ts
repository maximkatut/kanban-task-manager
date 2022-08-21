import { Task } from "@prisma/client";

const RATIO = 30;

export const findDuplicates = (arr: string[]) => arr.filter((item, index) => arr.indexOf(item) !== index);

export const changePositonTasks = (tasks: Task[], indexFrom: number, indexTo: number) => {
  const el = tasks.splice(indexFrom, 1)[0];
  el && tasks.splice(indexTo, 0, el);
  tasks.forEach((t, i) => (t.order = i));
  return tasks;
};

export const removeTask = (tasks: Task[], indexFrom: number) => {
  tasks.splice(indexFrom, 1);
  tasks.forEach((t, i) => (t.order = i));
  return tasks;
};

export const addTask = (tasks: Task[], task: Task | undefined, indexTo: number) => {
  task && tasks.splice(indexTo, 0, task);
  tasks.forEach((t, i) => (t.order = i));
  return tasks;
};

export const truncate = (input: string, width: number) => {
  const value = width / RATIO;
  if (input.length > value) {
    return input.substring(0, value) + "...";
  }
  return input;
};
