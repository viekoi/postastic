"use client";
import { useCommentModal } from "@/hooks/use-modal-store";
import Modal from "./modal";
import CommentContainer from "../comment-container";
import NewCommentForm from "../forms/comment/new-comment-form";
import useIsMobile from "@/hooks/use-is-mobile";
import DrawerModal from "../drawers/drawer";

const CommentModal = () => {
  const { isOpen, onClose, post } = useCommentModal();
  const isMobile = useIsMobile(1024);

  if (post && !isMobile) {
    return (
      <Modal
        title={`${post.user.name} Post`}
        className=" lg:max-h-[90vh] lg:max-w-[800px] p-0 overflow-hidden flex flex-col"
        isOpen={isOpen}
        onClose={() => {
          onClose();
        }}
      >
        <div className="overflow-y-scroll custom-scrollbar flex-1">
          <CommentContainer
            postId={post.id}
            initialCommentsCount={post.interactsCount}
          />
        </div>
        <NewCommentForm postId={post.id} />
      </Modal>
    );
  }

  if (post && isMobile) {
    return (
      <DrawerModal
        title={`${post.user.name} Post`}
        className=" lg:max-h-[90vh] lg:max-w-[800px] p-0 overflow-hidden flex flex-col"
        isOpen={isOpen}
        onClose={() => {
          onClose();
        }}
      >
        <div className="overflow-y-scroll custom-scrollbar flex-1">
          <CommentContainer
            postId={post.id}
            initialCommentsCount={post.interactsCount}
          />
        </div>
        <NewCommentForm postId={post.id} />
      </DrawerModal>
    );
  }

  return null;
};

export default CommentModal;
