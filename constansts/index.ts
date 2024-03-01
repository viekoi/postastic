import {
  Home,
  Search,
  MessageSquareText,
  Bell,
  BookMarked,
  Settings2,
  Globe,
  Lock,
  LucideIcon,
} from "lucide-react";

export enum privacyTypeValue {
  PUBLIC = "public",
  PRIVATE = "private",
}



export const sidebarLinks = [
  {
    icon: Home,
    route: "/",
    label: "Home",
  },
  {
    icon: Search,
    route: "/search",
    label: "Search",
  },
  {
    icon: MessageSquareText,
    route: "/message",
    label: "Message",
  },
  {
    icon: Bell,
    route: "/notification",
    label: "Notification",
  },
  {
    icon: BookMarked,
    route: "/saved",
    label: "Saved",
  },
  {
    icon: Settings2,
    route: "/setting",
    label: "Setting",
  },
];

export const userSheetLinks = [
  {
    icon: BookMarked,
    route: "/saved",
    label: "Saved",
  },
  {
    icon: Settings2,
    route: "/setting",
    label: "Setting",
  },
];

export const bottombarLinks = [
  {
    icon: Home,
    route: "/",
    label: "Home",
  },
  {
    icon: Search,
    route: "/search",
    label: "Search",
  },
  {
    icon: MessageSquareText,
    route: "/message",
    label: "Message",
  },
  {
    icon: Bell,
    route: "/notification",
    label: "Notification",
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


export const imageMaxSize = 8388608
export const videoMaxSize = 20971520

