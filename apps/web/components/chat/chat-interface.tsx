"use client"

import { useState } from "react"
import { ChatSidebar } from "./chat-sidebar"
import { ChatMain } from "./chat-main"

export function ChatInterface() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [isPinned, setIsPinned] = useState(false)

  return (
    <div className="flex h-screen bg-background">
      <ChatSidebar
        selectedChat={selectedChat}
        onSelectChat={setSelectedChat}
        isPinned={isPinned}
        onPinChange={setIsPinned}
      />
      <ChatMain selectedChat={selectedChat} isPinned={isPinned} />
    </div>
  )
}
