import { useEffect, useRef } from "react";

interface DotsMenuProps {
  setIsDotsMenuOpen: (x: boolean) => void;
  handleEditClick: () => void;
  handleDeleteClick: () => void;
  position: string;
  task?: boolean;
}

const DotsMenu = ({ setIsDotsMenuOpen, handleEditClick, handleDeleteClick, position, task }: DotsMenuProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const name = task ? "Task" : "Board";

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
