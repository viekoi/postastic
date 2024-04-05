import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface TabMenuProps {
  tabContents: React.ReactNode[];
  tabValues: string[];
  children?: React.ReactNode;
  className?: string;
  defaultValue: string;
}

const TabMenu = ({
  tabValues,
  tabContents,
  className,
  children,
  defaultValue,
}: TabMenuProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  return (
    <Tabs
      defaultValue={defaultValue ? defaultValue : tabValues[0]}
      className={cn("w-full ", className)}
    >
      <TabsList
        className="w-full bg-black grid p-0 h-full border-b-[0.5px] border-gray-600 rounded-none"
        style={{
          gridTemplateColumns: `repeat(${tabValues.length}, minmax(0, 1fr))`,
        }}
      >
        {tabValues.map((value) => {
          return (
            <TabsTrigger
              key={value}
              className="col-span-1 rounded-none font-bold text-sm"
              value={value}
              onClick={() =>
                router.replace(pathName + "?" + createQueryString("tab", value))
              }
            >
              {value}
            </TabsTrigger>
          );
        })}
      </TabsList>
      {children}
      {tabContents.map((content, index) => {
        return (
          <TabsContent key={index} value={tabValues[index]}>
            {content}
          </TabsContent>
        );
      })}
    </Tabs>
  );
};

export default TabMenu;
