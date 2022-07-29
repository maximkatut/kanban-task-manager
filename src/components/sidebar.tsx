import { Board } from "@prisma/client";
import { useState } from "react";
import { useStore } from "../store";
import AsideButton from "./asideButtton";
import BoardForm from "./boardForm";
import Modal from "./modal";
import Toggle from "./toggle";

interface SidebarProps {
  setIsMenuOpen: (x: boolean) => void;
  isMenuOpen: boolean;
  boards: Board[];
}

const Sidebar = ({ setIsMenuOpen, isMenuOpen, boards }: SidebarProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const setActiveBoard = useStore((state) => state.setActiveBoard);
  const activeBoard = useStore((state) => state.activeBoard);

  const createButtonHandler = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <Modal {...{ isModalOpen, setIsModalOpen }}>
        <BoardForm setIsModalOpen={setIsModalOpen} />
      </Modal>
      <aside
        className={`transition-all pb-8 w-[calc(75rem/4)] h-[calc(100vh-98px)] bg-white dark:bg-grey-dark fixed bottom-0 ${
          isMenuOpen ? "left-0 overflow-auto" : "-left-80"
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
