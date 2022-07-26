import { Subtask, Task } from "@prisma/client";
import { useState } from "react";
import { trpc } from "../utils/trpc";
import Modal from "./modal";
import TaskModalInsert from "./taskModalInsert";
interface TaskProps {
  task: Task;
}

const Task = ({ task }: TaskProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { data: subtasks } = trpc.useQuery(["subtask.getByTaskId", { taskId: task.id }]);

  const handleTaskClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <Modal {...{ isModalOpen, setIsModalOpen }}>
        <TaskModalInsert subtasks={subtasks as Subtask[]} task={task} />
      </Modal>
      <li
        onClick={handleTaskClick}
        className="mb-5 px-4 py-5 w-[calc(100%-1.25rem)] bg-white dark:bg-grey-dark rounded-lg shadow-sm cursor-pointer font-bold hover:text-purple"
      >
        <h4 className="text-base">{task.title}</h4>
        <p className="text-grey-medium">
          {subtasks?.reduce((acc, s) => {
            if (s.isCompleted === true) {
              acc++;
            }
            return acc;
          }, 0)}{" "}
          of {subtasks?.length} subtasks
        </p>
      </li>
    </>
  );
};

export default Task;
