"use client";

import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
} from "react";
import mermaid from "mermaid";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useTheme } from "next-themes";
import { EditorView, lineNumbers } from "@codemirror/view";
import {
  syntaxHighlighting,
  defaultHighlightStyle,
} from "@codemirror/language";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import {
  mermaid as mermaidLanguage,
  mindmapTags,
} from "codemirror-lang-mermaid";
import dynamic from "next/dynamic";
import { tokyoNight } from "@uiw/codemirror-themes-all";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  RefreshCw,
  Copy,
  Check,
  Code2,
  EyeOff,
} from "lucide-react";

const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), {
  ssr: false,
});

const useCodeMirrorExtensions = () => {
  return useMemo(
    () => [
      lineNumbers(),
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      EditorView.editable.of(false),
      EditorView.lineWrapping,
      mermaidLanguage(),
    ],
    []
  );
};

const MermaidDiagram: React.FC<{ code: string }> = React.memo(({ code }) => {
  const { theme } = useTheme();
  const [svg, setSvg] = useState<string | null>(null);
  const [showCode, setShowCode] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [retryId, setRetryId] = useState(0);

  const codeMirrorExtensions = useCodeMirrorExtensions();

  useEffect(() => {
    const renderDiagram = async () => {
      if (!code.trim()) {
        setSvg(null);
        setRenderError(null);
        return;
      }

      setIsRendering(true);
      setRenderError(null);

      try {
        mermaid.initialize({
          startOnLoad: false,
          suppressErrorRendering: true,
          theme: theme === "dark" ? "dark" : "default",
          fontFamily: "inherit",
        });

        const { svg: renderedSvg } = await mermaid.render(
          `mermaid-graph-${Date.now()}`.toString(),
          code
        );
        setSvg(renderedSvg);
      } catch (e) {
        console.error("Mermaid rendering failed:", e);
        // Ensure the error message is clean and can be displayed
        let message =
          e instanceof Error ? e.message : "An unknown error occurred.";
        // Sanitize newlines but also potentially break up very long error messages
        message = message.replace(/[\r\n]+/g, " ").replace(/(.{80})/g, "$1\n"); // Add newline every 80 chars as a soft break hint
        setRenderError(message);
        setSvg(null);
      } finally {
        setIsRendering(false);
      }
    };

    renderDiagram();
  }, [code, theme, retryId]);

  const handleCopyCode = useCallback(() => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }, [code]);

  const handleDownloadSVG = useCallback(() => {
    if (svg) {
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "diagram.svg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }, [svg]);

  const handleReRender = () => {
    setRetryId((prev) => prev + 1);
  };

  const hasContent = code.trim().length > 0;

  return (
    <div className="mermaid-container my-4 rounded-lg border bg-muted/30">
      <style jsx global>{`
        .mermaid-svg-container svg {
          max-width: 100%; /* Ensure SVG respects parent width */
          height: auto;
        }
        /* Specific styles for error messages to ensure they wrap */
        .mermaid-error-message {
          word-break: break-word; /* Allows breaking within words */
          overflow-wrap: break-word; /* Better for long strings */
          white-space: pre-wrap; /* Preserves newlines from processing */
          max-width: 100%; /* Explicitly set max-width */
        }
      `}</style>

      <div className="relative w-full flex justify-center p-4">
        <TransformWrapper>
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              {/* Controls Toolbar (unchanged) */}
              <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5 rounded-lg border bg-background/80 p-1.5 shadow-md">
                <button
                  onClick={() => zoomIn()}
                  title="Zoom In"
                  className="p-1.5 rounded-md hover:bg-muted"
                >
                  <ZoomIn size={16} />
                </button>
                <button
                  onClick={() => zoomOut()}
                  title="Zoom Out"
                  className="p-1.5 rounded-md hover:bg-muted"
                >
                  <ZoomOut size={16} />
                </button>
                <button
                  onClick={() => resetTransform()}
                  title="Reset Zoom"
                  className="p-1.5 rounded-md hover:bg-muted"
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  onClick={handleDownloadSVG}
                  title="Download as SVG"
                  className="p-1.5 rounded-md hover:bg-muted"
                  disabled={!svg}
                >
                  <Download size={16} />
                </button>
                <div className="h-5 w-px bg-border mx-1"></div>
                <button
                  onClick={handleReRender}
                  title="Re-render Diagram"
                  className="p-1.5 rounded-md hover:bg-muted"
                  disabled={isRendering}
                >
                  <RefreshCw
                    size={16}
                    className={isRendering ? "animate-spin" : ""}
                  />
                </button>
                <div className="h-5 w-px bg-border mx-1"></div>
                <button
                  onClick={handleCopyCode}
                  title="Copy Mermaid Code"
                  className="p-1.5 rounded-md hover:bg-muted"
                >
                  {isCopied ? <Check size={16} /> : <Copy size={16} />}
                </button>
                <button
                  onClick={() => setShowCode(!showCode)}
                  title={showCode ? "Hide Code" : "Show Code"}
                  className="p-1.5 rounded-md hover:bg-muted"
                >
                  {showCode ? <EyeOff size={16} /> : <Code2 size={16} />}
                </button>
              </div>

              <TransformComponent
                wrapperStyle={{ width: "100%", height: "100%", minHeight: 150 }}
                contentStyle={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                <div className="flex flex-col items-center justify-center p-4">
                  {isRendering && (
                    <div className="animate-pulse text-muted-foreground">
                      Rendering diagram...
                    </div>
                  )}
                  {renderError && !isRendering && (
                    <div className="text-red-500 p-4 text-center">
                      <div className="font-semibold mb-2">Rendering Error</div>
                      <div className="text-sm font-mono mermaid-error-message">
                        {renderError}
                      </div>{" "}
                      {/* Added mermaid-error-message class */}
                      <button
                        onClick={handleReRender}
                        className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                      >
                        Try Again
                      </button>
                    </div>
                  )}
                  {!isRendering && !renderError && svg && (
                    <div
                      className="mermaid-svg-container"
                      dangerouslySetInnerHTML={{ __html: svg }}
                    />
                  )}
                  {!isRendering && !renderError && !svg && hasContent && (
                    <div className="text-muted-foreground">
                      Preparing diagram...
                    </div>
                  )}
                  {!hasContent && (
                    <div className="text-sm text-muted-foreground/70">
                      No diagram code provided.
                    </div>
                  )}
                </div>
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>

      {showCode && (
        <div className="border-t">
          <CodeMirror
            value={code.replace(/\n$/, "")}
            height="auto"
            extensions={codeMirrorExtensions}
            editable={false}
            theme={[
              tokyoNight,
              EditorView.theme(
                {
                  "&": {
                    fontSize: "0.875rem",
                    backgroundColor: "hsl(var(--muted)/0.5)",
                  },
                  ".cm-editor": { borderRadius: "0" },
                  ".cm-scroller": {
                    padding: "0.5rem 0",
                    fontFamily:
                      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                  },
                  ".cm-gutters": {
                    backgroundColor: "hsl(var(--muted))",
                    borderRight: "1px solid hsl(var(--border))",
                  },
                },
                { dark: theme === "dark" }
              ),
            ]}
          />
        </div>
      )}
    </div>
  );
});

MermaidDiagram.displayName = "MermaidDiagram";

export default MermaidDiagram;
