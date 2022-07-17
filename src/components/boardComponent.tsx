import { Board } from "@prisma/client";
import { trpc } from "../utils/trpc";
import Column from "./column";
interface BoardProps {
  board: Board;
}

const Board = ({ board }: BoardProps) => {
  const { data: columns } = trpc.useQuery(["column.getByBoardId", { boardId: board.id }]);
  return (
    <ul className="min-h-[calc(100vh-80rem)] p-5 flex">
      {columns?.map((c) => {
        return <Column key={c.id} column={c} />;
      })}
      <li
        onClick={() => {}}
        className="group w-[260px] h-[calc(100vh-200px)] mt-[43px] mb-[19px] rounded-lg bg-grey-create dark:bg-grey-create-dark hover:bg-purple-10 flex flex-col justify-center items-center cursor-pointer"
      >
        <p className="group-hover:text-purple font-bold text-lg">+ New Column</p>
      </li>
    </ul>
  );
};

export default Board;
