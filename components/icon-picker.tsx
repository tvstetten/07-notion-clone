"use client";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useTheme } from "next-themes";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// import { PopoverClose } from "@radix-ui/react-popover";
import { cn, CO_POPUP_MENU_SHADOW } from "@/lib/utils";

interface IconPickerProps {
  onChange(icon: string): void;
  onOpenChange?(open: boolean): void;
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
  open?: boolean;
  closeAfterSelect?: boolean;
  title?: string;
  selectedEmoji?: string;
}

const Options = {
  skin: 1,
};

export const IconPicker = ({
  onChange,
  onOpenChange,
  children,
  className,
  asChild,
  open,
  closeAfterSelect = true,
  title,
  selectedEmoji,
}: IconPickerProps) => {
  const { resolvedTheme } = useTheme();

  return (
    <Popover
      onOpenChange={onOpenChange}
      modal={true}
    >
      <PopoverTrigger
        className={className}
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
        {/* <PopoverClose className="pointer-events-none mx-1.5 my-1 flex w-full justify-center  text-sm">
          <span className="flex-auto break-inside-avoid truncate text-start">
            {title}
          </span>
          <span className="pointer-events-auto inline-flex h-4 w-4 cursor-pointer pr-4">
            X
          </span>
        </PopoverClose> */}
        {/* <div>Hello World</div> */}
        <Picker
          data={data}
          // onEmojiSelect={console.log}
          onEmojiSelect={(data: any) => {
            // console.log("🔴🔴🔴", data);
            onChange(data.native);
            // console.log("🔴🔴🔴🔴🔴🔴", data);
          }}
          autofocus={true}
          theme={resolvedTheme || "light"}
          skin={Options.skin}
          onSkinChange={(data: any) => console.log("OnSkinChange", data)}
        />
      </PopoverContent>
    </Popover>
  );
};
