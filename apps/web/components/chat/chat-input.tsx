"use client";

import type React from "react";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaImage,
  FaMapMarkerAlt,
  FaMicrochip,
  FaGlobe,
  FaPaperclip,
  FaMicrophone,
  FaPaperPlane,
  FaCamera,
  FaFileImage,
  FaVideo,
  FaFileAlt,
  FaFilePdf,
  FaFileCode,
  FaMapPin,
  FaCompass,
  FaRoute,
  FaServer,
  FaBrain,
  FaCog,
  FaNewspaper,
  FaWikipediaW,
  FaStopCircle, // Import stop icon
} from "react-icons/fa";
import { PiWaveformBold } from "react-icons/pi";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import GradientButton from "@workspace/ui/components/gradient-button";

import { useChatStore } from "../../lib/store";
import type { UseStream } from "@langchain/langgraph-sdk/react";
import type { Message } from "@langchain/langgraph-sdk";

interface ChatInputProps {
  thread: UseStream<{ messages: Message[] }>;
}

export function ChatInput({ thread }: ChatInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [activeLeftIcon, setActiveLeftIcon] = useState("search");
  const inputRef = useRef<HTMLInputElement>(null);
  const { addMessage, setIsLoading, setShowInitialUI } = useChatStore();

  const searchContainerVariants = {
    hidden: {
      y: 30,
      opacity: 0,
      scale: 0.98,
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const iconGroupVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.2,
      },
    },
  };

  const iconVariants = {
    hidden: {
      scale: 0.8,
      opacity: 0,
    },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = { type: "human", content: inputValue };
    addMessage(userMessage);
    thread.submit({ messages: [userMessage] });
    setInputValue("");
    setShowInitialUI(false);
  };

  const handleStop = () => {
    thread.stop();
    setIsLoading(false);
  };

  const handleImageOption = (option: string) => {
    console.log("Image option selected:", option);
  };

  const handleLocationOption = (option: string) => {
    console.log("Location option selected:", option);
  };

  const handleCpuOption = (option: string) => {
    console.log("CPU option selected:", option);
  };

  const handleGlobeOption = (option: string) => {
    console.log("Globe option selected:", option);
  };

  const handleAttachmentOption = (option: string) => {
    console.log("Attachment option selected:", option);
  };

  const handleAudioOption = (option: string) => {
    console.log("Audio option selected:", option);
  };

  return (
    <motion.div
      className="relative"
      variants={searchContainerVariants as any}
      initial="hidden"
      animate="visible"
    >
      <form onSubmit={handleSubmit} className="relative">
        <motion.div
          className="relative bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 p-6"
          whileHover={{
            scale: 1.005,
            boxShadow: "0 8px 32px rgba(139, 92, 246, 0.08)",
            transition: { duration: 0.2 },
          }}
        >
          {/* Text Input Area */}
          <div className="mb-6">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything or @mention a Space"
              className="w-full border-0 bg-transparent px-0 py-2 text-lg placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 h-auto"
            />
          </div>

          {/* Icon Groups */}
          <div className="flex items-center justify-between">
            {/* Left Icon Group */}
            <motion.div
              className="flex items-center space-x-3"
              variants={iconGroupVariants}
            >
              {/* Animate each icon */}
              <motion.div variants={iconVariants as any}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setActiveLeftIcon(
                            activeLeftIcon === "search" ? "" : "search"
                          )
                        }
                        className={`w-10 h-10 rounded-xl transition-all duration-200 ${
                          activeLeftIcon === "search"
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        <FaSearch className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Search</p>
                  </TooltipContent>
                </Tooltip>
              </motion.div>

              {/* Image - Dropdown menu */}
              <motion.div variants={iconVariants as any}>
                <DropdownMenu>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="w-10 h-10 rounded-xl transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-muted"
                          >
                            <FaImage className="w-4 h-4" />
                          </Button>
                        </motion.div>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Image & Media</p>
                    </TooltipContent>
                  </Tooltip>
                  <DropdownMenuContent align="start" className="w-48">
                    <DropdownMenuItem
                      onClick={() => handleImageOption("camera")}
                    >
                      <FaCamera className="w-4 h-4 mr-2" />
                      Take Photo
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleImageOption("upload")}
                    >
                      <FaFileImage className="w-4 h-4 mr-2" />
                      Upload Image
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleImageOption("video")}
                    >
                      <FaVideo className="w-4 h-4 mr-2" />
                      Record Video
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>

              {/* Location - Dropdown menu */}
              <motion.div variants={iconVariants as any}>
                <DropdownMenu>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="w-10 h-10 rounded-xl transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-muted"
                          >
                            <FaMapMarkerAlt className="w-4 h-4" />
                          </Button>
                        </motion.div>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Location Services</p>
                    </TooltipContent>
                  </Tooltip>
                  <DropdownMenuContent align="start" className="w-48">
                    <DropdownMenuItem
                      onClick={() => handleLocationOption("current")}
                    >
                      <FaMapPin className="w-4 h-4 mr-2" />
                      Current Location
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleLocationOption("nearby")}
                    >
                      <FaCompass className="w-4 h-4 mr-2" />
                      Find Nearby
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleLocationOption("directions")}
                    >
                      <FaRoute className="w-4 h-4 mr-2" />
                      Get Directions
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            </motion.div>

            {/* Right Icon Group */}
            <motion.div
              className="flex items-center space-x-3"
              variants={iconGroupVariants}
            >
              {/* CPU - Dropdown menu */}
              <motion.div variants={iconVariants as any}>
                <DropdownMenu>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="w-10 h-10 rounded-xl transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-muted"
                          >
                            <FaMicrochip className="w-4 h-4" />
                          </Button>
                        </motion.div>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>AI Processing</p>
                    </TooltipContent>
                  </Tooltip>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onClick={() => handleCpuOption("analyze")}
                    >
                      <FaBrain className="w-4 h-4 mr-2" />
                      Deep Analysis
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleCpuOption("process")}
                    >
                      <FaServer className="w-4 h-4 mr-2" />
                      Process Data
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleCpuOption("optimize")}
                    >
                      <FaCog className="w-4 h-4 mr-2" />
                      Optimize Task
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>

              {/* Globe - Dropdown menu */}
              <motion.div variants={iconVariants as any}>
                <DropdownMenu>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="w-10 h-10 rounded-xl transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-muted"
                          >
                            <FaGlobe className="w-4 h-4" />
                          </Button>
                        </motion.div>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Web & Research</p>
                    </TooltipContent>
                  </Tooltip>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onClick={() => handleGlobeOption("search")}
                    >
                      <FaGlobe className="w-4 h-4 mr-2" />
                      Web Search
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleGlobeOption("news")}>
                      <FaNewspaper className="w-4 h-4 mr-2" />
                      Latest News
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleGlobeOption("wiki")}>
                      <FaWikipediaW className="w-4 h-4 mr-2" />
                      Wikipedia
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>

              {/* Attachment - Dropdown menu */}
              <motion.div variants={iconVariants as any}>
                <DropdownMenu>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="w-10 h-10 rounded-xl transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-muted"
                          >
                            <FaPaperclip className="w-4 h-4" />
                          </Button>
                        </motion.div>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Attach Files</p>
                    </TooltipContent>
                  </Tooltip>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onClick={() => handleAttachmentOption("document")}
                    >
                      <FaFileAlt className="w-4 h-4 mr-2" />
                      Document
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleAttachmentOption("pdf")}
                    >
                      <FaFilePdf className="w-4 h-4 mr-2" />
                      PDF File
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleAttachmentOption("code")}
                    >
                      <FaFileCode className="w-4 h-4 mr-2" />
                      Code File
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>

              {/* Audio Wave - Dropdown menu */}
              <motion.div variants={iconVariants as any}>
                <DropdownMenu>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="w-10 h-10 rounded-xl transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-muted"
                          >
                            <PiWaveformBold className="w-4 h-4" />
                          </Button>
                        </motion.div>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Audio & Voice</p>
                    </TooltipContent>
                  </Tooltip>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onClick={() => handleAudioOption("record")}
                    >
                      <FaMicrophone className="w-4 h-4 mr-2" />
                      Record Audio
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleAudioOption("voice")}
                    >
                      <PiWaveformBold className="w-4 h-4 mr-2" />
                      Voice Message
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>

              {/* Always show gradient send button with tooltip */}
              <motion.div variants={iconVariants as any}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {thread.isLoading ? (
                        <Button
                          type="button"
                          onClick={handleStop}
                          className="!w-10 !h-10 !p-0 !rounded-xl mx-2 bg-red-500 hover:bg-red-600 text-white"
                        >
                          <FaStopCircle className="w-4 h-4" />
                        </Button>
                      ) : (
                        <GradientButton
                          type="submit"
                          fromColor="from-primary"
                          toColor="to-secondary"
                          width={"auto"}
                          height={"auto"}
                          onClick={handleSubmit as any}
                          className="!w-10 !h-10 !p-0 !rounded-xl mx-2"
                        >
                          <FaPaperPlane className="w-4 h-4 text-foreground" />
                        </GradientButton>
                      )}
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{thread.isLoading ? "Stop Stream" : "Send Message"}</p>
                  </TooltipContent>
                </Tooltip>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </form>
    </motion.div>
  );
}
