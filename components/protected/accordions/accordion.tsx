import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface CollapseMenuProps {
  collapseMenuContents: {
    value: string;
    triggerText: string;
    content: React.ReactNode;
  }[];
  className?: string;
}

const CollapseMenu = ({
  collapseMenuContents,
  className,
}: CollapseMenuProps) => {
  return (
    <Accordion className={cn("overflow-x-hidden", className)} type="single" collapsible>
      {collapseMenuContents.map((c, index) => {
        return (
          <AccordionItem key={index} value={c.value}>
            <AccordionTrigger className="pl-1">{c.triggerText}</AccordionTrigger>
            <AccordionContent>{c.content}</AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

export default CollapseMenu;
