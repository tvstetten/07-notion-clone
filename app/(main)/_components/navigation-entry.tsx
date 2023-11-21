"use client"

import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { ChevronRight, LucideIcon, MoreHorizontal, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { NavigationButton } from "./navigation-button";
import React, { PropsWithChildren } from "react";

export interface NavigationEntryProps {
  level?: number;
  label?: string;
  active?: boolean;
  selectable?: boolean;
  onClick?: () => void;
  icon?: LucideIcon;
  children?: React.ReactNode;
}

// type NavigationEntryPropsWithChildren<NavigationEntryProps> =
// NavigationEntryProps & 
/***
 * calculate the indentation inside the tree
 * Used for the NavigationEntry and the Item.Skeleton
 */
export const calcPaddingLeft = (level?: number) => {
  return level ? `${(level * 20) + 2}px` : "3px"
}

export const navigationEntryStdHeight = "h-[25px] my-0.5 py-0.5"

export const NavigationEntry = ({
  level = 0,
  label,
  onClick,
  icon,
  selectable,
  active,
  children,
}: NavigationEntryProps) => {
  return (
    <div
      onClick={onClick}
      role={selectable ? "button" : "label"}
      style={{ paddingLeft: calcPaddingLeft(level) }}
      className={cn(
        "group",
        navigationEntryStdHeight,
        "flex items-center text-sm text-muted-foreground rounded-sm",
        selectable && "hover:bg-red-500 cursor-pointer",
        active && "bg-primary/5 text-primary"
      )}
    >
      {children}
    </div >
  )
}
