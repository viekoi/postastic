"use client";
import React from "react";
import { QueryKey} from "@tanstack/react-query";
import EditForm from "./edit-form";
import { CornerDownRight } from "lucide-react";
import { useEditMediaDrafts } from "@/hooks/use-edit-media-drafts-store";
import { MediaWithData } from "@/type";

interface EditProps {
  id: string;
  queryKeyPreflix: QueryKey;
  media: MediaWithData;
}

const Edit = ({ id, queryKeyPreflix, media }: EditProps) => {
  const { getDraftByMediaId } = useEditMediaDrafts();
  const draft = getDraftByMediaId(id);

  return (
    <div>
      <div className="flex gap-x-1 items-center p-4">
        <CornerDownRight />
        <div className="pt-2">Editing {media.type}</div>
      </div>
      <EditForm
        defaultValues={
          draft ? { draft: draft, default: media } : { default: media }
        }
        queryKeyPreflix={queryKeyPreflix}
      />
    </div>
  );
};

export default Edit;
