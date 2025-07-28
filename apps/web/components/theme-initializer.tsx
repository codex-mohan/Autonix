"use client"

import { useEffect } from "react"

export function ThemeInitializer() {
  useEffect(() => {
    // Force apply futuristic theme immediately
    const applyTheme = () => {
      try {
        // Remove any existing theme attributes
        document.documentElement.removeAttribute("data-theme")
        document.documentElement.classList.remove("light", "dark")

        // Apply futuristic theme
        document.documentElement.setAttribute("data-theme", "futuristic")
        document.documentElement.classList.add("dark")

        // Store in localStorage safely
        if (typeof window !== "undefined" && window.localStorage) {
          localStorage.setItem("color-theme", "futuristic")
          localStorage.setItem("theme", "dark")
        }
      } catch (error) {
        console.warn("Theme initialization error:", error)
      }
    }

    // Apply immediately
    applyTheme()

    // Apply again after a short delay to ensure it sticks
    const timeouts = [setTimeout(applyTheme, 50), setTimeout(applyTheme, 200)]

    return () => {
      timeouts.forEach(clearTimeout)
    }
  }, [])

  return null
}
