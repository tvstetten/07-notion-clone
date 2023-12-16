"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { LucideIcon, MoreHorizontal, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  NavItem,
  NavItemButtonBaseProps,
  calcPaddingLeft,
  navigationEntryBaseClassnames,
} from "./nav-item";
import { useUser } from "@clerk/clerk-react";
import { documentMenuContent } from "./document-menu";
import { IconPicker } from "@/components/icon-picker";
import { ReactNode } from "react";

interface ItemProps {
  documentId?: Id<"documents"> | undefined;
  level?: number;
  icon?: LucideIcon | string;
  active?: boolean;
  expanded?: boolean;
  keyboard?: string;
  label: string;
  onExpand?: (event?: React.MouseEvent<HTMLElement>) => void;
  onClick?: (event?: React.MouseEvent<HTMLElement>) => void;
}

export const NavItemDocument = ({
  documentId,
  level = 0,
  label,
  icon: Icon,
  expanded,
  active,
  keyboard,
  onClick,
  onExpand,
}: ItemProps) => {
  const { user } = useUser();
  const router = useRouter();
  const create = useMutation(api.documents.create);
  const archive = useMutation(api.documents.archive);

  console.log(
    "🚀 ~ file: item.tsx:64 ~ label:",
    label,
    "documentId",
    documentId,
  );

  const onCreate = () => {
    const promise = create({
      title: "Untitled",
      parentDocument: documentId,
    }).then((documentId) => {
      if (!expanded) {
        onExpand?.(undefined);
      }
      router.push(`/documents/${documentId}`);
    });

    toast.promise(promise, {
      loading: "Creating new note...",
      success: "New note created!",
      error: "Failed to create a new note",
    });
  };

  // update need to be declared outside of the function.
  // Otherwise there is a run-forever-condition
  const update = useMutation(api.documents.update);
  const handleOpenIconButton = (
    isOpen: boolean,
    setIsOpen: (isOpen: boolean) => void,
    buttonProps: NavItemButtonBaseProps,
    insertButtonHere: () => ReactNode,
  ) => {
    //--------------------------
    // Callback for the IconSelect
    async function handleIconSelect(icon: string) {
      if (documentId) {
        update({
          id: documentId,
          icon: icon,
        });
      }
      setIsOpen(false);
      return;
    }
    //--------------------------

    return (
      <IconPicker
        open={isOpen}
        onChange={handleIconSelect}
        onOpenChange={(open: Boolean) => !open && setIsOpen(false)}
      >
        {insertButtonHere()}
      </IconPicker>
    );
  };

  return (
    <NavItem
      level={level}
      selectable={true}
      active={active}
      onClick={onClick}
    >
      {/* Chevron-Icon */}
      <NavItem.Chevron
        active={active}
        expanded={expanded}
        onClick={onExpand}
      />

      {/* Icon -> on Click edit Icon */}
      <NavItem.ButtonDynamic
        icon={Icon}
        active={active}
        // clickable={true}
        handleOpenChanged={handleOpenIconButton}
      />

      {/* <IconPicker onChange={onIconSelect}>
        <NavItem.Button
          icon={Icon}
          active={active}
          clickable={true}
        />
      </IconPicker> */}
      {/* <NavItem.Button
        icon={Icon}
        active={active}
        onClick={handleIconClick}
      /> */}

      <NavItem.Label label={label} />
      {keyboard && <NavItem.Keyboard keyboard={keyboard} />}
      <NavItem.ButtonDropdown
        icon={MoreHorizontal}
        onlyHover={true}
        handleOpenChanged={(isOpen) => {
          // Keep the PLUS-Icon visible when the menu is open
          return (
            <>
              <NavItem.Button
                icon={Plus}
                onlyHover={!isOpen}
                onClick={onCreate}
              />
              {isOpen && documentId && documentMenuContent(documentId)}
            </>
          );
        }}
      />
    </NavItem>
  );
};

NavItemDocument.Skeleton = function ItemSkeleton({
  level,
}: {
  level?: number;
}) {
  return (
    <div
      style={{
        paddingLeft: calcPaddingLeft(level),
      }}
      className={cn("bg-tree", navigationEntryBaseClassnames())}
    >
      <Skeleton className="h-5 w-5" />
      <Skeleton className="h-5 w-[50%]" />
    </div>
  );
};
