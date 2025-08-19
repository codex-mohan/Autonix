"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { atomone } from "@uiw/codemirror-theme-atomone";

import { FiLink } from "react-icons/fi"; // Import the link icon
import SmartLink from "@/components/smart-link";

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

// --- Types ---
interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

// --- Helpers ---
function classNames(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

// FIXED: Create a map of supported languages
const languageMap: Record<string, () => ReturnType<typeof python>> = {
  python: python,
  py: python,
  javascript: javascript,
  js: javascript,
  typescript: javascript, // JS parser provides good-enough TS highlighting
  ts: javascript,
};

// --- COMPONENTS ---

const CodeBlock: React.FC<{ code: string; langHint?: string }> = ({
  code,
  langHint,
}) => {
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
          atomone,
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
};

// --- HELPERS ---

// Helper function to extract a YouTube video ID from various URL formats
const getYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;
  const regex =
    /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match: any = url.match(regex);
  return match ? match[1] : null;
};

const MarkdownView: React.FC<{ text: string }> = ({ text }) => {
  useEffect(() => ensureKatexCSS(), []);

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        // This 'code' component correctly handles both inline and block-level code.
        code({ className, children, ...props }) {
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
        p: ({ children }) => (
          <p className="leading-7 [&:not(:first-child)]:mt-4">{children}</p>
        ),
        h1: ({ children }) => (
          <h1 className="mt-6 border-b border-zinc-700 pb-2 text-2xl font-semibold tracking-tight">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="mt-8 border-b border-zinc-700 pb-2 text-xl font-semibold tracking-tight">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="mt-6 text-lg font-semibold tracking-tight">
            {children}
          </h3>
        ),
        ul: (props) => (
          <ul className="my-4 ml-6 list-disc [&>li]:mt-2" {...props} />
        ),
        ol: (props) => (
          <ol className="my-4 ml-6 list-decimal [&>li]:mt-2" {...props} />
        ),
        li: (props) => <li className="" {...props} />,
        blockquote: (props) => (
          <blockquote
            className="mt-4 border-l-2 border-zinc-600 pl-6 italic text-zinc-400"
            {...props}
          />
        ),
        table: (props) => (
          <div className="my-6 w-full overflow-y-auto">
            <table className="w-full" {...props} />
          </div>
        ),
        thead: (props) => (
          <thead className="border-b border-zinc-600" {...props} />
        ),
        tr: (props) => (
          <tr
            className="m-0 border-t border-zinc-700 p-0 even:bg-zinc-800/50"
            {...props}
          />
        ),
        th: (props) => (
          <th
            className="border border-zinc-600 px-4 py-2 text-left font-bold"
            {...props}
          />
        ),
        td: (props) => (
          <td
            className="border border-zinc-600 px-4 py-2 text-left"
            {...props}
          />
        ),
        a: ({ node, href, children, ...props }) => {
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

        // Custom renderer for images
        img: ({ node, src, alt, ...props }) => {
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
            <img
              src={src}
              alt={alt}
              className="my-4 max-w-full rounded-lg border border-zinc-700"
              {...props}
            />
          );
        },
      }}
    >
      {text}
    </ReactMarkdown>
  );
};

const GlobalStyles: React.FC = () => (
  <style>{`
     .katex-display { text-align: center; margin: 1rem 0; }
     .message-bubble { @apply rounded-2xl p-3 sm:p-4 shadow-sm; }
     .message-user {
       background: linear-gradient(180deg, rgba(139,92,246,0.18), rgba(139,92,246,0.10));
       border: 1px solid rgba(139,92,246,0.35);
     }
     .message-assistant {
       background: linear-gradient(180deg, rgba(24,24,27,0.9), rgba(24,24,27,0.7));
       border: 1px solid rgba(63,63,70,0.6);
     }
   `}</style>
);

