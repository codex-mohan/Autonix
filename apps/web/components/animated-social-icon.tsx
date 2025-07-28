"use client"

import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import type { IconType } from "react-icons"
import { motion, useAnimation } from "framer-motion"
import { useRef } from "react"

const MotionLink = motion.create(Link)

interface AnimatedSocialIconProps {
  icon: LucideIcon | IconType
  href: string
  label: string
  animationType?: "flip" | "rotate" | "creative"
  size?: "sm" | "md" | "lg"
  className?: string
}

export function AnimatedSocialIcon({
  icon: Icon,
  href,
  label,
  animationType = "flip",
  size = "md",
  className = "",
}: AnimatedSocialIconProps) {
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-12 h-12",
    lg: "w-14 h-14",
  }

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  const controls = useAnimation()
  const isHovered = useRef(false)

  const transition = { duration: 0.6, ease: "easeInOut" }

  const getAnimationVariants = () => {
    switch (animationType) {
      case "flip":
        return {
          hover: { rotateY: 360, scale: [1, 0.8, 1], transition },
          unhover: { rotateY: 0, scale: 1, transition },
        }
      case "rotate":
        return {
          hover: { rotate: 360, scale: [1, 1.2, 1], transition },
          unhover: { rotate: 0, scale: 1, transition },
        }
      case "creative":
        return {
          hover: {
            scale: [1, 1.3, 0.9, 1.1, 1],
            rotate: [0, 15, -10, 5, 0],
            y: [0, -8, 4, -2, 0],
            transition,
          },
          unhover: { scale: 1, rotate: 0, y: 0, transition },
        }
      default:
        return {
          hover: { scale: 1.1, transition },
          unhover: { scale: 1, transition },
        }
    }
  }

  const animationVariants = getAnimationVariants()

  const handleMouseEnter = () => {
    if (!isHovered.current) {
      isHovered.current = true
      controls.start("hover")
    }
  }

  const handleMouseLeave = () => {
    isHovered.current = false
    controls.start("unhover")
  }

  return (
    <MotionLink
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      aria-label={label}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative group ${sizeClasses[size]} flex items-center justify-center rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 hover:from-primary hover:to-secondary transition-all duration-300 hover:scale-110 ${className}`}
    >
      {/* Glow effect */}
      <motion.div className="absolute -inset-2 rounded-full opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-75 blur-xl bg-gradient-to-r from-primary to-secondary" />

      {/* Icon container */}
      <motion.div
        className={`relative z-10 ${iconSizes[size]} flex items-center justify-center text-white`}
        animate={controls}
        initial="unhover"
        variants={animationVariants as any}
        style={{ transformStyle: "preserve-3d" }}
      >
        <Icon className={`${iconSizes[size]} text-white`} />
      </motion.div>

      <span className="sr-only">{label}</span>
    </MotionLink>
  )
}
