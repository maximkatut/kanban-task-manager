import { Board, Task } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";
import { DragDropContext, OnDragEndResponder } from "react-beautiful-dnd";
import { SubmitHandler, useForm } from "react-hook-form";
import { useColumnsStore } from "../store/columns";
import { useTasksStore } from "../store/tasks";
import { COLORS } from "../utils/const";
import { trpc } from "../utils/trpc";
import Button from "./button";
import ColumnComponent from "./columnComponent";
import Loader from "./loader";
import Modal from "./modal";
interface BoardProps {
  board: Board;
}

interface Inputs {
  columnName: string;
  color: string;
}

const BoardComponent = ({ board }: BoardProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const [isShowStyles, setIsShowStyles] = useState<boolean>(false);
  const columns = useColumnsStore((state) => state.columns);
  const setColumns = useColumnsStore((state) => state.setColumns);
  const addColumn = useColumnsStore((state) => state.addColumn);
  const tasks = useTasksStore((state) => state.tasks);
  const setTasks = useTasksStore((state) => state.setTasks);
  const setTask = useTasksStore((state) => state.setTask);
  const utils = trpc.useContext();
  const { mutateAsync: createColumn, isLoading: createColumnIsLoading } = trpc.useMutation("column.create");
  const { mutateAsync: updateTask } = trpc.useMutation("task.update");
  const {
    register,
    formState: { errors },
    setError,
    handleSubmit,
    reset,
  } = useForm<Inputs>({ defaultValues: { columnName: "", color: COLORS[0] } });

  const handleNewColClick = () => {
    setIsModalOpen(true);
  };

  const handleCancelButton = () => {
    setIsModalOpen(false);
    reset();
  };

  const fetchData = useCallback(async () => {
    setIsLoadingData(true);
    const columnsData = await utils.fetchQuery(["column.getByBoardId", { boardId: board.id }]);
    const columnsDataIds = columnsData.map((c) => c.id);
    const tasks = await utils.fetchQuery(["task.getAll", { columnsDataIds }]);
    setColumns(columnsData.sort((a, b) => a.order - b.order));
    setTasks(tasks);
    setIsLoadingData(false);
  }, [board.id, setColumns, setTasks, utils]);

  const updateTasks = useCallback(async () => {
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i] as Task;
      await updateTask(task);
    }
  }, [tasks, updateTask]);

  useEffect(() => {
    fetchData();
  }, [setTasks, setColumns, fetchData]);

  useEffect(() => {
    updateTasks();
  }, [tasks, updateTasks]);

  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    const columnNames = columns?.map((c) => c.name.toLowerCase()) as string[];
    if (columnNames.includes(data.columnName.toLowerCase())) {
      setError("columnName", { type: "custom", message: "This name already exists" }, { shouldFocus: true });
      return;
    } else {
      await createColumn(
        {
          name: data.columnName,
          boardId: board.id,
          order: columns?.length as number,
          color: data.color,
        },
        {
          onSuccess(data) {
            addColumn(data);
          },
        }
      );
      setIsModalOpen(false);
      reset();
    }
  };

  const onDragStart = () => {
    setIsShowStyles(true);
  };
  const onDragEnd: OnDragEndResponder = async (result) => {
    const { destination, source, draggableId } = result;
    setIsShowStyles(false);
    if (!destination) {
      return;
    }
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }
    const column = columns?.find((c) => c.id === destination.droppableId);
    setTask(draggableId, destination, source, column?.name);
  };

  return (
    <>
      <Modal {...{ isModalOpen, setIsModalOpen }}>
        <form onSubmit={handleSubmit(onSubmit)} className="dark:bg-grey-very-dark p-8 rounded-sm">
          <h3 className="text-lg mb-5 font-bold">Add New Column</h3>
          <div className="flex">
            <input
              {...register("columnName", { required: true })}
              placeholder="e.g. Has To Be Done"
              type="text"
              className={`w-full py-2 px-4 border-[1px] ${
                errors.columnName ? "border-red animate-shake" : "border-lines-light dark:border-lines-dark"
              } rounded-sm mb-5 dark:bg-grey-very-dark`}
            />
            <input {...register("color")} type="color" className="w-6 h-6 ml-4 mt-2" />
          </div>
          {errors.columnName?.message && <p className="text-red-hover -mt-5">{errors.columnName?.message}</p>}
          <div className="flex justify-between">
            <Button isLoading={createColumnIsLoading} type="submit">
              Add
            </Button>
            <Button onClick={handleCancelButton}>Cancel</Button>
          </div>
        </form>
      </Modal>
      {isLoadingData ? (
        <Loader />
      ) : (
        <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
          <ul className="min-h-[calc(100vh-80rem)] p-5 flex h-full">
            {columns
              ?.sort((a, b) => a.order - b.order)
              .map((c) => {
                return (
                  <ColumnComponent
                    isShowStyles={isShowStyles}
                    key={c.id}
                    column={c}
                    tasks={tasks?.filter((t) => t.columnId === c.id)}
                  />
                );
              })}
            {columns?.length === 0 ? (
              <div className="mx-auto text-base flex flex-col my-auto">
                <p className="text-grey-medium mb-5">This board is empty. Create a new column to get started.</p>
                <Button
                  styles="mx-auto rounded-full px-6 py-3 text-white bg-purple hover:bg-purple-hover w-60"
                  onClick={handleNewColClick}
                >
                  + Add New Column
                </Button>
              </div>
            ) : (
              <li
                onClick={handleNewColClick}
                className="group w-[260px] h-[calc(100vh-200px)] mt-[43px] mb-[19px] rounded-lg bg-grey-create dark:bg-grey-create-dark hover:bg-purple-10 flex flex-col justify-center items-center cursor-pointer"
              >
                <p className="group-hover:text-purple font-bold text-lg cursor-pointer">+ New Column</p>
              </li>
            )}
          </ul>
        </DragDropContext>
      )}
    </>
  );
};

export default BoardComponent;
