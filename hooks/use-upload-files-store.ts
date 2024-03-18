import { AttachmentFile } from "@/type";
import { create } from "zustand";

interface UploadFilesStore {
  files: (AttachmentFile & { error: boolean })[];
  addFile: (newFile: AttachmentFile & { error: boolean }) => void;
  setFiles: (newFile: (AttachmentFile & { error: boolean })[]) => void;
}

export const useUploadFilesStore = create<UploadFilesStore>((set) => ({
  files: [],
  addFile: (newFile) => set((state) => ({ files: [...state.files, newFile] })),
  setFiles: (newFiles) => set({ files: newFiles }),
}));
