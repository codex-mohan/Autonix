"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { FaPalette, FaSun, FaMoon, FaCheck } from "react-icons/fa";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";

interface Theme {
  name: string;
  value: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
  };
  description: string;
}

const themes: Theme[] = [
  {
    name: "Catppuccin",
    value: "catppuccin",
    colors: {
      primary: "#8b5cf6",
      secondary: "#06b6d4",
      background: "#f1f5f9",
    },
    description: "Purple and blue gradient theme",
  },
  {
    name: "Ocean",
    value: "ocean",
    colors: {
      primary: "#0ea5e9",
      secondary: "#14b8a6",
      background: "#f8fafc",
    },
    description: "Cool ocean blues and teals",
  },
  {
    name: "Forest",
    value: "forest",
    colors: {
      primary: "#059669",
      secondary: "#84cc16",
      background: "#f9fafb",
    },
    description: "Natural greens and earth tones",
  },
  {
    name: "Sunset",
    value: "sunset",
    colors: {
      primary: "#f97316",
      secondary: "#eab308",
      background: "#fefcfb",
    },
    description: "Warm oranges and yellows",
  },
  {
    name: "Midnight",
    value: "midnight",
    colors: {
      primary: "#8b5cf6",
      secondary: "#a855f7",
      background: "#fafafa",
    },
    description: "Deep purples and dark tones",
  },
];

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentColorTheme, setCurrentColorTheme] = useState("catppuccin");
  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    bottom: "auto",
    transform: "none",
  });
  const { theme, setTheme, resolvedTheme } = useTheme();
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Calculate optimal menu position
  const calculateMenuPosition = () => {
    if (!triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const menuHeight = 600;
    const margin = 16;

    const spaceBelow = viewportHeight - triggerRect.bottom;
    const spaceAbove = triggerRect.top;

    let position = { top: 0, bottom: "auto" as const, transform: "none" };

    if (spaceBelow >= menuHeight + margin) {
      position = { top: 0, bottom: "auto", transform: "none" };
    } else if (spaceAbove >= menuHeight + margin) {
      position = { top: "auto" as const, bottom: 0, transform: "none" };
    } else {
      const triggerCenter = triggerRect.top + triggerRect.height / 2;
      const menuCenter = menuHeight / 2;
      const idealTop = triggerCenter - menuCenter;
      const clampedTop = Math.max(
        margin,
        Math.min(idealTop, viewportHeight - menuHeight - margin)
      );
      const offsetFromTrigger = clampedTop - triggerRect.top;
      position = { top: offsetFromTrigger, bottom: "auto", transform: "none" };
    }

    setMenuPosition(position);
  };

  // Enhanced theme application function
  const applyTheme = (themeValue: string, isDarkMode = false) => {
    console.log("Applying theme:", themeValue, "Dark mode:", isDarkMode);

    // Remove all existing theme classes and attributes
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.removeAttribute("data-theme");

    // Apply the new theme attribute
    document.documentElement.setAttribute("data-theme", themeValue);

    // Apply dark/light class
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.add("light");
    }

    // Store the color theme
    localStorage.setItem("color-theme", themeValue);

    // Force multiple reflows to ensure CSS updates
    const forceReflow = () => {
      document.documentElement.style.display = "none";
      document.documentElement.offsetHeight;
      document.documentElement.style.display = "";
    };

    forceReflow();
    setTimeout(forceReflow, 50);
    setTimeout(forceReflow, 100);

    console.log(
      "Theme applied - data-theme:",
      document.documentElement.getAttribute("data-theme")
    );
    console.log("Classes:", document.documentElement.className);
  };

  useEffect(() => {
    setMounted(true);

    // Get stored theme or default to catppuccin
    const storedTheme = localStorage.getItem("color-theme") || "catppuccin";
    setCurrentColorTheme(storedTheme);

    // Apply the theme immediately on mount
    const isDark = resolvedTheme === "dark";
    applyTheme(storedTheme, isDark);
  }, [resolvedTheme]);

  // Watch for theme changes and reapply
  useEffect(() => {
    if (mounted && resolvedTheme) {
      const isDark = resolvedTheme === "dark";
      applyTheme(currentColorTheme, isDark);
    }
  }, [resolvedTheme, currentColorTheme, mounted]);

  // Recalculate position when menu opens or window resizes
  useEffect(() => {
    if (isOpen) {
      calculateMenuPosition();

      const handleResize = () => calculateMenuPosition();
      const handleScroll = () => calculateMenuPosition();

      window.addEventListener("resize", handleResize);
      window.addEventListener("scroll", handleScroll, true);

      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("scroll", handleScroll, true);
      };
    }
  }, [isOpen]);

  if (!mounted) {
    return null;
  }

  const isDark = resolvedTheme === "dark";

  const handleThemeChange = (themeValue: string) => {
    console.log("Theme change requested:", themeValue);

    // Set the current color theme
    setCurrentColorTheme(themeValue);

    // Apply the theme immediately with current dark/light mode
    applyTheme(themeValue, isDark);

    setIsOpen(false);
  };

  const toggleDarkMode = () => {
    const newMode = isDark ? "light" : "dark";
    setTheme(newMode);
  };

  const handleToggleMenu = () => {
    if (!isOpen) {
      setTimeout(calculateMenuPosition, 0);
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <Button
        ref={triggerRef}
        variant="ghost"
        size="icon"
        onClick={handleToggleMenu}
        className="text-muted-foreground hover:text-foreground"
      >
        <FaPalette className="w-4 h-4" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Theme Switcher Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute left-full z-50 w-80 ml-2"
              style={{
                top: menuPosition.top !== "auto" ? menuPosition.top : undefined,
                bottom:
                  menuPosition.bottom !== "auto"
                    ? menuPosition.bottom
                    : undefined,
                transform: menuPosition.transform,
              }}
            >
              <Card className="border-border/50 shadow-2xl">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Theme Settings</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleDarkMode}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {isDark ? (
                          <FaSun className="w-4 h-4" />
                        ) : (
                          <FaMoon className="w-4 h-4" />
                        )}
                      </Button>
                    </div>

                    {/* Current Theme Display */}
                    <div className="p-3 rounded-lg bg-muted/50 border border-border">
                      <div className="text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">
                            Active Theme:
                          </span>
                          <span className="font-medium capitalize">
                            {currentColorTheme}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-muted-foreground">Mode:</span>
                          <span className="font-medium capitalize">
                            {isDark ? "Dark" : "Light"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Theme Options */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Color Themes
                      </h4>
                      <div className="grid gap-3 max-h-80 overflow-y-auto thin-scrollbar">
                        {themes.map((themeOption) => (
                          <motion.button
                            key={themeOption.value}
                            onClick={() => handleThemeChange(themeOption.value)}
                            className={`relative flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 text-left ${
                              currentColorTheme === themeOption.value
                                ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                                : "border-border hover:border-primary/50 hover:bg-muted/50"
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {/* Color Preview */}
                            <div className="flex space-x-1">
                              <div
                                className="w-4 h-4 rounded-full border border-border/50 shadow-sm"
                                style={{
                                  backgroundColor: themeOption.colors.primary,
                                }}
                              />
                              <div
                                className="w-4 h-4 rounded-full border border-border/50 shadow-sm"
                                style={{
                                  backgroundColor: themeOption.colors.secondary,
                                }}
                              />
                            </div>

                            {/* Theme Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h5 className="font-medium text-sm">
                                  {themeOption.name}
                                </h5>
                                {currentColorTheme === themeOption.value && (
                                  <FaCheck className="w-3 h-3 text-primary" />
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground truncate">
                                {themeOption.description}
                              </p>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Debug Info */}
                    <div className="pt-3 border-t border-border">
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>Theme: {currentColorTheme}</div>
                        <div>Mode: {resolvedTheme}</div>
                        <div>
                          Data Theme:{" "}
                          {document?.documentElement?.getAttribute(
                            "data-theme"
                          ) || "none"}
                        </div>
                        <div>
                          Classes:{" "}
                          {document?.documentElement?.className || "none"}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
