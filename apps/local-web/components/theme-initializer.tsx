"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

export function ThemeInitializer() {
  const { setTheme } = useTheme();

  useEffect(() => {
    // Force apply futuristic theme immediately
    const applyTheme = () => {
      try {
        // Apply theme variables
        const theme = localStorage.getItem("color-theme") || "futuristic";
        const mode = localStorage.getItem("theme") || "dark";

        // Set theme attributes on document
        document.documentElement.setAttribute("data-theme", theme);
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(mode);

        // Set theme in next-themes
        setTheme(mode);

        // Update CSS variables for dynamic colors
        const root = document.documentElement;
        const computedStyle = getComputedStyle(root);

        // Get primary and secondary colors from CSS variables
        const primaryHsl = computedStyle.getPropertyValue("--primary").trim();
        const secondaryHsl = computedStyle
          .getPropertyValue("--secondary")
          .trim();

        // Convert HSL to RGB for rgba usage
        const primaryRgb = hslToRgb(primaryHsl);
        const secondaryRgb = hslToRgb(secondaryHsl);

        // Set RGB values for use in rgba
        root.style.setProperty("--theme-primary-rgb", primaryRgb);
        root.style.setProperty("--theme-secondary-rgb", secondaryRgb);

        // Store in localStorage safely
        if (typeof window !== "undefined" && window.localStorage) {
          localStorage.setItem("color-theme", theme);
          localStorage.setItem("theme", mode);
        }
      } catch (error) {
        console.warn("Theme initialization error:", error);
      }
    };

    // Apply immediately
    applyTheme();

    // Apply again after a short delay to ensure it sticks
    const timeouts = [setTimeout(applyTheme, 50), setTimeout(applyTheme, 200)];

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [setTheme]);

  // Helper function to convert HSL to RGB
  function hslToRgb(hsl: string) {
    // Default fallback values
    let r = 139,
      g = 92,
      b = 246; // Default purple

    try {
      // Parse HSL values
      const [h, s, l] = hsl
        .split(" ")
        .map((val) => Number.parseFloat(val)) as any;

      // Convert HSL to RGB using a simple algorithm
      const c = (1 - Math.abs((2 * l) / 100 - 1)) * (s / 100);
      const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
      const m = l / 100 - c / 2;

      let r1, g1, b1;

      if (h < 60) {
        [r1, g1, b1] = [c, x, 0];
      } else if (h < 120) {
        [r1, g1, b1] = [x, c, 0];
      } else if (h < 180) {
        [r1, g1, b1] = [0, c, x];
      } else if (h < 240) {
        [r1, g1, b1] = [0, x, c];
      } else if (h < 300) {
        [r1, g1, b1] = [x, 0, c];
      } else {
        [r1, g1, b1] = [c, 0, x];
      }

      r = Math.round((r1 + m) * 255);
      g = Math.round((g1 + m) * 255);
      b = Math.round((b1 + m) * 255);
    } catch (error) {
      console.warn("Error converting HSL to RGB:", error);
    }

    return `${r}, ${g}, ${b}`;
  }

  return null;
}
