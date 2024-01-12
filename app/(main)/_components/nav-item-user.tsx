"use client";

import { ChevronsLeft, ChevronsUpDown, Settings, User2 } from "lucide-react";
import { useUser, SignOutButton } from "@clerk/clerk-react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavItem } from "./nav-item";
import { CO_POPUP_MENU_SHADOW, cn } from "@/lib/utils";
import { useSidebarContext } from "@/components/mylib/sidebar";

export const NavItemUser = () => {
  const { user } = useUser();
  const lockOpenState = useSidebarContext().lockOpenState;

  return (
    <NavItem
      level={0}
      selectable={true}
      active={false}
      onClick={undefined}
      className="mb-2 text-treeSelected-foreground"
      height={32}
      // className="ml-0 gap-x-0 pl-0 pr-2"
    >
      <DropdownMenu onOpenChange={(open) => lockOpenState(open)}>
        <DropdownMenuTrigger
          className={cn(
            "w-full min-w-0",
            "outline-none",
            "group shrink border-0 border-transparent",
            "flex flex-row content-start items-center justify-start rounded-sm align-baseline text-sm",
            "my-0.5 gap-1 py-[2px] pl-[1px] pr-[3px]",
          )}
        >
          <>
            {/* Avatar-image */}
            <NavItem.Icon
              icon={user?.imageUrl || User2}
              size={28}
              className="rounded-full text-treeSelected-foreground"
            />

            <div className="flex flex-row content-start justify-start gap-1 truncate align-baseline">
              {/* User-name */}
              <NavItem.Label
                label={`${user?.fullName || user?.emailAddresses[0]}'s Jotion`}
                // className="text-treeSelected-foreground"
                // className="place-self-start"
              />

              {/* Image to show that there is a drop-down */}
              <NavItem.Icon
                icon={ChevronsUpDown}
                size={20}
                // className="text-treeButton-foreground"
                className="shrink-0 grow-0"
              />
            </div>
            {/* <NavItem.Icon
              icon={Settings}
              size={20}
              // className="text-treeButton-foreground"
              className="shrink-0 grow-0"
            />

            {/* Navbar-collapse button (on the right) */}
            {/* <NavItem.GroupAlignRight
              onlyHover={true}
              className="group-hover/sidebar:inline-flex"
            > */}
            {/*<NavItem.Button
              icon={ChevronsLeft}
              size={28}
              clickable={true}
            /> */}
            {/* </NavItem.GroupAlignRight> */}
          </>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          // className="hover:shadow-[0_10px_20px_rgba(0,_0,_0,_0.7)]"
          // className="shadow-[0_7px_10px_rgba(0,_0,_0,_0.7)]"
          className={CO_POPUP_MENU_SHADOW()}
          align="start"
          alignOffset={11}
          forceMount
        >
          <div className="flex flex-col space-y-4 p-2">
            <p className="text-xs font-medium leading-none text-muted-foreground">
              {user?.emailAddresses[0].emailAddress}
            </p>
            <div className="flex items-center gap-x-2">
              <div className="rounded-md bg-secondary p-1">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.imageUrl} />
                </Avatar>
              </div>
              <div className="space-y-1">
                <p className="line-clamp-1 text-sm">
                  {user?.fullName}&apos;s Jotion
                </p>
              </div>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            asChild
            className="w-full cursor-pointer text-muted-foreground"
          >
            <SignOutButton>Log out</SignOutButton>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <NavItem.Button
        icon={Settings}
        size={20}
        clickable={true}
        // className="text-treeButton-foreground"
        className="shrink-0 grow-0"
      />

      {/* Navbar-collapse button (on the right) */}
      {/* <NavItem.GroupAlignRight
              onlyHover={true}
              className="group-hover/sidebar:inline-flex"
            > */}
      <NavItem.Button
        icon={ChevronsLeft}
        size={26}
        clickable={true}
        className="group-hover/sidebar:inline-flex"
      />
    </NavItem>
  );
};
