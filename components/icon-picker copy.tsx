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
  const currentTheme = (resolvedTheme || Theme.LIGHT) as keyof typeof themeMap;

  const themeMap = {
    dark: Theme.DARK,
    light: Theme.LIGHT,
  };

  const theme = themeMap[currentTheme];
  console.log("IconPicker", open);

  return (
    <Popover
      open={!!open}
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
        // avoidCollisions={true}
        // align="center"
        // collisionBoundary={20}
        side={"right"}
        className={cn(
          "z-[99999] h-1/3 w-full border-none p-0 shadow-none",
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
        <EmojiPicker
          // height={400}
          height={400}
          width={400}
          autoFocusSearch={true}
          className="text-sm"
          // previewConfig={{
          //   defaultEmoji: "string",
          //   defaultCaption: "string;",
          //   showPreview: true,
          // }}
          theme={theme}
          onEmojiClick={(data) => onChange(data.emoji)}
        />
      </PopoverContent>
    </Popover>
  );
};
