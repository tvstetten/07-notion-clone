"use client";

import { ChevronsLeft, ChevronsLeftRight, User2 } from "lucide-react";
import { useUser, SignOutButton } from "@clerk/clerk-react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavItem, navigationEntryBaseClassnames } from "./nav-item";
import { CO_POPUP_MENU_SHADOW, cn } from "@/lib/utils";

export const NavItemUser = () => {
  const { user } = useUser();

  return (
    <NavItem
      level={0}
      selectable={true}
      active={false}
      onClick={undefined}
      className="gl-0 -ml-0 pl-0"
    >
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            navigationEntryBaseClassnames(28),
            "items-center justify-start text-start outline-none",
          )}
        >
          <>
            {/* Avatar-image */}
            <NavItem.Button
              icon={user?.imageUrl || User2}
              size={30}
              className="rounded-full text-treeSelected-foreground"
            />
            {/* User-name */}
            <NavItem.Label
              label={`${user?.fullName || user?.emailAddresses[0]}'s Jotion`}
              className="flex-initial text-treeSelected-foreground"
            ></NavItem.Label>

            {/* Image to show that there is a drop-down */}
            <ChevronsLeftRight className="h-4 w-4 shrink-0 rotate-90 text-treeButton-foreground" />

            {/* Navbar-collapse button (on the right) */}
            <NavItem.GroupAlignRight className="group-hover/sidebar:inline-flex">
              <NavItem.Button
                icon={ChevronsLeft}
                size={28}
                clickable={true}
              />
            </NavItem.GroupAlignRight>
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
    </NavItem>
  );
};
