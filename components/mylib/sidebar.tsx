import clsx from "clsx";
import { MotionConfig, motion } from "framer-motion";
import React, {
  HTMLAttributes,
  PointerEvent,
  ReactNode,
  PointerEvent as ReactPointerEvent,
  createContext,
  useContext,
} from "react";

import {
  CrossRefProperties,
  CrossRefStore,
  createCrossRefProps,
} from "./cross-ref-store";

export const OpenState = {
  Locked: "locked",
  Unlocked: "unlocked",
  Hidden: "hidden",
} as const;

export type TOpenState = (typeof OpenState)[keyof typeof OpenState];

export const extraClassNames = {
  locked_className: "",
  unlocked_className: "",
  mobile_className: "",
};

// Observable properties of the inside store
interface SidebarStore extends CrossRefStore<SidebarProps> {
  width: number;
  isDragging: boolean;
  openState: TOpenState;
  isMobile: boolean;
}

interface SidebarPropsProperties {
  openStateLocked: number;
  autoOpenWidth: number;
  minWidth: number;
  maxWidth: number;
  floatingTop: number | string;
  floatingBottom?: number | string;
  floatingZIndex: number;
  floatingRadius: number;
  animationDelay: number;
  mobileWidth: number | string;
  mobileAnimationDelay: number;
}

interface SidebarPropsActions {
  onChangeWidth?(sbProps: SidebarProps): void;
  onChangeOpenState?: (sbProps: SidebarProps) => void;
  onChangeIsDragging?: (sbProps: SidebarProps) => void;

  // Properties of the Store
  useWidth(): number;
  getWidth(): number;
  setWidth(newValue: number): void;

  useIsDragging(): boolean;
  getIsDragging(): boolean;
  setIsDragging(newValue: boolean): void;

  useIsMobile(): boolean;
  getIsMobile(): boolean;
  setIsMobile(newValue: boolean): void;

  useOpenState(): TOpenState;
  getOpenState(): TOpenState;
  setOpenState(newValue: TOpenState, context?: String): void;

  lockOpenState(lock: boolean): void;

  print(context?: string): void;
}

interface SidebarProps
  extends CrossRefProperties<SidebarStore>,
    SidebarPropsProperties,
    SidebarPropsActions {}

export function createSidebarProps(
  propsDefaults: Partial<SidebarPropsProperties> = {} as SidebarPropsProperties,
  storeDefaults: Partial<SidebarStore> = {} as SidebarStore,
) {
  // Create the final properties
  const sbProps = createCrossRefProps<SidebarProps, SidebarStore>(
    {
      ...{
        openStateLocked: 0,
        minWidth: 150, // default_width
        maxWidth: 400,
        autoOpenWidth: 50,
        floatingTop: "60px",
        floatingBottom: "30px",
        floatingZIndex: 1000,
        floatingRadius: 5,
        animationDelay: 0.3,
        mobileWidth: "87vw", // use vh because % doesn't work in animation
        mobileAnimationDelay: 0.2,
      },
      // override with the parameter-values
      ...propsDefaults,

      useWidth: () => sbProps.useStore((state) => state.width),
      getWidth: () => sbProps.useStore.getState().width,
      setWidth: (newValue: number) => {
        // keep it in the valid range
        newValue = Math.floor(
          Math.min(Math.max(newValue, sbProps.minWidth), sbProps.maxWidth),
        );

        if (newValue !== sbProps.getWidth()) {
          sbProps.useStore.setState({ width: newValue });
          sbProps.onChangeWidth?.(sbProps); // Execute Callback if defined
        }
      },

      useIsDragging: () => sbProps.useStore((state) => state.isDragging),
      getIsDragging: () => sbProps.useStore.getState().isDragging,
      setIsDragging: (newValue: boolean) => {
        if (newValue !== sbProps.useStore.getState().isDragging) {
          sbProps.useStore.setState({ isDragging: newValue });
          sbProps.onChangeIsDragging?.(sbProps); // Execute Callback if defined
        }
      },

      useIsMobile: () => sbProps.useStore((state) => state.isMobile),
      getIsMobile: () => sbProps.useStore.getState().isMobile,
      setIsMobile: (newValue: boolean) => {
        if (newValue !== sbProps.useStore.getState().isMobile) {
          // console.log('setIsMobile', newValue)
          sbProps.useStore.setState({ isMobile: newValue });
        }
      },

      useOpenState: () => sbProps.useStore((state) => state.openState),
      getOpenState: () => sbProps.useStore.getState().openState,
      setOpenState: (newValue: TOpenState, context: String) => {
        if (
          newValue === OpenState.Locked &&
          sbProps.useStore.getState().isMobile
        ) {
          // console.log('setOpenState - set locked changed to unlocked')
          newValue = OpenState.Unlocked;
        }

        if (
          sbProps.openStateLocked === 0 &&
          newValue !== sbProps.useStore.getState().openState
        ) {
          // if (context && context.includes('!!!'))
          //   console.log('setOpenState - will change to', newValue)
          sbProps.useStore.setState({ openState: newValue });
          sbProps.onChangeOpenState?.(sbProps); // Execute Callback if defined
        }
      },

      lockOpenState: (lock: boolean) => {
        // sbProps.openStateLocked = sbProps.openStateLocked + (lock ? 1 : -1);
        sbProps.openStateLocked = lock ? 1 : 0;
        console.log(
          "lockOpenState changed to",
          sbProps.openStateLocked,
          " flag",
          lock,
        );
      },

      // Debug-function
      print: (context: string) => {
        console.log("SidebarProps", context ? `(${context})` : "");
        console.dir(sbProps);
        console.dir(sbProps.useStore.getState());
      },
    } as SidebarProps, // Needed because the provided object is incomplete

    () => {
      return {
        ...{
          width: 150, // default_width
          isDragging: false,
          openState: storeDefaults?.isMobile
            ? OpenState.Hidden
            : OpenState.Locked,
          isMobile: false,
        },

        // override with the parameter-values
        ...storeDefaults,
      };
    },
  ) as SidebarProps;

  return sbProps;
}

