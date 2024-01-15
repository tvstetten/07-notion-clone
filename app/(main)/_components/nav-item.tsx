//"use client";

import { cn } from "@/lib/utils";
import { ChevronRight, LucideIcon } from "lucide-react";
import React from "react";
import { AnyImage } from "@/components/any-image";

export interface NavItemProps {
  level?: number;
  active?: boolean;
  selectable?: boolean;
  height?: number;
  documentId?: any;
  onClick?: () => void;
  onEnter?: (event?: React.MouseEvent<HTMLElement>) => void;
  onLeave?: (event?: React.MouseEvent<HTMLElement>) => void;
  className?: string;
  children?: React.ReactNode;
}

export interface NavItemSimpleProps {
  icon?: LucideIcon | string;
  iconSize?: number;
  label: string;
  active?: boolean;
  selectable?: boolean;
  onClick?: (event?: React.MouseEvent<HTMLElement>) => void;
  children?: React.ReactNode;
}

export interface NavItemBaseProps {
  className?: string;
  icon?: LucideIcon | string;
  size?: number;
}

export interface NavItemButtonProps extends NavItemBaseProps {
  clickable?: boolean;
  onClick?: boolean | ((event?: React.MouseEvent<HTMLElement>) => void);
}

export const NAV_ITEM_IMAGE_SIZE = 20;

export const NavItem = ({
  level = 0,
  active,
  selectable,
  height = 26,
  documentId,
  onClick,
  onEnter,
  onLeave,
  className,
  children,
}: NavItemProps) => {
  return (
    <div
      id="nav-item"
      data-doc-id={documentId}
      onClick={onClick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      role={selectable ? "button" : "label"}
      style={{
        paddingLeft: level ? `${level * 24 + 0}px` : "3px",
        paddingRight: "3px",
        height: `${height}px`,
      }}
      className={cn(
        "group my-0.5 gap-1 py-[2px]",
        "flex flex-row content-start items-center justify-start rounded-sm align-baseline text-sm",
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
  iconSize = NAV_ITEM_IMAGE_SIZE,
  label,
  active,
  selectable = true,
  onClick,
  children,
}: NavItemSimpleProps) => {
  return (
    <NavItem
      level={0}
      onClick={onClick}
      active={active}
      selectable={selectable}
    >
      {icon && (
        <NavItem.Icon
          icon={icon}
          size={iconSize}
        />
      )}
      <NavItem.Label label={label} />
      {children}
    </NavItem>
  );
};

NavItem.Chevron = ({
  onClick,
  expanded,
}: {
  expanded?: boolean;
  onClick?: (event?: React.MouseEvent<HTMLElement>) => void;
}) => {
  return (
    <NavItem.Button
      icon={ChevronRight}
      onClick={onClick}
      className={`duration-490 ease transform rotate-${expanded ? 90 : 0}`}
    />
  );
};

NavItem.Label = ({
  label,
  className,
  style,
}: {
  label: String;
  className?: string;
  style?: object;
}) => {
  // align-baseline truncate {] ellipsis
  return (
    <span
      style={style || {}}
      className={cn(
        "w-full flex-auto break-inside-avoid truncate text-left",
        className,
      )}
    >
      {label}
    </span>
  );
};

NavItem.Icon = ({
  icon,
  size = 16, // again with default
  className,
}: NavItemBaseProps) => {
  return (
    <AnyImage
      icon={icon}
      size={size}
      // define text-size for the Emojis
      className={cn("shrink-0 grow-0 text-sm ", className)}
    />
  );
};

NavItem.Button = ({
  icon,
  size = 16,
  className,
  clickable,
  onClick,
}: NavItemButtonProps) => {
  return (
    <div
      role={!!onClick ? "button" : "label"}
      style={{ height: size, width: size }}
      className={cn(
        "g-0 m-0 shrink-0 grow-0 select-none items-center rounded-sm border-0 border-transparent p-0 text-center text-treeButton-foreground",
        (clickable || !!onClick) &&
          "hover:bg-treeButtonHover hover:text-treeButtonHover-foreground",
      )}
      onClick={(event: any) => {
        if (typeof onClick === "function") {
          event.stopPropagation();
          onClick();
        }
      }}
    >
      {icon && (
        <NavItem.Icon
          icon={icon}
          size={size}
          className={className}
        />
      )}
    </div>
  );
};

NavItem.Keyboard = ({ keyboard }: { keyboard: string }) => {
  return <kbd className="font-mono font-extralight ">{keyboard}</kbd>;
  //   <kbd className="bg-tree font-mono font-extralight text-tree-foreground group-hover:bg-treeHover group-hover:text-treeHover-foreground">
  //   {keyboard}
  // </kbd>
};

// NavItem.GroupAlignRight = ({
//   onlyHover,
//   className,
//   children,
// }: {
//   onlyHover?: boolean;
//   className?: string;
//   children?: React.ReactNode;
// }) => {
//   return (
//     <div
//       className={cn(
//         "ml-auto items-center gap-x-1",
//         onlyHover ? "hidden group-hover:inline-flex" : "inline-flex",
//         className,
//       )}
//     >
//       {children}
//     </div>
//   );
// };
