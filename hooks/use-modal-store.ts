import { AttachmentFile, PostWithData } from "@/type";
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

interface NewReplyModalStore {
  isOpen: boolean;
  postId: null | string;
  parentId: null | string;
  onOpen: (postId: string, parentId: string) => void;
  onClose: () => void;
}

export const useNewReplyModal = create<NewReplyModalStore>((set) => ({
  isOpen: false,
  postId: null,
  parentId: null,
  onOpen: (postId: string, parentId: string) =>
    set({ isOpen: true, postId: postId, parentId: parentId }),
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
  post: PostWithData | null;
  onOpen: (post: PostWithData) => void;
  onClose: () => void;
}

export const useCommentModal = create<CommentModalStore>((set) => ({
  isOpen: false,
  post: null,
  onOpen: (post: PostWithData) => set({ isOpen: true, post: post }),
  onClose: () => set({ isOpen: false, post: null }),
}));
