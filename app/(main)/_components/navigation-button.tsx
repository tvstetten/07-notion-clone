


import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

const rotationSpeed = 490

interface NavigationButtonProps {
  icon: LucideIcon;      // The icon
  onlyOnHover?: boolean; // true if only visible onHover
  rotatable?: boolean    // can this Icon be rotated 
  rotateDegree?: number; // degrees the icon is rotated
  onClick?: () => void;  // callback
}

export const NavigationButton = ({
  icon: Icon,
  onlyOnHover = false,
  rotatable = false,
  rotateDegree = 0,
  onClick
}: NavigationButtonProps) => {

  const handleClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (onClick) {
      event.stopPropagation()
      onClick()
    }
  }

  return (
    <div
      role="button"
      className={cn(
        onlyOnHover
          ? "opacity-0 group-hover:opacity-100"
          : "",
        "h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
      )}
      onClick={handleClick}
    >
      <Icon className={cn(
        "h-5 w-5", // text-muted-foreground/50",
        rotatable
          ? `transform duration-${rotationSpeed} ease rotate-${rotateDegree}`
          : ""
      )}
      />
    </div>
  )
}