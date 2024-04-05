import { UploadFile, MediaWithData } from "@/type";
import { QueryKey } from "@tanstack/react-query";
import { create } from "zustand";

interface EditMediaModal {
  media: MediaWithData | null;
  isOpen: boolean;
  onOpen: (id: string, queryKeyPreflix: QueryKey, media: MediaWithData) => void;
  onClose: () => void;
  id: string | null;
  queryKeyPreflix: QueryKey | null;
}
export const useEditMediaModal = create<EditMediaModal>((set) => ({
  media: null,
  id: null,
  queryKeyPreflix: null,
  isOpen: false,
  onOpen: (id: string, queryKeyPreflix: QueryKey, media: MediaWithData) =>
    set({
      isOpen: true,
      id: id,
      queryKeyPreflix: queryKeyPreflix,
      media: media,
    }),
  onClose: () =>
    set({ isOpen: false, id: null, queryKeyPreflix: null, media: null }),
}));

interface NewMediaModalStore {
  isOpen: boolean;
  media: MediaWithData | null;
  onOpen: (media: MediaWithData | null) => void;
  onClose: () => void;
}

export const useNewMediaModal = create<NewMediaModalStore>((set) => ({
  isOpen: false,
  media: null,
  isDraft: false,
  onOpen: (media: MediaWithData | null) =>
    set({
      isOpen: true,
      media: media,
    }),
  onClose: () => set({ isOpen: false, media: null }),
}));

interface ImageCarouselModalStore {
  isOpen: boolean;
  onOpen: (index: number, attachments: UploadFile[]) => void;
  onClose: () => void;
  attachments: UploadFile[];
  startIndex: null | number;
}

export const useImageCarouselModal = create<ImageCarouselModalStore>((set) => ({
  isOpen: false,
  startIndex: null,
  onOpen: (index, attachments) =>
    set({ isOpen: true, startIndex: index, attachments: attachments }),
  onClose: () => set({ isOpen: false, attachments: [], startIndex: null }),
  attachments: [],
}));

interface CommentModalStore {
  isOpen: boolean;
  post: MediaWithData | null;
  onOpen: (post: MediaWithData) => void;
  onClose: () => void;
}

export const useCommentModal = create<CommentModalStore>((set) => ({
  isOpen: false,
  post: null,
  onOpen: (post: MediaWithData) => set({ isOpen: true, post: post }),
  onClose: () => set({ isOpen: false, post: null }),
  queryFn: null,
}));

interface AlertModalStore {
  isOpen: boolean;
  isPending: boolean;
  onConfirm: () => void;
  setIsPending: (isPending: boolean) => void;
  onOpen: (onConfirm: () => void) => void;
  onClose: () => void;
}

export const useAlertModal = create<AlertModalStore>((set) => ({
  isOpen: false,
  isPending: false,
  onConfirm: () => {},
  setIsPending: (isPending: boolean) => set({ isPending: isPending }),
  onOpen: (onConfirm: () => void) =>
    set({ isOpen: true, onConfirm: onConfirm }),
  onClose: () => set({ isOpen: false, isPending: false, onConfirm: () => {} }),
}));

interface MobileNavSideModal {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useMobileNavSideModal = create<MobileNavSideModal>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
