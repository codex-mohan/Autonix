"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChatSidebar } from "./chat-sidebar";
import { ChatMain } from "./chat-main";

export function ChatInterface({ chatId }: { chatId?: string }) {
  const [isPinned, setIsPinned] = useState(false);
  const router = useRouter();

  const handleSelectChat = (selectedChatId: string) => {
    if (selectedChatId === "new") {
      // For new chat, just navigate to /chat without any chatId
      router.push("/chat");
    } else if (selectedChatId !== chatId) {
      router.push(`/chat/${selectedChatId}`);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <ChatSidebar
        selectedChat={chatId}
        onSelectChat={handleSelectChat}
        isPinned={isPinned}
        onPinChange={setIsPinned}
      />
      <ChatMain selectedChat={chatId} isPinned={isPinned} activeConversationId={chatId} />
    </div>
  );
}
