import Task from "./task";

interface ColumnProps {
  children?: React.ReactNode;
}

const Column = ({ children }: ColumnProps) => {
  return (
    <li className="w-[305px]">
      <h3 className="uppercase flex items-center mb-5">
        <span className="w-4 h-4 bg-blue rounded-full inline-block mb-1"></span>
        <span className="ml-4 tracking-[0.15rem]">todo (7)</span>
      </h3>
      <ul>
        <Task />
        <Task />
        <Task />
        <Task />
        <Task />
      </ul>
    </li>
  );
};

export default Column;
