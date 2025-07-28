"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaPlus,
  FaHome,
  FaGlobe,
  FaLayerGroup,
  FaUser,
  FaArrowUp,
  FaDownload,
  FaCog,
} from "react-icons/fa";
import { Button } from "@workspace/ui/components/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ExpandedSidebar } from "./expanded-sidebar";

interface ChatSidebarProps {
  selectedChat: string | null;
  onSelectChat: (chatId: string) => void;
  isPinned: boolean;
  onPinChange: (pinned: boolean) => void;
}

export function ChatSidebar({
  selectedChat,
  onSelectChat,
  isPinned,
  onPinChange,
}: ChatSidebarProps) {
  const [activeItem, setActiveItem] = useState("home");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const sidebarItems = [
    { id: "new", icon: FaPlus, label: "New Chat", isButton: true },
    { id: "home", icon: FaHome, label: "Home" },
    { id: "discover", icon: FaGlobe, label: "Discover" },
    { id: "spaces", icon: FaLayerGroup, label: "Spaces" },
  ];

  const bottomItems = [
    { id: "account", icon: FaUser, label: "Account", hasAvatar: true },
    { id: "upgrade", icon: FaArrowUp, label: "Upgrade" },
    { id: "install", icon: FaDownload, label: "Install" },
  ];

  // Professional animation variants with reduced bounce
  const logoVariants = {
    hidden: {
      scale: 0,
      rotate: -90,
      opacity: 0,
    },
    visible: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94], // Professional easing curve
      },
    },
  };

  const mainIconVariants = {
    hidden: (index: number) => ({
      x: -40,
      opacity: 0,
      scale: 0.8,
    }),
    visible: (index: number) => ({
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        delay: 0.2 + index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1,
      },
    },
  };

  const bottomIconVariants = {
    hidden: (index: number) => ({
      y: 30,
      opacity: 0,
      scale: 0.8,
    }),
    visible: (index: number) => ({
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        delay: 0.6 + index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
    hover: {
      scale: 1.08,
      y: -2,
      transition: {
        duration: 0.2,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    tap: {
      scale: 0.95,
      y: 1,
      transition: {
        duration: 0.1,
      },
    },
  };

  const themeSwitcherVariants = {
    hidden: {
      scale: 0,
      opacity: 0,
      rotate: 45,
    },
    visible: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        duration: 0.4,
        delay: 1.0,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const settingsVariants = {
    hidden: {
      scale: 0,
      opacity: 0,
      rotate: -45,
    },
    visible: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        duration: 0.4,
        delay: 1.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    hover: {
      rotate: 45,
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const sidebarContainerVariants = {
    hidden: {
      x: -80,
      opacity: 0,
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleMouseEnter = () => {
    if (!isPinned) {
      setIsExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isPinned) {
      setIsExpanded(false);
    }
  };

  const handlePin = () => {
    const newPinned = !isPinned;
    onPinChange(newPinned);
    if (newPinned) {
      setIsExpanded(true);
    }
  };

  return (
    <div className="flex">
      {/* Combined container for both sidebars to handle mouse events properly */}
      <div
        className="flex"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Main Sidebar */}
        <motion.div
          className="w-16 bg-card border-r border-border flex flex-col items-center py-4 relative z-50"
          variants={sidebarContainerVariants as any}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
        >
          {/* Logo */}
          <div className="mb-8">
            <motion.div
              className="w-8 h-8 flex items-center justify-center"
              variants={logoVariants as any}
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
            >
              <motion.div
                className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-sm flex items-center justify-center"
                whileHover={{
                  scale: 1.1,
                  rotate: 180,
                  transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
                }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-white text-xs font-bold">A</span>
              </motion.div>
            </motion.div>
          </div>

          {/* Main Navigation */}
          <div className="flex flex-col space-y-4 flex-1">
            {sidebarItems.map((item, index) => (
              <motion.div
                key={item.id}
                custom={index}
                variants={mainIconVariants as any}
                initial="hidden"
                animate={isLoaded ? "visible" : "hidden"}
                whileHover="hover"
                whileTap="tap"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (item.isButton) {
                      onSelectChat("new");
                    } else {
                      setActiveItem(item.id);
                    }
                  }}
                  className={`w-10 h-10 rounded-lg transition-all duration-200 ${
                    activeItem === item.id
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                  title={item.label}
                >
                  <motion.div
                    whileHover={{
                      rotate: item.isButton ? 90 : 0,
                      transition: { duration: 0.2 },
                    }}
                  >
                    <item.icon className="w-4 h-4" />
                  </motion.div>
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Bottom Navigation */}
          <div className="flex flex-col space-y-4">
            {bottomItems.map((item, index) => (
              <motion.div
                key={item.id}
                custom={index}
                variants={bottomIconVariants as any}
                initial="hidden"
                animate={isLoaded ? "visible" : "hidden"}
                whileHover="hover"
                whileTap="tap"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setActiveItem(item.id)}
                  className={`w-10 h-10 rounded-lg transition-all duration-200 ${
                    activeItem === item.id
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                  title={item.label}
                >
                  {item.hasAvatar ? (
                    <motion.div
                      className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center"
                      whileHover={{
                        scale: 1.1,
                        boxShadow: "0 0 15px rgba(139, 92, 246, 0.4)",
                        transition: { duration: 0.2 },
                      }}
                    >
                      <span className="text-white text-xs font-medium">U</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      whileHover={{
                        rotate: item.id === "upgrade" ? -10 : 0,
                        y: item.id === "upgrade" ? -1 : 0,
                        transition: { duration: 0.2 },
                      }}
                    >
                      <item.icon className="w-4 h-4" />
                    </motion.div>
                  )}
                </Button>
              </motion.div>
            ))}

            {/* Theme Switcher */}
            <motion.div
              className="pt-2 border-t border-border"
              variants={themeSwitcherVariants as any}
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
            >
              <ThemeSwitcher />
            </motion.div>

            {/* Settings */}
            <motion.div
              variants={settingsVariants as any}
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50"
                title="Settings"
              >
                <FaCog className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Expanded Sidebar */}
        <ExpandedSidebar
          isVisible={isExpanded || isPinned}
          isPinned={isPinned}
          onPin={handlePin}
          onSelectChat={onSelectChat}
        />
      </div>
    </div>
  );
}
