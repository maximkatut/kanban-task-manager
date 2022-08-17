import { Board, Subtask, Task } from "@prisma/client";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { useStore } from "../store/boards";
import { useTasksStore } from "../store/tasks";
import { trpc } from "../utils/trpc";

export interface Inputs {
  title: string;
  description: string;
  subtasks: Subtask[];
  status: string;
}

export interface UseTaskProps {
  setIsModalOpen: (x: boolean) => void;
  task: Task;
}

const useEditTask = ({ setIsModalOpen, task }: UseTaskProps) => {
  const activeBoard = useStore((state) => state.activeBoard) as Board;
  const tasks = useTasksStore((state) => state.tasks);
  const updateTask = useTasksStore((state) => state.updateTask);
  const updateTaskStatus = useTasksStore((state) => state.updateTaskStatus);
  const utils = trpc.useContext();
  const { data: columns } = trpc.useQuery(["column.getByBoardId", { boardId: activeBoard?.id as string }]);
  const { data: subtasks } = trpc.useQuery(["subtask.getByTaskId", { taskId: task.id }]);
  const { mutateAsync: createSubtask, isLoading: isLoadingSubtask } = trpc.useMutation("subtask.create", {
    async onSuccess(data) {
      await utils.invalidateQueries(["subtask.getByTaskId", { taskId: data.taskId }]);
    },
  });
  const { mutateAsync: updateSubtask, isLoading: isLoadingSubtaskUpdate } = trpc.useMutation("subtask.update", {
    async onSuccess(data) {
      await utils.invalidateQueries(["subtask.getByTaskId", { taskId: data.taskId }]);
    },
  });
  const { mutateAsync: deleteSubtask } = trpc.useMutation("subtask.delete", {
    async onSuccess(data) {
      await utils.invalidateQueries(["subtask.getByTaskId", { taskId: data.taskId }]);
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      title: task.title,
      description: task.description as string,
      subtasks: subtasks,
      status: task.status,
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "subtasks" as never,
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const newTask = {
      id: task.id,
      title: data.title,
      description: data.description,
      columnId: task.columnId,
      status: task.status,
      order: task.order,
    };
    updateTask(newTask);

    if (task.status !== data.status) {
      const column = columns?.find((c) => c.name === data.status);
      column && updateTaskStatus(column.id, task.id, data.status);
    }

    for (let i = 0; i < data.subtasks.length; i++) {
      const subtask = data.subtasks[i];
      if (subtask?.id) {
        await updateSubtask({
          id: subtask.id,
          order: i,
          title: subtask.title,
        });
      } else {
        await createSubtask({
          title: subtask?.title as string,
          order: i,
          taskId: task?.id as string,
          isCompleted: false,
        });
      }
    }

    setIsModalOpen(false);
  };

  const handleRemoveCrossButton = (i: number) => {
    remove(i);
    const subtaskId = subtasks && subtasks[i]?.id;
    if (subtaskId) {
      deleteSubtask({
        id: subtaskId,
      });
    }
  };

  const handleNewSubtaskButton = () => {
    append({ title: "" });
  };

  const handleMoveUpButton = (i: number) => {
    if (i > 0) {
      move(i, i - 1);
    }
  };

  const handleMoveDownButton = (i: number, arr: []) => {
    if (arr.length - 1 > i) {
      move(i, i + 1);
    }
  };

  return {
    onSubmit: handleSubmit(onSubmit),
    fields,
    handleRemoveCrossButton,
    handleNewSubtaskButton,
    errors,
    register,
    isLoading: isLoadingSubtask || isLoadingSubtaskUpdate,
    handleMoveUpButton,
    handleMoveDownButton,
  };
};

export default useEditTask;
