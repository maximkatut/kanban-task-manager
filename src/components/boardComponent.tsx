import { Board } from "@prisma/client";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { trpc } from "../utils/trpc";
import Button from "./button";
import Column from "./column";
import Modal from "./modal";
interface BoardProps {
  board: Board;
}

interface Inputs {
  columnName: string;
}

const Board = ({ board }: BoardProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const utils = trpc.useContext();
  const { data: columns } = trpc.useQuery(["column.getByBoardId", { boardId: board.id }], {
    async onSuccess() {
      await utils.invalidateQueries(["column.getByBoardId", { boardId: board.id }]);
    },
  });
  const { mutateAsync: createColumn, isLoading } = trpc.useMutation("column.create");
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<Inputs>({ defaultValues: { columnName: "" } });

  const handleNewColClick = () => {
    setIsModalOpen(true);
  };

  const handleCancelButton = () => {
    setIsModalOpen(false);
  };

  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    await createColumn({ name: data.columnName, boardId: board.id, order: columns?.length as number });
    setIsModalOpen(false);
  };

  return (
    <>
      <Modal {...{ isModalOpen, setIsModalOpen }}>
        <form onSubmit={handleSubmit(onSubmit)} className="dark:bg-grey-very-dark p-8 rounded-sm">
          <h3 className="text-lg mb-5 font-bold">Add New Column</h3>
          <input
            {...register("columnName", { required: true })}
            placeholder="e.g. Web Design"
            type="text"
            className={`w-full py-2 px-4 border-[1px] ${
              errors.columnName ? "border-red animate-shake" : "border-lines-light dark:border-lines-dark"
            } rounded-sm mb-5 dark:bg-grey-very-dark`}
          />
          <div className="flex justify-between">
            <Button type="submit">{isLoading ? <span className="animate-spin">0</span> : "Create"}</Button>
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
