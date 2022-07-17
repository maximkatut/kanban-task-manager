import { Task } from "@prisma/client";
import { trpc } from "../utils/trpc";

interface TaskProps {
  task: Task;
}

const Task = ({ task }: TaskProps) => {
  const { data: subtasks } = trpc.useQuery(["subtask.getByTaskId", { taskId: task.id }]);

  return (
    <li className="mb-5 px-4 py-5 w-[calc(100%-1.25rem)] bg-white dark:bg-grey-dark rounded-lg shadow-sm cursor-pointer font-bold hover:text-purple">
      <h4 className="text-base">{task.title}</h4>
      <p className="text-grey-medium">
        {subtasks?.reduce((acc, s) => {
          if (s.isCompleted === false) {
            acc++;
          }
          return acc;
        }, 0)}{" "}
        of {subtasks?.length} subtasks
      </p>
    </li>
  );
};

export default Task;
