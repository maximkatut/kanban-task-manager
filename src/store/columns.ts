import { Column } from "@prisma/client";
import create from "zustand";

interface ColumnsState {
  columns: Column[] | null;
  addColumn: (column: Column) => void;
  setColumns: (columns: Column[] | undefined) => void;
}

export const useColumnsStore = create<ColumnsState>((set) => ({
  columns: null,
  addColumn: (column) =>
    set((state) => {
      const columns = state.columns?.slice();
      columns?.push(column);
      return { columns };
    }),
  setColumns: (columns) => set((state) => ({ columns })),
}));
