"use client";

import { toast } from "sonner";

import { Plus, PlusCircle, Search, Settings, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { api } from "@/convex/_generated/api";
import { NavItemUser } from "./nav-item-user";
import { DocumentList } from "./document-list";
import { TrashBox } from "./trash-box";
import { useSearch } from "@/hooks/use-search";
import { useSettings } from "@/hooks/use-settings";
import { Navbar } from "./navbar";
import { NavItem, NavItemSimple } from "./nav-item";
import {
  Sidebar,
  SidebarPage,
  SidebarSplitter,
  createSidebarProps,
} from "@/components/mylib/sidebar";
import isMobile from "@/components/mylib/is-mobile";

const GlobalSidebarProps = createSidebarProps(
  {
    minWidth: 160, //
    maxWidth: 500,
    mobileWidth: 300,
    floatingZIndex: 99999,
  },
  {
    width: 240, // set without check or callback
    isMobile: isMobile(),
  },
);

export const Navigation = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const settings = useSettings();
  const search = useSearch();
  const create = useMutation(api.documents.create);

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
    <SidebarPage sbProps={GlobalSidebarProps}>
      <Sidebar className={"bg-tree text-tree-foreground"}>
        <SidebarSplitter />
        <div
          id="Sidebar-content"
          className="flex h-full flex-grow flex-col overflow-auto px-1 py-1"
        >
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
              <PopoverTrigger className="mt-4 w-full justify-start">
                <NavItemSimple
                  label="Trash"
                  icon={Trash}
                />
              </PopoverTrigger>
              <PopoverContent
                className="w-72 p-0"
                side={isMobile() ? "bottom" : "right"}
              >
                <TrashBox />
              </PopoverContent>
            </Popover>{" "}
          </div>
        </div>
      </Sidebar>
      {children}
      <div id="AFTER_CHILDREN" />
    </SidebarPage>
  );
};
