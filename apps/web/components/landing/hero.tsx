"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import GradientButton from "@workspace/ui/components/gradient-button";
import SingleColorButton from "@workspace/ui/components/single-color-button";
import {
  FaRocket,
  FaLightbulb,
  FaStar,
  FaAtom,
  FaBolt,
  FaShieldAlt,
} from "react-icons/fa";

export function LandingHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Subtle parallax transforms for professional feel
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.98]);

  // Smooth spring animations
  const springY = useSpring(y, { stiffness: 100, damping: 30 });
  const springScale = useSpring(scale, { stiffness: 100, damping: 30 });

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      ref={containerRef}
      id="about"
      className="relative min-h-screen flex items-center justify-center px-4 pt-32 pb-20 overflow-hidden"
    >
      {/* Professional Grid Background */}
      <div className="absolute inset-0 grid-background opacity-60" />

      {/* Hero background blur overlay */}
      <div className="hero-blur-overlay" />

      {/* Subtle Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="particle opacity-30" />
        ))}
      </div>

      {/* Professional Background Orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full floating-orb opacity-20"
        style={{
          background:
            "radial-gradient(circle, var(--orb-color-primary) 0%, var(--orb-color-primary-faded) 40%, transparent 70%)",
          x: useTransform(scrollYProgress, [0, 1], [0, -50]),
          y: useTransform(scrollYProgress, [0, 1], [0, -25]),
        }}
        animate={{
          x: mousePosition.x * 0.01,
          y: mousePosition.y * 0.01,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
      />

      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full floating-orb opacity-15"
        style={{
          background:
            "radial-gradient(circle, var(--orb-color-secondary) 0%, var(--orb-color-secondary-faded) 40%, transparent 70%)",
          x: useTransform(scrollYProgress, [0, 1], [0, 50]),
          y: useTransform(scrollYProgress, [0, 1], [0, 25]),
        }}
        animate={{
          x: -mousePosition.x * 0.015,
          y: -mousePosition.y * 0.015,
        }}
        transition={{ type: "spring", stiffness: 40, damping: 25 }}
      />

      {/* Main Content */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto text-center"
        style={{ y: springY, scale: springScale }}
      >
        {/* Professional Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16"
        >
          {/* Company Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
          >
            <FaShieldAlt className="w-4 h-4 text-primary mr-2" />
            <span className="text-sm font-medium text-primary">
              Enterprise-Grade AI Assistant
            </span>
          </motion.div>

          {/* Main AUTONIX Title - More Professional */}
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 relative z-30 tracking-tight"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
          >
            <motion.span
              className="relative bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary"
              style={{
                backgroundSize: "200% 200%",
                filter: "drop-shadow(0 0 20px var(--text-glow-color-faded))",
              }}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              AUTONIX
            </motion.span>
          </motion.h1>

          {/* Professional Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="space-y-4"
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4 leading-tight">
              Your{" "}
              <span className="text-primary relative">
                Intelligent AI Agent
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                />
              </span>{" "}
              for Modern Business
            </h2>
            <motion.p
              className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              Transform your workflow with an AI assistant that understands
              natural language, executes complex tasks, and integrates
              seamlessly with your existing tools and processes.
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Professional Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20"
        >
          <Link href="/auth">
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <GradientButton
                fromColor="from-primary"
                toColor="to-secondary"
                className="text-base px-8 py-3 font-semibold shadow-lg"
              >
                <FaRocket className="mr-2" />
                Start Free Trial
              </GradientButton>
            </motion.div>
          </Link>

          <Link href="#features">
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <SingleColorButton
                bgColor="bg-card/80"
                textColor="text-foreground"
                className="text-base px-8 py-3 font-semibold border border-border/50 hover:border-primary/50 backdrop-blur-sm"
              >
                <FaLightbulb className="mr-2" />
                View Demo
              </SingleColorButton>
            </motion.div>
          </Link>
        </motion.div>

        {/* Professional Feature Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16"
        >
          {[
            {
              icon: FaAtom,
              title: "Advanced AI Processing",
              description:
                "State-of-the-art neural networks for intelligent task execution and decision making",
              color: "from-purple-500 to-pink-500",
            },
            {
              icon: FaBolt,
              title: "Real-time Performance",
              description:
                "Lightning-fast responses with enterprise-grade reliability and 99.9% uptime",
              color: "from-blue-500 to-cyan-500",
            },
            {
              icon: FaStar,
              title: "Continuous Learning",
              description:
                "Adaptive algorithms that evolve with your business needs and preferences",
              color: "from-green-500 to-emerald-500",
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.6,
                delay: 1.3 + index * 0.1,
                type: "spring",
                stiffness: 100,
              }}
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
              className="glass-card p-6 rounded-xl group cursor-pointer relative overflow-hidden"
            >
              <motion.div
                className="mb-4"
                whileHover={{
                  rotate: 360,
                  scale: 1.1,
                }}
                transition={{ duration: 0.6, type: "spring" }}
              >
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} p-3 mx-auto flex items-center justify-center shadow-lg`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
              </motion.div>

              <h3 className="text-lg font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                {feature.title}
              </h3>

              <p className="text-muted-foreground leading-relaxed text-sm">
                {feature.description}
              </p>

              {/* Professional hover effect */}
              <motion.div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background:
                    "linear-gradient(135deg, transparent 0%, var(--hover-glow-color) 50%, transparent 100%)",
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Professional Stats Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="flex flex-wrap justify-center gap-8 mb-16"
        >
          {[
            {
              value: "99.9%",
              label: "Uptime SLA",
              sublabel: "Enterprise reliability",
            },
            {
              value: "< 50ms",
              label: "Response Time",
              sublabel: "Lightning fast",
            },
            { value: "10K+", label: "Businesses", sublabel: "Trust Autonix" },
            {
              value: "SOC 2",
              label: "Compliant",
              sublabel: "Enterprise security",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="glass-card px-6 py-4 rounded-lg text-center min-w-[140px]"
              whileHover={{ scale: 1.05, y: -3 }}
              transition={{ type: "spring", stiffness: 300 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ transitionDelay: `${1.8 + index * 0.1}s` }}
            >
              <div className="text-2xl font-bold text-primary mb-1">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-foreground">
                {stat.label}
              </div>
              <div className="text-xs text-muted-foreground">
                {stat.sublabel}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2 }}
          className="text-center"
        >
          <p className="text-sm text-muted-foreground mb-4">
            Trusted by leading companies worldwide
          </p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            {["Microsoft", "Google", "Amazon", "Salesforce"].map(
              (company, index) => (
                <motion.div
                  key={company}
                  className="text-muted-foreground font-semibold text-lg"
                  whileHover={{ opacity: 1, scale: 1.1 }}
                  initial={{ opacity: 0.4 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ delay: 2.2 + index * 0.1 }}
                >
                  {company}
                </motion.div>
              )
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Professional Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 2.2 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center cursor-pointer"
          whileHover={{ scale: 1.1, borderColor: "var(--primary)" }}
          onClick={() =>
            document
              .getElementById("features")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          <motion.div
            className="w-1 h-3 bg-primary rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
