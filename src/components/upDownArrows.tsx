interface UpDownArrowsProps {
  handleMoveUpButton: (i: number) => void;
  handleMoveDownButton: (i: number, arr: any) => void;
  i: number;
  arr: any;
  isTask?: boolean;
}

const UpDownArrows = ({ handleMoveUpButton, handleMoveDownButton, i, arr, isTask }: UpDownArrowsProps) => {
  return (
    <div>
      <button
        className={`absolute h-10 w-8 ${isTask ? "right-16" : "right-24"} top-0 group flex justify-center items-center`}
        disabled={i === 0}
        onClick={(e) => {
          e.preventDefault();
          handleMoveUpButton(i);
        }}
      >
        <svg className="ml-2 mt-2" width="20" height="14" xmlns="http://www.w3.org/2000/svg">
          <path
            className="group-hover:stroke-purple-hover group-disabled:stroke-purple-25"
            stroke="#635FC7"
            strokeWidth="3"
            fill="none"
            d="M9 6 5 2 1 6"
          />
        </svg>
      </button>
      <button
        disabled={i === arr.length - 1}
        className={`flex justify-center items-center h-10 w-8 absolute ${isTask ? "right-8" : "right-16"} top-0 group `}
        onClick={(e) => {
          e.preventDefault();
          handleMoveDownButton(i, arr);
        }}
      >
        <svg className="ml-2 mt-2" width="20" height="14" xmlns="http://www.w3.org/2000/svg">
          <path
            className="group-hover:stroke-purple-hover group-disabled:stroke-purple-25"
            stroke="#635FC7"
            strokeWidth="3"
            fill="none"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>
    </div>
  );
};

export default UpDownArrows;