export const SidebarContext = createContext<SidebarProps | null>(null);

export function useSidebarContext() {
  const value = useContext(SidebarContext);
  if (!value) {
    throw new Error(
      "useSidebarContext has to be used within <SidebarContext.Provider>",
    );
  }
  return value as SidebarProps;
}

interface SidebarPageProps {
  sbProps: SidebarProps;
  className?: String;
  children: ReactNode;
}

interface SidebarComponentProps {
  className?: String;
  children: ReactNode;
}

export const SidebarPage = ({
  sbProps,
  className,
  children,
  ...props
}: SidebarPageProps) => {
  const isDragging = sbProps.useIsDragging();
  const openState = sbProps.useOpenState();

  function isOverSidebar(ele: Element | null) {
    // Determine if the target element is a child of the sidebar
    if (sbProps.getOpenState() !== OpenState.Hidden) {
      while (ele != null) {
        if (ele.id === "sidebar-container") return true;
        ele = ele.parentElement;
      }
    }
    return false;
  }

  return (
    <SidebarContext.Provider value={sbProps}>
      <MotionConfig
        transition={{
          ease: [0.165, 0.84, 0.44, 1],
          duration: isDragging
            ? 0
            : sbProps.getIsMobile()
              ? sbProps.mobileAnimationDelay
              : sbProps.animationDelay,
        }}
        {...props}
      >
        <div
          id="sidebar-page"
          className={clsx("flex h-screen w-screen overflow-auto", className)}
          // click on the background to close in mobile-mode
          onClick={(e: React.MouseEvent<HTMLElement>) => {
            if (
              sbProps.openStateLocked === 0 &&
              sbProps.getIsMobile() &&
              openState !== OpenState.Hidden &&
              !isOverSidebar(e.target as Element)
            ) {
              sbProps.setOpenState(OpenState.Hidden, "sidebarPage-onClick");
            }
          }}
          //
          onPointerMove={(e: PointerEvent) => {
            if (isDragging || sbProps.getIsMobile()) {
              // console.log('onPointerMove_0-IsMobile->exit')
            } else if (e.clientX < sbProps.autoOpenWidth) {
              openState === OpenState.Hidden &&
                sbProps.setOpenState(OpenState.Unlocked, "onPointerMove_1");
            } else if (isOverSidebar(e.target as Element)) {
              openState === OpenState.Hidden &&
                !sbProps.getIsMobile() &&
                sbProps.setOpenState(OpenState.Unlocked, "onPointerMove_2 ");
            } else if (
              sbProps.openStateLocked === 0 &&
              openState === OpenState.Unlocked
            ) {
              sbProps.setOpenState(OpenState.Hidden, "onPointerMove_3");
            }
            // console.log('onPointerMove_0-exit')
          }}
        >
          {children}
        </div>
      </MotionConfig>
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({ className, children }: SidebarComponentProps) => {
  const sbProps = useSidebarContext();
  const width = sbProps.useWidth();
  const isDragging = sbProps.useIsDragging();
  const openState = sbProps.useOpenState();

  function addPX(value: any) {
    return !isNaN(value) ? `${value}px` : value;
  }

  const isMobile = sbProps.getIsMobile();
  const borderRightRadius =
    openState === OpenState.Locked || isMobile
      ? "0px"
      : `${sbProps.floatingRadius}px`;
  const fullSize =
    openState === OpenState.Locked ||
    (openState === OpenState.Unlocked && isMobile);
  const currentWidth = isMobile ? sbProps.mobileWidth : `${width}px`;
  const optWidth = `calc(min(max(${currentWidth},${addPX(
    sbProps.minWidth,
  )}),${addPX(sbProps.maxWidth)}))`;

  return (
    <motion.nav
      role="sidebar"
      id="sidebar-container"
      style={{ zIndex: sbProps.floatingZIndex }}
      className={clsx(
        "relative flex h-screen flex-shrink-0 flex-col",
        isDragging && "cursor-col-resize",
      )}
      animate={{ width: openState === OpenState.Locked ? width : 0 }}
      initial={false}
      // close floating <Sidebar> if mouse leaves
      onPointerLeave={() => {
        if (
          !isDragging &&
          sbProps.openStateLocked === 0 &&
          !sbProps.getIsMobile() &&
          openState === OpenState.Unlocked
        ) {
          sbProps.setOpenState(OpenState.Hidden, "onPointerLeave");
        }
      }}
    >
      <motion.div
        id="sidebar-sidebar"
        className={clsx(
          "absolute left-0 overflow-clip",
          openState === OpenState.Unlocked &&
            !isMobile &&
            !!sbProps.floatingRadius &&
            "py-1", // avoid a scrollbar to override the rounded border
          openState === OpenState.Hidden
            ? ""
            : isMobile
              ? extraClassNames.mobile_className
              : openState === OpenState.Unlocked
                ? extraClassNames.unlocked_className
                : extraClassNames.locked_className,
          className,
        )}
        initial={false}
        animate={{
          borderTopRightRadius: borderRightRadius,
          borderBottomRightRadius: borderRightRadius,
          opacity: openState === OpenState.Hidden ? 0 : 1.0,
          x: openState === OpenState.Hidden ? `-${currentWidth}` : 0,
          width: optWidth,
          top: fullSize ? 0 : sbProps.floatingTop,
          bottom: fullSize ? 0 : sbProps.floatingBottom || sbProps.floatingTop,
        }}
      >
        {children}
      </motion.div>
    </motion.nav>
  );
};

export const SidebarSplitter = ({
  className = "",
  draggingClassName = "",
}: {
  className?: string;
  draggingClassName?: string;
}) => {
  const sbProps = useSidebarContext();

  // No splitter in Mobile-mode
  if (sbProps.getIsMobile()) return <></>;

  const width = sbProps.useWidth();
  const isDragging = sbProps.useIsDragging();
  const openState = sbProps.useOpenState();

  function handlePointerDown(e: ReactPointerEvent) {
    e.preventDefault(); // this prevents dragging from selecting

    sbProps.setIsDragging(true);
    const { ownerDocument } = e.currentTarget;
    let originalWidth = width;
    let originalClientX = e.clientX;

    function onPointerMove(e: globalThis.PointerEvent) {
      sbProps.setWidth(originalWidth + e.clientX - originalClientX);
    }

    function onPointerUp(e: globalThis.PointerEvent) {
      ownerDocument.removeEventListener("pointermove", onPointerMove);
      sbProps.setIsDragging(false);

      // Moved less than 6 pixels then toggle visibility
      if (Math.abs(e.clientX - originalClientX) < 6) {
        sbProps.setOpenState(
          openState !== OpenState.Locked ? OpenState.Locked : OpenState.Hidden,
          "SidebarSplitter-onPointerUp",
        );
      }
      //else console.log('PointerSidebarSplitter-onPointerUp')
    }
    ownerDocument.addEventListener("pointermove", onPointerMove);
    ownerDocument.addEventListener("pointerup", onPointerUp, { once: true });
  }

  // className={clsx(
  //   'absolute right-0 h-full cursor-col-resize grow-0 shrink-0',
  //   'cursor-col-resize w-2 border-r-0',
  //   isDragging
  //     ? 'border-r-4 border-r-transparent/30'
  //     : 'hover:border-r-4 hover:border-r-transparent/60 hover:delay-300',
  //   isDragging ? draggingClassName : className,
  // )}
  return (
    <div
      id="sidebar-splitter"
      className={clsx(
        "absolute right-0 h-full shrink-0 grow-0 cursor-col-resize",
        "w-2 cursor-col-resize ",
        "hover:border-r-4 hover:border-r-transparent/30 hover:delay-300",
        // keep the border during dragging
        isDragging ? "border-r-4 border-r-transparent/30" : "border-r-0",
        isDragging ? draggingClassName : className,
      )}
      onPointerDown={handlePointerDown}
    />
  );
};
