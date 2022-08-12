import { Column, Task } from "@prisma/client";
import { Droppable } from "react-beautiful-dnd";
import { COLORS } from "../utils/const";
import TaskComponent from "./task";
interface ColumnProps {
  column: Column;
  tasks: Task[] | undefined;
}

const Column = ({ column, tasks }: ColumnProps) => {
  return (
    <li className="w-[305px]">
      <h3 className="uppercase flex items-center mb-5">
        <span
          style={{ backgroundColor: column?.color || COLORS[0] }}
          className="w-4 h-4 rounded-full inline-block mb-1"
        ></span>
        <span className="ml-4 tracking-[0.15rem]">
          {column.name} ({tasks?.length})
        </span>
      </h3>
      <Droppable droppableId={column.id}>
        {(provided) => (
          <ul ref={provided.innerRef} {...provided.droppableProps}>
            {tasks
              ?.sort((a, b) => a.order - b.order)
              .map((t, i) => {
                return <TaskComponent key={t.id} task={t} index={i} />;
              })}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </li>
  );
};

export default Column;
