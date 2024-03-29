import { create } from "zustand";
import * as z from "zod";
import { EditMediaShcema } from "@/schemas";

interface EditMediaDraftsStore {
  mediaDrafts: z.infer<typeof EditMediaShcema>[];
  setDrafts: (draft: z.infer<typeof EditMediaShcema>) => void;
  removeDraft: (id: string) => void;
  getDraftByMediaId: (
    id: string
  ) => z.infer<typeof EditMediaShcema> | undefined;
}

export const useEditMediaDrafts = create<EditMediaDraftsStore>((set, get) => ({
  mediaDrafts: [],
  setDrafts: (draft: z.infer<typeof EditMediaShcema>) => {
    set((state) => {
      const existingDraftIndex = state.mediaDrafts.findIndex(
        (d) => d.id === draft.id
      );

      if (existingDraftIndex !== -1) {
        const updatedDrafts = [...state.mediaDrafts];
        updatedDrafts[existingDraftIndex] = draft;
        return { mediaDrafts: updatedDrafts };
      } else {
        if (
          !draft.attachments.length &&
          !draft.content.length &&
          draft.privacyType === "public"
        ) {
          return { mediaDrafts: state.mediaDrafts };
        } else {
          return { mediaDrafts: [...state.mediaDrafts, draft] };
        }
      }
    });
  },
  removeDraft: (id: string) => {
    set((state) => {
      const prevState = [...state.mediaDrafts];
      const updatedDrafts = prevState.filter((d) => d.id !== id);
      return { mediaDrafts: updatedDrafts };
    });
  },
  getDraftByMediaId: (id: string) => {
    const drafts = get().mediaDrafts;
    return drafts.find((draft) => draft.id === id);
  },
}));
