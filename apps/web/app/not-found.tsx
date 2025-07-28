"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaHome, FaArrowLeft } from "react-icons/fa";
import GradientButton from "@workspace/ui/components/gradient-button";
import SingleColorButton from "@workspace/ui/components/single-color-button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="text-center max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-8">
            <h1 className="text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              404
            </h1>
            <h2 className="text-2xl font-semibold text-foreground mt-4 mb-2">
              Page Not Found
            </h2>
            <p className="text-muted-foreground">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <GradientButton
                fromColor="from-primary"
                toColor="to-secondary"
                className="w-full sm:w-auto"
              >
                <FaHome className="mr-2" />
                Go Home
              </GradientButton>
            </Link>
            <button onClick={() => window.history.back()}>
              <SingleColorButton
                bgColor="bg-muted"
                textColor="text-foreground"
                className="w-full sm:w-auto"
              >
                <FaArrowLeft className="mr-2" />
                Go Back
              </SingleColorButton>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
