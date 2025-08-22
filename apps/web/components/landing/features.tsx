"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";
import {
  FaEnvelope,
  FaFile,
  FaCloud,
  FaBell,
  FaCode,
  FaShieldAlt,
  FaChartLine,
  FaUsers,
  FaCog,
} from "react-icons/fa";

export function LandingFeatures() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["50px", "-50px"]);

  const features = [
    {
      icon: FaEnvelope,
      title: "Email Automation",
      description:
        "Intelligent email management with automated responses, scheduling, and priority filtering based on context and importance.",
      gradient: "from-purple-500 to-pink-500",
      delay: 0,
      category: "Communication",
    },
    {
      icon: FaFile,
      title: "Document Processing",
      description:
        "Advanced document creation, editing, and analysis with support for multiple formats and collaborative workflows.",
      gradient: "from-blue-500 to-cyan-500",
      delay: 0.1,
      category: "Productivity",
    },
    {
      icon: FaCloud,
      title: "Data Integration",
      description:
        "Seamless integration with cloud services, APIs, and databases for comprehensive data management and analysis.",
      gradient: "from-green-500 to-emerald-500",
      delay: 0.2,
      category: "Integration",
    },
    {
      icon: FaBell,
      title: "Smart Notifications",
      description:
        "Intelligent alert system that learns your preferences and delivers contextually relevant notifications.",
      gradient: "from-orange-500 to-red-500",
      delay: 0.3,
      category: "Automation",
    },
    {
      icon: FaCode,
      title: "Code Generation",
      description:
        "AI-powered code generation, review, and optimization across multiple programming languages and frameworks.",
      gradient: "from-indigo-500 to-purple-500",
      delay: 0.4,
      category: "Development",
    },
    {
      icon: FaShieldAlt,
      title: "Enterprise Security",
      description:
        "Bank-grade encryption, compliance monitoring, and advanced security protocols to protect your sensitive data.",
      gradient: "from-teal-500 to-blue-500",
      delay: 0.5,
      category: "Security",
    },
  ];

  const additionalFeatures = [
    {
      icon: FaChartLine,
      title: "Analytics & Insights",
      description:
        "Comprehensive analytics dashboard with actionable insights and performance metrics.",
    },
    {
      icon: FaUsers,
      title: "Team Collaboration",
      description:
        "Built-in collaboration tools for seamless team coordination and project management.",
    },
    {
      icon: FaCog,
      title: "Custom Workflows",
      description:
        "Create and automate custom workflows tailored to your specific business processes.",
    },
  ];

  return (
    <section
      ref={containerRef}
      id="features"
      className="relative py-24 px-4 overflow-hidden"
    >
      {/* Professional Grid Background */}
      <div className="absolute inset-0 grid-background opacity-40" />

      {/* Subtle floating elements */}
      <div className="absolute inset-0">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full"
            style={{
              left: `${25 + i * 20}%`,
              top: `${30 + (i % 2) * 40}%`,
            }}
            animate={{
              y: [-15, 15, -15],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 4 + i,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      <motion.div className="max-w-7xl mx-auto" style={{ y }}>
        {/* Professional Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={
              isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
            }
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <span className="text-sm font-medium text-primary">
              Comprehensive AI Capabilities
            </span>
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl font-black mb-6"
            whileHover={{ scale: 1.02 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary">
              Powerful Features for Modern Business
            </span>
          </motion.h2>

          <motion.p
            className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Discover comprehensive AI capabilities designed to streamline your
            workflow, enhance productivity, and drive business growth.
          </motion.p>
        </motion.div>

        {/* Main Features Grid - Consistent spacing and alignment */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={
                isInView
                  ? {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }
                  : {
                      opacity: 0,
                      y: 30,
                      scale: 0.95,
                    }
              }
              transition={{
                duration: 0.6,
                delay: feature.delay,
                type: "spring",
                stiffness: 100,
              }}
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
              className="group glass-card rounded-xl relative overflow-hidden cursor-pointer h-full flex flex-col"
            >
              {/* Consistent card structure with fixed heights and spacing */}
              <div className="p-8 flex flex-col h-full">
                {/* Category Badge - consistently positioned */}
                <div className="absolute top-4 right-4 z-10">
                  <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium border border-primary/20">
                    {feature.category}
                  </span>
                </div>

                {/* Icon container - consistent spacing from top */}
                <div className="flex-shrink-0 mb-6 mt-2">
                  <motion.div
                    whileHover={{
                      rotate: 360,
                      scale: 1.1,
                    }}
                    transition={{ duration: 0.6, type: "spring" }}
                  >
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.gradient} p-3.5 flex items-center justify-center shadow-lg`}
                    >
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                  </motion.div>
                </div>

                {/* Content area - consistent spacing */}
                <div className="flex-grow flex flex-col">
                  <h3 className="text-xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors duration-300 leading-tight">
                    {feature.title}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed text-sm flex-grow">
                    {feature.description}
                  </p>
                </div>
              </div>

              {/* Professional hover effect */}
              <motion.div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(135deg, transparent 0%, var(--hover-glow-color) 50%, transparent 100%)",
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Additional Features Section - Consistent with main cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mb-16"
        >
          <h3 className="text-2xl font-bold mb-8 text-foreground">
            And Much More
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                className="glass-card rounded-lg text-center group hover:scale-105 transition-transform duration-200 h-full flex flex-col"
              >
                {/* Consistent padding and structure */}
                <div className="p-6 flex flex-col h-full">
                  {/* Icon - consistent positioning */}
                  <div className="flex-shrink-0 mb-4">
                    <feature.icon className="w-8 h-8 text-primary mx-auto" />
                  </div>

                  {/* Content - consistent spacing */}
                  <div className="flex-grow flex flex-col">
                    <h4 className="font-semibold mb-3 text-foreground group-hover:text-primary transition-colors leading-tight">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-grow">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Professional CTA Section - Consistent alignment */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center"
        >
          <motion.div
            className="glass-card p-8 rounded-2xl max-w-3xl mx-auto"
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              Ready to Transform Your Business?
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Join thousands of forward-thinking companies that have already
              revolutionized their operations with Autonix's intelligent AI
              capabilities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-shadow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Free Trial
              </motion.button>
              <motion.button
                className="px-6 py-3 border border-border hover:border-primary/50 rounded-lg font-semibold text-foreground hover:text-primary transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Schedule Demo
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
