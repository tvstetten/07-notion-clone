"use client";

import { FileText, LucideIcon, MoreHorizontal, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
// import { documents } from "@/convex/_generated/dataModel";
import { IDocument } from "@/convex/documents";
import { useMutation } from "convex/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { NAV_ITEM_IMAGE_SIZE, NavItem } from "./nav-item";
import { documentMenuContent } from "./document-menu";
import { IconPicker } from "@/components/icon-picker";
import { useSidebarContext } from "@/components/mylib/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ItemProps {
  document: IDocument;
  level?: number;
  icon?: LucideIcon | string;
  active?: boolean;
  expanded?: boolean;
  keyboard?: string;
  label: string;
  onExpand?: (event?: React.MouseEvent<HTMLElement>) => void;
  onClick?: (event?: React.MouseEvent<HTMLElement>) => void;
}

interface IGlobalItemStatus {
  hovered: undefined | string;
  opened: undefined | string;
  callback: undefined | (() => void);
}

const global_ItemStatus: IGlobalItemStatus = {
  hovered: "",
  opened: "",
  callback: undefined,
};

export const NavItemDocument = ({
  document,
  level = 0,
  // label,
  // icon: Icon,
  expanded,
  active,
  onClick,
  onExpand,
}: ItemProps) => {
  const [navItemHovered, setNavItemHovered] = useState<boolean>(false);
  const sbStatus = useSidebarContext();

  const documentId = document._id;
  console.log("🎆", documentId);

  // Callback that's set as global_ItemStatus.callback-value to be able to reset this item
  //  when another item is selected and this element didn't catch the MouseLeave-event
  function ResetStatusCallback() {
    // console.log("🟠");
    if (navItemHovered) {
      console.log("😊");
      setNavItemHovered(false); // Force repaint
    }
    global_ItemStatus.callback = undefined;
  }

  // Callback for the IconSelect
  async function handleIconSelect(icon: string) {
    const update = useMutation(api.documents.update);
    if (documentId) {
      update({
        id: documentId,
        icon: icon,
      });
    }
    // setIsOpen(false);
  }

  function handlePopupOpenChange(open: boolean) {
    console.log(
      "🤷‍♂️ handlePopupOpenChange-start; open =",
      open,
      "ItemStatus:",
      global_ItemStatus,
    );
    if (open) {
      global_ItemStatus.opened = documentId;
    } else {
      global_ItemStatus.opened = "";
      global_ItemStatus.hovered = "";
      setNavItemHovered(false); // refresh lead to a new onEnter if applicable
    }
    console.log(
      "🤷‍♂️ handlePopupOpenChange-ende; open =",
      open,
      "ItemStatus:",
      global_ItemStatus,
    );
    sbStatus.lockOpenState(open);
  }

  function PageIcon() {
    const Icon = document.icon || FileText;
    return (
      <>
        {navItemHovered ? (
          <IconPicker
            onChange={handleIconSelect}
            onOpenChange={handlePopupOpenChange}
            className="inline-flex"
            open={global_ItemStatus.opened === documentId}
            title="Document Icon"
          >
            <NavItem.Button
              icon={Icon}
              size={NAV_ITEM_IMAGE_SIZE}
              // className="text-base"
              clickable={true}
            />
          </IconPicker>
        ) : (
          <NavItem.Button
            icon={Icon}
            size={NAV_ITEM_IMAGE_SIZE}
            // className="text-base"
            clickable={true}
          />
        )}
      </>
    );
  }
  function calculateContrastColor(rgbColor: string, secondColor: string) {
    const r = parseInt(rgbColor.slice(1, 3), 16);
    const g = parseInt(rgbColor.slice(3, 5), 16);
    const b = parseInt(rgbColor.slice(5, 7), 16);
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const contrastLuminance = luminance > 0.5 ? 0 : 255;
    const contrastColor = `rgb(${contrastLuminance}, ${contrastLuminance}, ${contrastLuminance})`;
    const contrastRatio = (luminance + 0.05) / (contrastLuminance + 0.05);
    if (secondColor) {
      const secondR = parseInt(secondColor.slice(1, 3), 16);
      const secondG = parseInt(secondColor.slice(3, 5), 16);
      const secondB = parseInt(secondColor.slice(5, 7), 16);
      const secondLuminance =
        0.2126 * secondR + 0.7152 * secondG + 0.0722 * secondB;
      const secondContrastLuminance = secondLuminance > 0.5 ? 0 : 255;
      const secondContrastColor = `rgb(${secondContrastLuminance}, ${secondContrastLuminance}, ${secondContrastLuminance})`;
      const secondContrastRatio =
        (secondLuminance + 0.05) / (secondContrastLuminance + 0.05);
      if (secondContrastRatio < contrastRatio) {
        return secondContrastColor;
      }
    }
    return contrastColor;
  }
  function rgb(r: number, g: number, b: number) {
    return (
      "#" +
      r.toString(16).padStart(2, "0") +
      (2).toString(g).padStart(2, "0") +
      (3).toString(b).padStart(2, "0")
    );
  }
  function PageLabel() {
    let style = {};
    if (document.title === "Colored") {
      // const fg_calc = calculateContrastColor(rgb(252, 165, 165), gray)
      const backGround = "#0000F0"; // "#90bd84";
      const foreGround = "#FF00FF"; //"#c8c8cc"
      const fg_calc = calculateContrastColor(backGround, foreGround);
      console.log(foreGround, backGround, fg_calc);
      // style = { "background-color": backGround, color: fg_calc };
      // style = `background-color:${backGround};color:${fg_calc}`;
      style = { color: foreGround };
    }
    return (
      <NavItem.Label
        label={document.title}
        style={style}
      />
    );
  }

  function PageMenuButton() {
    global_ItemStatus.callback = ResetStatusCallback;

    return (
      <DropdownMenu onOpenChange={handlePopupOpenChange}>
        <DropdownMenuTrigger className={"inline-flex"}>
          <NavItem.Button
            icon={MoreHorizontal}
            clickable={true}
          />
          {documentMenuContent(documentId!)}
        </DropdownMenuTrigger>
      </DropdownMenu>
    );
  }

  function PageAddNew() {
    const router = useRouter();
    const create = useMutation(api.documents.create);
    const handleOnCreate = () => {
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

    return (
      <NavItem.Button
        icon={Plus}
        onClick={handleOnCreate}
      />
    );
  }

  return (
    <NavItem
      level={level}
      selectable={true}
      active={active}
      onClick={onClick}
      onEnter={() => {
        // clean_up previous item
        if (global_ItemStatus.hovered !== documentId) {
          global_ItemStatus.callback && global_ItemStatus.callback();
        }
        navItemHovered || setNavItemHovered(true); // Refresh item
        global_ItemStatus.hovered = documentId!;

        // console.log(
        //   "NavItem.onEnter",
        //   documentId,
        //   navItemHovered,
        //   global_ItemStatus,
        // );
      }}
      onLeave={() => {
        if (
          navItemHovered &&
          global_ItemStatus.hovered === documentId &&
          global_ItemStatus.opened !== documentId
        ) {
          global_ItemStatus.hovered = "";
          global_ItemStatus.callback = undefined;
          setNavItemHovered(false); // Refresh item
          // console.log(
          //   "NavItem.onLeave changed",
          //   documentId,
          //   navItemHovered,
          //   global_ItemStatus,
          // );
        } else {
          // console.log(
          //   "NavItem.onLeave unchanged",
          //   documentId,
          //   itemStatus,
          //   global_ItemStatus,
          // );
        }
      }}
    >
      {/* Chevron-Icon */}
      <NavItem.Chevron
        active={active}
        expanded={expanded}
        onClick={onExpand}
      />
      <PageIcon />
      <PageLabel />

      {/* Buttons on the right side only on hover */}
      {global_ItemStatus.hovered === documentId! && (
        <>
          <PageMenuButton />
          <PageAddNew />
        </>
      )}
    </NavItem>
  );
};

NavItemDocument.Skeleton = function ItemSkeleton({
  level,
}: {
  level?: number;
}) {
  return (
    <NavItem level={level}>
      <Skeleton className="h-5 w-5" />
      <Skeleton className="h-5 w-[50%]" />
    </NavItem>
  );
};
