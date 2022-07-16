import { Board } from "@prisma/client";
import { Dispatch, SetStateAction, useState } from "react";
import ReactModal from "react-modal";
import { trpc } from "../utils/trpc";
import AsideButton from "./asideButtton";
import BoardForm from "./boardForm";
import Toggle from "./toggle";

interface SidebarProps {
  setIsMenuOpen: (x: boolean) => void;
  isMenuOpen: boolean;
  boards: Board[];
  setActiveBoard: Dispatch<SetStateAction<Board | undefined>>;
  activeBoard?: Board;
}

const Sidebar = ({ setIsMenuOpen, isMenuOpen, boards, setActiveBoard, activeBoard }: SidebarProps) => {
  const [isModalOpen, setisModalOpen] = useState<boolean>(false);
  const client = trpc.useContext();
  const { mutate: createBoard } = trpc.useMutation("board.create", {
    async onSuccess(data) {
      await client.invalidateQueries(["board.getAll"]);
      setActiveBoard(data);
    },
  });

  const createButtonHandler = () => {
    setisModalOpen(true);
    // createBoard({ name: "new board" });
  };

  return (
    <>
      <ReactModal
        style={{
          content: {
            top: "140px",
            left: "0",
            right: "0",
            bottom: "140px",
            margin: "0 auto",
            width: "480px",
            height: "min-content",
            padding: "30px",
          },
          overlay: { zIndex: "10", backgroundColor: "rgba(0,0,0,0.5)" },
        }}
        isOpen={isModalOpen}
        onRequestClose={() => {
          setisModalOpen((prev) => !prev);
        }}
      >
        <BoardForm />
      </ReactModal>
      <aside
        className={`transition-all pb-8 w-[calc(75rem/4)] h-[calc(100vh-98px)] bg-white dark:bg-grey-dark fixed bottom-0 ${
          isMenuOpen ? "left-0 overflow-scroll" : "-left-80"
        } flex flex-col justify-between`}
      >
        <div>
          <p className="px-7 py-3 tracking-[0.15rem] uppercase">All boards ({boards.length})</p>
          <ul>
            {boards.map((b) => {
              return (
                <li key={b.id}>
                  <AsideButton
                    active={activeBoard?.id === b.id}
                    onClick={() => {
                      setActiveBoard(b);
                    }}
                  >
                    {b.name}
                  </AsideButton>
                </li>
              );
            })}
            <li>
              <AsideButton newBoard onClick={createButtonHandler}>
                + Create New Board
              </AsideButton>
            </li>
          </ul>
        </div>
        <div>
          <Toggle />

          <AsideButton
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
            }}
            isTextHidden
            {...{ isMenuOpen }}
          >
            Hide Sidebar
          </AsideButton>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
