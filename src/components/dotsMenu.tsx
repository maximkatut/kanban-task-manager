import { RefObject, useRef } from "react";
import useOutsideClick from "../hooks/useOutsideClick";

interface DotsMenuProps {
  setIsDotsMenuOpen: (x: boolean) => void;
  handleEditClick: () => void;
  handleDeleteClick: () => void;
  position: string;
  task?: boolean;
  refMenuDotsButton: RefObject<HTMLButtonElement>;
}

const DotsMenu = ({
  setIsDotsMenuOpen,
  handleEditClick,
  handleDeleteClick,
  position,
  task,
  refMenuDotsButton,
}: DotsMenuProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const name = task ? "Task" : "Board";
  const {} = useOutsideClick({
    setIsMenuOpen: setIsDotsMenuOpen,
    ref,
    refMenuButton: refMenuDotsButton,
    isDotsMenu: true,
  });

  return (
    <div
      ref={ref}
      className={`text-base shadow-lg absolute ${position} w-48 px-6 py-4 flex flex-col bg-white dark:bg-grey-very-dark rounded-lg`}
    >
      <button onClick={handleEditClick} className="text-grey-medium text-left mb-2 hover:font-bold">
        Edit {name}
      </button>
      <button onClick={handleDeleteClick} className="text-red text-left hover:font-bold">
        Delete {name}
      </button>
    </div>
  );
};

export default DotsMenu;
