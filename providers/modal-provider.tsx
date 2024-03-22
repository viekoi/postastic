"use client";

import ImageCarouselModal from "@/components/protected/modals/image-carousel-modal";
import NewPostModal from "@/components/protected/modals/new-post-modal";
import NewReplyModal from "@/components/protected/modals/new-reply-modal";
import CommentModal from "@/components/protected/modals/comment-modal";
import { useEffect, useState } from "react";
import EditMediaModal from "@/components/protected/modals/edit-media-modal";
import { AlertModal } from "@/components/protected/modals/alert-modal";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <AlertModal />
      <NewPostModal />
      <NewReplyModal />
      <ImageCarouselModal />
      <CommentModal />
      <EditMediaModal />
    </>
  );
};

export default ModalProvider;
