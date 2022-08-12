import { Subtask } from "@prisma/client";
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
}

const useCreateTask = ({ setIsModalOpen }: UseTaskProps) => {
  const activeBoard = useStore((state) => state.activeBoard);
  const addTask = useTasksStore((state) => state.addTask);
  const utils = trpc.useContext();
  const { data: columns } = trpc.useQuery(["column.getByBoardId", { boardId: activeBoard?.id as string }]);
  const { mutateAsync: createTask } = trpc.useMutation("task.create", {
    async onSuccess(data) {
      await utils.invalidateQueries(["task.getByColumnId", { columnId: data.columnId }]);
      addTask(data);
    },
  });
  const { mutateAsync: createSubtask } = trpc.useMutation("subtask.create", {
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
      title: "",
      description: "",
      subtasks: [{ title: "" }, { title: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subtasks" as never,
  });
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const column = columns?.find((c) => c.name.toLowerCase() === data.status.toLowerCase());
    const tasks = utils.fetchQuery(["task.getByColumnId", { columnId: column?.id as string }]);

    await createTask(
      {
        title: data.title,
        description: data.description,
        columnId: column?.id as string,
        status: data.status,
        order: (await tasks).length,
      },
      {
        async onSuccess({ id }) {
          data.subtasks.forEach(async (sub, i) => {
            await createSubtask({
              title: sub.title,
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
    onCreateSubmit: handleSubmit(onSubmit),
    fieldsCreate: fields,
    handleRemoveCrossButtonCreate: handleRemoveCrossButton,
    handleNewSubtaskButtonCreate: handleNewSubtaskButton,
    errorsCreate: errors,
    registerCreate: register,
  };
};

export default useCreateTask;
