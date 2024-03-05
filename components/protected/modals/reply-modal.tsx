"use client";
import { useReplyModal } from "@/hooks/use-modal-store";
import Modal from "./modal";
import CommentContainer from "../comment-container";
import NewCommentForm from "../forms/new-comment-form";
import { useFilesUploadActions } from "@/hooks/use-files-upload-actions";


const ReplyModal = () => {
  const { isOpen, onClose, post } = useReplyModal();
  const { onRemoveFiles } = useFilesUploadActions();

  if (post) {
    return (
      <Modal
        title={`${post.user.name} Post`}
        className=" lg:max-h-[90vh] lg:max-w-[800px] p-0 overflow-hidden flex flex-col"
        isOpen={isOpen}
        onClose={() => {
          onRemoveFiles();
          onClose();
        }}
      >
        <div className="overflow-y-scroll custom-scrollbar flex-1">
          <CommentContainer
            postId={post.id}
            initialCommentsCount={post.commentsCount}
          />
        </div>
        <NewCommentForm postId={post.id} />
      </Modal>
    );
  }

  return null;
};

export default ReplyModal;
