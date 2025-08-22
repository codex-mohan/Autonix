"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import MarkdownView from "@/components/chat/markdown-view";

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
        "```\n" +
        "And another example in JavaScript:\n" +
        "```js\n" +
        "function greet(name) {\n" +
        "  console.log(`Hello, ${name}!`);\n" +
        "}\n" +
        "greet('John');\n" +
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
        content:
          `You said:\n\n${text}\n\nHere is a JS example:\n\n\`\`\`js\nexport const add = (a, b) => a + b;\n \`\`\` \n\n And a centered equation:\n` +
          "$$ \n" +
          "\\int_{-\\infty}^{\\infty} e^{-x^2} \\, dx = \\sqrt{\\pi} \n" +
          "$$ \n\n",
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
                "message-bubble p-4",
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
