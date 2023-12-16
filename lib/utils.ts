import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const CO_POPUP_MENU_SHADOW = () => { 
  return cn("shadow-[2px_5px_14px_rgba(250,230,0,0.7)]");
  // "shadow-[0_27px_34px_rgba(255,255,_0,_0.7)]";
  // "hover:shadow-[0_7px_24px_rgba(0,_0,_0,_0.7)]";
};
