"use client";

import { FileText, LucideIcon, MoreHorizontal, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
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
import { GlobalItemStatus } from "./navigation";

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

class NavItemMonitor {
  hovered: undefined | string = "";
  popupOpen: undefined | string = "";
  callback: undefined | (() => void) = undefined;
}
// const GlobalItemStatus = new NavItemMonitor();

export const NavItemDocument = ({
  document,
  level = 0,
  expanded,
  active,
  onClick,
  onExpand,
}: ItemProps) => {
  // todo: return to boolean
  //  !const [navItemHovered, setNavItemHovered] = useState<boolean>(false);
  const [navItemHovered, setNavItemHovered] = useState<string>("");
  const sbStatus = useSidebarContext();

  const documentId = document._id;

  function cl(...where: any[]) {
    console.log([
      ...(where || [""]),
      "did",
      documentId,
      "nih",
      navItemHovered,
      "GIS",
      GlobalItemStatus,
    ]);
  }

  cl("🎇 Redraw");

  // Callback that's set as GlobalItemStatus.callback-value to be able to reset this item
  //  when another item is selected and this element didn't catch the MouseLeave-event
  function ResetStatusCallback() {
    return;
    if (
      GlobalItemStatus.hovered === documentId &&
      GlobalItemStatus.popupOpen === ""
    ) {
      cl("🟢 RSC true");
      GlobalItemStatus.hovered = "";
      GlobalItemStatus.popupOpen = "";
      GlobalItemStatus.callback = undefined;
      setNavItemHovered(""); // Force repaint
      // if (navItemHovered) setNavItemHovered(""); // Force repaint
    } else {
      cl("🟠 RSC false");
    }
  }

  function handlePopupOpenChange(open: boolean) {
    // cl("🤷‍♂️ +handlePopupOpenChange; open =", open);
    // if (open) {
    //   GlobalItemStatus.popupOpen = documentId;
    //   cl("🤷‍♂️ true->handlePopupOpenChange; open =", open);
    // } else {
    //   cl("📗 onClose");
    //   GlobalItemStatus.popupOpen = "";
    //   // GlobalItemStatus.hovered = "";
    //   // setNavItemHovered(""); // refresh lead to a new onEnter if applicable
    // }
    // sbStatus.lockOpenState(open);
    cl("🤷‍♂️ -handlePopupOpenChange; open =", open);
  }

  function PageIcon() {
    const Icon = document.icon || FileText;
    const update = useMutation(api.documents.update);

    // Callback for the IconSelect
    async function handleIconSelect(icon: string) {
      console.log("handleIconSelect, Icon:", icon);
      documentId && update({ id: documentId, icon: icon });
      GlobalItemStatus.popupOpen = "";
      // setIsOpen(false);
    }

    return (
      <>
        {true || navItemHovered ? (
          <IconPicker
            onChange={handleIconSelect}
            onOpenChange={handlePopupOpenChange}
            // className="" //inline-flex h-0 w-0"
            //open={GlobalItemStatus.popupOpen === documentId}
            title="Document Icon"
          >
            <NavItem.Button
              icon={Icon}
              size={NAV_ITEM_IMAGE_SIZE}
              clickable={true} // activate hover
            />
          </IconPicker>
        ) : (
          <NavItem.Button
            icon={Icon}
            size={NAV_ITEM_IMAGE_SIZE}
            clickable={true}
          />
        )}
      </>
    );
  }

  function PageLabel() {
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
    let style = {};
    if (document.title === "Colored") {
      // const fg_calc = calculateContrastColor(rgb(252, 165, 165), gray)
      const backGround = "#0000F0"; // "#90bd84";
      const foreGround = "#FF00FF"; //"#c8c8cc"
      const fg_calc = calculateContrastColor(backGround, foreGround);
      style = { color: foreGround };
    }
    return (
      <NavItem.Label
        label={document._id}
        style={style}
      />
    );
  }

  function PageMenuButton() {
    // <DropdownMenuTrigger className={"inline-flex"}>
    return (
      <DropdownMenu onOpenChange={handlePopupOpenChange}>
        <DropdownMenuTrigger asChild={false}>
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
      documentId={documentId}
      level={level}
      selectable={true}
      active={active}
      onClick={onClick}
      // onEnter={() => {
      //   cl("+onEnter");
      //   if (GlobalItemStatus.popupOpen) return;
      //   // clean_up previous item
      //   GlobalItemStatus.hovered !== documentId &&
      //     GlobalItemStatus.callback &&
      //     GlobalItemStatus.callback();

      //   GlobalItemStatus.hovered = documentId!;
      //   GlobalItemStatus.callback = ResetStatusCallback;
      //   navItemHovered || setNavItemHovered(documentId); // Refresh item
      //   cl("-onEnter");
      // }}
      // onLeave={() => {
      //   // cl("+onLeave");
      //   // ResetStatusCallback();
      //   // cl("-onLeave");
      //   // if (
      //   //   navItemHovered &&
      //   //   GlobalItemStatus.hovered === documentId &&
      //   //   GlobalItemStatus.opened !== documentId
      //   // ) {
      //   //   GlobalItemStatus.hovered = "";
      //   //   GlobalItemStatus.callback = undefined;
      //   //   setNavItemHovered(false); // Refresh item
      //   //   console.log(
      //   //     "NavItem.onLeave changed",
      //   //     documentId,
      //   //     navItemHovered,
      //   //     GlobalItemStatus,
      //   //   );
      //   // } else {
      //   //   // console.log(
      //   //   //   "NavItem.onLeave unchanged",
      //   //   //   documentId,
      //   //   //   itemStatus,
      //   //   //   GlobalItemStatus,
      //   //   // );
      //   // }
      // }}
    >
      {/* Chevron-Icon */}
      <NavItem.Chevron
        expanded={expanded}
        onClick={onExpand}
      />
      <PageIcon />
      <PageLabel />

      {/* Buttons on the right side only on hover */}
      {true ||
        (GlobalItemStatus.hovered === documentId! && (
          <>
            <PageMenuButton />
            <PageAddNew />
          </>
        ))}
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
