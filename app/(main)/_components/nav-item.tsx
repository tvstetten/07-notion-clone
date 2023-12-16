"use client";

import { cn } from "@/lib/utils";
import { ChevronRight, LucideIcon, Trash } from "lucide-react";
import React, { useState, ReactNode } from "react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface NavigationEntryProps {
  level?: number;
  active?: boolean;
  selectable?: boolean;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export interface NavItemButtonBaseProps {
  icon?: LucideIcon | string;
  active?: boolean;
  className?: string;
  size?: number;
  onlyHover?: boolean;
}

export interface NavItemButtonProps extends NavItemButtonBaseProps {
  clickable?: boolean;
  onClick?: boolean | ((event?: React.MouseEvent<HTMLElement>) => void);
}

export interface NavItemButtonDynamikProps extends NavItemButtonBaseProps {
  handleOpenChanged(
    isOpen: boolean,
    setIsOpen: (isOpen: boolean) => void,
    buttonProps: NavItemButtonBaseProps,
    insertButtonHere: () => ReactNode,
  ): ReactNode;
}

export interface NavItemButtonDropdownCallbackProps {
  handleOpenChanged(isOpen: boolean): ReactNode | undefined;
}

export interface NavItemButtonDropdownProps extends NavItemButtonBaseProps {
  handleOpenChanged(isOpen: boolean): ReactNode | undefined;
}
/***
 * calculate the indentation inside the tree
 * Used for the NavigationEntry and the Item.Skeleton
 */
export const calcPaddingLeft = (level?: number) => {
  return level ? `${level * 24 + 3}px` : "";
};

// export const navigationEntryBaseClassnames =
export const navigationEntryBaseClassnames = (height: number = 25) => {
  return `flex align-baseline items-center text-sm rounded-sm my-0.5 p-1 content-start
  justify-start gap-1 max-h-[${height}px] min-h-[${height}px] w-[100%]`;
};

