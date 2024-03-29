"use client";
import { useCommentModal } from "@/hooks/use-modal-store";
import Modal from "./modal";
import CommentContainer from "../containers/comment/comment-container";
import useIsMobile from "@/hooks/use-is-mobile";
import DrawerModal from "../drawers/drawer";
import NewMediaForm from "../forms/media/new/new-media-form";
import { QUERY_KEYS } from "@/queries/react-query/query-keys";

const CommentModal = () => {
  const { isOpen, onClose, post } = useCommentModal();
  const isMobile = useIsMobile(1024);

  if (post && !isMobile) {
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
        {/* <NewCommentForm postId={post.id} /> */}
        <NewMediaForm
          parentListQueryKey={[QUERY_KEYS.GET_HOME_POSTS]}
          currentListQueryKey={[
            QUERY_KEYS.GET_POST_COMMENTS,
            post.id,
            "comments",
          ]}
          type="comment"
          postId={post.id}
          parentId={post.id}
        />
      </Modal>
    );
  }

  if (post && isMobile) {
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
          parentListQueryKey={[QUERY_KEYS.GET_HOME_POSTS]}
          currentListQueryKey={[
            QUERY_KEYS.GET_POST_COMMENTS,
            post.id,
            "comments",
          ]}
          type="comment"
          postId={post.id}
          parentId={post.id}
        />
      </DrawerModal>
    );
  }

  return null;
};

export default CommentModal;
