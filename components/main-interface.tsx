"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChatSidebar } from "./chat-sidebar"
import { WorkspaceArea } from "./workspace-area"
import { SparrowLogo } from "./sparrow-logo"
import { Menu, X, MessageSquare, Code } from "lucide-react"

export function MainInterface() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeView, setActiveView] = useState<"chat" | "workspace">("chat")

  return (
    <div className="h-[100dvh] bg-black text-white flex flex-col md:flex-row overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-3 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800 flex-shrink-0 safe-area-top">
        <div className="flex items-center space-x-2">
          <SparrowLogo size={28} />
          <h1 className="text-lg font-bold">Sparrow</h1>
        </div>
        <div className="flex items-center space-x-2">
          {/* Mobile view toggle */}
          <button
            onClick={() => setActiveView(activeView === "chat" ? "workspace" : "chat")}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            {activeView === "chat" ? (
              <Code className="w-5 h-5" />
            ) : (
              <MessageSquare className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="hidden md:flex w-96 border-r border-gray-800 flex-col h-full"
      >
        <div className="p-4 border-b border-gray-800 flex items-center space-x-3 bg-gradient-to-r from-gray-900 to-gray-800 glow-white flex-shrink-0">
          <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 300 }}>
            <SparrowLogo size={32} />
          </motion.div>
          <motion.h1
            className="text-xl font-bold tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Sparrow
          </motion.h1>
        </div>
        <div className="flex-1 min-h-0">
          <ChatSidebar />
        </div>
      </motion.div>

      {/* Mobile Chat View */}
      <div className={`md:hidden flex-1 min-h-0 ${activeView === "chat" ? "flex" : "hidden"} flex-col`}>
        <ChatSidebar />
      </div>

      {/* Mobile Workspace View */}
      <div className={`md:hidden flex-1 min-h-0 ${activeView === "workspace" ? "flex" : "hidden"} flex-col`}>
        <WorkspaceArea />
      </div>

      {/* Desktop Workspace */}
      <motion.div
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        className="hidden md:flex flex-1 flex-col h-full relative"
      >
        <div className="absolute inset-0 bg-gradient-radial opacity-30 pointer-events-none" />
        <div className="relative z-10 h-full">
          <WorkspaceArea />
        </div>
      </motion.div>
    </div>
  )
}
