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
  onClick?: () => void;
  onEnter?: (event?: React.MouseEvent<HTMLElement>) => void;
  onLeave?: (event?: React.MouseEvent<HTMLElement>) => void;
  className?: string;
  children?: React.ReactNode;
}

export interface NavItemBaseProps {
  className?: string;
  icon?: LucideIcon | string;
  size?: number;
}

export interface NavItemButtonProps extends NavItemBaseProps {
  active?: boolean;
  onlyHover?: boolean;
  clickable?: boolean;
  onClick?: boolean | ((event?: React.MouseEvent<HTMLElement>) => void);
}

export const NAV_ITEM_IMAGE_SIZE = 20;

export const NavItem = ({
  level = 0,
  active,
  selectable,
  height = 26,
  onClick,
  onEnter,
  onLeave,
  className,
  children,
}: NavItemProps) => {
  return (
    <div
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
        "group my-0.5 gap-1 border-0 border-transparent py-[2px]",
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
  iconSize = 20,
  label,
  active,
  selectable = true,
  onClick,
  children,
}: {
  icon?: LucideIcon | string;
  iconSize?: number;
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
        <NavItem.Icon
          icon={icon}
          size={iconSize}
          // active={active}
          // clickable={false}
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
        "flex-auto break-inside-avoid truncate text-left",
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
      className={className}
    />
  );
};

