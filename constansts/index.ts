import { Settings2, Globe, Lock } from "lucide-react";

export enum privacyTypeValue {
  PUBLIC = "public",
  PRIVATE = "private",
}

export const MediaTypes = ["post", "reply", "comment"] as const;
export const InfinitePostsRoutes = ["home", "profile", "save","search"] as const;

export const userSheetLinks = [
  {
    icon: Settings2,
    route: "/settings",
    label: "Settings",
  },
];

export const postPrivacyOtptions = [
  {
    label: "Public",
    icon: Globe,
    value: privacyTypeValue.PUBLIC,
  },
  {
    label: "Private",
    icon: Lock,
    value: privacyTypeValue.PRIVATE,
  },
];

export const imageMaxSize = 8388608;
export const videoMaxSize = 20971520;
