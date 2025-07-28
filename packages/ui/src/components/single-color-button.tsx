"use client";

import type React from "react";
import { motion } from "framer-motion";
import { cn } from "@workspace/ui/lib/utils";

interface SingleColorButtonProps {
  children: React.ReactNode;
  className?: string;
  width?: number | "full" | "auto";
  height?: number | "auto";
  type?: "button" | "reset" | "submit";
  textColor?: string; // Text color (Tailwind color class like 'text-white')
  bgColor: string; // Background color (Tailwind color class like 'bg-purple-600')
  disabled?: boolean;
  onClick?: () => void | Promise<void>;
}

const SingleColorButton: React.FC<SingleColorButtonProps> = ({
  children,
  className = "",
  height = "auto",
  width = "auto",
  textColor = "text-white",
  type = "button",
  bgColor,
  disabled = false,
  onClick,
}) => {
  // Build size classes
  const sizeClasses = cn(
    height === "auto"
      ? ""
      : typeof height === "number"
        ? `h-${height}`
        : "h-full",
    width === "auto"
      ? ""
      : typeof width === "number"
        ? `w-${width}`
        : width === "full"
          ? "w-full"
          : ""
  );

  // Animation variants
  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: {
      scale: 0.95,
      transition: {
        type: "spring",
        stiffness: 600,
        damping: 15,
      },
    },
  };

  return (
    <div className={cn("relative", className)}>
      {/* Glow effect - only on hover */}
      <motion.div
        className={cn(
          "absolute -inset-2 rounded-lg opacity-0 blur-xl",
          bgColor,
          disabled && "opacity-0"
        )}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: disabled ? 0 : 0.3 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      />

      {/* Button */}
      <motion.button
        type={type}
        disabled={disabled}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg px-6 py-3 font-medium text-center text-sm",
          "focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-transparent",
          "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
          bgColor,
          textColor,
          sizeClasses,
          disabled ? "opacity-50 cursor-not-allowed" : "shadow-lg"
        )}
        variants={buttonVariants as any}
        initial="initial"
        whileHover={disabled ? "initial" : "hover"}
        whileTap={disabled ? "initial" : "tap"}
        onClick={disabled ? undefined : onClick}
        style={{
          filter: "brightness(1)",
        }}
        onMouseDown={() => {
          if (!disabled) {
            const button = document.activeElement as HTMLButtonElement;
            if (button) {
              button.style.filter = "brightness(0.9)";
            }
          }
        }}
        onMouseUp={() => {
          if (!disabled) {
            const button = document.activeElement as HTMLButtonElement;
            if (button) {
              button.style.filter = "brightness(1)";
            }
          }
        }}
        onMouseLeave={() => {
          if (!disabled) {
            const button = document.activeElement as HTMLButtonElement;
            if (button) {
              button.style.filter = "brightness(1)";
            }
          }
        }}
      >
        {children}
      </motion.button>
    </div>
  );
};

export { SingleColorButton };
export default SingleColorButton;
