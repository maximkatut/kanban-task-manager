import { Board } from "@prisma/client";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { useStore } from "../store";
import { findDuplicates } from "../utils/index";
import { trpc } from "../utils/trpc";
import { Inputs, UseBoardProps } from "./useCreateBoard";

interface columnData {
  order: number;
  id: string;
  name: string;
  color: string;
}

const useEditBoard = ({ setIsModalOpen }: UseBoardProps) => {
  const activeBoard = useStore((state) => state.activeBoard) as Board;
  const setActiveBoard = useStore((state) => state.setActiveBoard);
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

  const columnsNameArr = columns?.sort((a, b) => a.order - b.order).map((c) => ({ name: c.name, color: c.color }));

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      boardName: activeBoard?.name,
      column: columnsNameArr,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "column" as never,
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    let columnsNewArray: columnData[] = [];
    const columnNames = data.column.map((c) => c.name);
    const dublicates = findDuplicates(columnNames);
    const inputIndex = columnNames.findIndex((it) => it === dublicates[0]);
    if (dublicates.length > 0) {
      setError(`column.${inputIndex}.name`, {
        type: "custom",
        message: "Two or more columns can't be with the same name",
      });
      return;
    }

    if (activeBoard.name !== data.boardName) {
      await updateBoard({ boardName: data.boardName, boardId: activeBoard?.id });
    }
    data.column.forEach((newColumn, newIndex) => {
      columns?.forEach((oldColumn, oldIndex) => {
        if (newIndex === oldIndex) {
          if (newColumn.name === oldColumn.name && newColumn.color === oldColumn.color) {
            return;
          }
          columnsNewArray.push({
            name: newColumn.name,
            order: newIndex,
            id: columns[oldIndex]?.id as string,
            color: newColumn.color,
          });
        }
      });
    });

    for (let column of columnsNewArray) {
      await updateColumn(column);
    }

    if (columns && data.column.length > columns?.length) {
      const delta = data.column.length - columns?.length;
      for (let index = data.column.length - 1; index >= data.column.length - delta; index--) {
        await createColumn({
          name: data.column[index]?.name as string,
          boardId: activeBoard.id,
          order: index,
          color: data.column[index]?.color as string,
        });
      }
    }

    setIsModalOpen(false);
  };

  const handleRemoveCrossButton = (i: number) => {
    remove(i);
    columns && deleteColumn({ id: columns[i]?.id as string });
  };

  const handleNewColumnButton = () => {
    append({ name: "" });
  };

  return {
    onEditSubmit: handleSubmit(onSubmit),
    fieldsEdit: fields,
    handleRemoveCrossButtonEdit: handleRemoveCrossButton,
    handleNewColumnButtonEdit: handleNewColumnButton,
    errorsEdit: errors,
    registerEdit: register,
  };
};
export default useEditBoard;