export default function DeepseekLikeChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m1",
      role: "assistant",
      content:
        "# Welcome to NovaFlow Assistant!\n\n" +
        "I can render a variety of Markdown elements to make our conversation clear and readable.\n\n" +
        "### Text Formatting\n" +
        "Here is some **bold text**, *italic text*, ~~strikethrough~~, and `inline code`.\n\n" +
        "### Mathematical Notation (using KaTeX)\n" +
        "I support inline LaTeX, like the famous equation $E = mc^2$, and block-level equations for more complex formulas:\n\n" +
        "$$ \n" +
        "\\int_{-\\infty}^{\\infty} e^{-x^2} \\, dx = \\sqrt{\\pi} \n" +
        "$$ \n\n" +
        "### Lists & Tables\n" +
        "Organize information with lists and tables.\n" +
        "* Unordered list item 1\n" +
        "    * A nested item\n" +
        "* Unordered list item 2\n\n" +
        "| Feature         | Status      |\n" +
        "| --------------- | ----------- |\n" +
        "| Markdown        | ✅ Supported |\n" +
        "| Code Highlighting | ✅ Supported |\n" +
        "| LaTeX           | ✅ Supported |\n\n" +
        "> Blockquotes are useful for highlighting important notes or quotes from a source.\n\n" +
        "### Code Highlighting\n" +
        "I can highlight code in various languages, including blocks without a specified language.\n\n" +
        "```python\n" +
        "def get_user_data(user_id: int) -> dict:\n" +
        '    """Fetches user data from a database."""\n' +
        "    try:\n" +
        "        with db_connection.cursor() as cursor:\n" +
        '            sql = "SELECT name, email FROM users WHERE id = %s"\n' +
        "            cursor.execute(sql, (user_id,))\n" +
        "            return cursor.fetchone()\n" +
        "    except Exception as e:\n" +
        '        print(f"An error occurred: {e}")\n' +
        "        return {}\n" +
        "```\n\n" +
        "### Rich Content & Embeds\n\n" +
        "I can also render hyperlinks, images, and even embed YouTube videos directly in the chat.\n\n" +
        "A standard link to the [official React documentation](https://react.dev) will appear with an icon.\n\n" +
        "Here's a standard image:\n" +
        "![A random placeholder image from Picsum Photos](https://picsum.photos/seed/picsum/600/400)\n\n" +
        "And here is an embedded YouTube video, rendered just by pasting the link:\n" +
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
  ]);
  const [draft, setDraft] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length]);

  const send = async () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };
    setMessages((m) => [...m, userMsg]);

    setIsSending(true);
    try {
      const assistant: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: `You said:\n\n${text}\n\nHere is a JS example:\n\n\`\`\`js\nexport const add = (a, b) => a + b;\n\`\`\`\n\nAnd a centered equation:\n\n$$E=mc^2$$`,
      };
      await new Promise((r) => setTimeout(r, 400));
      setMessages((m) => [...m, assistant]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100">
      <GlobalStyles />
      <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 pb-28 pt-6">
        <header className="sticky top-0 z-10 -mx-4 mb-1 border-b border-zinc-800/80 bg-zinc-950/70 px-4 backdrop-blur">
          <div className="mx-auto flex max-w-4xl items-center justify-between py-3">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 shadow" />
              <div>
                <h1 className="text-lg font-semibold tracking-tight">
                  NovaFlow Assistant
                </h1>
                <p className="text-xs text-zinc-400">
                  DeepSeek‑style chat • CodeMirror 6 • LaTeX
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-sm text-zinc-200 hover:bg-zinc-900"
                onClick={() => setMessages([])}
                title="Clear conversation"
              >
                Clear
              </button>
              <a
                className="rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-3 py-1.5 text-sm font-medium"
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                New chat
              </a>
            </div>
          </div>
        </header>

        <div
          ref={listRef}
          className="scrollbar-thin scrollbar-thumb-zinc-800/70 scrollbar-track-transparent flex min-h-[50vh] flex-col gap-3 overflow-y-auto rounded-2xl border border-zinc-800/70 bg-zinc-950/60 p-3 sm:p-4"
        >
          {messages.map((m) => (
            <div
              key={m.id}
              className={classNames(
                "message-bubble",
                m.role === "user"
                  ? "message-user self-end max-w-[90%]"
                  : "message-assistant self-start max-w-[95%]"
              )}
            >
              <div className="mb-1 text-[10px] uppercase tracking-wider text-zinc-400">
                {m.role}
              </div>
              <MarkdownView text={m.content} />
            </div>
          ))}
          {isSending && (
            <div className="message-assistant message-bubble w-fit animate-pulse text-zinc-400">
              Thinking…
            </div>
          )}
        </div>

        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-zinc-800/80 bg-zinc-950/80 backdrop-blur">
          <div className="mx-auto flex max-w-4xl items-end gap-2 px-4 py-3">
            <textarea
              className="min-h-[44px] max-h-40 w-full flex-1 resize-y rounded-2xl border border-zinc-800/80 bg-zinc-950/70 px-4 py-3 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-600/60"
              placeholder="Send a message, use ```lang for code, $x^2$ or $$...$$ for math"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
            />
            <button
              onClick={send}
              disabled={!draft.trim() || isSending}
              className={classNames(
                "rounded-2xl px-4 py-3 font-medium transition",
                draft.trim() && !isSending
                  ? "bg-gradient-to-r from-purple-600 to-fuchsia-600"
                  : "bg-zinc-800 text-zinc-400"
              )}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
