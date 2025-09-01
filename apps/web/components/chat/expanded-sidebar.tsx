"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useConversationStore, useChatStore } from "@/lib/store";
import {
  FaPlus,
  FaThumbtack,
  FaEdit,
  FaTrash,
  FaInfo,
  FaTimes,
} from "react-icons/fa";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@workspace/ui/components/tooltip";

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  messageCount: number;
}

interface ExpandedSidebarProps {
  isVisible: boolean;
  isPinned: boolean;
  onPin: () => void;
  onSelectChat: (chatId: string) => void;
}

export function ExpandedSidebar({
  isVisible,
  isPinned,
  onPin,
  onSelectChat,
}: ExpandedSidebarProps) {
  const { conversations, updateConversationTitle, deleteConversation } =
    useConversationStore();
  const { newConversation } = useChatStore();
  const [editingConversation, setEditingConversation] = useState<string | null>(
    null
  );
  const [editingName, setEditingName] = useState("");
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  // Professional animation variants with reduced bounce
  const sidebarVariants = {
    hidden: {
      x: -280,
      opacity: 0,
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
    exit: {
      x: -280,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  const headerVariants = {
    hidden: { y: -15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        delay: 0.1,
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  const buttonVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        delay: 0.2,
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.15,
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { x: -15, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  const handleEditConversation = (
    conversationId: string,
    currentName: string
  ) => {
    setEditingConversation(conversationId);
    setEditingName(currentName);
  };

  const handleSaveConversation = (conversationId: string) => {
    updateConversationTitle(conversationId, editingName);
    setEditingConversation(null);
    setEditingName("");
  };

  const handleDeleteConversation = (conversationId: string) => {
    deleteConversation(conversationId);
  };

  const handleShowInfo = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={sidebarVariants as any}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          exit="exit"
          className={`${
            isPinned ? "relative" : "fixed left-16"
          } top-0 h-full w-64 bg-card border-r border-border shadow-xl z-40 flex flex-col overflow-hidden`}
        >
          {/* Header with Pin Button */}
          <motion.div
            className="flex items-center justify-between p-4 border-b border-border flex-shrink-0"
            variants={headerVariants as any}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
          >
            <h2 className="text-lg font-semibold truncate">Chat History</h2>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    variants={buttonVariants as any}
                    initial="hidden"
                    animate={isVisible ? "visible" : "hidden"}
                    whileHover={{
                      rotate: isPinned ? 0 : 10,
                      scale: 1.05,
                      transition: { duration: 0.2 },
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onPin}
                      className={`w-8 h-8 flex-shrink-0 ${
                        isPinned
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <FaThumbtack className="w-4 h-4" />
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isPinned ? "Unpin sidebar" : "Pin sidebar"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </motion.div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
            {/* New Chat Button */}
            <motion.div
              className="p-4 border-b border-border flex-shrink-0"
              variants={buttonVariants as any}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
            >
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => {
                    onSelectChat("new");
                    newConversation();
                  }}
                >
                  <motion.div
                    whileHover={{ rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaPlus className="w-4 h-4 mr-2 flex-shrink-0" />
                  </motion.div>
                  <span className="truncate">New Conversation</span>
                </Button>
              </motion.div>
            </motion.div>

            {/* Conversations List */}
            <motion.div
              className="p-4 space-y-2"
              variants={listVariants}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
            >
              {conversations.length > 0 ? (
                conversations.map((conversation) => (
                  <motion.div
                    key={conversation.id}
                    variants={itemVariants}
                    className="group"
                  >
                    {editingConversation === conversation.id ? (
                      <div className="flex items-center space-x-2">
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="h-8 text-sm"
                          onKeyDown={(e) => {
                            if (e.key === "Enter")
                              handleSaveConversation(conversation.id);
                            if (e.key === "Escape")
                              setEditingConversation(null);
                          }}
                          autoFocus
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="w-8 h-8"
                          onClick={() =>
                            handleSaveConversation(conversation.id)
                          }
                        >
                          <FaTimes className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                        onClick={() => onSelectChat(conversation.id)}
                      >
                        <div className="flex-1 min-w-0 pr-2">
                          <p className="text-sm font-medium truncate">
                            {conversation.title}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {conversation.timestamp}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="w-6 h-6"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditConversation(
                                      conversation.id,
                                      conversation.title
                                    );
                                  }}
                                >
                                  <FaEdit className="w-3 h-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Edit</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="w-6 h-6 text-destructive hover:text-destructive"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteConversation(conversation.id);
                                  }}
                                >
                                  <FaTrash className="w-3 h-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="text-center text-sm text-muted-foreground py-8">
                  No conversations yet.
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
