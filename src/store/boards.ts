import { Board } from "@prisma/client";
import create from "zustand";

interface BoardState {
  activeBoard: Board | null;
  setActiveBoard: (board: Board | undefined) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
  activeBoard: null,
  setActiveBoard: (board) => set((state) => ({ activeBoard: board })),
}));
