"use client";
import React from "react";
import Modal from "./modal";
import { useNewMediaModal } from "@/hooks/use-modal-store";

import { useIsAddingFiles } from "@/hooks/use-is-adding-files";
import useIsMobile from "@/hooks/use-is-mobile";
import DrawerModal from "../drawers/drawer";
import NewMediaForm from "../forms/media/new/new-media-form";
import { QUERY_KEYS } from "@/queries/react-query/query-keys";

const NewMediaModal = () => {
  const { isOpen, onClose, media } = useNewMediaModal();
  const { onCancel } = useIsAddingFiles();
  const isMobile = useIsMobile(1024);

  if (media) {
    const currentListQueryKey =
      media.type === "comment"
        ? [QUERY_KEYS.GET_COMMENT_REPLIES, media.postId, media.id, "replies"]
        : [
            QUERY_KEYS.GET_COMMENT_REPLIES,
            media.postId,
            media.parentId,
            "replies",
          ];

    const parentListQueryKey = [
      QUERY_KEYS.GET_POST_COMMENTS,
      media.postId,
      "comments",
    ];

    const parentId = media.type === "comment" ? media.id : media.parentId;

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
          />
        </div>
      </Modal>
    );
  } else {
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
              currentListQueryKey={[QUERY_KEYS.GET_HOME_POSTS]}
              postId={null}
              parentId={null}
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
            currentListQueryKey={[QUERY_KEYS.GET_HOME_POSTS]}
            postId={null}
            parentId={null}
          />
        </div>
      </Modal>
    );
  }
};

export default NewMediaModal;
