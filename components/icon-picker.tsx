"use client";

import EmojiPicker, { Theme } from "emoji-picker-react";
import { useTheme } from "next-themes";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { Button } from "./ui/button";
import { cn, CO_POPUP_MENU_SHADOW } from "@/lib/utils";

interface IconPickerProps {
  onChange(icon: string): void;
  onOpenChange?(open: boolean): void;
  children: React.ReactNode;
  asChild?: boolean;
  open?: boolean;
}

export const IconPicker = ({
  onChange,
  onOpenChange,
  children,
  asChild,
  open,
}: IconPickerProps) => {
  const { resolvedTheme } = useTheme();
  const currentTheme = (resolvedTheme || "light") as keyof typeof themeMap;

  const themeMap = {
    dark: Theme.DARK,
    light: Theme.LIGHT,
  };

  const theme = themeMap[currentTheme];

  return (
    <Popover
      open={!!open}
      onOpenChange={onOpenChange}
    >
      <PopoverTrigger asChild={asChild}>{children}</PopoverTrigger>
      <PopoverContent
        className={cn(
          "z-[99999] w-full border-none p-0 shadow-none",
          CO_POPUP_MENU_SHADOW(),
        )}
      >
        {/* <div className="pointer-events-none flex w-full justify-end"> */}
        <PopoverClose className="pointer-events-none flex w-full justify-end">
          <span className="pointer-events-auto m-1 mt-auto h-4 w-4 cursor-pointer text-sm">
            X
          </span>
        </PopoverClose>
        {/* </div> */}
        <EmojiPicker
          height={300}
          theme={theme}
          onEmojiClick={(data) => onChange(data.emoji)}
        />
      </PopoverContent>
    </Popover>
  );
};
