"use client";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useTheme } from "next-themes";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { cn, CO_POPUP_MENU_SHADOW } from "@/lib/utils";

interface IconPickerProps {
  onChange(icon: string): void;
  onOpenChange?(open: boolean): void;
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
  open?: boolean;
  title?: string;
}

export const IconPicker = ({
  onChange,
  onOpenChange,
  children,
  className,
  asChild,
  open,
  title,
}: IconPickerProps) => {
  const { resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme || "light";
  console.log("IconPicker", open);

  function handleSelection(data: any) {
    console.log("🔴🔴🔴", data);
    // onChange(data.emoji)
  }

  return (
    <Popover
      open={!!open}
      onOpenChange={onOpenChange}
      modal={true}
    >
      <PopoverTrigger
      // className={className}
      // asChild={asChild}
      >
        {children}
      </PopoverTrigger>
      <PopoverContent
        // avoidCollisions={true}
        // align="center"
        // collisionBoundary={20}
        side={"right"}
        className={cn(
          "z-[9999999] h-1/3 w-full border-none p-0 shadow-none",
          CO_POPUP_MENU_SHADOW(),
        )}
      >
        <PopoverClose className="pointer-events-none my-1 flex w-full justify-end text-sm">
          <span className="flex-auto break-inside-avoid truncate text-start">
            {title}
          </span>
          <span className="pointer-events-auto m-1 mt-auto h-4 w-4 cursor-pointer">
            X
          </span>
        </PopoverClose>
        {/* <Picker
          data={data}
          onEmojiSelect={console.log}
          autofocus={true}
          theme={currentTheme}
          onEmojiClick={handleSelection}
        /> */}
        <div>
          <div>fjkashfjkHJKFHJKLhsaf</div>
          <div>fjkashfjkHJKFHJKLhsaf</div>
          <div>fjkashfjkHJKFHJKLhsaf</div>
          <div>fjkashfjkHJKFHJKLhsaf</div>
          <div>fjkashfjkHJKFHJKLhsaf</div>
          <div>fjkashfjkHJKFHJKLhsaf</div>
          <div>fjkashfjkHJKFHJKLhsaf</div>
          <div>fjkashfjkHJKFHJKLhsaf</div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
