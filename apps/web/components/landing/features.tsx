"use client"

import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef } from "react"
import { FaEnvelope, FaFile, FaCloud, FaBell, FaCode, FaShieldAlt } from "react-icons/fa"

export function LandingFeatures() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["100px", "-100px"])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  const features = [
    {
      icon: FaEnvelope,
      title: "Email Management",
      description: "Send, receive, and organize emails automatically based on your preferences and commands.",
      gradient: "from-purple-500 to-pink-500",
      delay: 0,
    },
    {
      icon: FaFile,
      title: "File Operations",
      description: "Create, edit, organize, and manage files and documents with simple natural language commands.",
      gradient: "from-blue-500 to-cyan-500",
      delay: 0.1,
    },
    {
      icon: FaCloud,
      title: "Weather Monitoring",
      description: "Get real-time weather updates and alerts for your location or any place you specify.",
      gradient: "from-green-500 to-emerald-500",
      delay: 0.2,
    },
    {
      icon: FaBell,
      title: "Event Notifications",
      description: "Monitor and receive notifications for important events, deadlines, and reminders.",
      gradient: "from-orange-500 to-red-500",
      delay: 0.3,
    },
    {
      icon: FaCode,
      title: "Code Generation",
      description: "Generate, review, and execute code in multiple programming languages.",
      gradient: "from-indigo-500 to-purple-500",
      delay: 0.4,
    },
    {
      icon: FaShieldAlt,
      title: "Secure & Private",
      description: "Your data is encrypted and secure. We prioritize your privacy and data protection.",
      gradient: "from-teal-500 to-blue-500",
      delay: 0.5,
    },
  ]

  return (
    <section ref={containerRef} id="features" className="relative py-32 px-4 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 grid-background opacity-30" />

      {/* Floating Elements */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 2) * 40}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4 + i,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      <motion.div className="max-w-7xl mx-auto" style={{ y, opacity }}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.h2 className="text-5xl md:text-6xl font-black mb-8 neon-glow" whileHover={{ scale: 1.02 }}>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary">
              Powerful Features
            </span>
          </motion.h2>

          <motion.p
            className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Discover what makes Autonix the ultimate agentic AI assistant for your daily tasks and workflows.
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50, rotateX: -15 }}
              animate={
                isInView
                  ? {
                      opacity: 1,
                      y: 0,
                      rotateX: 0,
                    }
                  : {
                      opacity: 0,
                      y: 50,
                      rotateX: -15,
                    }
              }
              transition={{
                duration: 0.8,
                delay: feature.delay,
                type: "spring",
                stiffness: 100,
              }}
              whileHover={{
                y: -15,
                rotateX: 5,
                scale: 1.02,
                transition: { duration: 0.3 },
              }}
              className="group glass-card p-8 rounded-2xl relative overflow-hidden cursor-pointer"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Background Gradient Animation */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(135deg, transparent 0%, rgba(139, 92, 246, 0.3) 50%, transparent 100%)`,
                }}
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />

              {/* Icon */}
              <motion.div
                className="mb-6"
                whileHover={{
                  rotate: 360,
                  scale: 1.1,
                }}
                transition={{ duration: 0.6, type: "spring" }}
              >
                <div
                  className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.gradient} p-4 flex items-center justify-center shadow-lg neon-border`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
              </motion.div>

              <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors duration-300">
                {feature.title}
              </h3>

              <p className="text-muted-foreground leading-relaxed text-lg">{feature.description}</p>

              {/* Hover Glow Effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  boxShadow: "inset 0 0 20px rgba(139, 92, 246, 0.1)",
                }}
              />

              {/* Corner Accents */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-primary/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-4 left-4 w-2 h-2 bg-secondary/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-20"
        >
          <motion.div
            className="glass-card p-8 rounded-2xl max-w-2xl mx-auto"
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3 className="text-2xl font-bold mb-4 text-foreground">Ready to experience the future?</h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of users who are already transforming their workflow with Autonix.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold neon-border">
                Start Your Journey
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
