import { create } from "zustand";

interface IsAddingFiles {
  isAddingFiles: boolean;
  onAdd: () => void;
  onCancel: () => void;
}

export const useIsAddingFiles = create<IsAddingFiles>((set) => ({
  isAddingFiles: false,
  onAdd: () => set({ isAddingFiles: true }),
  onCancel: () => set({ isAddingFiles: false }),
}));
