import { Board, Column, Subtask, Task } from "@prisma/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useStore } from "../store/index";
import { trpc } from "../utils/trpc";
import DotsButton from "./dotsButton";
import DotsMenu from "./dotsMenu";

interface TaskModalInsertProps {
  task: Task;
  subtasks: Subtask[];
}

interface Inputs {
  status: string;
  checkbox: string[];
}

const TaskModalInsert = ({ subtasks, task }: TaskModalInsertProps) => {
  const [isDotsMenuOpen, setIsDotsMenuOpen] = useState<Boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const activeBoard = useStore((state) => state.activeBoard) as Board;
  const { data: columns } = trpc.useQuery(["column.getByBoardId", { boardId: activeBoard.id }]);
  const activeSubtasks = subtasks.filter((s) => s.isCompleted === true).map((s) => s.id);
  const activeColumn = columns?.find((c) => c.id === task.columnId) as Column;
  const { register, handleSubmit } = useForm({
    defaultValues: { checkbox: [...activeSubtasks], status: activeColumn.name },
  });

  const clickDotsButtonHandler = () => {
    setIsDotsMenuOpen((prevState) => !prevState);
  };

  const handleEditClick = () => {
    setIsModalOpen(true);
    setIsDotsMenuOpen(false);
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
    setIsDotsMenuOpen(false);
  };

  return (
    <div className="dark:bg-grey-very-dark p-8 rounded-sm">
      <div className="relative flex items-center mb-6 justify-between">
        <h3 className="text-lg  font-bold mr-5">{task.title}</h3>
        <DotsButton onClick={clickDotsButtonHandler} />
        {isDotsMenuOpen && (
          <DotsMenu
            task
            position="-right-5 top-12"
            setIsDotsMenuOpen={setIsDotsMenuOpen}
            handleDeleteClick={handleDeleteClick}
            handleEditClick={handleEditClick}
          />
        )}
      </div>
      <p className="text-grey-medium mb-6">{task.description}</p>
      <form
        onChange={() => {
          handleSubmit((data) => {
            console.log(data);
          })();
        }}
      >
        <p className="text-grey-medium text-xs mb-2 font-bold">
          Subtasks (
          {subtasks?.reduce((acc, s) => {
            if (s.isCompleted === true) {
              acc++;
            }
            return acc;
          }, 0)}{" "}
          of {subtasks?.length})
        </p>
        {subtasks
          .sort((a, b) => a.order - b.order)
          .map((s) => (
            <label
              htmlFor={s.id}
              key={s.id}
              className={`${
                s.isCompleted ? "line-through" : "font-bold text-black"
              } text-grey-medium bg-purple-10 p-4 text-xs block mb-2 hover:bg-purple-25`}
            >
              <input {...register("checkbox")} id={s.id} key={s.id} type="checkbox" value={s.id} />
              <span className="ml-4">{s.title}</span>
            </label>
          ))}
        <label className="text-grey-medium text-xs block mt-6 mb-2 font-bold">Current Status</label>
        <select
          {...register("status")}
          id="status"
          className={`w-full py-3 px-4 border-[1px] bg-white uppercase border-lines-light dark:border-lines-dark rounded-sm mb-5 dark:bg-grey-very-dark`}
        >
          {columns?.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name.toUpperCase()}
            </option>
          ))}
        </select>
      </form>
    </div>
  );
};

export default TaskModalInsert;
