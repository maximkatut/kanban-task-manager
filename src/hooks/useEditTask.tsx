import { Board, Column, Subtask, Task } from "@prisma/client";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { useStore } from "../store";
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
  const updateTask = useTasksStore((state) => state.updateTask);
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
    const column = columns?.find((c) => c.name === data.status) as Column;
    const newTask = {
      id: task.id,
      columnId: column.id,
      status: data.status,
      title: data.title,
      description: data.description,
      order: task.order,
    };
    updateTask(newTask);

    for (let i = 0; i < data.subtasks.length; i++) {
      const subtask = data.subtasks[i];
      if (subtask?.id) {
        await updateSubtask({
          id: subtask.id,
          order: i,
          title: subtask.title,
        });
      } else {
        createSubtask({
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
    onEditSubmit: handleSubmit(onSubmit),
    fieldsEdit: fields,
    handleRemoveCrossButtonEdit: handleRemoveCrossButton,
    handleNewSubtaskButtonEdit: handleNewSubtaskButton,
    errorsEdit: errors,
    registerEdit: register,
    isLoading: isLoadingSubtask || isLoadingSubtaskUpdate,
    handleMoveUpButton,
    handleMoveDownButton,
  };
};

export default useEditTask;
