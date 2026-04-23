import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva("rounded-md px-4 py-2 text-sm font-medium transition-colors", {
  variants: {
    variant: {
      default: "bg-white text-black hover:bg-zinc-200",
      outline: "border border-zinc-700 text-white hover:bg-zinc-900"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant }), className)} {...props} />;
}
