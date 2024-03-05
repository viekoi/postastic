import { MediaFile } from "@/type";
import { create } from "zustand";

interface UploadFilesStore {
  files: (MediaFile & { error: boolean })[];
  addFile: (newFile: MediaFile & { error: boolean }) => void;
  setFiles: (newFile: (MediaFile & { error: boolean })[]) => void;
}

export const useUploadFilesStore = create<UploadFilesStore>((set) => ({
  files: [],
  addFile: (newFile) => set((state) => ({ files: [...state.files, newFile] })),
  setFiles: (newFiles) => set({ files: newFiles }),
}));
