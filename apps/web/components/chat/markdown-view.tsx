"use client";

import React, { useEffect, useMemo, useState } from "react";
// FIXED: Removed dynamic loader, we'll import languages directly
import { EditorView, lineNumbers } from "@codemirror/view";
import {
  foldGutter,
  syntaxHighlighting,
  defaultHighlightStyle,
} from "@codemirror/language";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";

// FIXED: Explicitly import the languages you need
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import dynamic from "next/dynamic";
import { tokyoNightStorm } from "@uiw/codemirror-themes-all";

import SmartLink from "@/components/smart-link";
// UPDATED: Import the new ZoomableImageWithLoader component
import ZoomableImageWithLoader from "./image-with-loader";

const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), {
  ssr: false,
});

// We add KaTeX CSS at runtime to make preview work in this environment.
const ensureKatexCSS = () => {
  const id = "katex-css-link";
  if (!document.getElementById(id)) {
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css";
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);
  }
};

// FIXED: Create a map of supported languages
const languageMap: Record<string, () => ReturnType<typeof python>> = {
  python: python,
  py: python,
  javascript: javascript,
  js: javascript,
  typescript: javascript, // JS parser provides good-enough TS highlighting
  ts: javascript,
};

// OPTIMIZATION: Memoize the CodeBlock component to prevent re-renders
const CodeBlock: React.FC<{ code: string; langHint?: string }> = React.memo(
  ({ code, langHint }) => {
    const [isCopied, setIsCopied] = useState(false);

    // FIXED: Use the new languageMap instead of the dynamic loader
    const languageExt = useMemo(() => {
      if (!langHint) return null;
      const langLoader = languageMap[langHint.toLowerCase()];
      return langLoader ? langLoader() : null;
    }, [langHint]);

    const extensions = useMemo(() => {
      const base = [
        lineNumbers(),
        foldGutter(),
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        EditorView.editable.of(false),
        EditorView.lineWrapping,
      ];
      // If a language is found, add it. Otherwise, CodeMirror will render plain text.
      if (languageExt) {
        return [...base, languageExt];
      }
      return base;
    }, [languageExt]);

    const handleCopy = () => {
      navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    };

    return (
      <div className="mt-4 overflow-hidden rounded-xl border border-zinc-700/70">
        <div className="flex items-center justify-between bg-zinc-800/80 px-4 py-1.5 text-xs">
          <span className="font-semibold uppercase text-zinc-300">
            {langHint || "code"}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-zinc-300 transition-colors hover:bg-zinc-700/80"
            title="Copy code"
          >
            {isCopied ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
        <CodeMirror
          value={code.replace(/\n$/, "")}
          height="auto"
          extensions={extensions}
          editable={false}
          theme={[
            tokyoNightStorm,
            EditorView.theme({
              "&": {
                fontSize: "0.875rem",
              },
              ".cm-editor": {
                borderRadius: "0",
              },
              ".cm-scroller": {
                paddingTop: "0.5rem",
                paddingBottom: "0.5rem",
                fontFamily:
                  "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
              },
              ".cm-gutters": {
                backgroundColor: "#282c34",
                borderRight: "1px solid #3f434e",
              },
            }),
          ]}
        />
      </div>
    );
  }
);
CodeBlock.displayName = "CodeBlock"; // Good practice for debugging

// Helper function to extract a YouTube video ID from various URL formats
const getYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;
  const regex =
    /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match: any = url.match(regex);
  return match ? match[1] : null;
};

