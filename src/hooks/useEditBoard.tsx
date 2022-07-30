import { Board } from "@prisma/client";
import { useState } from "react";
import { SubmitHandler, useFieldArray, useForm, UseFormSetError } from "react-hook-form";
import { useStore } from "../store";
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
  const activeBoard = useStore((state) => state.activeBoard) as Board;
  const setActiveBoard = useStore((state) => state.setActiveBoard);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);
  const utils = trpc.useContext();
  const { data: columns } = trpc.useQuery(["column.getByBoardId", { boardId: activeBoard?.id as string }]);
  const { mutateAsync: createColumn } = trpc.useMutation("column.create", {
    async onSuccess() {
      activeBoard && (await utils.invalidateQueries(["column.getByBoardId", { boardId: activeBoard.id }]));
    },
  });
  const { mutateAsync: updateColumn } = trpc.useMutation("column.update", {
    async onSuccess() {
      await utils.invalidateQueries(["column.getByBoardId", { boardId: activeBoard?.id as string }]);
    },
  });
  const { mutate: deleteColumn } = trpc.useMutation("column.delete", {
    async onSuccess() {
      await utils.invalidateQueries(["column.getByBoardId", { boardId: activeBoard?.id as string }]);
    },
  });
  const { mutateAsync: updateBoard } = trpc.useMutation("board.update", {
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
      columns,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "columns" as never,
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data);
    if (checkOnDublicates(data, setError)) {
      return;
    }

    if (activeBoard.name !== data.boardName) {
      await updateBoard({ boardName: data.boardName, boardId: activeBoard?.id });
    }

    for (let index = 0; index < data.columns.length; index++) {
      if (data.columns[index]?.id) {
        await updateColumn({
          id: data.columns[index]?.id as string,
          name: data.columns[index]?.name,
          order: index,
          color: data.columns[index]?.color,
        });
      }
    }

    if (columns && data.columns.length > columns?.length) {
      for (let index = data.columns.length - 1; index >= columns?.length; index--) {
        await createColumn({
          name: data.columns[index]?.name as string,
          boardId: activeBoard.id,
          order: index,
          color: data.columns[index]?.color as string,
        });
      }
    }

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
  };
};
export default useEditBoard;
