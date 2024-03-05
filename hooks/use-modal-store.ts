import { MediaFile, PostWithData } from "@/type";
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
  onOpen: (index: number, medias: MediaFile[]) => void;
  onClose: () => void;
  medias: MediaFile[];
  startIndex: null | number;
}

export const useImageCarouselModal = create<ImageCarouselModalStore>((set) => ({
  isOpen: false,
  startIndex: null,
  onOpen: (index, medias) =>
    set({ isOpen: true, startIndex: index, medias: medias }),
  onClose: () => set({ isOpen: false, medias: [], startIndex: null }),
  medias: [],
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
