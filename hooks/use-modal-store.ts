import { AttachmentFile, PostWithData } from "@/type";
import { create } from "zustand";

interface baseModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useNewPostModal = create<baseModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
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

interface ReplyModalStore {
  isOpen: boolean;
  post: PostWithData | null;
  onOpen: (post: PostWithData) => void;
  onClose: () => void;
}

export const useReplyModal = create<ReplyModalStore>((set) => ({
  isOpen: false,
  post: null,
  onOpen: (post: PostWithData) => set({ isOpen: true, post: post }),
  onClose: () => set({ isOpen: false, post: null }),
}));
