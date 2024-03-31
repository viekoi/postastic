import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";


interface TabMenuProps {
  tabContents: React.ReactNode[];
  tabValues: string[];
  children?:React.ReactNode
  className?: string;
}

const TabMenu = ({ tabValues, tabContents, className, children}: TabMenuProps) => {
  return (
    <Tabs defaultValue={tabValues[0]} className={cn("w-full ", className)}>
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
