"use client";
import { FC, useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { ChevronsUpDown } from "lucide-react";
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
        className="group flex items-center gap-2 text-muted-foreground"
      >
        <div className="flex flex-col items-start">
          <span className="text-md font-bold text-card-foreground group-hover:text-foreground">
            {isStreaming ? "Thinking" : "Thought"}
          </span>
          {reasoningTime && (
            <span className="text-xs group-hover:text-foreground">
              {reasoningTime}s duration
            </span>
          )}
        </div>
        <ChevronsUpDown className="h-4 w-4 group-hover:text-foreground" />
      </button>
      {isOpen && (
        <div className="mt-2 pl-4 border-l-2 border-border">
          <MarkdownView text={content} />
        </div>
      )}
    </div>
  );
};

export default Thinking;
