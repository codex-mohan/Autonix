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

// Memoize extensions for the CodeMirror preview (no changes here)
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
  // State to manually trigger a re-render
  const [retryId, setRetryId] = useState(0);

  const codeMirrorExtensions = useCodeMirrorExtensions();

  // FIX: A single, consolidated useEffect handles rendering.
  // It runs whenever the diagram code, theme, or the retry trigger changes.
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

        // FIX: Use mermaid.render() to get the SVG as a string.
        // This avoids direct DOM manipulation and integrates cleanly with React state.
        const { svg: renderedSvg } = await mermaid.render(
          `mermaid-graph-${Date.now()}`.toString(), // A unique ID is required
          code
        );
        setSvg(renderedSvg);
      } catch (e) {
        console.error("Mermaid rendering failed:", e);
        const message =
          e instanceof Error ? e.message : "An unknown error occurred.";
        setRenderError(message.replace(/[\r\n]+/g, " ")); // Clean up multiline errors
        setSvg(null);
      } finally {
        setIsRendering(false);
      }
    };

    renderDiagram();
  }, [code, theme, retryId]); // Dependencies are clear and concise

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

  // FIX: Re-rendering is now handled by updating the `retryId` state,
  // which re-triggers the main useEffect.
  const handleReRender = () => {
    setRetryId((prev) => prev + 1);
  };

  const hasContent = code.trim().length > 0;

  return (
    <div className="mermaid-container my-4 rounded-lg border bg-muted/30">
      <div className="relative w-full flex justify-center p-4">
        <TransformWrapper>
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              {/* Controls Toolbar */}
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
                {/* FIX: The content is now rendered declaratively based on state */}
                <div className="flex items-center justify-center p-4">
                  {isRendering && (
                    <div className="animate-pulse text-muted-foreground">
                      Rendering diagram...
                    </div>
                  )}
                  {renderError && !isRendering && (
                    <div className="text-red-500 p-4 text-center">
                      <div className="font-semibold mb-2">Rendering Error</div>
                      <div className="text-sm font-mono break-all">
                        {renderError}
                      </div>
                      <button
                        onClick={handleReRender}
                        className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                      >
                        Try Again
                      </button>
                    </div>
                  )}
                  {!isRendering && !renderError && svg && (
                    <div dangerouslySetInnerHTML={{ __html: svg }} />
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

      {/* Collapsible Code Preview (no major changes needed here) */}
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
