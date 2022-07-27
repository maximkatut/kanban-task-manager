import { Board, Column, Subtask, Task } from "@prisma/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useStore } from "../store/index";
import { trpc } from "../utils/trpc";
import DeleteModalInsert from "./deleteModalInsert";
import DotsButton from "./dotsButton";
import DotsMenu from "./dotsMenu";
import Modal from "./modal";
import TaskForm from "./taskForm";

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
  const utils = trpc.useContext();
  const { data: columns } = trpc.useQuery(["column.getByBoardId", { boardId: activeBoard.id }]);
  const { mutate: deleteTask } = trpc.useMutation("task.delete", {
    onSuccess(data) {
      utils.invalidateQueries(["task.getByColumnId", { columnId: data.columnId }]);
    },
  });
  const { mutateAsync: updateTask } = trpc.useMutation("task.update", {
    async onSuccess(data) {
      await utils.invalidateQueries(["task.getByColumnId", { columnId: data.columnId }]);
      task && (await utils.invalidateQueries(["task.getByColumnId", { columnId: task?.columnId }]));
    },
  });
  const { mutateAsync: updateSubtask } = trpc.useMutation("subtask.update", {
    async onSuccess(data) {
      await utils.invalidateQueries(["subtask.getByTaskId", { taskId: data.taskId }]);
    },
  });
  const activeSubtasksIds = subtasks.filter((s) => s.isCompleted === true).map((s) => s.id);
  const activeColumn = columns?.find((c) => c.id === task.columnId) as Column;
  const { register, handleSubmit } = useForm({
    defaultValues: { checkbox: [...activeSubtasksIds], status: activeColumn.name },
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

  const handleDeleteTaskButton = () => {
    deleteTask({ id: task.id });
  };

  return (
    <>
      <Modal isModalOpen={isDeleteModalOpen} setIsModalOpen={setIsDeleteModalOpen}>
        <DeleteModalInsert task {...{ setIsDeleteModalOpen }} handleDeleteButton={handleDeleteTaskButton} />
      </Modal>
      <Modal {...{ setIsModalOpen, isModalOpen }}>
        <TaskForm task={task} isEditMode setIsModalOpen={setIsModalOpen} />
      </Modal>
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
              const column = columns?.find((c) => c.name === data.status);
              if (task.status !== data.status) {
                updateTask({
                  id: task.id,
                  status: data.status,
                  columnId: column?.id,
                });
              }
              if (task.status !== data.status) {
                updateTask({
                  id: task.id,
                });
              }
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
                } text-grey-medium dark:text-white bg-purple-10 p-4 text-xs block mb-2 hover:bg-purple-25 cursor-pointer`}
              >
                <input
                  {...register("checkbox", {
                    onChange(event) {
                      const checkbox = event.target;
                      updateSubtask({
                        id: checkbox.id,
                        isCompleted: checkbox.checked,
                      });
                      console.log(event.currentTarget.value);
                      console.log(event.target.checked);
                    },
                  })}
                  defaultChecked={s.isCompleted}
                  id={s.id}
                  key={s.id}
                  type="checkbox"
                  value={s.title}
                />
                <span className="ml-4">{s.title}</span>
              </label>
            ))}
          <label className="text-grey-medium text-xs block mt-6 mb-2 font-bold">Current Status</label>
          <select
            {...register("status")}
            id="status"
            className={`hover:border-purple w-full py-3 px-4 border-[1px] bg-white uppercase border-lines-light dark:border-lines-dark rounded-sm mb-5 dark:bg-grey-very-dark`}
          >
            {columns?.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name.toUpperCase()}
              </option>
            ))}
          </select>
        </form>
      </div>
    </>
  );
};

export default TaskModalInsert;
