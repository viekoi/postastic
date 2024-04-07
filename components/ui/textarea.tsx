import * as React from "react";

import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";

const textareaVariants = cva(
  "flex min-h-[80px] w-full rounded-md border border-input bg-black text-white px-3 py-2 text-sm  placeholder:text-muted-foreground  disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none  focus-visible:ring-offset-0 ",
  {
    variants: {
      variant: {
        default: "",
        destructive:
          "ring-4 ring-red-600 focus-visible:ring-4 focus-visible:ring-red-600",

        outline: " focus-visible:ring-4 focus-visible:ring-blue-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <textarea
        className={cn(textareaVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
