"use client";

import type React from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useState, useRef } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaClock,
  FaHeadset,
  FaGlobe,
} from "react-icons/fa";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import GradientButton from "@workspace/ui/components/gradient-button";

export function LandingContact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["30px", "-30px"]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      company: "",
      subject: "",
      message: "",
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: FaEnvelope,
      title: "Email Support",
      content: "hello@autonix.ai",
      href: "mailto:hello@autonix.ai",
      gradient: "from-purple-500 to-pink-500",
      description: "Get in touch via email",
    },
    {
      icon: FaPhone,
      title: "Phone Support",
      content: "+1 (555) 123-4567",
      href: "tel:+15551234567",
      gradient: "from-blue-500 to-cyan-500",
      description: "Call us during business hours",
    },
    {
      icon: FaMapMarkerAlt,
      title: "Headquarters",
      content: "San Francisco, CA",
      href: "#",
      gradient: "from-green-500 to-emerald-500",
      description: "Visit our main office",
    },
  ];

  const supportFeatures = [
    {
      icon: FaClock,
      title: "24/7 Support",
      description: "Round-the-clock assistance for enterprise customers",
    },
    {
      icon: FaHeadset,
      title: "Dedicated Success Manager",
      description: "Personal support for your implementation journey",
    },
    {
      icon: FaGlobe,
      title: "Global Coverage",
      description: "Support teams across multiple time zones",
    },
  ];

  return (
    <section
      ref={containerRef}
      id="contact"
      className="relative py-24 px-4 overflow-hidden"
    >
      {/* Professional Grid Background */}
      <div className="absolute inset-0 grid-background opacity-30" />

      {/* Subtle floating orbs */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 rounded-full floating-orb opacity-10"
        style={{
          background:
            "radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-40 h-40 rounded-full floating-orb opacity-10"
        style={{
          background:
            "radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%)",
        }}
      />

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
              Enterprise Support
            </span>
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl font-black mb-6"
            whileHover={{ scale: 1.02 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary">
              Let's Build the Future Together
            </span>
          </motion.h2>

          <motion.p
            className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Ready to transform your business with AI? Our team of experts is
            here to guide you through every step of your digital transformation
            journey.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info & Support Features */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold mb-6 text-foreground">
                Get in Touch
              </h3>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Whether you're looking to implement AI solutions, need technical
                support, or want to explore partnership opportunities, we're
                here to help.
              </p>
            </div>

            {/* Contact Methods */}
            <div className="space-y-4">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                >
                  <a
                    href={item.href}
                    className="flex items-center space-x-4 p-6 rounded-xl glass-card group cursor-pointer relative z-10"
                  >
                    <motion.div
                      className={`w-12 h-12 bg-gradient-to-r ${item.gradient} rounded-lg flex items-center justify-center shadow-lg`}
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <item.icon className="w-6 h-6 text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-primary font-medium">{item.content}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </a>
                </motion.div>
              ))}
            </div>

            {/* Support Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="space-y-4"
            >
              <h4 className="text-lg font-bold text-foreground mb-4">
                Why Choose Our Support?
              </h4>
              {supportFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={
                    isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                  }
                  transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                  className="flex items-start space-x-3 p-4 rounded-lg glass-card"
                >
                  <feature.icon className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h5 className="font-semibold text-foreground">
                      {feature.title}
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Professional Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card className="glass-card border-primary/20 shadow-2xl relative z-10">
              <CardContent className="p-8">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Send us a Message
                  </h3>
                  <p className="text-muted-foreground">
                    Fill out the form below and we'll get back to you within 24
                    hours.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.div
                      className="space-y-2"
                      whileFocus={{ scale: 1.02 }}
                    >
                      <Label
                        htmlFor="firstName"
                        className="text-foreground font-medium"
                      >
                        First Name *
                      </Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
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
                        Last Name *
                      </Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
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
                      Business Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@company.com"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="bg-background/50 border-border focus:border-primary transition-colors"
                    />
                  </motion.div>

                  <motion.div
                    className="space-y-2"
                    whileFocus={{ scale: 1.02 }}
                  >
                    <Label
                      htmlFor="company"
                      className="text-foreground font-medium"
                    >
                      Company
                    </Label>
                    <Input
                      id="company"
                      type="text"
                      placeholder="Your Company Name"
                      value={formData.company}
                      onChange={handleInputChange}
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
                      Subject *
                    </Label>
                    <Input
                      id="subject"
                      type="text"
                      placeholder="How can we help you?"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
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
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your project, requirements, or any questions you have..."
                      rows={5}
                      required
                      value={formData.message}
                      onChange={handleInputChange}
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
                      className="mt-6 py-3 text-base font-semibold shadow-lg"
                    >
                      <FaPaperPlane className="mr-2" />
                      {isSubmitting ? "Sending Message..." : "Send Message"}
                    </GradientButton>
                  </motion.div>

                  <p className="text-xs text-muted-foreground text-center">
                    By submitting this form, you agree to our Privacy Policy and
                    Terms of Service.
                  </p>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
