import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Task } from "@prisma/client";
import useCreateTask from "../hooks/useCreateTask";
import useEditTask from "../hooks/useEditTask";
import { useStore } from "../store";
import { trpc } from "../utils/trpc";
import Button from "./button";
import UpDownArrows from "./upDownArrows";

interface TaskFormProps {
  task: Task;
  isEditMode?: boolean;
  setIsModalOpen: (x: boolean) => void;
}

const TaskForm = ({ task, isEditMode, setIsModalOpen }: TaskFormProps) => {
  const [parent] = useAutoAnimate<HTMLFormElement>();
  const activeBoard = useStore((state) => state.activeBoard);
  const { data: columns } = trpc.useQuery(["column.getByBoardId", { boardId: activeBoard?.id as string }]);
  const {
    onCreateSubmit,
    registerCreate,
    errorsCreate,
    fieldsCreate,
    handleNewSubtaskButtonCreate,
    handleRemoveCrossButtonCreate,
  } = useCreateTask({
    setIsModalOpen,
  });

  const {
    onEditSubmit,
    registerEdit,
    errorsEdit,
    fieldsEdit,
    handleNewSubtaskButtonEdit,
    handleRemoveCrossButtonEdit,
    isLoading,
    handleMoveDownButton,
    handleMoveUpButton,
  } = useEditTask({
    setIsModalOpen,
    task,
  });

  const onSubmit = isEditMode ? onEditSubmit : onCreateSubmit;
  const register = isEditMode ? registerEdit : registerCreate;
  const errors = isEditMode ? errorsEdit : errorsCreate;
  const fields = isEditMode ? fieldsEdit : fieldsCreate;
  const handleNewSubtaskButton = isEditMode ? handleNewSubtaskButtonEdit : handleNewSubtaskButtonCreate;
  const handleRemoveCrossButton = isEditMode ? handleRemoveCrossButtonEdit : handleRemoveCrossButtonCreate;

  return (
    <form ref={parent} onSubmit={onSubmit} className="dark:bg-grey-very-dark p-8 rounded-sm">
      <h3 className="text-lg mb-5 font-bold">{isEditMode ? `Edit ${task?.title}` : "Add New Task"}</h3>
      <label htmlFor="title" className="text-grey-medium text-xs block mb-2">
        Title
      </label>
      <input
        {...register("title", { required: true })}
        placeholder="e.g. Take coffee brake"
        type="text"
        id="title"
        className={`hover:border-purple w-full py-2 px-4 border-[1px] ${
          errors.title ? "border-red animate-shake" : "border-lines-light dark:border-lines-dark"
        } rounded-sm mb-5 dark:bg-grey-very-dark`}
      />
      <label htmlFor="description" className="text-grey-medium text-xs block mb-2">
        Description
      </label>
      <textarea
        {...register("description")}
        placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little."
        id="description"
        className={`hover:border-purple w-full py-2 px-4 border-[1px] border-lines-light dark:border-lines-dark rounded-sm mb-5 dark:bg-grey-very-dark`}
      />
      <label className="text-grey-medium text-xs block mb-2">Subtasks</label>
      {fields.map((f, i, arr) => {
        return (
          <div
            className={`relative flex justify-between items-center ${
              errors?.[`subtasks`]?.[`${i}`] &&
              "animate-shake before:content-['Can`t_be_empty'] before:text-red before:absolute before:top-2 before:right-24 before:z-10"
            } `}
            key={f.id}
          >
            <input
              {...register(`subtasks.${i}.title` as const, { required: true })}
              placeholder="Subtask name..."
              type="text"
              id="subtask"
              className={`relative hover:border-purple w-[93%] py-2 px-4 pr-16 border-[1px] ${
                errors?.[`subtasks`]?.[`${i}`] ? "border-red" : "border-lines-light dark:border-lines-dark"
              } rounded-sm mb-2 dark:bg-grey-very-dark`}
            />
            <UpDownArrows {...{ i, arr, handleMoveDownButton, handleMoveUpButton, isTask: true }} />
            <button
              aria-label="Remove column input"
              className="mb-1"
              onClick={(e) => {
                e.preventDefault();
                handleRemoveCrossButton(i);
              }}
            >
              <svg width="15" height="15" xmlns="http://www.w3.org/2000/svg">
                <g className="hover:fill-red" fill="#828FA3" fillRule="evenodd">
                  <path d="m12.728 0 2.122 2.122L2.122 14.85 0 12.728z" />
                  <path d="M0 2.122 2.122 0 14.85 12.728l-2.122 2.122z" />
                </g>
              </svg>
            </button>
          </div>
        );
      })}
      <Button
        onClick={handleNewSubtaskButton}
        styles="mr-4 rounded-full px-6 py-3 font-bold text-purple bg-purple-10 hover:bg-purple-25 w-full mb-5"
      >
        + Add New Subtask
      </Button>
      <label htmlFor="status" className="text-grey-medium text-xs block mb-2">
        Status
      </label>
      <select
        {...register("status")}
        id="status"
        className={`hover:border-purple w-full py-3 px-4 border-[1px] bg-white uppercase border-lines-light dark:border-lines-dark rounded-sm mb-5 dark:bg-grey-very-dark`}
      >
        {columns
          ?.sort((a, b) => a.order - b.order)
          .map((c) => (
            <option key={c.id} value={c.name}>
              {c.name.toUpperCase()}
            </option>
          ))}
      </select>

      <Button
        type="submit"
        isLoading={isLoading}
        styles={`mr-4 rounded-full px-6 py-3 font-bold text-white w-full ${
          isLoading ? "bg-purple-25" : "bg-purple hover:bg-purple-hover"
        }`}
      >
        {isEditMode ? `Save changes` : "Create Task"}
      </Button>
    </form>
  );
};

export default TaskForm;
