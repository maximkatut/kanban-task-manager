import { Board } from "@prisma/client";
import { useStore } from "../store";
import { useBoardStore } from "../store/boards";
import { MD_WIDTH } from "../utils/const";
import { trpc } from "../utils/trpc";
import Button from "./button";

interface DeleteModalInsertProps {
  setIsDeleteModalOpen: (x: boolean) => void;
  handleDeleteButton?: () => void;
  column?: boolean;
  task?: boolean;
}

const DeleteModalInsert = ({ setIsDeleteModalOpen, column, task, handleDeleteButton }: DeleteModalInsertProps) => {
  const activeBoard = useBoardStore((state) => state.activeBoard) as Board;
  const setActiveBoard = useBoardStore((state) => state.setActiveBoard);
  const width = useStore((state) => state.width);
  const client = trpc.useContext();
  const { data: boards } = trpc.useQuery(["board.getAll"]);
  const { mutate: deleteBoard } = trpc.useMutation("board.delete", {
    async onSuccess(data) {
      await client.invalidateQueries("board.getAll");
      const restBoards = boards?.filter((b) => b.id !== data.id);
      if (restBoards && restBoards?.length > 0) {
        setActiveBoard(restBoards[0]);
      }
      setIsDeleteModalOpen(false);
    },
  });
  const handleDeleteBoardClick = () => {
    deleteBoard({ boardId: activeBoard.id });
  };
  const handleCancelClick = () => {
    setIsDeleteModalOpen(false);
  };

  const isMediaMd = width > MD_WIDTH;

  return (
    <div className="dark:bg-grey-very-dark p-8 rounded-sm">
      <h2 className="text-red mb-5 text-lg">Delete this {column ? "column" : task ? "task" : "board"}?</h2>
      <p className="text-grey-medium mb-5">
        {`Are you sure you want to delete the ${
          column ? "column" : task ? "task" : `${activeBoard.name} board`
        }? This action will remove ${task ? "the task" : `all ${column ? "" : "columns and"} tasks`} and
        cannot be reversed.`}
      </p>
      <div className={`flex justify-between ${isMediaMd ? "" : "flex-wrap"}`}>
        <Button
          onClick={column || task ? handleDeleteButton : handleDeleteBoardClick}
          styles={`rounded-full px-6 py-3 text-white bg-red hover:bg-red-hover ${isMediaMd ? "w-48" : "w-full mb-3"}`}
        >
          Delete
        </Button>
        <Button
          onClick={handleCancelClick}
          styles={`rounded-full px-6 py-3 text-white bg-purple hover:bg-purple-hover ${isMediaMd ? "w-48" : "w-full"}`}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default DeleteModalInsert;
