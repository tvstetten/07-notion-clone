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
import { useState } from "react";

interface IconPickerProps {
  onChange(icon: string): void;
  onOpenChange?(open: boolean): void;
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
  open?: boolean;
  closeAfterSelect?: boolean;
  title?: string;
}

export const IconPicker = ({
  onChange,
  onOpenChange,
  children,
  className,
  asChild,
  open,
  closeAfterSelect = true,
  title,
}: IconPickerProps) => {
  const { resolvedTheme } = useTheme();
  // const [isOpen, setIsOpen] = useState(false);
  const currentTheme = resolvedTheme || "light";
  // console.log("IconPicker create", isOpen, open);

  // if (open !== undefined && !!open !== isOpen) {
  //   setIsOpen(!!open);
  //   // return null
  // }

  function handleOpenChange(open: boolean) {
    onOpenChange && onOpenChange(open);
    // if (isOpen !== open) {
    // setIsOpen(open);
  }

  function handleSelection(data: any) {
    console.log("🔴🔴🔴", data);
    onChange(data.native);
    console.log("🔴🔴🔴🔴🔴🔴", data);
    // if (closeAfterSelect) setIsOpen(false);
  }

  return (
    <Popover
      // open={!!open || isOpen}
      onOpenChange={handleOpenChange}
      modal={true}
    >
      <PopoverTrigger
        className={className}
        // className="text-sm"
        asChild={asChild}
      >
        {children}
      </PopoverTrigger>
      <PopoverContent
        side={"right"}
        className={cn(
          "z-[9999999] h-1/3 w-full border-none p-1 shadow-none",
          CO_POPUP_MENU_SHADOW(),
        )}
      >
        <PopoverClose className="pointer-events-none mx-1.5 my-1 flex w-full justify-center  text-sm">
          <span className="flex-auto break-inside-avoid truncate text-start">
            {title}
          </span>
          <span className="pointer-events-auto inline-flex h-4 w-4 cursor-pointer pr-4">
            X
          </span>
        </PopoverClose>
        {/* <div>Hello World</div> */}
        <Picker
          data={data}
          onEmojiSelect={handleSelection}
          // onEmojiSelect={console.log}
          autofocus={true}
          theme={currentTheme}
        />
      </PopoverContent>
    </Popover>
  );
};
