import { useState } from "react";
import { useStore } from "../store/index";
import BoardForm from "./boardForm";
import Button from "./button";
import DeleteModalInsert from "./deleteModalInsert";
import DotsButton from "./dotsButton";
import DotsMenu from "./dotsMenu";
import Modal from "./modal";
import Logo from "./svg/logo";
import TaskForm from "./taskForm";
interface HeaderProps {
  isMenuOpen?: boolean;
}

const Header = ({ isMenuOpen }: HeaderProps) => {
  const activeBoard = useStore((state) => state.activeBoard);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [isDotsMenuOpen, setIsDotsMenuOpen] = useState<Boolean>(false);
  const clickDotsButtonHandler = () => {
    setIsDotsMenuOpen((prevState) => !prevState);
  };

  const handleEditClick = () => {
    setIsModalOpen(true);
    setIsDotsMenuOpen(false);
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
    setIsDotsMenuOpen(false);
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
        <TaskForm setIsModalOpen={setIsTaskModalOpen} />
      </Modal>
      <header className="flex items-center bg-white dark:bg-grey-dark fixed w-full top-0 left-0">
        <div
          className={`transition-all py-9 ${
            isMenuOpen ? "pl-7 pr-[119px]" : "px-7"
          } border-r-[1px] border-lines-light dark:border-x-lines-dark`}
        >
          <Logo />
        </div>
        <div className="flex items-center justify-between flex-grow pl-10 pr-6">
          <h2 className="text-2xl font-bold">{activeBoard?.name}</h2>
          <div className="relative flex justify-between text-base">
            <Button
              onClick={() => {
                setIsTaskModalOpen(true);
              }}
            >
              + Add New Task
            </Button>
            <DotsButton onClick={clickDotsButtonHandler} />
            {isDotsMenuOpen && (
              <DotsMenu
                position={"top-20 left-0"}
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
