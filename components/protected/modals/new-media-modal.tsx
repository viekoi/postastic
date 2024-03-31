"use client";
import React from "react";
import Modal from "./modal";
import { useNewMediaModal } from "@/hooks/use-modal-store";

import { useIsAddingFiles } from "@/hooks/use-is-adding-files";
import DrawerModal from "../drawers/drawer";
import NewMediaForm from "../forms/media/new/new-media-form";
import { QUERY_KEYS_PREFLIX } from "@/queries/react-query/query-keys";
import { useNewMediaDrafts } from "@/hooks/use-new-media-drafts-store";
import { useIsMobile } from "@/providers/is-mobile-provider";


const NewMediaModal = () => {
  const { isOpen, onClose, media } = useNewMediaModal();
  const { onCancel } = useIsAddingFiles();
  const { getDraftByParentId } = useNewMediaDrafts();
  const { isMobile } = useIsMobile();


  if (media) {
    const parentId = media.type === "comment" ? media.id : media.parentId;
    const draft = getDraftByParentId(parentId);

    const currentListQueryKey = [
      QUERY_KEYS_PREFLIX.GET_INFINITE_MEDIAS,
      "reply",
      { parentId: parentId },
    ];

    const parentListPreflix = [
      QUERY_KEYS_PREFLIX.GET_INFINITE_MEDIAS,
      "comment",
      { parentId: media.postId },
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
              parentListPreflix={parentListPreflix}
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
            parentListPreflix={parentListPreflix}
            currentListQueryKey={currentListQueryKey}
            postId={media.postId}
            parentId={parentId}
            defaultValues={draft}
          />
        </div>
      </Modal>
    );
  } else {
    const draft = getDraftByParentId(null);
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
              currentListQueryKey={[
                QUERY_KEYS_PREFLIX.GET_INFINITE_MEDIAS,
                "post",
              ]}
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
            currentListQueryKey={[
              QUERY_KEYS_PREFLIX.GET_INFINITE_MEDIAS,
              "post",
            ]}
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
