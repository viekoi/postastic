"use client";

import { bottombarLinks } from "@/constansts";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Bottombar = () => {
  const pathName = usePathname();

  return (
    <div className=" border-t-[0.5px] bg-black border-gray-600 z-50 justify-evenly w-full flex sticky bottom-0  bg-dark-2 px-5 py-4 lg:hidden">
      {bottombarLinks.map((link) => {
        const isActive = pathName === link.route;
        return (
          <Link
            key={`bottombar-${link.label}`}
            href={link.route}
            className={`${
              isActive && "rounded-[10px] bg-background/25 "
            } flex items-center flex-col gap-1 p-2 transition`}
          >
            <link.icon />

            <p className="text-[10px] font-medium leading-[140%] text-white">
              {link.label}
            </p>
          </Link>
        );
      })}
    </div>
  );
};

export default Bottombar;
