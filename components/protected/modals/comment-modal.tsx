"use client";
import { useCommentModal } from "@/hooks/use-modal-store";
import Modal from "./modal";
import CommentContainer from "../containers/comment/comment-container";

import DrawerModal from "../drawers/drawer";
import NewMediaForm from "../forms/media/new/new-media-form";
import { useNewMediaDrafts } from "@/hooks/use-new-media-drafts-store";
import { useIsMobile } from "@/providers/is-mobile-provider";
import { QUERY_KEYS_PREFLIX } from "@/queries/react-query/query-keys";

const CommentModal = () => {
  const { isOpen, onClose, post } = useCommentModal();
  const { getDraftByParentId } = useNewMediaDrafts();
  const { isMobile } = useIsMobile();
  if (!post) {
    return null;
  }

  const draft = getDraftByParentId(post.id);

  if (!isMobile) {
    return (
      <Modal
        title={`${post.user.name} Post`}
        className=" lg:max-h-[90vh] lg:max-w-[800px]  overflow-hidden flex flex-col"
        isOpen={isOpen}
        onClose={() => {
          onClose();
        }}
      >
        <div className="overflow-y-scroll custom-scrollbar flex-1">
          <CommentContainer
            postId={post.id}
            initiaParentInteractCount={post.interactsCount}
          />
        </div>
        <NewMediaForm
          parentListPreflix={[QUERY_KEYS_PREFLIX.GET_INFINITE_MEDIAS, "post"]}
          currentListQueryKey={[
            QUERY_KEYS_PREFLIX.GET_INFINITE_MEDIAS,
            "comment",
            { parentId: post.id },
          ]}
          type="comment"
          postId={post.id}
          parentId={post.id}
          defaultValues={draft}
        />
      </Modal>
    );
  }

  if (isMobile) {
    return (
      <DrawerModal
        title={`${post.user.name} Post`}
        className=" lg:max-h-[90vh] lg:max-w-[800px]  overflow-hidden flex flex-col p-0"
        isOpen={isOpen}
        onClose={() => {
          onClose();
        }}
      >
        <div className="overflow-y-scroll custom-scrollbar flex-1">
          <CommentContainer
            postId={post.id}
            initiaParentInteractCount={post.interactsCount}
          />
        </div>
        <NewMediaForm
          parentListPreflix={[QUERY_KEYS_PREFLIX.GET_INFINITE_MEDIAS,"post"]}
          currentListQueryKey={[
            QUERY_KEYS_PREFLIX.GET_INFINITE_MEDIAS,
            "comment",
            { parentId: post.id },
          ]}
          type="comment"
          postId={post.id}
          parentId={post.id}
          defaultValues={draft}
        />
      </DrawerModal>
    );
  }

  return null;
};

export default CommentModal;
