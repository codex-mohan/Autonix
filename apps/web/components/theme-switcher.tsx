"use client";

import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { FaPalette, FaSun, FaMoon, FaCheck } from "react-icons/fa";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";

interface ColorTheme {
  name: string;
  value: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
  };
  description: string;
}

const colorThemes: ColorTheme[] = [
  {
    name: "Futuristic",
    value: "futuristic",
    colors: {
      primary: "#8b5cf6",
      secondary: "#a855f7",
      background: "#0a0a0f",
    },
    description: "Dark purple futuristic theme",
  },
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
  const [currentColorTheme, setCurrentColorTheme] = useState("futuristic");
  const { theme, setTheme, resolvedTheme } = useTheme();

  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});

  // Apply color theme to document
  const applyColorTheme = (colorTheme: string) => {
    try {
      document.documentElement.setAttribute("data-theme", colorTheme);
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem("color-theme", colorTheme);
      }
      setCurrentColorTheme(colorTheme);
    } catch (error) {
      console.warn("Error applying color theme:", error);
    }
  };

  useEffect(() => {
    setMounted(true);

    // Get stored color theme or default to futuristic
    let storedColorTheme = "futuristic";
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        storedColorTheme = localStorage.getItem("color-theme") || "futuristic";
      }
    } catch (error) {
      console.warn("Error reading from localStorage:", error);
    }

    setCurrentColorTheme(storedColorTheme);
    applyColorTheme(storedColorTheme);
  }, []);

  useLayoutEffect(() => {
    if (isOpen && triggerRef.current && menuRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const menuRect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const margin = 8;

      const newStyle: React.CSSProperties = {
        position: "fixed",
      };

      // Calculate horizontal position
      let leftPos = triggerRect.left;
      if (leftPos + menuRect.width > viewportWidth) {
        leftPos = triggerRect.right - menuRect.width;
      }
      newStyle.left = Math.max(margin, leftPos);

      // Calculate vertical position
      let topPos = triggerRect.bottom + margin;
      if (topPos + menuRect.height > viewportHeight) {
        topPos = triggerRect.top - menuRect.height - margin;
      }
      newStyle.top = Math.max(margin, topPos);

      setMenuStyle(newStyle);
    }
  }, [isOpen]);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="text-muted-foreground">
        <FaPalette className="w-4 h-4" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  const handleColorThemeChange = (themeValue: string) => {
    applyColorTheme(themeValue);
    setIsOpen(false);
  };

  const toggleDarkMode = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <div className="relative">
      <Button
        ref={triggerRef}
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 m-4 text-muted-foreground hover:text-foreground"
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
              className="fixed inset-0 z-40 bg-black/20" // <-- The "backdrop-blur-sm" class has been removed from here
              onClick={() => setIsOpen(false)}
            />

            {/* Theme Switcher Panel (Now with dynamic positioning) */}
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.1, ease: "easeOut" }}
              className="z-50 w-80"
              style={menuStyle}
            >
              <Card className="border-border/50 shadow-2xl glass-card">
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
                        {colorThemes.map((themeOption) => (
                          <motion.button
                            key={themeOption.value}
                            onClick={() =>
                              handleColorThemeChange(themeOption.value)
                            }
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
