"use client";
import { FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import MarkdownView from "./markdown-view";

interface ThinkingProps {
  content: string;
  usageMetadata: {
    input_tokens: number;
    output_tokens: number;
    total_tokens: number;
    output_token_details?: {
      reasoning?: number;
    };
  } | null;
  isStreaming: boolean;
}

const Thinking: FC<ThinkingProps> = ({
  content,
  usageMetadata,
  isStreaming,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const reasoningTime =
    usageMetadata?.output_token_details?.reasoning &&
    usageMetadata.output_token_details.reasoning > 0
      ? (usageMetadata.output_token_details.reasoning / 1000).toFixed(2)
      : null;

  return (
    <div className="w-full my-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none"
      >
        <span className="font-semibold">
          {isStreaming
            ? "Thinking"
            : `Thought ${reasoningTime ? `for ${reasoningTime}s` : ""}`}
        </span>
        <ChevronDown
          className={`h-4 w-4 transform transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-2 pl-4 border-l-2 border-border">
              <MarkdownView text={content} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Thinking;
