import Column from "./column";
interface BoardProps {
  children?: React.ReactNode;
}

const Board = ({ children }: BoardProps) => {
  return (
    <ul className="min-h-[calc(100vh-80rem)] p-5 flex">
      <Column />
      <Column />
      <Column />
      <li
        onClick={() => {}}
        className="group w-[260px] mt-[43px] mb-[19px] rounded-lg bg-grey-create hover:bg-purple-10 flex flex-col justify-center items-center cursor-pointer"
      >
        <p className="group-hover:text-purple font-bold text-lg">+ New Column</p>
      </li>
    </ul>
  );
};

export default Board;
