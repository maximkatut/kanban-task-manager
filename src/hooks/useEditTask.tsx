import { Board, Subtask, Task } from "@prisma/client";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { useStore } from "../store";
import { trpc } from "../utils/trpc";

export interface Inputs {
  title: string;
  description: string;
  subtasks: Subtask[];
  status: string;
}

export interface UseTaskProps {
  setIsModalOpen: (x: boolean) => void;
  task?: Task;
}

const useEditTask = ({ setIsModalOpen, task }: UseTaskProps) => {
  const activeBoard = useStore((state) => state.activeBoard) as Board;
  const utils = trpc.useContext();
  const { data: columns } = trpc.useQuery(["column.getByBoardId", { boardId: activeBoard?.id as string }]);
  const { data: subtasks } = trpc.useQuery(["subtask.getByTaskId", { taskId: task?.id as string }]);
  const { mutateAsync: updateTask, isLoading: isLoadingTask } = trpc.useMutation("task.update", {
    async onSuccess(data) {
      await utils.invalidateQueries(["task.getByColumnId", { columnId: data.columnId }]);
      task && (await utils.invalidateQueries(["task.getByColumnId", { columnId: task?.columnId }]));
    },
  });
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
      title: task?.title,
      description: task?.description as string,
      subtasks: subtasks,
      status: task?.status,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subtasks" as never,
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const column = columns?.find((c) => c.name === data.status);

    await updateTask({
      id: task?.id as string,
      title: data.title,
      description: data.description,
      columnId: column?.id as string,
      status: data.status,
    });

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

  return {
    onEditSubmit: handleSubmit(onSubmit),
    fieldsEdit: fields,
    handleRemoveCrossButtonEdit: handleRemoveCrossButton,
    handleNewSubtaskButtonEdit: handleNewSubtaskButton,
    errorsEdit: errors,
    registerEdit: register,
    isLoading: isLoadingSubtask || isLoadingSubtaskUpdate || isLoadingTask,
  };
};

export default useEditTask;
