"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@workspace/ui/components/tooltip";

interface Collection {
  id: string;
  name: string;
  conversations: Conversation[];
}

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
  const [editingCollection, setEditingCollection] = useState<string | null>(
    null
  );
  const [editingName, setEditingName] = useState("");
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const [isAnimated, setIsAnimated] = useState(false);

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
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    exit: {
      x: -280,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
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
        ease: [0.25, 0.46, 0.45, 0.94],
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
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const collectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.15,
        staggerChildren: 0.05,
      },
    },
  };

  const conversationVariants = {
    hidden: { x: -15, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const libraryVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        delay: 0.3,
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  useEffect(() => {
    if (isVisible) {
      setIsAnimated(true);
    }
  }, [isVisible]);

  // Mock data
  const [collections, setCollections] = useState<Collection[]>([
    {
      id: "home",
      name: "Home",
      conversations: [
        {
          id: "1",
          title: "build a model card for ai",
          lastMessage: "Here's a comprehensive model card template...",
          timestamp: "2 hours ago",
          messageCount: 15,
        },
        {
          id: "2",
          title: "how can is set a python",
          lastMessage: "To set up Python environment...",
          timestamp: "1 day ago",
          messageCount: 8,
        },
      ],
    },
    {
      id: "finance",
      name: "Finance",
      conversations: [
        {
          id: "3",
          title: "what is langraph.json file",
          lastMessage: "LangGraph JSON files are configuration...",
          timestamp: "3 days ago",
          messageCount: 12,
        },
      ],
    },
    {
      id: "travel",
      name: "Travel",
      conversations: [
        {
          id: "4",
          title: "how can i get the list of",
          lastMessage: "You can get the list by using...",
          timestamp: "1 week ago",
          messageCount: 6,
        },
      ],
    },
    {
      id: "academic",
      name: "Academic",
      conversations: [
        {
          id: "5",
          title: "what does langchain.llm",
          lastMessage: "LangChain LLM is a wrapper...",
          timestamp: "2 weeks ago",
          messageCount: 20,
        },
        {
          id: "6",
          title: "what is reranking in rag",
          lastMessage: "Reranking in RAG improves...",
          timestamp: "3 weeks ago",
          messageCount: 18,
        },
        {
          id: "7",
          title: "how can i export a graph",
          lastMessage: "To export a graph, you can use...",
          timestamp: "1 month ago",
          messageCount: 10,
        },
      ],
    },
  ]);

  const handleEditCollection = (collectionId: string, currentName: string) => {
    setEditingCollection(collectionId);
    setEditingName(currentName);
  };

  const handleSaveCollection = (collectionId: string) => {
    setCollections((prev) =>
      prev.map((col) =>
        col.id === collectionId ? { ...col, name: editingName } : col
      )
    );
    setEditingCollection(null);
    setEditingName("");
  };

  const handleDeleteConversation = (conversationId: string) => {
    setCollections((prev) =>
      prev.map((col) => ({
        ...col,
        conversations: col.conversations.filter(
          (conv) => conv.id !== conversationId
        ),
      }))
    );
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
                  onClick={() => onSelectChat("new")}
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

            {/* Collections */}
            <motion.div
              className="p-4 space-y-4 max-h-80 overflow-y-auto thin-scrollbar"
              variants={collectionVariants}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
            >
              {collections.map((collection, collectionIndex) => (
                <motion.div
                  key={collection.id}
                  className="space-y-2"
                  variants={conversationVariants as any}
                  custom={collectionIndex}
                >
                  {/* Collection Header */}
                  <div className="flex items-center justify-between group min-w-0">
                    {editingCollection === collection.id ? (
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="h-6 text-sm min-w-0 flex-1"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleSaveCollection(collection.id);
                            } else if (e.key === "Escape") {
                              setEditingCollection(null);
                            }
                          }}
                          autoFocus
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="w-6 h-6 flex-shrink-0"
                          onClick={() => handleSaveCollection(collection.id)}
                        >
                          <FaTimes className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide truncate flex-1 min-w-0">
                          {collection.name}
                        </h3>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                          onClick={() =>
                            handleEditCollection(collection.id, collection.name)
                          }
                        >
                          <FaEdit className="w-3 h-3" />
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Conversations */}
                  <div className="space-y-1">
                    {collection.conversations.map((conversation, index) => (
                      <motion.div
                        key={conversation.id}
                        className="group flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer min-w-0"
                        onClick={() => onSelectChat(conversation.id)}
                        variants={conversationVariants as any}
                        whileHover={{
                          x: 2,
                          transition: { duration: 0.15 },
                        }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex-1 min-w-0 pr-2">
                          <p className="text-sm font-medium truncate">
                            {conversation.title}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {conversation.timestamp}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="w-6 h-6"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditCollection(
                                      conversation.id,
                                      conversation.title
                                    );
                                  }}
                                >
                                  <FaEdit className="w-3 h-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Edit conversation</p>
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
                                <p>Delete conversation</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <Dialog>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <DialogTrigger asChild>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="w-6 h-6"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleShowInfo(conversation);
                                      }}
                                    >
                                      <FaInfo className="w-3 h-3" />
                                    </Button>
                                  </DialogTrigger>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Conversation info</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>Conversation Details</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <h4 className="text-sm font-medium mb-1">
                                    Title
                                  </h4>
                                  <p className="text-sm text-muted-foreground break-words">
                                    {conversation.title}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium mb-1">
                                    Last Message
                                  </h4>
                                  <p className="text-sm text-muted-foreground break-words">
                                    {conversation.lastMessage}
                                  </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="text-sm font-medium mb-1">
                                      Messages
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                      {conversation.messageCount}
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-medium mb-1">
                                      Last Active
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                      {conversation.timestamp}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Library Section */}
          <motion.div
            className="border-t border-border p-4 flex-shrink-0"
            variants={libraryVariants as any}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
          >
            <div className="flex items-center justify-between mb-2 min-w-0">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide truncate flex-1">
                Library
              </h3>
              <Button
                size="icon"
                variant="ghost"
                className="w-6 h-6 flex-shrink-0"
              >
                <FaPlus className="w-3 h-3" />
              </Button>
            </div>
            <div className="space-y-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs"
              >
                <span className="truncate">Recent Searches</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs"
              >
                <span className="truncate">Saved Responses</span>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
