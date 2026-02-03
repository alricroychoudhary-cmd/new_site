import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface InputWithIconProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: LucideIcon;
  containerClassName?: string;
}

export const InputWithIcon = React.forwardRef<HTMLInputElement, InputWithIconProps>(
  ({ icon: Icon, className, containerClassName, ...props }, ref) => {
    return (
      <div className={cn("relative flex items-center w-full", containerClassName)}>
        <div className="absolute left-4 text-primary/60">
          <Icon className="w-5 h-5" />
        </div>
        <input
          ref={ref}
          className={cn(
            "w-full bg-slate-100 border-none rounded-xl py-4 pl-12 pr-4 text-base font-medium placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

InputWithIcon.displayName = "InputWithIcon";
