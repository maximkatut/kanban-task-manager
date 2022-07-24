import useCreateBoard from "../hooks/useCreateBoard";
import useEditBoard from "../hooks/useEditBoard";
import { useStore } from "../store/index";
import Button from "./button";
interface BoardFormProps {
  setIsModalOpen: (x: boolean) => void;
  isEditMode?: boolean;
}

const BoardForm = ({ setIsModalOpen, isEditMode }: BoardFormProps) => {
  const activeBoard = useStore((state) => state.activeBoard);

  const {
    onCreateSubmit,
    registerCreate,
    errorsCreate,
    fieldsCreate,
    handleNewColumnButtonCreate,
    handleRemoveCrossButtonCreate,
  } = useCreateBoard({
    setIsModalOpen,
  });

  const { onEditSubmit, registerEdit, errorsEdit, fieldsEdit, handleNewColumnButtonEdit, handleRemoveCrossButtonEdit } =
    useEditBoard({
      setIsModalOpen,
    });

  const onSubmit = isEditMode ? onEditSubmit : onCreateSubmit;
  const register = isEditMode ? registerEdit : registerCreate;
  const errors = isEditMode ? errorsEdit : errorsCreate;
  const fields = isEditMode ? fieldsEdit : fieldsCreate;
  const handleRemoveCrossButton = isEditMode ? handleRemoveCrossButtonEdit : handleRemoveCrossButtonCreate;
  const handleNewColumnButton = isEditMode ? handleNewColumnButtonEdit : handleNewColumnButtonCreate;

  return (
    <form onSubmit={onSubmit} className="dark:bg-grey-very-dark p-8 rounded-sm">
      <h3 className="text-lg mb-5 font-bold">{isEditMode ? `Edit ${activeBoard?.name}` : "Add New Board"}</h3>
      <label htmlFor="name" className="text-grey-medium text-xs block mb-2">
        {isEditMode ? activeBoard?.name : "Board Name"}
      </label>
      <input
        {...register("boardName", { required: true })}
        placeholder="e.g. Web Design"
        type="text"
        id="name"
        className={`w-full py-2 px-4 border-[1px] ${
          errors.boardName ? "border-red animate-shake" : "border-lines-light dark:border-lines-dark"
        } rounded-sm mb-5 dark:bg-grey-very-dark`}
      />
      <label className="text-grey-medium text-xs block mb-2">Board Columns</label>
      {fields.map((f, i) => {
        return (
          <>
            <div className="flex justify-between items-center" key={f.id}>
              <input
                {...register(`column.${i}.name` as const, { required: true })}
                placeholder="Column name..."
                type="text"
                id="column"
                className={`w-[85%] py-2 px-4 border-[1px] ${
                  errors?.[`column`]?.[`${i}`]
                    ? "border-red animate-shake"
                    : "border-lines-light dark:border-lines-dark"
                } rounded-sm mb-2 dark:bg-grey-very-dark`}
              />
              <input
                {...register(`column.${i}.color` as const, { required: true })}
                type="color"
                defaultValue={"#FF9898"}
                className={`w-6 h-6 mb-2`}
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
            {errors.column?.[`${i}`]?.name?.type === "custom" && (
              <p className="text-red-hover">{errors.column?.[`${i}`]?.name?.message}</p>
            )}
          </>
        );
      })}
      <Button
        onClick={handleNewColumnButton}
        styles="mr-4 rounded-full px-6 py-3 font-bold text-purple bg-purple-10 hover:bg-purple-25 w-full mb-5"
      >
        + Add New Column
      </Button>
      <Button
        type="submit"
        styles="mr-4 rounded-full px-6 py-3 font-bold text-white bg-purple hover:bg-purple-hover w-full"
      >
        {isEditMode ? `Save changes` : "Create New Board"}
      </Button>
    </form>
  );
};

export default BoardForm;
