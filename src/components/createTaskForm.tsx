import useCreateTask from "../hooks/useCreateTask";
import { useColumnsStore } from "../store/columns";
import TaskForm from "./taskForm";

interface CreateTaskFormProps {
  setIsModalOpen: (x: boolean) => void;
}

const CreateTaskForm = ({ setIsModalOpen }: CreateTaskFormProps) => {
  const columns = useColumnsStore((state) => state.columns);
  const {
    onSubmit,
    register,
    errors,
    fields,
    handleNewSubtaskButton,
    handleRemoveCrossButton,
    handleMoveDownButton,
    handleMoveUpButton,
  } = useCreateTask({
    setIsModalOpen,
  });

  if (columns) {
    return (
      <TaskForm
        task={{
          id: "",
          title: "",
          description: null,
          status: "",
          order: 0,
          columnId: "",
        }}
        {...{
          columns,
          onSubmit,
          register,
          errors,
          fields,
          handleRemoveCrossButton,
          handleNewSubtaskButton,
          handleMoveDownButton,
          handleMoveUpButton,
        }}
      />
    );
  } else return <></>;
};

export default CreateTaskForm;