export const NavItem = ({
  level = 0,
  active,
  selectable,
  onClick,
  className,
  children,
}: NavigationEntryProps) => {
  return (
    <div
      onClick={onClick}
      role={selectable ? "button" : "label"}
      style={{ paddingLeft: calcPaddingLeft(level) }}
      className={cn(
        "group border-0",
        navigationEntryBaseClassnames(),
        selectable &&
          "cursor-pointer hover:bg-treeHover hover:text-treeHover-foreground",
        active
          ? "bg-treeSelected text-treeSelected-foreground"
          : "bg-tree text-tree-foreground",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const NavItemSimple = ({
  icon,
  label,
  active,
  selectable = true,
  onClick,
  children,
}: {
  icon?: LucideIcon | string;
  label: string;
  active?: boolean;
  selectable?: boolean;
  onClick?: (event?: React.MouseEvent<HTMLElement>) => void;
  children?: React.ReactNode;
}) => {
  return (
    <NavItem
      level={0}
      onClick={onClick}
      active={active}
      selectable={selectable}
    >
      {icon && (
        <NavItem.Button
          icon={icon}
          active={active}
          clickable={false}
        />
      )}
      <NavItem.Label label={label} />
      {children}
    </NavItem>
  );
};

NavItem.Chevron = ({
  active,
  onClick,
  expanded,
}: {
  active?: boolean;
  expanded?: boolean;
  onClick?: (event?: React.MouseEvent<HTMLElement>) => void;
}) => {
  return (
    <NavItem.Button
      icon={ChevronRight}
      active={active}
      onClick={onClick}
      className={`duration-490 ease transform rotate-${expanded ? 90 : 0}`}
    />
  );
};

NavItem.Label = ({
  label,
  className,
  children,
}: {
  label: String;
  className?: string;
  children?: React.ReactNode;
}) => {
  // align-baseline truncate {] ellipsis
  return (
    <span
      className={cn(
        "flex-auto break-inside-avoid truncate text-start",
        className,
      )}
    >
      {label}
      {children}
    </span>
  );
};

NavItem.Keyboard = ({ keyboard }: { keyboard: string }) => {
  // <kbd className="gap-1 ml-auto inline-flex h-5 rounded-sm  px-1 gap-x-1 text-sm font-mono font-medium bg-muted text-muted-foreground opacity-100">
  return (
    <kbd className="bg-tree font-mono font-extralight text-tree-foreground group-hover:bg-treeHover group-hover:text-treeHover-foreground">
      {keyboard}
    </kbd>
  );
};

NavItem.GroupAlignRight = ({
  onlyHover = true,
  className,
  children,
}: {
  onlyHover?: boolean;
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "ml-auto gap-x-1 ",
        onlyHover ? "hidden group-hover:inline-flex" : "inline-flex",
        "items-center",
        className,
      )}
    >
      {children}
    </div>
  );
};

// Wrapper for the Icon: LucidIcon
NavItem.Button = ({
  icon,
  active = false,
  size = 26,
  className,
  clickable,
  onlyHover,
  onClick,
}: NavItemButtonProps) => {
  clickable = clickable || !!onClick;

  const handleClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    // Only if the onClick is a function (and not a boolean)
    console.log("typeof onClick", typeof onClick, "event", event);
    if (typeof onClick === "function") {
      event.stopPropagation();
      onClick(event);
    }
  };

  // Converts a LucidIcon-icon in a Icon-class
  const ButtonIcon = ({
    icon: Icon,
    className,
  }: {
    icon: LucideIcon;
    className: string;
  }) => {
    return <Icon className={className} />;
  };
  const divSize = `flex-none rounded-sm min-w-[${size}px] max-w-[${size}px] min-h-[${size}px] max-h-[${size}px]`;
  const imageSizeAndClassName = cn(
    `rounded-sm h-${Math.trunc(size / 5)} w-${Math.trunc(size / 5)}`,
    "shrink-0",
    className,
  );

  // we need an outer div to get a group-hoover-color
  return (
    <div
      className={cn(
        divSize,
        "bg-treeButton text-treeButton-foreground",
        onlyHover ? "hidden group-hover:inline-flex" : "inline-flex",
        !clickable
          ? "bg-tree group-hover:bg-treeHover"
          : active
            ? "bg-treeButtonParentHover"
            : "group-hover:bg-treeButtonParentHover",
      )}
    >
      {/* Extra div necessary because of group-hover and hover*/}
      <div
        role={clickable ? "button" : "label"}
        className={cn(
          divSize,
          clickable &&
            "hover:bg-treeButtonHover hover:text-treeButtonHover-foreground",
          "text-treeButton-foreground",
        )}
        onClick={(event: any) => {
          if (typeof onClick === "function") {
            event.stopPropagation();
            onClick();
          }
        }}
      >
        {icon && typeof icon === "object" ? (
          <ButtonIcon
            icon={icon}
            className={imageSizeAndClassName}
          />
        ) : typeof icon === "string" ? (
          icon.length < 5 ? (
            <div className={imageSizeAndClassName}>{icon}</div>
          ) : (
            <Image
              src={icon}
              alt=""
              height={size}
              width={size}
              className={imageSizeAndClassName}
            />
          )
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

NavItem.ButtonDynamic = (buttonProps: NavItemButtonDynamikProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Function that builds the button itself. used if
  //  dropdown is on and also if it's off
  const insertButton = () => {
    return (
      <NavItem.Button
        {...buttonProps}
        onClick={() => setIsOpen(!isOpen)}
      />
    );
  };

  if (isOpen) {
    // special handler if isOpen
    return buttonProps.handleOpenChanged(
      isOpen,
      setIsOpen,
      buttonProps,
      insertButton,
    );
  } else {
    // Only the button if not open
    return insertButton();
  }
};

NavItem.ButtonDropdown = ({
  icon,
  active,
  onlyHover,
  className,
  handleOpenChanged,
}: NavItemButtonDropdownProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Function that builds the button itself. used if
  //  dropdown is on and also if it's off
  const menuButton = () => {
    return (
      <>
        <NavItem.Button
          icon={icon}
          active={active}
          onlyHover={onlyHover && !isOpen}
          className={className}
          onClick={() => setIsOpen(!isOpen)}
        />
        {handleOpenChanged(isOpen)}
      </>
    );
  };

  return (
    <>
      {isOpen ? (
        <DropdownMenu
          open={true}
          onOpenChange={(open) => {
            open || setIsOpen(false);
          }}
        >
          <DropdownMenuTrigger className={"inline-flex max-h-[25] gap-1"}>
            {menuButton()}
          </DropdownMenuTrigger>
          {/* className="h-0 max-h-4 w-0 max-w-0" /> */}
        </DropdownMenu>
      ) : (
        menuButton()
      )}
    </>
  );
};
