import { AttachmentFile, MediaWithData } from "@/type";
import { QueryKey } from "@tanstack/react-query";
import { create } from "zustand";

interface NewPostModalStore {
  isOpen: boolean;
  onOpen: (postId?: string) => void;
  onClose: () => void;
  postId: string | null;
}

export const useNewPostModal = create<NewPostModalStore>((set) => ({
  postId: null,
  isOpen: false,
  onOpen: (postId?: string) => set({ isOpen: true, postId: postId }),
  onClose: () => set({ isOpen: false, postId: null }),
}));

interface EditMediaModal {
  isOpen: boolean;
  onOpen: (id: string, queryKey: QueryKey) => void;
  onClose: () => void;
  id: string | null;
  queryKey: QueryKey | null;
}
export const useEditMediaModal = create<EditMediaModal>((set) => ({
  id: null,
  queryKey: null,
  isOpen: false,
  onOpen: (id: string, queryKey: QueryKey) =>
    set({ isOpen: true, id: id, queryKey: queryKey }),
  onClose: () => set({ isOpen: false, id: null, queryKey: null }),
}));

interface NewReplyModalStore {
  isOpen: boolean;
  postId: null | string;
  parentId: null | string;
  parentUserName: string;
  onOpen: (postId: string, parentId: string, parentUserName: string) => void;
  onClose: () => void;
}

export const useNewReplyModal = create<NewReplyModalStore>((set) => ({
  isOpen: false,
  postId: null,
  parentId: null,
  parentUserName: "",
  onOpen: (postId: string, parentId: string, parentUserName: string) =>
    set({
      isOpen: true,
      postId: postId,
      parentId: parentId,
      parentUserName: parentUserName,
    }),
  onClose: () => set({ isOpen: false, postId: null, parentId: null }),
}));

interface ImageCarouselModalStore {
  isOpen: boolean;
  onOpen: (index: number, attachments: AttachmentFile[]) => void;
  onClose: () => void;
  attachments: AttachmentFile[];
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
}));

interface useAlertModal {
  isOpen: boolean;
  isPending: boolean;
  onConfirm: () => void;
  setIsPending: (isPending: boolean) => void;
  onOpen: (onConfirm: () => void) => void;
  onClose: () => void;
}

export const useAlertModal = create<useAlertModal>((set) => ({
  isOpen: false,
  isPending: false,
  onConfirm: () => {},
  setIsPending: (isPending: boolean) => set({ isPending: isPending }),
  onOpen: (onConfirm: () => void) =>
    set({ isOpen: true, onConfirm: onConfirm }),
  onClose: () => set({ isOpen: false, isPending: false, onConfirm: () => {} }),
}));
