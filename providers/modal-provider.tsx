"use client";

import ImageCarouselModal from "@/components/protected/modals/image-carousel-modal";
import NewPostModal from "@/components/protected/modals/new-post-modal";
import NewReplyModal from "@/components/protected/modals/new-reply-modal";
import CommentModal from "@/components/protected/modals/comment-modal";
import { useEffect, useState } from "react";

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
      <NewPostModal />
      <NewReplyModal />
      <ImageCarouselModal />
      <CommentModal />
    </>
  );
};

export default ModalProvider;