// Wrapper for the Icon: LucidIcon
NavItem.Button = ({
  icon,
  size = 16,
  className,
  active = false,
  onlyHover,
  clickable,
  onClick,
}: NavItemButtonProps) => {
  return (
    <div
      role={!!onClick ? "button" : "label"}
      className={cn(
        // `rounded-sm size-[] w-[${size}px] h-[${size}px] min-w-[${size}px] max-w-[${size}px] min-h-[${size}px] max-h-[${size}px]`,
        // " flex-shrink-0 flex-grow-0 items-center",
        `rounded-sm size-[${size}px] `,
        "border-0 text-treeButton-foreground",
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

NavItem.GroupAlignRight = ({
  onlyHover,
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
        "ml-auto items-center gap-x-1",
        onlyHover ? "hidden group-hover:inline-flex" : "inline-flex",
        className,
      )}
    >
      {children}
    </div>
  );
};

// export interface NavItemButtonDynamikProps extends NavItemBaseProps {
//   handleOpenChanged(
//     isOpen: boolean,
//     setIsOpen: (isOpen: boolean) => void,
//     buttonProps: NavItemBaseProps,
//     insertButtonHere: () => ReactNode,
//   ): ReactNode;
// }

// export interface NavItemButtonDropdownCallbackProps {
//   handleOpenChanged(isOpen: boolean): ReactNode | undefined;
// }

// export interface NavItemButtonDropdownProps extends NavItemBaseProps {
//   handleOpenChanged(isOpen: boolean): ReactNode | undefined;
// }

// {icon && typeof icon === "object" ? (
//   // Need a separate function to convert to an <Icon>
//   <ButtonIcon
//     icon={icon}
//     className={imageSizeAndClassName}
//   />
// ) : typeof icon === "string" ? (
//   icon.length < 5 ? (
//     // Character-Emoji
//     <span
//       className={cn(
//         imageSizeAndClassName,
//         "flex-auto break-inside-avoid truncate text-start",
//       )}
//     >
//       {icon}
//     </span>
//   ) : (
//     // A "real" image
//     <Image
//       src={icon}
//       alt=""
//       height={size}
//       width={size}
//       className={className}
//     />
//   )
// ) : (
//   ""
// )}

// NavItem.ButtonDynamic = (buttonProps?: NavItemButtonDynamikProps) => {
//   const [isOpen, setIsOpen] = useState<boolean>(false);

//   // Function that builds the button itself. used if
//   //  dropdown is on and also if it's off
//   const insertButton = () => {
//     return (
//       <NavItem.Button
//         {...buttonProps}
//         onClick={() => setIsOpen(!isOpen)}
//       />
//     );
//   };

//   console.log("NavItem.ButtonDynamic: isOpen", isOpen);
//   if (isOpen) {
//     // special handler if isOpen
//     return buttonProps?.handleOpenChanged(
//       isOpen,
//       setIsOpen,
//       buttonProps,
//       insertButton,
//     );
//   } else {
//     // Only the button if not open
//     return insertButton();
//   }
// };

// NavItem.ButtonDropdown = ({
//   icon,
//   active,
//   onlyHover,
//   className,
//   handleOpenChanged,
// }: NavItemButtonDropdownProps) => {
//   // const [isOpen, setIsOpen] = useState<boolean>(false);
//   const [buttonState, setButtonState] = useState<number>(0);
//   const sbContext = useSidebarContext();

//   // Function that builds the button itself. Used if
//   //  dropdown is on and also if it's off
//   const menuButton = () => {
//     // if (isOpen) console.log("menuButton()");

//     return (
//       <>
//         <NavItem.Button
//           icon={icon}
//           active={active}
//           onlyHover={onlyHover && buttonState < 2}
//           className={className}
//           onClick={() => {
//             setButtonState(2);
//             console.log("ButtonDropdown.OnClick");
//           }}
//           onEnter={() => {
//             if (buttonState === 0) {
//               setButtonState(1);
//             }
//             // console.log("ButtonDropdown.OnEnter");
//           }}
//           onLeave={() => {
//             if (buttonState === 1) {
//               setButtonState(0);
//             }
//             // console.log("ButtonDropdown.OnLeave");
//           }}
//         />
//         {handleOpenChanged(buttonState > 1)}
//       </>
//     );
//   };

//   console.log("DropdownMenu: buttonState:", buttonState);
//   return (
//     <>
//       {buttonState ? (
//         <DropdownMenu
//           // defaultOpen={true}
//           // open={true}
//           onOpenChange={(open) => {
//             console.log("DropdownMenu.onOpenChange", open);
//             sbContext.lockOpenState(open);
//             if (!open) setButtonState(0);
//             // open || setIsOpen(false);
//           }}
//         >
//           <DropdownMenuTrigger className={"inline-flex max-h-[25] gap-1"}>
//             {menuButton()}
//           </DropdownMenuTrigger>
//           {/* className="h-0 max-h-4 w-0 max-w-0" /> */}
//         </DropdownMenu>
//       ) : (
//         menuButton()
//       )}
//     </>
//   );
// };

// NavItem.ButtonDropdown = ({
//   icon,
//   active,
//   onlyHover,
//   className,
//   handleOpenChanged,
// }: NavItemButtonDropdownProps) => {
//   const [isOpen, setIsOpen] = useState<boolean>(false);

//   // Function that builds the button itself. Used if
//   //  dropdown is on and also if it's off
//   const menuButton = () => {
//     if (isOpen) console.log("menuButton()");

//     return (
//       <>
//         <NavItem.Button
//           icon={icon}
//           active={active}
//           onlyHover={onlyHover && !isOpen}
//           className={className}
//           onClick={() => setIsOpen(!isOpen)}
//           onEnter={() => console.log("ButtonDropdown.OnEnter")}
//           onLeave={() => console.log("ButtonDropdown.OnLeave")}
//         />
//         {handleOpenChanged(isOpen)}
//       </>
//     );
//   };

//   console.log("DropdownMenu: active", active, onlyHover);
//   return (
//     <>
//       {isOpen ? (
//         <DropdownMenu
//           defaultOpen={true}
//           // open={true}
//           onOpenChange={(open) => {
//             console.log("DropdownMenu.onOpenChange", open);
//             open || setIsOpen(false);
//           }}
//         >
//           <DropdownMenuTrigger className={"inline-flex max-h-[25] gap-1"}>
//             {menuButton()}
//           </DropdownMenuTrigger>
//           {/* className="h-0 max-h-4 w-0 max-w-0" /> */}
//         </DropdownMenu>
//       ) : (
//         menuButton()
//       )}
//     </>
//   );
// };

// {isOpen ? (
//   <DropdownMenu
//     defaultOpen={true}
//     // open={true}
//     onOpenChange={(open) => {
//       console.log("DropdownMenu.onOpenChange", open);
//       open || setIsOpen(false);
//     }}
//   >
//     <DropdownMenuTrigger className={"inline-flex max-h-[25] gap-1"}>
//       {menuButton()}
//     </DropdownMenuTrigger>
//     {/* className="h-0 max-h-4 w-0 max-w-0" /> */}
//   </DropdownMenu>
// ) : (
//   menuButton()
// )}
