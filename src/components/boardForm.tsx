import { Board } from "@prisma/client";
import { useEffect, useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { trpc } from "../utils/trpc";
import Button from "./button";
interface BoardFormProps {
  setIsModalOpen: (x: boolean) => void;
  setActiveBoard: (x: Board) => void;
}

interface Inputs {
  boardName: string;
  column: {
    name: string;
  }[];
}

const BoardForm = ({ setIsModalOpen, setActiveBoard }: BoardFormProps) => {
  const [newBoard, setNewBoard] = useState<Board>();
  const [newColumns, setNewColumns] = useState<{ name: string }[]>();
  const client = trpc.useContext();
  const { mutate: createTask } = trpc.useMutation("column.create");
  const { mutate: createBoard } = trpc.useMutation("board.create", {
    async onSuccess(data) {
      await client.invalidateQueries(["board.getAll"]);
      setIsModalOpen(false);
      setActiveBoard(data);
      setNewBoard(data);
    },
  });
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      boardName: "",
      column: [{ name: "Todo" }, { name: "Doing" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "column" as never,
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setNewColumns(data.column);
    createBoard({ name: data.boardName });
  };

  useEffect(() => {
    newColumns &&
      newBoard &&
      newColumns.map((c) => {
        createTask({ ...c, boardId: newBoard.id });
      });
  }, [createTask, newBoard, newColumns]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="dark:bg-grey-very-dark p-8 rounded-sm">
      <h3 className="text-lg mb-5 font-bold">Add New Board</h3>
      <label htmlFor="name" className="text-grey-medium text-xs block mb-2">
        Board Name
      </label>
      <input
        {...register("boardName", { required: true })}
        placeholder="e.g. Web Design"
        type="text"
        id="name"
        className="w-full py-2 px-4 border-[1px] border-lines-light dark:border-lines-dark rounded-sm mb-5 dark:bg-grey-very-dark"
      />
      <label className="text-grey-medium text-xs block mb-2">Board Columns</label>
      {fields.map((f, i) => {
        return (
          <div className="flex justify-between items-center" key={f.id}>
            <input
              {...register(`column.${i}.name` as const, { required: true })}
              placeholder="Column name..."
              defaultValue="Todo"
              type="text"
              id="column"
              className="w-[93%] py-2 px-4 border-[1px]  border-lines-light dark:border-lines-dark rounded-sm mb-2 dark:bg-grey-very-dark"
            />
            <button
              aria-label="Remove column input"
              className="mb-1"
              onClick={() => {
                remove(i);
              }}
            >
              <svg width="15" height="15" xmlns="http://www.w3.org/2000/svg">
                <g fill="#828FA3" fillRule="evenodd">
                  <path d="m12.728 0 2.122 2.122L2.122 14.85 0 12.728z" />
                  <path d="M0 2.122 2.122 0 14.85 12.728l-2.122 2.122z" />
                </g>
              </svg>
            </button>
          </div>
        );
      })}
      <Button
        onClick={() => {
          append({ name: "" });
        }}
        styles="mr-4 rounded-full px-6 py-3 font-bold text-purple bg-purple-10 hover:bg-purple-25 w-full mb-5"
      >
        + Add New Column
      </Button>
      <Button
        type="submit"
        styles="mr-4 rounded-full px-6 py-3 font-bold text-white bg-purple hover:bg-purple-hover w-full"
      >
        Create New Board
      </Button>
    </form>
  );
};

export default BoardForm;
