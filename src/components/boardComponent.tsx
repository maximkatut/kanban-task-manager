import { Board } from "@prisma/client";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { trpc } from "../utils/trpc";
import Button from "./button";
import Column from "./columnComponent";
import Modal from "./modal";
interface BoardProps {
  board: Board;
}

interface Inputs {
  columnName: string;
  color: string;
}

const Board = ({ board }: BoardProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const utils = trpc.useContext();
  const { data: columns } = trpc.useQuery(["column.getByBoardId", { boardId: board.id }]);
  const { mutateAsync: createColumn, isLoading } = trpc.useMutation("column.create", {
    async onSuccess() {
      await utils.invalidateQueries(["column.getByBoardId", { boardId: board.id }]);
    },
  });
  const {
    register,
    formState: { errors },
    setError,
    handleSubmit,
    reset,
  } = useForm<Inputs>({ defaultValues: { columnName: "", color: "#49C4E5" } });

  const handleNewColClick = () => {
    setIsModalOpen(true);
  };

  const handleCancelButton = () => {
    setIsModalOpen(false);
    reset();
  };

  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    const columnNames = columns?.map((c) => c.name.toLowerCase()) as string[];
    if (columnNames.includes(data.columnName.toLowerCase())) {
      setError("columnName", { type: "custom", message: "This name already exists" }, { shouldFocus: true });
      return;
    } else {
      await createColumn({
        name: data.columnName,
        boardId: board.id,
        order: columns?.length as number,
        color: data.color,
      });
      setIsModalOpen(false);
      reset();
    }
  };

  return (
    <>
      <Modal {...{ isModalOpen, setIsModalOpen }}>
        <form onSubmit={handleSubmit(onSubmit)} className="dark:bg-grey-very-dark p-8 rounded-sm">
          <h3 className="text-lg mb-5 font-bold">Add New Column</h3>
          <div className="flex">
            <input
              {...register("columnName", { required: true })}
              placeholder="e.g. Has To Be Done"
              type="text"
              className={`w-full py-2 px-4 border-[1px] ${
                errors.columnName ? "border-red animate-shake" : "border-lines-light dark:border-lines-dark"
              } rounded-sm mb-5 dark:bg-grey-very-dark`}
            />
            <input {...register("color")} type="color" className="w-6 h-6 ml-4 mt-2" />
          </div>
          {errors.columnName?.message && <p className="text-red-hover -mt-5">{errors.columnName?.message}</p>}
          <div className="flex justify-between">
            <Button isLoading={isLoading} type="submit">
              Add
            </Button>
            <Button onClick={handleCancelButton}>Cancel</Button>
          </div>
        </form>
      </Modal>
      <ul className="min-h-[calc(100vh-80rem)] p-5 flex">
        {columns
          ?.sort((a, b) => a.order - b.order)
          .map((c) => {
            return <Column key={c.id} column={c} />;
          })}
        <li
          onClick={handleNewColClick}
          className="group w-[260px] h-[calc(100vh-200px)] mt-[43px] mb-[19px] rounded-lg bg-grey-create dark:bg-grey-create-dark hover:bg-purple-10 flex flex-col justify-center items-center cursor-pointer"
        >
          <p className="group-hover:text-purple font-bold text-lg cursor-pointer">+ New Column</p>
        </li>
      </ul>
    </>
  );
};

export default Board;
