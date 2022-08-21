import { Board } from "@prisma/client";
import { useState } from "react";
import { useStore } from "../store";
import { useBoardStore } from "../store/boards";
import { MD_WIDTH } from "../utils/const";
import AsideButton from "./asideButtton";
import BoardForm from "./boardForm";
import DarkModeToggle from "./darkModeToggle";
import Modal from "./modal";

interface SidebarProps {
  setIsMenuOpen: (x: boolean) => void;
  isMenuOpen: boolean;
  boards: Board[];
}

const Sidebar = ({ setIsMenuOpen, isMenuOpen, boards }: SidebarProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const setActiveBoard = useBoardStore((state) => state.setActiveBoard);
  const activeBoard = useBoardStore((state) => state.activeBoard);
  const width = useStore((state) => state.width);

  const checkIsMediaMdAndCloseMenu = () => {
    if (!isMediaMd) {
      setIsMenuOpen(false);
    }
  };

  const createButtonHandler = () => {
    setIsModalOpen(true);
    checkIsMediaMdAndCloseMenu();
  };

  const handleAsideButtonClick = (board: Board) => {
    setActiveBoard(board);
    checkIsMediaMdAndCloseMenu();
  };

  const isMediaMd = width > MD_WIDTH;

  return (
    <>
      <Modal {...{ isModalOpen, setIsModalOpen }}>
        <BoardForm setIsModalOpen={setIsModalOpen} />
      </Modal>
      <aside
        className={`z-10 flex flex-col transition-all md:pb-8 w-[calc(65rem/4)] 
        lg:w-[calc(75rem/4)] md:h-[calc(100vh-82px)] lg:h-[calc(100vh-98px)]
         bg-white dark:bg-grey-dark fixed top-[66px] md:top-[82px] lg:top-[98px] ${
           isMenuOpen
             ? isMediaMd
               ? "left-0 overflow-auto"
               : "left-[calc(50%-260px/2)] mt-5 rounded-lg"
             : isMediaMd
             ? "-left-80"
             : "hidden"
         } ${isMediaMd ? "justify-between" : ""}`}
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
                      handleAsideButtonClick(b);
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
        <div className="text-center">
          <DarkModeToggle />
          {width > MD_WIDTH && (
            <AsideButton
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
              }}
              isTextHidden
              {...{ isMenuOpen }}
            >
              Hide Sidebar
            </AsideButton>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
