import { Board, Task } from "@prisma/client";
import { useState } from "react";
import { SubmitHandler, useFieldArray, useForm, UseFormSetError } from "react-hook-form";
import { useBoardStore } from "../store/boards";
import { useColumnsStore } from "../store/columns";
import { findDuplicates } from "../utils/index";
import { trpc } from "../utils/trpc";
import { Inputs, UseBoardProps } from "./useCreateBoard";

export const checkOnDublicates = (data: Inputs, setError: UseFormSetError<Inputs>) => {
  const columnNames = data.columns.map((c) => c.name);
  const dublicates = findDuplicates(columnNames);
  const inputIndex = columnNames.findIndex((it) => it === dublicates[0]);
  if (dublicates.length > 0) {
    setError(`columns.${inputIndex}.name`, {
      type: "custom",
      message: "Two or more columns can't be with the same name",
    });
    return true;
  }
};

const useEditBoard = ({ setIsModalOpen }: UseBoardProps) => {
  const activeBoard = useBoardStore((state) => state.activeBoard) as Board;
  const setActiveBoard = useBoardStore((state) => state.setActiveBoard);
  const setColumns = useColumnsStore((state) => state.setColumns);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);
  const utils = trpc.useContext();
  const columns = useColumnsStore((state) => state.columns);
  const { mutateAsync: updateTask } = trpc.useMutation("task.update");
  const { mutateAsync: createColumn, isLoading: isLoadingCreate } = trpc.useMutation("column.create", {
    async onSuccess() {
      activeBoard && (await utils.invalidateQueries(["column.getByBoardId", { boardId: activeBoard.id }]));
    },
  });
  const { mutateAsync: updateColumn, isLoading: isLoadingUpdate } = trpc.useMutation("column.update", {
    async onSuccess(data) {
      await utils.invalidateQueries(["column.getByBoardId", { boardId: activeBoard?.id as string }]);
      const tasks = await utils.fetchQuery(["task.getByColumnId", { columnId: data.id }]);
      for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i] as Task;
        await updateTask({ id: task.id, status: data.name });
      }
    },
  });
  const { mutate: deleteColumn } = trpc.useMutation("column.delete", {
    async onSuccess() {
      await utils.invalidateQueries(["column.getByBoardId", { boardId: activeBoard?.id as string }]);
    },
  });
  const { mutateAsync: updateBoard, isLoading: isLoadingUpdateBoard } = trpc.useMutation("board.update", {
    async onSuccess(data) {
      await utils.invalidateQueries(["board.getAll"]);
      setActiveBoard(data);
    },
  });

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      boardName: activeBoard?.name,
      columns: columns?.sort((a, b) => a.order - b.order),
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "columns" as never,
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (checkOnDublicates(data, setError)) {
      return;
    }

    if (activeBoard.name !== data.boardName) {
      await updateBoard({ boardName: data.boardName, boardId: activeBoard?.id });
    }

    for (let index = 0; index < data.columns.length; index++) {
      const column = data.columns[index];
      if (column?.id) {
        await updateColumn({
          id: data.columns[index]?.id as string,
          name: data.columns[index]?.name,
          order: index,
          color: data.columns[index]?.color,
        });
      } else if (column) {
        await createColumn({
          name: column.name,
          boardId: activeBoard.id,
          order: index,
          color: column.color,
        });
      }
    }

    const newDataColumns = data.columns.map((c, i) => {
      c.order = i;
      return c;
    });
    setColumns(newDataColumns);
    setIsModalOpen(false);
  };

  const handleRemoveCrossButton = (i: number) => {
    if (columns && columns[i]) {
      setIsDeleteModalOpen(true);
      setIndex(i);
    } else {
      remove(i);
    }
  };

  const handleNewColumnButton = () => {
    append({ name: "" });
  };

  const handleMoveUpButton = (i: number) => {
    if (i > 0) {
      move(i, i - 1);
    }
  };

  const handleMoveDownButton = (i: number, arr: []) => {
    if (arr.length - 1 > i) {
      move(i, i + 1);
    }
  };

  const handleDeleteColumnButton = () => {
    const i = index;
    columns && deleteColumn({ id: columns[i]?.id as string });
    setIsDeleteModalOpen(false);
    remove(i);
  };

  return {
    onEditSubmit: handleSubmit(onSubmit),
    fieldsEdit: fields,
    handleRemoveCrossButtonEdit: handleRemoveCrossButton,
    handleNewColumnButtonEdit: handleNewColumnButton,
    errorsEdit: errors,
    registerEdit: register,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    handleDeleteColumnButton,
    handleMoveUpButton,
    handleMoveDownButton,
    isLoading: isLoadingCreate || isLoadingUpdate || isLoadingUpdateBoard,
  };
};
export default useEditBoard;
