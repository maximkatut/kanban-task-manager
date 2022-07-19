import { Column } from "@prisma/client";
import { trpc } from "../utils/trpc";
import TaskComponent from "./task";

interface ColumnProps {
  column: Column;
}

const Column = ({ column }: ColumnProps) => {
  const { data: tasks } = trpc.useQuery(["task.getByColumnId", { columnId: column.id }]);
  return (
    <li className="w-[305px]">
      <h3 className="uppercase flex items-center mb-5">
        <span className="w-4 h-4 bg-blue rounded-full inline-block mb-1"></span>
        <span className="ml-4 tracking-[0.15rem]">
          {column.name} ({tasks?.length})
        </span>
      </h3>
      <ul>
        {tasks?.map((t) => {
          return <TaskComponent key={t.id} task={t} />;
        })}
      </ul>
    </li>
  );
};

export default Column;
