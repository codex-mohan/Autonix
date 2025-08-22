"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { AnimatedSocialIcon } from "@/components/animated-social-icon";
import {
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaDiscord,
  FaRocket,
  FaShieldAlt,
  FaGlobe,
  FaEnvelope,
} from "react-icons/fa";

export function LandingFooter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0px", "-30px"]);

  const footerLinks = {
    Product: [
      { name: "Features", href: "#features" },
      { name: "Pricing", href: "#pricing" },
      { name: "API Documentation", href: "#docs" },
      { name: "Integrations", href: "#integrations" },
    ],
    Company: [
      { name: "About Us", href: "#about" },
      { name: "Careers", href: "#careers" },
      { name: "Press", href: "#press" },
      { name: "Contact", href: "#contact" },
    ],
    Resources: [
      { name: "Blog", href: "#blog" },
      { name: "Help Center", href: "#help" },
      { name: "Community", href: "#community" },
      { name: "Status", href: "#status" },
    ],
    Legal: [
      { name: "Privacy Policy", href: "#privacy" },
      { name: "Terms of Service", href: "#terms" },
      { name: "Cookie Policy", href: "#cookies" },
      { name: "GDPR", href: "#gdpr" },
    ],
  };

  return (
    <motion.footer
      ref={containerRef}
      className="relative py-20 px-4 border-t border-border/50 overflow-hidden bg-card/30"
      style={{ y }}
    >
      {/* Professional Background */}
      <div className="absolute inset-0 grid-background opacity-20" />

      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12"
        >
          {/* Brand Section */}
          <motion.div className="lg:col-span-2" whileHover={{ scale: 1.02 }}>
            <motion.h3
              className="text-2xl font-black mb-4"
              whileHover={{
                textShadow: "0 0 20px var(--text-glow-color-faded)",
              }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                AUTONIX
              </span>
            </motion.h3>
            <p className="text-muted-foreground text-base mb-6 leading-relaxed max-w-sm">
              Empowering businesses with intelligent AI solutions that transform
              workflows and drive innovation.
            </p>

            {/* Trust Badges */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-2">
                <FaShieldAlt className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground">
                  SOC 2 Compliant
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <FaGlobe className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground">
                  GDPR Ready
                </span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <AnimatedSocialIcon
                icon={FaGithub}
                href="https://github.com"
                label="GitHub"
                animationType="flip"
                size="sm"
                className="hover:shadow-lg hover:shadow-primary/25"
              />
              <AnimatedSocialIcon
                icon={FaTwitter}
                href="https://twitter.com"
                label="Twitter"
                animationType="rotate"
                size="sm"
                className="hover:shadow-lg hover:shadow-primary/25"
              />
              <AnimatedSocialIcon
                icon={FaLinkedin}
                href="https://linkedin.com"
                label="LinkedIn"
                animationType="creative"
                size="sm"
                className="hover:shadow-lg hover:shadow-primary/25"
              />
              <AnimatedSocialIcon
                icon={FaDiscord}
                href="https://discord.com"
                label="Discord"
                animationType="flip"
                size="sm"
                className="hover:shadow-lg hover:shadow-primary/25"
              />
            </div>
          </motion.div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(
            ([category, links], categoryIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                viewport={{ once: true }}
              >
                <h4 className="font-bold text-foreground mb-4">{category}</h4>
                <ul className="space-y-3">
                  {links.map((link, linkIndex) => (
                    <motion.li
                      key={link.name}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: categoryIndex * 0.1 + linkIndex * 0.05,
                      }}
                      viewport={{ once: true }}
                    >
                      <Link
                        href={link.href}
                        className="text-muted-foreground hover:text-primary transition-colors text-sm"
                      >
                        {link.name}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )
          )}
        </motion.div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-border/50 pt-8 mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h4 className="font-bold text-foreground mb-2">Stay Updated</h4>
              <p className="text-muted-foreground text-sm">
                Get the latest updates on AI innovations and product releases.
              </p>
            </div>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded-lg bg-background border border-border focus:border-primary outline-none text-sm"
              />
              <motion.button
                className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg text-sm font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaEnvelope className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-muted-foreground text-sm">
              &copy; 2025 Autonix AI Technologies, Inc. All rights reserved.
            </p>
            <p className="text-muted-foreground text-xs mt-1">
              Built with ❤️ for the future of intelligent automation.
            </p>
          </div>

          <div className="flex items-center space-x-6 text-xs text-muted-foreground">
            <span>Version 2.1.0</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>All systems operational</span>
            </div>
          </div>
        </motion.div>

        {/* Professional Scroll to Top */}
        <motion.button
          className="fixed right-8 bottom-8 w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center shadow-lg z-50"
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
        >
          <FaRocket className="w-5 h-5 text-white transform rotate-45" />
        </motion.button>
      </div>
    </motion.footer>
  );
}
