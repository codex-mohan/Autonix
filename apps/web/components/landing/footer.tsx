"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { AnimatedSocialIcon } from "@/components/animated-social-icon";
import {
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaDiscord,
  FaRocket,
} from "react-icons/fa";

export function LandingFooter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0px", "-50px"]);

  return (
    <motion.footer
      ref={containerRef}
      className="relative py-16 px-4 border-t border-primary/20 overflow-hidden"
      style={{ y }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 grid-background opacity-10" />

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/40 rounded-full"
            style={{
              left: `${20 + i * 20}%`,
              top: `${30 + (i % 2) * 40}%`,
            }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 3 + i,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center"
        >
          {/* Brand Section */}
          <motion.div
            className="mb-8 md:mb-0 text-center md:text-left"
            whileHover={{ scale: 1.05 }}
          >
            <motion.h3
              className="text-3xl font-black mb-3"
              style={{
                textShadow:
                  "0 0 30px rgba(139, 92, 246, 0.5), 0 0 60px rgba(139, 92, 246, 0.3)",
              }}
              whileHover={{
                textShadow: [
                  "0 0 20px rgba(139, 92, 246, 0.8)",
                  "0 0 40px rgba(139, 92, 246, 0.6)",
                  "0 0 60px rgba(139, 92, 246, 0.4)",
                ],
              }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                AUTONIX
              </span>
            </motion.h3>
            <p className="text-muted-foreground text-lg max-w-md">
              Your intelligent agentic AI assistant for the future of work
            </p>

            {/* Quick Stats */}
            <motion.div
              className="flex space-x-6 mt-4 justify-center md:justify-start"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="text-center">
                <div className="text-primary font-bold">50K+</div>
                <div className="text-xs text-muted-foreground">Users</div>
              </div>
              <div className="text-center">
                <div className="text-primary font-bold">99.9%</div>
                <div className="text-xs text-muted-foreground">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-primary font-bold">24/7</div>
                <div className="text-xs text-muted-foreground">Support</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            className="flex items-center space-x-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <AnimatedSocialIcon
              icon={FaGithub}
              href="https://github.com"
              label="GitHub"
              animationType="flip"
              size="md"
              className="hover:shadow-lg hover:shadow-primary/25"
            />
            <AnimatedSocialIcon
              icon={FaTwitter}
              href="https://twitter.com"
              label="Twitter"
              animationType="rotate"
              size="md"
              className="hover:shadow-lg hover:shadow-primary/25"
            />
            <AnimatedSocialIcon
              icon={FaLinkedin}
              href="https://linkedin.com"
              label="LinkedIn"
              animationType="creative"
              size="md"
              className="hover:shadow-lg hover:shadow-primary/25"
            />
            <AnimatedSocialIcon
              icon={FaDiscord}
              href="https://discord.com"
              label="Discord"
              animationType="flip"
              size="md"
              className="hover:shadow-lg hover:shadow-primary/25"
            />
          </motion.div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-primary/20 flex flex-col md:flex-row justify-between items-center"
        >
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-muted-foreground">
              &copy; 2025 Autonix. All rights reserved. Built with ❤️ for the
              future.
            </p>
          </div>

          <motion.div
            className="flex items-center space-x-6 text-sm text-muted-foreground"
            whileHover={{ scale: 1.05 }}
          >
            <a href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Documentation
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll to Top */}
        <motion.button
          className="z-99 absolute right-8 top-6 w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center shadow-lg neon-border"
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <FaRocket className="w-5 h-5 text-white transform rotate-45" />
        </motion.button>
      </div>
    </motion.footer>
  );
}
