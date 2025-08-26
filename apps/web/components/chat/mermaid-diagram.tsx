"use client";

import React, { useEffect, useMemo, useState } from "react";
import mermaid from "mermaid";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useTheme } from "next-themes";
import { EditorView, lineNumbers } from "@codemirror/view";
import { foldGutter, syntaxHighlighting, defaultHighlightStyle } from "@codemirror/language";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import dynamic from "next/dynamic";
import { tokyoNight } from "@uiw/codemirror-themes-all";

const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), {
  ssr: false,
});

// Memoize extensions for the CodeMirror preview
const useCodeMirrorExtensions = () => {
  return useMemo(
    () => [
      lineNumbers(),
      foldGutter(),
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      EditorView.editable.of(false),
      EditorView.lineWrapping,
      markdown({ base: markdownLanguage }), // Mermaid syntax is markdown-like
    ],
    []
  );
};

const MermaidDiagram: React.FC<{ code: string }> = React.memo(({ code }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [isRendered, setIsRendered] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const codeMirrorExtensions = useCodeMirrorExtensions();

  useEffect(() => {
    setIsRendered(false);
    if (ref.current) {
      ref.current.innerHTML = "";
    }
    if (ref.current && code) {
      try {
        mermaid.initialize({
          startOnLoad: false,
          theme: theme === "dark" ? "dark" : "default",
          fontFamily: "inherit",
        });
        ref.current.innerHTML = code;
        ref.current.classList.add("mermaid");
        mermaid.run({ nodes: [ref.current] });
        setIsRendered(true);
      } catch (e) {
        console.error("Mermaid rendering failed:", e);
        if (ref.current) {
          ref.current.classList.remove("mermaid");
          ref.current.innerHTML =
            '<div class="text-red-500 p-4">Error: Mermaid diagram could not be rendered.</div>';
        }
      }
    }
  }, [code, theme]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadSVG = () => {
    if (ref.current?.querySelector("svg")) {
      const svgData = new XMLSerializer().serializeToString(
        ref.current.querySelector("svg")!
      );
      const blob = new Blob([svgData], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "diagram.svg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="mermaid-container my-4 rounded-lg border bg-muted/30">
      <div className="relative w-full flex justify-center p-4">
        <TransformWrapper>
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              {/* Controls Toolbar */}
              <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5 rounded-lg border bg-background/80 p-1.5 shadow-md">
                {/* Diagram Controls */}
                <button
                  onClick={() => zoomIn()}
                  title="Zoom In"
                  className="p-1.5 rounded-md hover:bg-muted"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
                <button
                  onClick={() => zoomOut()}
                  title="Zoom Out"
                  className="p-1.5 rounded-md hover:bg-muted"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
                <button
                  onClick={() => resetTransform()}
                  title="Reset Zoom"
                  className="p-1.5 rounded-md hover:bg-muted"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 2v6h6"></path>
                    <path d="M21 12A9 9 0 0 0 6 5.3L3 8"></path>
                    <path d="M21 22v-6h-6"></path>
                    <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path>
                  </svg>
                </button>
                <button
                  onClick={handleDownloadSVG}
                  title="Download as SVG"
                  className="p-1.5 rounded-md hover:bg-muted"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                </button>

                {/* Divider */}
                <div className="h-5 w-px bg-border mx-1"></div>

                {/* Code Controls */}
                <button
                  onClick={handleCopyCode}
                  title="Copy Mermaid Code"
                  className="p-1.5 rounded-md hover:bg-muted flex items-center gap-1.5"
                >
                  {isCopied ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect
                        x="9"
                        y="9"
                        width="13"
                        height="13"
                        rx="2"
                        ry="2"
                      ></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => setShowCode(!showCode)}
                  title={showCode ? "Hide Code" : "Show Code"}
                  className="p-1.5 rounded-md hover:bg-muted"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="16 18 22 12 16 6"></polyline>
                    <polyline points="8 6 2 12 8 18"></polyline>
                  </svg>
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
                <div ref={ref} />
                {!isRendered && (
                  <div className="animate-pulse text-muted-foreground">
                    Loading diagram...
                  </div>
                )}
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>

      {/* Collapsible Code Preview */}
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