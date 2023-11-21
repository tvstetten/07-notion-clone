"use client"

import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { ChevronRight, LucideIcon, MoreHorizontal, Plus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { NavigationEntry, calcPaddingLeft, navigationEntryStdHeight } from "./navigation-entry";
import { NavigationButton } from "./navigation-button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { archive } from "@/convex/documents";
import { useUser } from "@clerk/clerk-react";

interface ItemProps {
  id?: Id<"documents">;
  documentIcon?: string;
  active?: boolean;
  expanded?: boolean;
  isSearch?: boolean;
  level?: number;
  onExpand?: () => void;
  label: string;
  onClick?: () => void;
  icon: LucideIcon
}

export const Item = ({
  id,
  label,
  onClick,
  icon: Icon,
  active,
  documentIcon,
  isSearch,
  level = 0,
  onExpand,
  expanded,
}: ItemProps) => {
  const { user } = useUser();
  const router = useRouter()
  const create = useMutation(api.documents.create)
  const archive = useMutation(api.documents.archive);

  const onArchive = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    if (!id) return;
    const promise = archive({ id })
      .then(() => router.push("/documents"))

    toast.promise(promise, {
      loading: "Moving to trash...",
      success: "Note moved to trash!",
      error: "Failed to archive note."
    });
  };

  const onCreate = () => {
    if (!id) return

    const promise = create({ title: "Untitled", parentDocument: id })
      .then((documentId) => {
        if (!expanded) {
          onExpand?.()
        }
        router.push(`/documents/${documentId}`)
      })

    toast.promise(promise, {
      loading: "Creating new note...",
      success: "New note created!",
      error: "Failed to create a new note"
    })
  }

  return (
    <NavigationEntry level={level} selectable={true} onClick={onClick}>

      {/* Chevron-Icon */}
      {!!id && (
        <span className="ml-0.5 text-muted-foreground/40" >
          <NavigationButton
            icon={ChevronRight}
            rotatable={true}
            rotateDegree={expanded ? 90 : 0}
            onClick={onExpand}
          />
        </span>
      )}

      {
        documentIcon ? (
          <div className="shrink-0 mr-2.5 text-[18px] w-[18px]">
            {documentIcon}
          </div>
        ) : (
          <Icon
            className="shrink-0 ml-0.5 mr-2 text-[18px] w-[18px] text-muted-foreground" />
        )
      }

      <span className="truncate align-baseline">
        {label}
      </span>

      {
        isSearch && (
          <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted mx-1 px-1.5 gap-x-1 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        )
      }

      {
        !!id && (
          <div className="ml-auto h-full hidden group-hover:block">
            <span className="inline-flex items-center mx-1 gap-x-1 text-muted-foreground/50">
              {/* <NavigationButton
                icon={MoreHorizontal}
                onlyOnHover={true}
                onClick={onCreate}
              /> */}
              <DropdownMenu>
                <DropdownMenuTrigger
                  onClick={(e) => e.stopPropagation()}
                  asChild
                >
                  <div
                    role="button"
                    className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
                  >
                    <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-60"
                  align="start"
                  side="right"
                  forceMount
                >
                  <DropdownMenuItem onClick={onArchive}>
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <div className="text-xs text-muted-foreground p-2">
                    Last edited by: {user?.fullName}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              <NavigationButton
                icon={Plus}
                onlyOnHover={true}
                onClick={onCreate}
              />
            </span>
          </div>
        )
      }


      {/* </div > */}
    </NavigationEntry>
  )
}

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
  return (
    <div
      style={{
        paddingLeft: calcPaddingLeft(level)
      }}
      // className="flex gap-x-2 py-[3px]"
      className={cn(
        "flex gap-x-2",
        navigationEntryStdHeight,
      )}
    >
      <Skeleton className="h-5 w-5" />
      <Skeleton className="h-5 w-[30%]" />
    </div>
  )
}