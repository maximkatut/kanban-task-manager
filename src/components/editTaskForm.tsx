import { Column, Task } from "@prisma/client";
import useEditTask from "../hooks/useEditTask";
import { useColumnsStore } from "../store/columns";
import TaskForm from "./taskForm";

interface EditTaskFormProps {
  task: Task;
  isEditMode?: boolean;
  setIsModalOpen: (x: boolean) => void;
}

const EditTaskForm = ({ task, setIsModalOpen, isEditMode }: EditTaskFormProps) => {
  const columns = useColumnsStore((state) => state.columns);
  const {
    onSubmit,
    register,
    errors,
    fields,
    handleNewSubtaskButton,
    handleRemoveCrossButton,
    isLoading,
    handleMoveDownButton,
    handleMoveUpButton,
  } = useEditTask({
    setIsModalOpen,
    task,
  });

  return (
    <TaskForm
      {...{
        task,
        isEditMode,
        columns: columns as Column[],
        onSubmit,
        register,
        errors,
        fields,
        handleMoveDownButton,
        handleMoveUpButton,
        handleRemoveCrossButton,
        handleNewSubtaskButton,
        isLoading,
      }}
    />
  );
};

export default EditTaskForm;
