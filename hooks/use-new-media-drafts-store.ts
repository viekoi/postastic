import { create } from "zustand";
import * as z from "zod";
import { NewMediaSchema } from "@/schemas";

interface NewMediaDraftsStore {
  mediaDrafts: z.infer<typeof NewMediaSchema>[];
  setDrafts: (draft: z.infer<typeof NewMediaSchema>) => void;
  removeDraft: (parentId?: string | null) => void;
  getDraftByParentId: (
    parentId?: string | null
  ) => z.infer<typeof NewMediaSchema> | undefined;
}

export const useNewMediaDrafts = create<NewMediaDraftsStore>((set, get) => ({
  mediaDrafts: [],
  setDrafts: (draft: z.infer<typeof NewMediaSchema>) => {
    set((state) => {
      const existingDraftIndex = state.mediaDrafts.findIndex(
        (d) => d.parentId === draft.parentId
      );

      if (existingDraftIndex !== -1) {
        if (
          !draft.attachments.length &&
          !draft.content.length &&
          draft.privacyType === "public"
        ) {
          const updatedDrafts = [...state.mediaDrafts].filter(
            (d) => d.parentId !== draft.parentId
          );
          return { mediaDrafts: updatedDrafts };
        }
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
  removeDraft: (parentId?: string | null) => {
    set((state) => {
      const prevState = [...state.mediaDrafts];
      const updatedDrafts = prevState.filter((d) => d.parentId !== parentId);
      return { mediaDrafts: updatedDrafts };
    });
  },
  getDraftByParentId: (parentId?: string | null) => {
    const drafts = get().mediaDrafts;
    return drafts.find((draft) => draft.parentId === parentId);
  },
}));
