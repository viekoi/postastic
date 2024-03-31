import {
  InfinitePostsRoutes,
  MediaTypes,
  imageMaxSize,
  postPrivacyOtptions,
  videoMaxSize,
} from "@/constansts";
import { QUERY_KEYS_PREFLIX } from "@/queries/react-query/query-keys";
import { AttachmentFile } from "@/type";
import { type ClassValue, clsx } from "clsx";
import { FileWithPath } from "react-dropzone";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateString(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("en-US", options);

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${formattedDate} at ${time}`;
}

export const multiFormatDateString = (timestamp: string = ""): string => {
  const timestampNum = Math.round(new Date(timestamp).getTime() / 1000);
  const date: Date = new Date(timestampNum * 1000);
  const now: Date = new Date();

  const diff: number = now.getTime() - date.getTime();
  const diffInSeconds: number = diff / 1000;
  const diffInMinutes: number = diffInSeconds / 60;
  const diffInHours: number = diffInMinutes / 60;
  const diffInDays: number = diffInHours / 24;

  switch (true) {
    case Math.floor(diffInDays) >= 30:
      return formatDateString(timestamp);
    case Math.floor(diffInDays) === 1:
      return `${Math.floor(diffInDays)} day ago`;
    case Math.floor(diffInDays) > 1 && diffInDays < 30:
      return `${Math.floor(diffInDays)} days ago`;
    case Math.floor(diffInHours) >= 1:
      return `${Math.floor(diffInHours)} hours ago`;
    case Math.floor(diffInMinutes) >= 1:
      return `${Math.floor(diffInMinutes)} minutes ago`;
    default:
      return "Just now";
  }
};

export const mobileMultiFormatDateString = (timestamp: string = ""): string => {
  const timestampNum = Math.round(new Date(timestamp).getTime() / 1000);
  const date: Date = new Date(timestampNum * 1000);
  const now: Date = new Date();

  const diff: number = now.getTime() - date.getTime();
  const diffInSeconds: number = diff / 1000;
  const diffInMinutes: number = diffInSeconds / 60;
  const diffInHours: number = diffInMinutes / 60;
  const diffInDays: number = diffInHours / 24;

  switch (true) {
    case Math.floor(diffInDays) >= 30:
      return formatDateString(timestamp);
    case Math.floor(diffInDays) === 1:
      return `${Math.floor(diffInDays)} day`;
    case Math.floor(diffInDays) > 1 && diffInDays < 30:
      return `${Math.floor(diffInDays)} days`;
    case Math.floor(diffInHours) >= 1:
      return `${Math.floor(diffInHours)} hours`;
    case Math.floor(diffInMinutes) >= 1:
      return `${Math.floor(diffInMinutes)} min`;
    default:
      return "Just now";
  }
};

export const isTooLarge = (
  file: AttachmentFile | FileWithPath,
  type: "video" | "image"
) => {
  if (!file.size) return false;
  if (type === "image" && file.size > imageMaxSize) {
    return true;
  }

  if (type === "video" && file.size > videoMaxSize) {
    return true;
  }

  return false;
};

export const getPostPrivacyOption = (privacyType: "public" | "private") => {
  const res = postPrivacyOtptions.find(
    (option) => option.value === privacyType
  );

  return res ? res : postPrivacyOtptions[0];
};

export const InfiniteMediasQueryKeyBuilder = ({
  parentId,
  type,
  route,
  profileId,
}: {
  parentId: string | null;
  type: (typeof MediaTypes)[number];
  route: (typeof InfinitePostsRoutes)[number];
  profileId?: string;
}) => {
  return [
    QUERY_KEYS_PREFLIX.GET_INFINITE_MEDIAS,
    type,
    { parentId: parentId, profileId: profileId, route: route },
  ];
};
