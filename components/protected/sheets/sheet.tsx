import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const SHEET_SIDES = ["top", "right", "bottom", "left"] as const;

interface SideModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  side: (typeof SHEET_SIDES)[number];
  className?: string;
}

const SideModal = ({
  isOpen,
  onClose,
  children,
  className,
  side,
}: SideModalProps) => {
  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };
  return (
    <Sheet open={isOpen} defaultOpen={isOpen} onOpenChange={onChange}>
      <SheetContent
        side={side}
        className={cn(
          "border-none shadow-md shadow-white flex flex-col justify-between",
          className
        )}
      >
        {children}
      </SheetContent>
    </Sheet>
  );
};

export default SideModal;
