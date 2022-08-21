import create from "zustand";

interface State {
  width: number;
  setWidth: (width: number) => void;
}

export const useStore = create<State>((set) => ({
  width: 0,
  setWidth: (width) => set((state) => ({ width })),
}));
