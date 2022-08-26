import { Task } from "@prisma/client";
import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { trpc } from "../utils/trpc";
import Modal from "./modal";
import DraggableSVG from "./svg/draggableSVG";
import TaskModalInsert from "./taskModalInsert";

interface TaskProps {
  task: Task;
  index: number;
}

const Task = ({ task, index }: TaskProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { data: subtasks } = trpc.useQuery(["subtask.getByTaskId", { taskId: task.id }]);

  const handleTaskClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <Modal {...{ isModalOpen, setIsModalOpen }}>{subtasks && <TaskModalInsert {...{ subtasks, task }} />}</Modal>
      <Draggable draggableId={task.id} index={index}>
        {(provided) => (
          <li
            {...provided.dragHandleProps}
            {...provided.draggableProps}
            ref={provided.innerRef}
            onClick={handleTaskClick}
            className="relative group mx-[10px] my-3 px-4 py-5 w-[calc(100%-1.25rem)] bg-white dark:bg-grey-dark 
            rounded-lg shadow-sm cursor-pointer font-bold hover:text-purple hover:shadow hover:translate-y-[-1px]"
          >
            <h4 className="text-base text-ellipsis overflow-hidden">{task.title}</h4>
            <p className="text-grey-medium">
              {subtasks?.reduce((acc, s) => {
                if (s.isCompleted === true) {
                  acc++;
                }
                return acc;
              }, 0)}{" "}
              of {subtasks?.length} subtasks
            </p>
            <DraggableSVG />
          </li>
        )}
      </Draggable>
    </>
  );
};

export default Task;
