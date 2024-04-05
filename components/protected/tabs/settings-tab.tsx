"use client";

import TabMenu from "./tab";
import { useParams, useSearchParams } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";
import EditUserProfileForm from "../forms/profile/edit-user-profile-form";
import { ExtendedUser } from "@/next-auth";

interface SettingsTabProps {
  user: ExtendedUser;
  isEdit: boolean;
  setIsEdit: () => void;
}

const SettingsTab = ({ user, isEdit, setIsEdit }: SettingsTabProps) => {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab");
  const tabValues = ["profile", "security"];
  const tabContents = [
    <>
      <EditUserProfileForm setIsEdit={setIsEdit} isEdit={isEdit} user={user} />
    </>,
    <>security</>,
  ];

  return (
    <TabMenu
      defaultValue={defaultTab ? defaultTab : tabValues[0]}
      tabContents={tabContents}
      tabValues={tabValues}
    />
  );
};

export default SettingsTab;
