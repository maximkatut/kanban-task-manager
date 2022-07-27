import { Board, Task } from "@prisma/client";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { useStore } from "../store";
import { trpc } from "../utils/trpc";

export interface Inputs {
  title: string;
  description: string;
  subtasks: {
    name: string;
  }[];
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
  const { mutateAsync: updateTask } = trpc.useMutation("task.update", {
    async onSuccess(data) {
      await utils.invalidateQueries(["task.getByColumnId", { columnId: data.columnId }]);
      task && (await utils.invalidateQueries(["task.getByColumnId", { columnId: task?.columnId }]));
    },
  });
  const { mutateAsync: createSubtask } = trpc.useMutation("subtask.create", {
    async onSuccess(data) {
      await utils.invalidateQueries(["subtask.getByTaskId", { taskId: data.taskId }]);
    },
  });
  const { mutateAsync: deleteSubtask } = trpc.useMutation("subtask.delete", {
    async onSuccess(data) {
      await utils.invalidateQueries(["subtask.getByTaskId", { taskId: data.taskId }]);
    },
  });
  const subtasksObjectNames = subtasks && subtasks?.map((s) => ({ name: s.title }));
  const subtasksNames = subtasks && subtasks?.map((s) => s.title);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      title: task?.title,
      description: task?.description as string,
      subtasks: subtasksObjectNames,
      status: task?.status,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subtasks" as never,
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const column = columns?.find((c) => c.name === data.status);
    await updateTask(
      {
        id: task?.id as string,
        title: data.title,
        description: data.description,
        columnId: column?.id as string,
        status: data.status,
      },
      {
        async onSuccess({ id }) {
          data.subtasks.forEach(async (sub, i) => {
            if (subtasksNames?.includes(sub.name)) {
              return;
            }

            await createSubtask({
              name: sub.name,
              order: i,
              taskId: id,
              isCompleted: false,
            });
          });
        },
      }
    );

    setIsModalOpen(false);
  };

  const handleRemoveCrossButton = (i: number) => {
    remove(i);
  };

  const handleNewSubtaskButton = () => {
    append({ name: "" });
  };

  return {
    onEditSubmit: handleSubmit(onSubmit),
    fieldsEdit: fields,
    handleRemoveCrossButtonEdit: handleRemoveCrossButton,
    handleNewSubtaskButtonEdit: handleNewSubtaskButton,
    errorsEdit: errors,
    registerEdit: register,
  };
};

export default useEditTask;
