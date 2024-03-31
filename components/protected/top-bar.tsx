"use client";

import Link from "next/link";
import { useCurrentUser } from "@/hooks/use-current-user";
import { LogOut, Twitter } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "../ui/separator";
import { userSheetLinks } from "@/constansts";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "../ui/button";
import UserAvatar from "./user/user-avatar";

import { useMobileNavSideModal } from "@/hooks/use-modal-store";
import SideModal from "./sheets/sheet";

const Topbar = () => {
  const { user } = useCurrentUser();
  const pathName = usePathname();
  const router = useRouter();
  const { isOpen, onClose, onOpen } = useMobileNavSideModal();

  return (
    <section className=" sticky top-0 z-50 lg:hidden w-full border-[0.5px] border-gray-600 bg-black/90">
      <div className="flex justify-between py-4 px-5 items-center">
        <Link href="/" className="flex items-center justify-center ">
          <Twitter size={30} fill="white" />
        </Link>
        <UserAvatar user={user} onClick={onOpen} />
        <SideModal isOpen={isOpen} onClose={onClose} side="left">
          <div className="space-y-8 flex flex-col ">
            <div className="space-y-4 inline-flex flex-col text-start gap-y-4">
              <UserAvatar
                onClick={() => {
                  router.push(`/profile/${user?.id}`);
                  onClose();
                }}
                user={user}
              />
              <Link
                href={`/profile/${user?.id}`}
                onClick={onClose}
                className="font-bold"
              >
                {user?.name}
              </Link>
              <Separator className="w-full h-[1px] bg-gray-600" />
            </div>
            <div className="flex flex-col space-y-8 ">
              {userSheetLinks.map((link) => {
                const isActive = pathName === link.route;

                return (
                  <div key={link.route}>
                    <Button
                      onClick={() => {
                        router.push(link.route);
                        onClose();
                      }}
                      variant={"ghost"}
                      className="text-sm"
                      size={"link"}
                    >
                      <div
                        className={cn(
                          "relative",
                          isActive && "side-link-active"
                        )}
                      >
                        <link.icon />
                      </div>
                      {link.label}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
          <Button
            variant={"destructive"}
            onClick={() => signOut()}
            className="w-fit rounded-3xl gap-2"
          >
            <LogOut />
            Log out
          </Button>
        </SideModal>
      </div>
    </section>
  );
};

export default Topbar;

export const LayoutTopbar = () => {
  const pathName = usePathname();

  const topbarTitle = () => {
    if (pathName === "/") return "Home";

    const name = pathName.split("/")[1];

    return name.charAt(0).toUpperCase() + name.slice(1);
  };
  return (
    <h1 className=" bg-black/90 z-50 hidden lg:block text-xl font-medium p-6 backdrop-blur border-b-[0.5px] border-gray-600 sticky top-0">
      {topbarTitle()}
    </h1>
  );
};
