"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import GradientButton from "@workspace/ui/components/gradient-button";
import SingleColorButton from "@workspace/ui/components/single-color-button";
import { FaRocket, FaLightbulb, FaStar, FaAtom, FaBolt } from "react-icons/fa";

export function LandingHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax transforms
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

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
      {/* Animated Grid Background */}
      <div className="absolute inset-0 animated-grid" />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>

      {/* Cyber Lines */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="cyber-line" />
        ))}
      </div>

      {/* Dynamic Background Orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full floating-orb"
        style={{
          background:
            "radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, rgba(139, 92, 246, 0.1) 40%, transparent 70%)",
          x: useTransform(scrollYProgress, [0, 1], [0, -100]),
          y: useTransform(scrollYProgress, [0, 1], [0, -50]),
        }}
        animate={{
          x: mousePosition.x * 0.02,
          y: mousePosition.y * 0.02,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
      />

      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full floating-orb"
        style={{
          background:
            "radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, rgba(168, 85, 247, 0.1) 40%, transparent 70%)",
          x: useTransform(scrollYProgress, [0, 1], [0, 100]),
          y: useTransform(scrollYProgress, [0, 1], [0, 50]),
        }}
        animate={{
          x: -mousePosition.x * 0.03,
          y: -mousePosition.y * 0.03,
        }}
        transition={{ type: "spring", stiffness: 40, damping: 25 }}
      />

      <motion.div
        className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full floating-orb"
        style={{
          background:
            "radial-gradient(circle, rgba(147, 51, 234, 0.2) 0%, rgba(147, 51, 234, 0.05) 40%, transparent 70%)",
          x: useTransform(scrollYProgress, [0, 1], [0, 50]),
          y: useTransform(scrollYProgress, [0, 1], [0, -75]),
        }}
        animate={{
          x: mousePosition.x * 0.015,
          y: mousePosition.y * 0.025,
        }}
        transition={{ type: "spring", stiffness: 60, damping: 15 }}
      />

      {/* Main Content */}
      <motion.div
        className="relative z-10 max-w-6xl mx-auto text-center"
        style={{ y: springY, scale: springScale, opacity }}
      >
        {/* Holographic Title */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-12"
        >
          {/* Main AUTONIX Title - Removed blur effects */}
          <motion.h1
            className="text-6xl md:text-8xl lg:text-9xl font-black mb-8"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            whileHover={{
              scale: 1.05,
            }}
            style={{
              textShadow:
                "0 0 30px rgba(139, 92, 246, 0.5), 0 0 60px rgba(139, 92, 246, 0.3)",
            }}
          >
            <motion.span
              className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary"
              style={{
                backgroundSize: "200% 200%",
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

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Your{" "}
              <span
                className="text-primary"
                style={{ textShadow: "0 0 20px rgba(139, 92, 246, 0.5)" }}
              >
                Agentic AI
              </span>{" "}
              Assistant
            </h2>
            <motion.p
              className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              Experience the future of AI interaction with our intelligent
              assistant that responds in natural language and executes real
              tasks like creating files, sending emails, monitoring events, and
              much more.
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20"
        >
          <Link href="/auth">
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <GradientButton
                fromColor="from-primary"
                toColor="to-secondary"
                className="text-lg px-10 py-4 neon-border"
              >
                <FaRocket className="mr-3" />
                Launch Experience
              </GradientButton>
            </motion.div>
          </Link>

          <Link href="#features">
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <SingleColorButton
                bgColor="bg-muted/20"
                textColor="text-foreground"
                className="text-lg px-10 py-4 glass-card border-primary/30"
              >
                <FaLightbulb className="mr-3" />
                Discover Features
              </SingleColorButton>
            </motion.div>
          </Link>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          {[
            {
              icon: FaAtom,
              title: "Neural Processing",
              description:
                "Advanced AI algorithms for intelligent task execution",
              color: "from-purple-500 to-pink-500",
            },
            {
              icon: FaBolt,
              title: "Lightning Fast",
              description:
                "Instant responses with real-time processing capabilities",
              color: "from-blue-500 to-cyan-500",
            },
            {
              icon: FaStar,
              title: "Adaptive Learning",
              description:
                "Continuously evolves to understand your preferences",
              color: "from-green-500 to-emerald-500",
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30, rotateX: -15 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                duration: 0.8,
                delay: 1.2 + index * 0.2,
                type: "spring",
                stiffness: 100,
              }}
              whileHover={{
                y: -10,
                rotateX: 5,
                scale: 1.02,
                transition: { duration: 0.3 },
              }}
              className="glass-card p-8 rounded-2xl group cursor-pointer"
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.div
                className="mb-6"
                whileHover={{
                  rotate: 360,
                  scale: 1.2,
                }}
                transition={{ duration: 0.6, type: "spring" }}
              >
                <div
                  className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} p-4 mx-auto flex items-center justify-center shadow-lg`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
              </motion.div>

              <h3 className="text-xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors">
                {feature.title}
              </h3>

              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Effect Lines */}
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background:
                    "linear-gradient(45deg, transparent 30%, rgba(139, 92, 246, 0.1) 50%, transparent 70%)",
                  backgroundSize: "200% 200%",
                }}
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Floating Stats */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
          className="mt-20 flex flex-wrap justify-center gap-8"
        >
          {[
            { value: "99.9%", label: "Uptime" },
            { value: "< 100ms", label: "Response Time" },
            { value: "50K+", label: "Active Users" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="glass-card px-6 py-4 rounded-xl text-center"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div
                className="text-2xl font-bold text-primary"
                style={{ textShadow: "0 0 15px rgba(139, 92, 246, 0.5)" }}
              >
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center"
          whileHover={{ scale: 1.1 }}
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
