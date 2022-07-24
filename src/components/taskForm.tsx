import { Task } from "@prisma/client";
import useCreateTask from "../hooks/useCreateTask";
import { useStore } from "../store";
import { trpc } from "../utils/trpc";
import Button from "./button";

interface TaskFormProps {
  task?: Task;
  isEditMode?: boolean;
  setIsModalOpen: (x: boolean) => void;
}

const TaskForm = ({ task, isEditMode, setIsModalOpen }: TaskFormProps) => {
  const activeBoard = useStore((state) => state.activeBoard);
  const { data: columns } = trpc.useQuery(["column.getByBoardId", { boardId: activeBoard?.id as string }]);

  const { onSubmit, register, errors, fields, handleNewSubtaskButton, handleRemoveCrossButton } = useCreateTask({
    setIsModalOpen,
  });
  return (
    <form onSubmit={onSubmit} className="dark:bg-grey-very-dark p-8 rounded-sm">
      <h3 className="text-lg mb-5 font-bold">{isEditMode ? `Edit ${task?.title}` : "Add New Task"}</h3>
      <label htmlFor="title" className="text-grey-medium text-xs block mb-2">
        Title
      </label>
      <input
        {...register("title", { required: true })}
        placeholder="e.g. Take coffee brake"
        type="text"
        id="title"
        className={`w-full py-2 px-4 border-[1px] ${
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
        className={`w-full py-2 px-4 border-[1px] border-lines-light dark:border-lines-dark rounded-sm mb-5 dark:bg-grey-very-dark`}
      />
      <label className="text-grey-medium text-xs block mb-2">Subtasks</label>
      {fields.map((f, i) => {
        return (
          <div className="flex justify-between items-center" key={f.id}>
            <input
              {...register(`subtasks.${i}.name` as const, { required: true })}
              placeholder="Subtask name..."
              type="text"
              id="subtask"
              className={`w-[93%] py-2 px-4 border-[1px] ${
                errors?.[`subtasks`]?.[`${i}`]
                  ? "border-red animate-shake"
                  : "border-lines-light dark:border-lines-dark"
              } rounded-sm mb-2 dark:bg-grey-very-dark`}
            />
            <button
              aria-label="Remove column input"
              className="mb-1"
              onClick={() => {
                handleRemoveCrossButton(i);
              }}
            >
              <svg width="15" height="15" xmlns="http://www.w3.org/2000/svg">
                <g fill="#828FA3" fillRule="evenodd">
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
        className={`w-full py-3 px-4 border-[1px] bg-white uppercase border-lines-light dark:border-lines-dark rounded-sm mb-5 dark:bg-grey-very-dark`}
      >
        {columns?.map((c) => (
          <option key={c.id} value={c.name}>
            {c.name.toUpperCase()}
          </option>
        ))}
      </select>

      <Button
        type="submit"
        styles="mr-4 rounded-full px-6 py-3 font-bold text-white bg-purple hover:bg-purple-hover w-full"
      >
        {isEditMode ? `Save changes` : "Create Task"}
      </Button>
    </form>
  );
};

export default TaskForm;
