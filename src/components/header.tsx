import { useEffect, useRef, useState } from "react";
import { useStore } from "../store/index";
import BoardForm from "./boardForm";
import Button from "./button";
import DeleteModalInsert from "./deleteModalInsert";
import DotsButton from "./dotsButton";
import Modal from "./modal";
import Logo from "./svg/logo";
interface HeaderProps {
  isMenuOpen?: boolean;
}

const Header = ({ isMenuOpen }: HeaderProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const activeBoard = useStore((state) => state.activeBoard);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isDotsMenuOpen, setIsDotsMenuOpen] = useState<Boolean>(false);
  const clickDotsButtonHandler = () => {
    setIsDotsMenuOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const handleOutsideClick = (e: any) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsDotsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleEditClick = () => {
    setIsModalOpen(true);
    setIsDotsMenuOpen(false);
  };

  const handleDeletetClick = () => {
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
            <Button>+ Add New Task</Button>
            <DotsButton onClick={clickDotsButtonHandler} />
            {isDotsMenuOpen && (
              <div
                ref={ref}
                className="absolute top-20 left-0 w-48 px-6 py-4 flex flex-col bg-white dark:bg-grey-very-dark rounded-lg"
              >
                <button onClick={handleEditClick} className="text-grey-medium text-left mb-2">
                  Edit Board
                </button>
                <button onClick={handleDeletetClick} className="text-red text-left">
                  Delete Board
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
