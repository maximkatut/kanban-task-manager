import { useEffect, useState } from "react";
import { useStore } from "../store";
import { useBoardStore } from "../store/boards";
import { useColumnsStore } from "../store/columns";
import { truncate } from "../utils";
import { MD_WIDTH } from "../utils/const";
import BoardForm from "./boardForm";
import Button from "./button";
import CreateTaskForm from "./createTaskForm";
import DeleteModalInsert from "./deleteModalInsert";
import DotsButton from "./dotsButton";
import DotsMenu from "./dotsMenu";
import Modal from "./modal";
import Logo from "./svg/logo";
interface HeaderProps {
  isMenuOpen?: boolean;
  setIsMenuOpen: (x: boolean) => void;
}

const Header = ({ isMenuOpen, setIsMenuOpen }: HeaderProps) => {
  const activeBoard = useBoardStore((state) => state.activeBoard);
  const columns = useColumnsStore((state) => state.columns);
  const width = useStore((state) => state.width);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [isDotsMenuOpen, setIsDotsMenuOpen] = useState<boolean>(false);
  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false);

  const isMediaMd = width > MD_WIDTH;

  const clickDotsButtonHandler = () => {
    setIsDotsMenuOpen((prevState) => !prevState);
  };

  useEffect(() => {
    if (columns?.length === 0) {
      setIsDisabledButton(true);
    } else {
      setIsDisabledButton(false);
    }
  }, [columns]);

  const handleEditClick = () => {
    setIsModalOpen(true);
    setIsDotsMenuOpen(false);
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
    setIsDotsMenuOpen(false);
  };

  const handleSidebarOpenClick = () => {
    if (isMediaMd) {
      return;
    }
    document.body.style.overflow = "hidden";

    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <Modal {...{ isModalOpen, setIsModalOpen }}>
        <BoardForm setIsModalOpen={setIsModalOpen} isEditMode={true} />
      </Modal>
      <Modal isModalOpen={isDeleteModalOpen} setIsModalOpen={setIsDeleteModalOpen}>
        <DeleteModalInsert {...{ setIsDeleteModalOpen }} />
      </Modal>
      <Modal isModalOpen={isTaskModalOpen} setIsModalOpen={setIsTaskModalOpen}>
        <CreateTaskForm setIsModalOpen={setIsTaskModalOpen} />
      </Modal>
      <header className="z-10 max-h-24 flex items-center bg-white dark:bg-grey-dark fixed w-full top-0 left-0">
        <div
          className={`transition-all py-5 md:py-7 lg:py-9 ${
            isMenuOpen && isMediaMd ? "pl-7 pr-[80px] lg:pr-[119px]" : "px-4 md:px-7"
          } md:border-r-[1px] border-lines-light dark:border-x-lines-dark`}
        >
          <Logo />
        </div>
        <div className="flex items-center justify-between flex-grow px-3 md:pl-10 md:pr-6">
          <h2
            className={` font-bold ${isMediaMd ? "text-2xl" : "cursor-pointer flex items-center text-lg"}`}
            onClick={handleSidebarOpenClick}
          >
            {activeBoard && truncate(activeBoard.name, width)}
            {!isMediaMd && (
              <svg
                className={`mr-2 ${isMenuOpen ? "ml-2" : "rotate-180 mb-2"}`}
                width="20"
                height="14"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path stroke="#635FC7" strokeWidth="3" fill="none" d="M9 6 5 2 1 6" />
              </svg>
            )}
          </h2>
          <div className="relative flex justify-between text-base">
            <Button
              styles={
                isMediaMd
                  ? undefined
                  : "mr-4 rounded-full text-white bg-purple py-1 hover:bg-purple-hover w-20 text-2xl font-bold"
              }
              isLoading={isDisabledButton}
              onClick={() => {
                setIsTaskModalOpen(true);
              }}
            >
              {isMediaMd ? "+ Add New Task" : "+"}
            </Button>
            <DotsButton onClick={clickDotsButtonHandler} />
            {isDotsMenuOpen && (
              <DotsMenu
                position={isMediaMd ? "top-20 left-0" : "top-16 right-0"}
                setIsDotsMenuOpen={setIsDotsMenuOpen}
                handleDeleteClick={handleDeleteClick}
                handleEditClick={handleEditClick}
              />
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
