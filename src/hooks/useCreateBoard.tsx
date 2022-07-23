import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { useStore } from "../store";
import { COLORS } from "../utils/const";
import { trpc } from "../utils/trpc";

export interface Inputs {
  boardName: string;
  column: {
    name: string;
    color: string;
  }[];
}

export interface UseBoardProps {
  setIsModalOpen: (x: boolean) => void;
}

const useCreateBoard = ({ setIsModalOpen }: UseBoardProps) => {
  const activeBoard = useStore((state) => state.activeBoard);
  const setActiveBoard = useStore((state) => state.setActiveBoard);
  const utils = trpc.useContext();
  const { mutateAsync: createTask } = trpc.useMutation("column.create", {
    async onSuccess() {
      activeBoard && (await utils.invalidateQueries(["column.getByBoardId", { boardId: activeBoard.id }]));
    },
  });
  const { mutateAsync: createBoard } = trpc.useMutation("board.create", {
    async onSuccess(data) {
      await utils.invalidateQueries(["board.getAll"]).then(() => {
        setIsModalOpen(false);
        setActiveBoard(data);
      });
      const inputs = getValues();
      inputs.column.map(async (c, i) => {
        await createTask({ ...c, boardId: data.id, order: i });
      });
    },
  });
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    getValues,
  } = useForm<Inputs>({
    defaultValues: {
      boardName: "",
      column: [
        { name: "", color: COLORS[0] },
        { name: "", color: COLORS[1] },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "column" as never,
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await createBoard({ name: data.boardName });
  };

  const handleRemoveCrossButton = (i: number) => {
    remove(i);
  };

  const handleNewColumnButton = () => {
    append({ name: "" });
  };

  return {
    onCreateSubmit: handleSubmit(onSubmit),
    fieldsCreate: fields,
    handleRemoveCrossButtonCreate: handleRemoveCrossButton,
    handleNewColumnButtonCreate: handleNewColumnButton,
    errorsCreate: errors,
    registerCreate: register,
  };
};

export default useCreateBoard;
