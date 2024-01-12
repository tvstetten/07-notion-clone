"use client";

import { toast } from "sonner";

import {
  MenuIcon,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Trash,
} from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { ElementRef, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { useMutation } from "convex/react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import { NavItemUser } from "./nav-item-user";
import { DocumentList } from "./document-list";
import { TrashBox } from "./trash-box";
import { useSearch } from "@/hooks/use-search";
import { useSettings } from "@/hooks/use-settings";
import { Navbar } from "./navbar";
import { NavItem, NavItemSimple } from "./nav-item";

const defaultWidth = 240;
const mobileWidth = 300;
const minWidth = 120;
const maxWidth = 480;

export const Navigation = () => {
  const router = useRouter();
  const settings = useSettings();
  const search = useSearch();
  const params = useParams();
  const pathname = usePathname();
  // const isMobile = useMediaQuery("(max-width: 768px)")
  const isMobile = useMediaQuery(`(max-width: ${mobileWidth}px)`);
  const create = useMutation(api.documents.create);

  const isResizingRef = useRef(false);
  const sidebarRef = useRef<ElementRef<"aside">>(null);
  const navbarRef = useRef<ElementRef<"div">>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  // My own extension
  const [lastWidth, setLastWidth] = useState(defaultWidth);
  const handleMouseMove = (event: MouseEvent) => {
    // console.log("handleMouseMove")
    if (!isResizingRef.current) return;
    let newWidth = event.clientX;

    if (newWidth < minWidth) newWidth = minWidth;
    if (newWidth > maxWidth) newWidth = maxWidth;

    setLastWidth(newWidth);

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.setProperty("left", `${newWidth}px`);
      navbarRef.current.style.setProperty(
        "width",
        `calc(100% - ${newWidth}px)`,
      );
    }
  };

  const handleMouseUp = () => {
    // console.log("handleMouseUp")
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    // console.log("handleMouseDown")
    event.preventDefault();
    event.stopPropagation();
    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);

      sidebarRef.current.style.width = isMobile ? "100%" : `${lastWidth}px`;
      navbarRef.current.style.setProperty(
        "width",
        isMobile ? "0" : `calc(100% - ${lastWidth}px)`,
      );
      navbarRef.current.style.setProperty(
        "left",
        isMobile ? "100%" : `${lastWidth}px`,
      );
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);

      sidebarRef.current.style.width = "0";
      navbarRef.current.style.setProperty("width", "100%");
      navbarRef.current.style.setProperty("left", "0");
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  useEffect(() => {
    if (isMobile) {
      collapse();
    } else {
      resetWidth();
    }
  }, [isMobile, resetWidth]);

  useEffect(() => {
    if (isMobile) {
      collapse();
    }
  }, [pathname, isMobile]);

  const onCreate = () => {
    const promise = create({ title: "Untitled" }).then((documentId) =>
      router.push(`/documents/${documentId}`),
    );

    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created",
      error: "could not create a new note",
    });
  };

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          "group/sidebar relative z-[9999] flex h-full flex-col overflow-y-auto bg-tree",
          isResetting && "transition-all duration-300 ease-in-out",
          isMobile && "w-0",
        )}
      >
        {/* <div
          onClick={collapse}
          role="button"
          className={cn(
            "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-blue-300 absolute top-1 right-6 opacity-0 group-hover/sidebar:opacity-100 transition",
            isMobile && "opacity-100",
          )}
        >
          <ChevronsLeft className="h-6 w-6" />
        </div> */}

        <div className="px-1">
          <div className="mt-1">
            <NavItemUser />
            <NavItemSimple
              label="Search"
              icon={Search}
              onClick={search.onOpen}
            >
              <NavItem.Keyboard keyboard="Ctrl+K" />
            </NavItemSimple>

            <NavItemSimple
              label="Settings"
              icon={Settings}
              onClick={settings.onOpen}
            />
            <NavItemSimple
              onClick={onCreate}
              label="New page"
              icon={PlusCircle}
            />
          </div>

          <div className="mt-4">
            <DocumentList />
            <NavItemSimple
              onClick={onCreate}
              icon={Plus}
              label="Add a page"
            />
            <Popover>
              <PopoverTrigger className="mt-4 w-full">
                <NavItemSimple
                  label="Trash"
                  icon={Trash}
                />
              </PopoverTrigger>
              <PopoverContent
                className="w-72 p-0"
                side={isMobile ? "bottom" : "right"}
              >
                <TrashBox />
              </PopoverContent>
            </Popover>{" "}
          </div>
        </div>

        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className="bg-primary/10 absolute right-0 top-0 h-full w-1 cursor-col-resize opacity-0 transition group-hover/sidebar:opacity-100"
        />
      </aside>

      <div
        ref={navbarRef}
        className={cn(
          "absolute left-60 top-0 z-auto",
          `w-[calc(100%-${minWidth}px)]`,
          isResetting && "transition-all duration-300 ease-in-out",
          isMobile && "left-0 w-full",
        )}
      >
        {!!params.documentId ? (
          <Navbar
            isCollapsed={isCollapsed}
            onResetWidth={resetWidth}
          />
        ) : (
          <nav className="w-full bg-transparent px-3 py-2">
            {isCollapsed && (
              <MenuIcon
                onClick={resetWidth}
                role="button"
                className="h-6 w-6 text-muted-foreground"
              />
            )}
          </nav>
        )}
      </div>
    </>
  );
};
