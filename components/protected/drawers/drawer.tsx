import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface DrawerProps {
  title?: string;
  description?: string;
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  className?: string;
}

const DrawerModal: React.FC<DrawerProps> = ({
  isOpen,
  title,
  description,
  children,
  className,
  onClose,
}) => {
  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onChange}>
      <DrawerContent
        className={cn(
          `
      flex
      flex-col
      overflow-hidden
      border 
      border-gray-600 
      h-full 
      w-full  
      rounded-md 
      bg-black
      p-[25px] 
      focus:outline-none
      z-50
      `,
          className
        )}
      >
        {title && (
          <DrawerTitle
            className="
              text-white
              text-xl 
              text-center 
              font-bold 
              p-4
              relative
              "
          >
            {title}
          </DrawerTitle>
        )}

        {description && (
          <DrawerDescription
            className="
            text-white
        mb-5 
        text-sm 
        leading-normal 
        text-center
      "
          >
            {description}
          </DrawerDescription>
        )}
        {children}
      </DrawerContent>
    </Drawer>
  );
};

export default DrawerModal;