// MAIN FIX: Wrap MarkdownView in React.memo to prevent re-renders when parent state changes.
const MarkdownView: React.FC<{ text: string }> = React.memo(({ text }) => {
  useEffect(() => ensureKatexCSS(), []);

  // OPTIMIZATION: Memoize the components object so it's not recreated on every render.
  const components = useMemo(
    () => ({
      // This 'code' component correctly handles both inline and block-level code.
      code({ className, children, ...props }: any) {
        // Fenced code blocks have a `language-xxx` class, inline code does not.
        const match = /language-([\w-]+)/.exec(className || "");
        const lang = match?.[1];
        const raw = String(children);

        // If there's no language match, we treat it as an inline code snippet.
        if (!match) {
          return (
            <code
              className="rounded bg-zinc-800 px-1.5 py-1 text-[0.9em] text-purple-300"
              {...props}
            >
              {children}
            </code>
          );
        }

        // Otherwise, it's a fenced code block that we render with CodeMirror.
        return <CodeBlock code={raw} langHint={lang} />;
      },
      p: ({ children }: any) => (
        <p className="leading-7 [&:not(:first-child)]:mt-4">{children}</p>
      ),
      h1: ({ children }: any) => (
        <h1 className="mt-6 border-b border-zinc-700 pb-2 text-2xl font-semibold tracking-tight">
          {children}
        </h1>
      ),
      h2: ({ children }: any) => (
        <h2 className="mt-8 border-b border-zinc-700 pb-2 text-xl font-semibold tracking-tight">
          {children}
        </h2>
      ),
      h3: ({ children }: any) => (
        <h3 className="mt-6 text-lg font-semibold tracking-tight">
          {children}
        </h3>
      ),
      ul: (props: any) => (
        <ul className="my-4 ml-6 list-disc [&>li]:mt-2" {...props} />
      ),
      ol: (props: any) => (
        <ol className="my-4 ml-6 list-decimal [&>li]:mt-2" {...props} />
      ),
      li: (props: any) => <li className="" {...props} />,
      blockquote: (props: any) => (
        <blockquote
          className="mt-4 border-l-2 border-zinc-600 pl-6 italic text-zinc-400"
          {...props}
        />
      ),
      table: (props: any) => (
        <div className="my-6 w-full overflow-y-auto">
          <table className="w-full" {...props} />
        </div>
      ),
      thead: (props: any) => (
        <thead className="border-b border-zinc-600 bg-zinc-600" {...props} />
      ),
      tr: (props: any) => (
        <tr
          className="m-0 border-t border-zinc-700 p-0 even:bg-zinc-800/50"
          {...props}
        />
      ),
      th: (props: any) => (
        <th
          className="border border-zinc-600 px-4 py-2 text-left font-bold"
          {...props}
        />
      ),
      td: (props: any) => (
        <td className="border border-zinc-600 px-4 py-2 text-left" {...props} />
      ),
      a: ({ node, href, children, ...props }: any) => {
        const videoId = href ? getYouTubeVideoId(href) : null;

        // If it's a YouTube link, render an embed
        if (videoId) {
          return (
            <div className="my-4 aspect-video overflow-hidden rounded-lg border border-zinc-700 bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              ></iframe>
            </div>
          );
        }

        // Otherwise, render a standard link with an icon and tooltip
        return <SmartLink href={href || ""}>{children}</SmartLink>;
      },

      // UPDATED: Custom renderer for images now uses the zoomable component
      img: ({ node, src, alt, ...props }: any) => {
        const videoId = src ? getYouTubeVideoId(src) : null;

        // Also check if an image tag is being used to embed a YouTube video
        if (videoId) {
          return (
            <div className="my-4 aspect-video overflow-hidden rounded-lg border border-zinc-700 bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              ></iframe>
            </div>
          );
        }

        return (
          <ZoomableImageWithLoader
            src={src}
            alt={alt}
            // Add sizing and margin classes for the thumbnail display
            className="my-4 aspect-video w-full max-w-xl"
            {...props}
          />
        );
      },
    }),
    []
  ); // Empty dependency array means this object is created only once

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={components}
    >
      {text}
    </ReactMarkdown>
  );
});
MarkdownView.displayName = "MarkdownView"; // Good practice for debugging

export default MarkdownView;
