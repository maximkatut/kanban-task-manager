import { useEffect, useState } from "react";
import { useStore } from "../store/boards";
import { useColumnsStore } from "../store/columns";
import { truncate } from "../utils";
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
}

const Header = ({ isMenuOpen }: HeaderProps) => {
  const activeBoard = useStore((state) => state.activeBoard);
  const columns = useColumnsStore((state) => state.columns);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [isDotsMenuOpen, setIsDotsMenuOpen] = useState<boolean>(false);
  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false);
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
      <header className="z-10 flex items-center bg-white dark:bg-grey-dark fixed w-full top-0 left-0">
        <div
          className={`transition-all py-7 lg:py-9 ${
            isMenuOpen ? "pl-7 pr-[80px] lg:pr-[119px]" : "px-7"
          } border-r-[1px] border-lines-light dark:border-x-lines-dark`}
        >
          <Logo />
        </div>
        <div className="flex items-center justify-between flex-grow pl-10 pr-6">
          <h2 className="text-2xl font-bold">{activeBoard && truncate(activeBoard.name)}</h2>
          <div className="relative flex justify-between text-base">
            <Button
              isLoading={isDisabledButton}
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
