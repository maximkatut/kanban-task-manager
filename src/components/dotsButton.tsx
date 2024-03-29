import { RefObject } from "react";

interface DotsButtonProps {
  onClick?: () => void;
  refMenuDotsButton: RefObject<HTMLButtonElement>;
}

const DotsButton = ({ onClick, refMenuDotsButton }: DotsButtonProps) => {
  return (
    <button ref={refMenuDotsButton} onClick={onClick} className="px-2 group">
      <svg
        className="group-hover:fill-purple fill-grey-medium"
        width="5"
        height="20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fillRule="evenodd">
          <circle cx="2.308" cy="2.308" r="2.308" />
          <circle cx="2.308" cy="10" r="2.308" />
          <circle cx="2.308" cy="17.692" r="2.308" />
        </g>
      </svg>
    </button>
  );
};

export default DotsButton;
