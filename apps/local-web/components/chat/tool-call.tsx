"use client";
import { FC, useState, useMemo } from "react";
import { Button } from "@workspace/ui/components/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { FiCheck, FiCopy, FiDownload } from "react-icons/fi";
import { EditorView, lineNumbers } from "@codemirror/view";
import {
  syntaxHighlighting,
  defaultHighlightStyle,
} from "@codemirror/language";
import { json } from "@codemirror/lang-json";
import dynamic from "next/dynamic";
import { tokyoNight } from "@uiw/codemirror-themes-all";
import { useTheme } from "next-themes";

const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), {
  ssr: false,
});

interface ToolCallProps {
  toolName: string;
  toolArgs: Record<string, any>;
  toolOutput: string;
}

// Simple code block component with copy functionality (no CodeMirror for outputs)
const SimpleCodeBlock: React.FC<{ code: string; title?: string }> = ({
  code,
  title = "code",
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = `${title.toLowerCase().replace(/\s+/g, "-")}.txt`;
    const blob = new Blob([code], {
      type: `text/plain;charset=utf-8;`,
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="mt-2 overflow-hidden rounded-xl border border-border">
      <div className="flex items-center justify-between bg-muted/50 px-4 py-1.5 text-xs">
        <span className="font-semibold uppercase text-muted-foreground">
          {title}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-muted-foreground transition-colors hover:bg-muted"
            title="Download"
          >
            <FiDownload size={14} />
            Download
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-muted-foreground transition-colors hover:bg-muted"
            title="Copy"
          >
            {isCopied ? (
              <>
                <FiCheck size={14} />
                Copied!
              </>
            ) : (
              <>
                <FiCopy size={14} />
                Copy
              </>
            )}
          </button>
        </div>
      </div>
      <pre className="mt-0 text-sm text-foreground/80 overflow-x-auto bg-muted p-4 rounded-b-lg">
        {code}
      </pre>
    </div>
  );
};

// CodeMirror code block for tool arguments (with syntax highlighting)
const CodeBlock: React.FC<{ code: string; lang?: string; title?: string }> = ({
  code,
  lang = "json",
  title = "code",
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const { theme } = useTheme();

  const extensions = useMemo(() => {
    const base = [
      lineNumbers(),
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      EditorView.editable.of(false),
      EditorView.lineWrapping,
    ];

    // Add language support for JSON
    if (lang === "json") {
      return [...base, json()];
    }

    return base;
  }, [lang]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    const extension = lang === "json" ? "json" : "txt";
    const filename = `${title.toLowerCase().replace(/\s+/g, "-")}.${extension}`;
    const blob = new Blob([code], {
      type: `text/${extension};charset=utf-8;`,
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="mt-2 overflow-hidden rounded-xl border border-border">
      <div className="flex items-center justify-between bg-muted/50 px-4 py-1.5 text-xs">
        <span className="font-semibold uppercase text-muted-foreground">
          {title}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-muted-foreground transition-colors hover:bg-muted"
            title="Download code"
          >
            <FiDownload size={14} />
            Download
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-muted-foreground transition-colors hover:bg-muted"
            title="Copy code"
          >
            {isCopied ? (
              <>
                <FiCheck size={14} />
                Copied!
              </>
            ) : (
              <>
                <FiCopy size={14} />
                Copy
              </>
            )}
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <CodeMirror
          value={code}
          theme={theme === "dark" ? tokyoNight : "light"}
          extensions={extensions}
          className="text-sm"
        />
      </div>
    </div>
  );
};

const ToolCall: React.FC<ToolCallProps> = ({
  toolName,
  toolArgs,
  toolOutput,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="rounded-lg border bg-background px-3 py-2"
    >
      <div className="flex items-center justify-between space-x-4">
        <h4 className="text-sm font-bold">Tool Call: {toolName}</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      {Object.keys(toolArgs).length > 0 && (
        <CollapsibleContent className="mb-2">
          <CodeBlock
            code={JSON.stringify(toolArgs, null, 2)}
            lang="json"
            title="Arguments"
          />
        </CollapsibleContent>
      )}
      {toolOutput.length > 0 && (
        <CollapsibleContent className="mb-2">
          <SimpleCodeBlock code={toolOutput} title="Output" />
        </CollapsibleContent>
      )}
    </Collapsible>
  );
};

export default ToolCall;
