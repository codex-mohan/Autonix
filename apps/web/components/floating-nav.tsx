"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";
import { Button } from "@workspace/ui/components/button";
import { useMobile } from "@/hooks/use-mobile";
import GradientButton from "@workspace/ui/components/gradient-button";
import { ThemeSwitcher } from "@/components/theme-switcher";

export function FloatingNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const isMobile = useMobile();

  const navItems = [
    { name: "About", href: "#about" },
    { name: "Features", href: "#features" },
    { name: "Contact", href: "#contact" },
  ];

  const handleNavClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  // Track active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map((item) => item.href.substring(1));
      const scrollPosition = window.scrollY + 100;

      if (window.scrollY < 100) {
        setActiveSection("");
        return;
      }

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside or pressing escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const nav = document.getElementById("floating-nav");
      if (nav && !nav.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  const isActive = (href: string) => {
    const sectionId = href.substring(1);
    return activeSection === sectionId;
  };

  return (
    <>
      <motion.div
        id="floating-nav"
        className="fixed top-4 left-4 right-4 md:left-8 md:right-8 z-50"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
      >
        <div className="relative px-4 py-3 md:px-6 md:py-4 rounded-full bg-card/90 backdrop-blur-md border border-border shadow-xl">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur opacity-50"></div>

          {isMobile ? (
            <div className="relative flex items-center justify-between">
              <Link href="/" className="font-bold text-lg flex-shrink-0">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                  Auto
                </span>
                <span className="text-foreground">nix</span>
              </Link>

              <div className="flex items-center gap-3">
                <ThemeSwitcher />
                {activeSection && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-secondary"
                  />
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground hover:bg-muted flex-shrink-0 h-8 w-8 p-0"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isOpen ? (
                      <FaTimes className="h-5 w-5" />
                    ) : (
                      <FaBars className="h-5 w-5" />
                    )}
                  </motion.div>
                </Button>
              </div>
            </div>
          ) : (
            <div className="relative flex items-center justify-between">
              <Link href="/" className="font-bold text-xl flex-shrink-0">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                  Auto
                </span>
                <span className="text-foreground">nix</span>
              </Link>

              <div className="flex items-center gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full ${
                      isActive(item.href)
                        ? "text-foreground bg-gradient-to-r from-primary/30 to-secondary/30 shadow-lg"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                    onClick={handleNavClick}
                  >
                    {isActive(item.href) && (
                      <motion.div
                        layoutId="activeSection"
                        className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}

                    {isActive(item.href) && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-gradient-to-r from-primary to-secondary shadow-lg"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 20,
                        }}
                      />
                    )}

                    <span className="relative z-10">{item.name}</span>
                  </Link>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <ThemeSwitcher />
                <Link href="/auth">
                  <GradientButton
                    fromColor="from-primary"
                    toColor="to-secondary"
                    color="text-white"
                    width="auto"
                    height="auto"
                    className="text-xs font-medium"
                  >
                    Get Started
                  </GradientButton>
                </Link>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Mobile menu overlay */}
      {isMobile && (
        <>
          <motion.div
            className={`fixed inset-0 z-40 bg-black/80 backdrop-blur-sm ${isOpen ? "block" : "hidden"}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: isOpen ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsOpen(false)}
          />

          <motion.div
            className={`fixed top-20 left-4 right-4 z-50 ${isOpen ? "block" : "hidden"}`}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{
              opacity: isOpen ? 1 : 0,
              y: isOpen ? 0 : -20,
              scale: isOpen ? 1 : 0.95,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="relative rounded-2xl bg-card/95 backdrop-blur-md border border-border shadow-2xl overflow-hidden">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl blur opacity-50"></div>

              <div className="relative p-6">
                <div className="flex flex-col space-y-4">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : -20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        className={`relative block px-4 py-3 text-lg font-medium transition-all duration-300 rounded-lg ${
                          isActive(item.href)
                            ? "text-foreground bg-gradient-to-r from-primary/30 to-secondary/30 shadow-lg"
                            : "text-foreground hover:text-primary hover:bg-muted"
                        }`}
                        onClick={handleNavClick}
                      >
                        {isActive(item.href) && (
                          <motion.div
                            layoutId="activeSectionMobile"
                            className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg"
                            initial={false}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 30,
                            }}
                          />
                        )}

                        <div className="relative z-10 flex items-center justify-between">
                          <span>{item.name}</span>
                          {isActive(item.href) && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-secondary"
                            />
                          )}
                        </div>
                      </Link>
                    </motion.div>
                  ))}

                  <motion.div
                    className="pt-4 border-t border-border"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 20 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                  >
                    <Link href="/auth">
                      <GradientButton
                        fromColor="from-primary"
                        toColor="to-secondary"
                        color="text-white"
                        width="full"
                        height="auto"
                        className="justify-center text-base font-medium py-3"
                      >
                        Get Started
                      </GradientButton>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </>
  );
}
