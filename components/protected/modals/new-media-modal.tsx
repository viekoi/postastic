"use client";
import React from "react";
import Modal from "./modal";
import { useNewMediaModal } from "@/hooks/use-modal-store";

import { useIsAddingFiles } from "@/hooks/use-is-adding-files";
import useIsMobile from "@/hooks/use-is-mobile";
import DrawerModal from "../drawers/drawer";
import NewMediaForm from "../forms/media/new/new-media-form";
import { QUERY_KEYS } from "@/queries/react-query/query-keys";
import { useNewMediaDrafts } from "@/hooks/use-new-media-drafts-store";


const NewMediaModal = () => {
  const { isOpen, onClose, media } = useNewMediaModal();
  const { onCancel } = useIsAddingFiles();
  const {getDraftByParentId,mediaDrafts} = useNewMediaDrafts()
  const isMobile = useIsMobile(1024);

  if (media) {
    const parentId = media.type === "comment" ? media.id : media.parentId;
    const draft = getDraftByParentId(parentId)
    const currentListQueryKey =
      media.type === "comment"
        ? [QUERY_KEYS.GET_INFINITE_MEDIAS, media.id]
        : [
            QUERY_KEYS.GET_INFINITE_MEDIAS,
            media.parentId,
          ];

    const parentListQueryKey = [
      QUERY_KEYS.GET_INFINITE_MEDIAS,
      media.postId,
    ];

    if (isMobile) {
      return (
        <DrawerModal
          className=" lg:max-h-[85vh] lg:h-auto  lg:max-w-[800px] z-[1000] "
          isOpen={isOpen}
          onClose={() => {
            onClose();
            onCancel();
          }}
        >
          <div className="overflow-x-hidden over-y-auto custom-scrollbar">
            <NewMediaForm
              type={"reply"}
              parentListQueryKey={parentListQueryKey}
              currentListQueryKey={currentListQueryKey}
              postId={media.postId}
              parentId={parentId}
              defaultValues={draft}
            />
          </div>
        </DrawerModal>
      );
    }
    return (
      <Modal
        className=" lg:max-h-[85vh] lg:h-auto  lg:max-w-[800px] z-[1000] "
        isOpen={isOpen}
        onClose={() => {
          onClose();
          onCancel();
        }}
      >
        <div className="overflow-x-hidden over-y-auto custom-scrollbar">
          <NewMediaForm
            type={"reply"}
            parentListQueryKey={parentListQueryKey}
            currentListQueryKey={currentListQueryKey}
            postId={media.postId}
            parentId={parentId}
            defaultValues={draft}
          />
        </div>
      </Modal>
    );
  } else {
    const draft = getDraftByParentId(null)
    if (isMobile) {
      return (
        <DrawerModal
          className=" lg:max-h-[85vh] lg:h-auto  lg:max-w-[800px] "
          isOpen={isOpen}
          onClose={() => {
            onClose();
            onCancel();
          }}
        >
          <div className="overflow-x-hidden over-y-auto custom-scrollbar">
            <NewMediaForm
              type={"post"}
              currentListQueryKey={[QUERY_KEYS.GET_INFINITE_MEDIAS,null]}
              postId={null}
              parentId={null}
              defaultValues={draft}
            />
          </div>
        </DrawerModal>
      );
    }
    return (
      <Modal
        className=" lg:max-h-[85vh] lg:h-auto  lg:max-w-[800px] "
        isOpen={isOpen}
        onClose={() => {
          onClose();
          onCancel();
        }}
      >
        <div className="overflow-x-hidden over-y-auto custom-scrollbar">
          <NewMediaForm
            type={"post"}
            currentListQueryKey={[QUERY_KEYS.GET_INFINITE_MEDIAS,null]}
            postId={null}
            parentId={null}
            defaultValues={draft}
          />
        </div>
      </Modal>
    );
  }
};

export default NewMediaModal;
