import { LucideIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface AnyImageProps {
  icon?: LucideIcon | string;
  size?: number;
  className?: string;
  style?: object;
}

export const AnyImage = ({
  icon,
  size = 16, // again with default
  className,
  style,
}: AnyImageProps) => {
  // Converts a LucidIcon-icon to a Icon-class
  const _Icon = ({
    icon: Icon,
    className,
    style,
  }: {
    icon: LucideIcon;
    className: string;
    style?: object;
  }) => {
    return (
      <Icon
        strokeWidth={1}
        size={size}
        className={cn("justify-self-center", className)}
        style={style}
        // className={className}
      />
    );
  };

  return (
    <>
      {!!icon && typeof icon === "object" ? (
        // Need a separate function to convert to an <Icon>
        <_Icon
          icon={icon}
          style={style}
          className={cn(
            // "rounded-sm text-base",
            // `w-[${size}px] h-[${size}px] min-w-[${size}px] max-w-[${size}px] min-h-[${size}px] max-h-[${size}px]`,
            className,
          )}
        />
      ) : typeof icon === "string" ? (
        icon.length < 5 ? (
          // Character-Emoji
          <span
            style={style}
            className={cn(
              // "break-inside-avoid truncate rounded-sm text-base",
              "truncate rounded-sm text-sm",
              // "inline-flex items-center justify-center",
              //"inline-flex items-center justify-center",
              // `w-[${size}px] h-[${size}px]`,
              // ` min-w-[${size}px] max-w-[${size}px] min-h-[${size}px] max-h-[${size}px]`,
              // `size-[${size}px]`,
              // "size-5",
              className,
            )}
          >
            {icon}
          </span>
        ) : (
          // A "real" image as a url
          <Image
            src={icon}
            alt=""
            height={size}
            width={size}
            style={style}
            className={className}
          />
        )
      ) : null}
    </>
  );
};
