"use client";

import Link from "next/link";
import { useCurrentUser } from "@/hooks/use-current-user";
import { LogOut, Twitter } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "../ui/separator";
import { userSheetLinks } from "@/constansts";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "../ui/button";
import UserAvatar from "./user-avatar";

const Topbar = () => {
  const { user } = useCurrentUser();
  const pathName = usePathname();
  return (
    <section className=" sticky top-0 z-50 lg:hidden w-full border-[0.5px] border-gray-500">
      <div className="flex justify-between py-4 px-5 items-center">
        <Link href="/" className="flex items-center justify-center ">
          <Twitter size={30} fill="white" />
        </Link>

        <Sheet>
          <SheetTrigger>
            <UserAvatar user={user} />
          </SheetTrigger>
          <SheetContent
            side={"left"}
            className="border-none shadow-md shadow-gray-400 flex flex-col justify-between"
          >
            <div className="space-y-8 flex flex-col ">
              <div className="space-y-4">
                <Link
                  href={`user/${user?.id}`}
                  className="inline-flex flex-col text-start gap-y-4"
                >
                  <UserAvatar user={user} />
                  {user?.name}
                </Link>
                <Separator className="w-full h-[1px]" />
              </div>
              <div className="flex flex-col space-y-8 ">
                {userSheetLinks.map((link) => {
                  const isActive = pathName === link.route;

                  return (
                    <Link
                      href={link.route}
                      className={"group"}
                      key={link.route}
                    >
                      <Button variant={"link"} className="text-sm">
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
                    </Link>
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
          </SheetContent>
        </Sheet>
      </div>
    </section>
  );
};

export default Topbar;
