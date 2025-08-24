"use client";
import type React from "react";
import { cn } from "@workspace/ui/lib/utils";

export interface GradientButtonProps {
  children: React.ReactNode;
  className?: string;
  width?: number | "full" | "auto";
  height?: number | "auto";
  type?: "button" | "reset" | "submit";
  color?: string;
  fromColor: string;
  viaColor?: string;
  toColor: string;
  disabled?: boolean;
  onClick?: () => void | Promise<void>;
}

const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  className = "",
  height = "auto",
  width = "auto",
  color = "text-white",
  type = "button",
  fromColor,
  viaColor,
  toColor,
  disabled = false,
  onClick,
}) => {
  const gradientClass = viaColor
    ? `bg-gradient-to-r ${fromColor} ${viaColor} ${toColor}`
    : `bg-gradient-to-r ${fromColor} ${toColor}`;

  /* width / height handling */
  const widthStyle =
    typeof width === "number" ? { width: `${width}px` } : undefined;
  const heightStyle =
    typeof height === "number" ? { height: `${height}px` } : undefined;

  const widthClass =
    width === "full"
      ? "w-full"
      : width === "auto"
        ? "w-auto"
        : undefined; /* let style prop handle the number */

  const heightClass =
    height === "auto"
      ? "h-auto"
      : undefined; /* let style prop handle the number */

  return (
    <div className={cn("relative group/button", className)}>
      {/* glow */}
      <div
        className={cn(
          "absolute -inset-2 rounded-lg opacity-0 transition-opacity duration-300 ease-in-out group-hover/button:opacity-75 blur-xl",
          gradientClass,
          disabled && "opacity-0"
        )}
      />

      {/* button */}
      <button
        type={type}
        disabled={disabled}
        style={{ ...widthStyle, ...heightStyle }}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg px-6 py-3 font-medium transition-all duration-300 ease-in-out text-center",
          "focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-transparent",
          "active:scale-95 active:shadow-inner",
          "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
          gradientClass,
          color,
          widthClass,
          heightClass,
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:shadow-lg hover:scale-105",
          "group-hover:shadow-none group-hover:scale-100 hover:!shadow-lg hover:!scale-105"
        )}
        onClick={disabled ? undefined : onClick}
      >
        {children}
      </button>
    </div>
  );
};

export { GradientButton };
export default GradientButton;
