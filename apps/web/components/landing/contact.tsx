"use client";

import type React from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useState, useRef } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaRocket,
} from "react-icons/fa";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import GradientButton from "@workspace/ui/components/gradient-button";

export function LandingContact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["50px", "-50px"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: FaEnvelope,
      title: "Email",
      content: "hello@autonix.ai",
      href: "mailto:hello@autonix.ai",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: FaPhone,
      title: "Phone",
      content: "+1 (555) 123-4567",
      href: "tel:+15551234567",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: FaMapMarkerAlt,
      title: "Location",
      content: "San Francisco, CA",
      href: "#",
      gradient: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <section
      ref={containerRef}
      id="contact"
      className="relative py-32 px-4 overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 grid-background opacity-20" />

      {/* Floating Orbs */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 rounded-full floating-orb"
        style={{
          background:
            "radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-40 h-40 rounded-full floating-orb"
        style={{
          background:
            "radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 70%)",
        }}
      />

      <motion.div className="max-w-7xl mx-auto" style={{ y, opacity }}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.h2
            className="text-5xl md:text-6xl font-black mb-8 neon-glow"
            whileHover={{ scale: 1.02 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary">
              Get In Touch
            </span>
          </motion.h2>

          <motion.p
            className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Ready to experience the future of AI assistance? Contact us to learn
            more about Autonix.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-3xl font-bold mb-6 text-foreground">
                Let's Connect
              </h3>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Have questions about Autonix? Want to see a demo? We'd love to
                hear from you and show you the incredible possibilities of
                agentic AI.
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                  }
                  transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 10 }}
                >
                  <a
                    href={item.href}
                    className="flex items-center space-x-6 p-6 rounded-2xl glass-card group cursor-pointer"
                  >
                    <motion.div
                      className={`w-16 h-16 bg-gradient-to-r ${item.gradient} rounded-full flex items-center justify-center shadow-lg neon-border`}
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <item.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <div>
                      <h4 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-muted-foreground text-lg">
                        {item.content}
                      </p>
                    </div>
                  </a>
                </motion.div>
              ))}
            </div>

            {/* Additional Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="glass-card p-6 rounded-2xl"
            >
              <div className="flex items-center space-x-4 mb-4">
                <FaRocket className="w-6 h-6 text-primary" />
                <h4 className="font-bold text-lg text-foreground">
                  Quick Response
                </h4>
              </div>
              <p className="text-muted-foreground">
                We typically respond within 24 hours. For urgent inquiries,
                please call us directly.
              </p>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card className="glass-card border-primary/20 shadow-2xl">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                      className="space-y-2"
                      whileFocus={{ scale: 1.02 }}
                    >
                      <Label
                        htmlFor="firstName"
                        className="text-foreground font-medium"
                      >
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        required
                        className="bg-background/50 border-border focus:border-primary transition-colors"
                      />
                    </motion.div>
                    <motion.div
                      className="space-y-2"
                      whileFocus={{ scale: 1.02 }}
                    >
                      <Label
                        htmlFor="lastName"
                        className="text-foreground font-medium"
                      >
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        required
                        className="bg-background/50 border-border focus:border-primary transition-colors"
                      />
                    </motion.div>
                  </div>

                  <motion.div
                    className="space-y-2"
                    whileFocus={{ scale: 1.02 }}
                  >
                    <Label
                      htmlFor="email"
                      className="text-foreground font-medium"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      required
                      className="bg-background/50 border-border focus:border-primary transition-colors"
                    />
                  </motion.div>

                  <motion.div
                    className="space-y-2"
                    whileFocus={{ scale: 1.02 }}
                  >
                    <Label
                      htmlFor="subject"
                      className="text-foreground font-medium"
                    >
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      type="text"
                      placeholder="I'm interested in Autonix"
                      required
                      className="bg-background/50 border-border focus:border-primary transition-colors"
                    />
                  </motion.div>

                  <motion.div
                    className="space-y-2"
                    whileFocus={{ scale: 1.02 }}
                  >
                    <Label
                      htmlFor="message"
                      className="text-foreground font-medium"
                    >
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us more about your needs and how Autonix can help transform your workflow..."
                      rows={5}
                      required
                      className="bg-background/50 border-border focus:border-primary transition-colors resize-none"
                    />
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <GradientButton
                      type="submit"
                      fromColor="from-primary"
                      toColor="to-secondary"
                      width="full"
                      disabled={isSubmitting}
                      className="mt-8 py-4 text-lg font-semibold neon-border"
                    >
                      <FaPaperPlane className="mr-3" />
                      {isSubmitting ? "Sending Message..." : "Send Message"}
                    </GradientButton>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
