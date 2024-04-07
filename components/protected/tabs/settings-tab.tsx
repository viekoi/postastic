"use client";

import TabMenu from "./tab";
import { useSearchParams } from "next/navigation";
import EditUserProfileForm from "../forms/profile/edit-user-profile-form";
import { ExtendedUser } from "@/next-auth";

import SecuritySettingAccordion from "../accordions/security-setting-accordion";

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
    <>
      <SecuritySettingAccordion user={user} />
    </>,
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
