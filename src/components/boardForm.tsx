import { useAutoAnimate } from "@formkit/auto-animate/react";
import useCreateBoard from "../hooks/useCreateBoard";
import useEditBoard from "../hooks/useEditBoard";
import { useStore } from "../store/boards";
import Button from "./button";
import DeleteModalInsert from "./deleteModalInsert";
import Modal from "./modal";
import UpDownArrows from "./upDownArrows";
interface BoardFormProps {
  setIsModalOpen: (x: boolean) => void;
  isEditMode?: boolean;
}

const BoardForm = ({ setIsModalOpen, isEditMode }: BoardFormProps) => {
  const activeBoard = useStore((state) => state.activeBoard);
  const [parent] = useAutoAnimate<HTMLFormElement>();

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

  const {
    onEditSubmit,
    registerEdit,
    errorsEdit,
    fieldsEdit,
    handleNewColumnButtonEdit,
    handleRemoveCrossButtonEdit,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    handleDeleteColumnButton,
    isLoading,
    handleMoveDownButton,
    handleMoveUpButton,
  } = useEditBoard({
    setIsModalOpen,
  });

  const onSubmit = isEditMode ? onEditSubmit : onCreateSubmit;
  const register = isEditMode ? registerEdit : registerCreate;
  const errors = isEditMode ? errorsEdit : errorsCreate;
  const fields = isEditMode ? fieldsEdit : fieldsCreate;
  const handleRemoveCrossButton = isEditMode ? handleRemoveCrossButtonEdit : handleRemoveCrossButtonCreate;
  const handleNewColumnButton = isEditMode ? handleNewColumnButtonEdit : handleNewColumnButtonCreate;

  return (
    <>
      {isEditMode && (
        <Modal setIsModalOpen={setIsDeleteModalOpen} isModalOpen={isDeleteModalOpen}>
          <DeleteModalInsert
            column
            setIsDeleteModalOpen={setIsDeleteModalOpen}
            handleDeleteButton={handleDeleteColumnButton}
          />
        </Modal>
      )}
      <form ref={parent} onSubmit={onSubmit} className="dark:bg-grey-very-dark p-8 rounded-sm">
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
          } hover:border-purple rounded-sm mb-5 dark:bg-grey-very-dark`}
        />
        <label className="text-grey-medium text-xs block mb-2">Board Columns</label>
        {fields.map((f, i, arr: any) => {
          return (
            <div key={f.id}>
              <div className="relative flex justify-between items-center">
                <input
                  {...register(`columns.${i}.name` as const, { required: true })}
                  placeholder="Column name..."
                  type="text"
                  id="column"
                  className={`w-[85%] py-2 px-4 pr-16 border-[1px] ${
                    errors?.[`columns`]?.[`${i}`]
                      ? "border-red animate-shake"
                      : "border-lines-light dark:border-lines-dark"
                  } hover:border-purple rounded-sm mb-2 dark:bg-grey-very-dark`}
                />
                <UpDownArrows {...{ arr, i, handleMoveDownButton, handleMoveUpButton }} />
                <input
                  {...register(`columns.${i}.color` as const, { required: true })}
                  type="color"
                  defaultValue={"#FF9898"}
                  className={`w-6 h-6 mb-2`}
                />
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
              {errors.columns?.[`${i}`]?.name?.type === "custom" && (
                <p className="text-red-hover">{errors.columns?.[`${i}`]?.name?.message}</p>
              )}
            </div>
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
          isLoading={isLoading}
          styles={`mr-4 rounded-full px-6 py-3 font-bold text-white w-full ${
            isLoading ? "bg-purple-25" : "bg-purple hover:bg-purple-hover"
          }
        }`}
        >
          {isEditMode ? `Save changes` : "Create New Board"}
        </Button>
      </form>
    </>
  );
};

export default BoardForm;
