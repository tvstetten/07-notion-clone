import { LucideIcon, LucideProps } from "lucide-react";
import Image from "next/image";
// import { cn } from "@/lib/utils";
// import { AriaAttributes, ImgHTMLAttributes } from "react";
// import { HTMLAttributes } from "react";

export interface AnyImageProps {
  icon?: LucideIcon | string;
  size?: number;
  className?: string;
  style?: object;
  props?: object;
}

export const AnyImage = ({
  icon,
  size = 16, // again with default
  style,
  ...props
}: AnyImageProps) => {
  let styleX = { height: size, width: size };
  if (style) styleX = { ...styleX, ...style };

  // console.log("AnyImage", icon, typeof icon === "string" ? icon.length : "");

  // Converts a LucidIcon-icon to a Icon-class
  function _Icon({ icon: Icon }: { icon: LucideIcon }) {
    return (
      <Icon
        strokeWidth={1}
        size={size}
        style={styleX}
        {...props}
      />
    );
  }

  return (
    <>
      {!!icon && typeof icon === "object" ? (
        // --------------
        // Need a separate function to convert to an <Icon>
        <_Icon icon={icon} />
      ) : typeof icon === "string" ? (
        // --------------
        // "Character"-Emoji
        icon.length < 7 ? (
          <span
            style={styleX}
            // className={className}
            {...props}
          >
            {icon}
          </span>
        ) : (
          // --------------
          // A "real" image as a url
          <Image
            src={icon}
            alt=""
            height={size}
            width={size}
            style={style}
            // className={className}
            {...props}
          />
        )
      ) : null}
    </>
  );
};
