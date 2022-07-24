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
}

const useCreateTask = ({ setIsModalOpen }: UseTaskProps) => {
  const activeBoard = useStore((state) => state.activeBoard);
  const utils = trpc.useContext();
  const { data: columns } = trpc.useQuery(["column.getByBoardId", { boardId: activeBoard?.id as string }]);
  // const { data: tasks } = trpc.useQuery(["task.getByColumnId"]);
  const { mutate: createTask } = trpc.useMutation("task.create", {
    async onSuccess(data) {
      await utils.invalidateQueries(["task.getByColumnId", { columnId: data.columnId }]);
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
      subtasks: [{ name: "" }, { name: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subtasks" as never,
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const column = columns?.find((c) => c.name === data.status);
    createTask({
      title: data.title,
      description: data.description,
      columnId: column?.id as string,
      status: data.status,
      order: 0,
    });
    setIsModalOpen(false);
  };

  const handleRemoveCrossButton = (i: number) => {
    remove(i);
  };

  const handleNewSubtaskButton = () => {
    append({ name: "" });
  };

  return {
    onSubmit: handleSubmit(onSubmit),
    fields: fields,
    handleRemoveCrossButton: handleRemoveCrossButton,
    handleNewSubtaskButton: handleNewSubtaskButton,
    errors: errors,
    register: register,
  };
};

export default useCreateTask;
