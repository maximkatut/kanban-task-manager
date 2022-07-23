import { useStore } from "../store/index";
interface DotsButtonProps {
  onClick?: () => void;
}

const DotsButton = ({ onClick }: DotsButtonProps) => {
  const activeBoard = useStore((state) => state.activeBoard);
  return (
    <button onClick={onClick} disabled={!activeBoard} className="px-2 group">
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
