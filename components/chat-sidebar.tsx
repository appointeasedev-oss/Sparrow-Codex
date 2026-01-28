"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { 
  Send, Plus, MessageSquare, Sparkles, Loader2, X, 
  ImageIcon, CheckCircle2, Circle, Terminal, FileCode, FolderTree 
} from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  steps?: AgentStep[]
}

interface AgentStep {
  id: string
  title: string
  status: "pending" | "running" | "completed" | "error"
  description?: string
}

interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
}

interface CodeBlock {
  language: string
  filename: string
  content: string
}

export function ChatSidebar() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentSession, setCurrentSession] = useState<string | null>(null)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState<string>("gpt-4o")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imageAnalysis, setImageAnalysis] = useState<string>("")
  const [canSend, setCanSend] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const availableModels = [
    { name: 'GPT-4o', id: 'gpt-4o' },
    { name: 'Claude 3.5 Sonnet', id: 'claude-3-5-sonnet' },
    { name: 'Gemini 1.5 Pro', id: 'gemini-1-5-pro' },
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [sessions])

  const parseFileStructure = (content: string): string[] => {
    const files: string[] = []
    const structureRegex = /##?\s*File\s*Structure[\s\S]*?(?=##|$)/i
    const structureMatch = content.match(structureRegex)

    if (structureMatch) {
      const fileRegex = /[-*]\s*([a-zA-Z0-9._\/-]+\.[a-zA-Z0-9]+)/gi
      let match
      while ((match = fileRegex.exec(structureMatch[0])) !== null) {
        if (!files.includes(match[1])) files.push(match[1])
      }
    }

    // Fallback to code blocks
    const codeBlockRegex = /```\w+\s*(?:file[=:]?\s*["']?([^"'\n]+)["']?)?\s*\n/g
    let match
    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match[1]) {
        const filename = match[1].replace(/^["']|["']$/g, "")
        if (!files.includes(filename)) files.push(filename)
      }
    }

    return files
  }

  const parseCodeBlocks = (content: string): CodeBlock[] => {
    const codeBlocks: CodeBlock[] = []
    const codeBlockRegex = /```(\w+)?\s*(?:file[=:]?\s*["']?([^"'\n]+)["']?)?\s*\n([\s\S]*?)```/g
    let match

    while ((match = codeBlockRegex.exec(content)) !== null) {
      const language = match[1] || "text"
      let filename = match[2] || `untitled.${getFileExtension(language)}`
      const code = match[3].trim()
      filename = filename.replace(/^["']|["']$/g, "")
      if (code) {
        codeBlocks.push({ language, filename, content: code })
      }
    }
    return codeBlocks
  }

  const getFileExtension = (language: string): string => {
    const map: Record<string, string> = {
      html: "html", css: "css", javascript: "js", js: "js",
      typescript: "ts", ts: "ts", jsx: "jsx", tsx: "tsx", json: "json"
    }
    return map[language.toLowerCase()] || "txt"
  }

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
    }
    setSessions((prev) => [newSession, ...prev])
    setCurrentSession(newSession.id)
    window.dispatchEvent(new CustomEvent("createNewProject", {
      detail: { sessionId: newSession.id, projectName: `Project ${newSession.id.slice(-4)}` }
    }))
  }

  const sendMessage = async () => {
    if (!input.trim() && !selectedImage) return
    if (!canSend) return

    let sessionId = currentSession
    if (!sessionId) {
      sessionId = Date.now().toString()
      createNewSession()
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date(),
    }

    setInput("")
    setSessions((prev) =>
      prev.map((s) => s.id === sessionId ? { ...s, messages: [...s.messages, userMessage] } : s)
    )

    setIsLoading(true)
    
    const assistantMessageId = (Date.now() + 1).toString()
    const initialSteps: AgentStep[] = [
      { id: "analyze", title: "Analyzing request", status: "running" },
      { id: "structure", title: "Planning file structure", status: "pending" },
      { id: "generate", title: "Generating code", status: "pending" },
      { id: "apply", title: "Applying changes", status: "pending" },
    ]

    const assistantMessage: Message = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
      steps: initialSteps
    }

    setSessions((prev) =>
      prev.map((s) => s.id === sessionId ? { ...s, messages: [...s.messages, assistantMessage] } : s)
    )

    try {
      const puter = (window as any).puter
      if (!puter) throw new Error("Puter.js not loaded")

      const systemPrompt = `You are Sparrow AI, an expert React + TypeScript developer.
      You build modern, responsive web applications using Vite, React, and Tailwind CSS.
      
      ALWAYS follow this format:
      1. ## File Structure: List all files with their full paths (e.g., src/components/Button.tsx)
      2. ## Code Files: Provide complete code for each file using code blocks with file names.
      
      Example:
      ## File Structure
      - package.json
      - src/App.tsx
      
      ## Code Files
      \`\`\`tsx file="src/App.tsx"
      import React from 'react';
      export default function App() { return <div>Hello</div>; }
      \`\`\`
      `

      // Update steps: Analyzing -> Planning
      updateStep(sessionId, assistantMessageId, "analyze", "completed")
      updateStep(sessionId, assistantMessageId, "structure", "running")

      const response = await puter.ai.chat([
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage.content }
      ], { model: selectedModel })

      const content = typeof response === 'string' ? response : response?.message?.content || ""
      
      // Update steps: Planning -> Generating
      updateStep(sessionId, assistantMessageId, "structure", "completed")
      updateStep(sessionId, assistantMessageId, "generate", "running")

      const files = parseFileStructure(content)
      const codeBlocks = parseCodeBlocks(content)

      // Update steps: Generating -> Applying
      updateStep(sessionId, assistantMessageId, "generate", "completed")
      updateStep(sessionId, assistantMessageId, "apply", "running")

      // Dispatch events to update workspace
      if (files.length > 0) {
        window.dispatchEvent(new CustomEvent("createProjectFiles", { detail: { files } }))
      }
      
      codeBlocks.forEach(block => {
        window.dispatchEvent(new CustomEvent("codeGenerated", {
          detail: { code: block.content, language: block.language, filename: block.filename }
        }))
      })

      updateStep(sessionId, assistantMessageId, "apply", "completed")

      setSessions((prev) =>
        prev.map((s) => s.id === sessionId ? {
          ...s,
          messages: s.messages.map(m => m.id === assistantMessageId ? { ...m, content } : m)
        } : s)
      )

    } catch (error: any) {
      console.error("AI Error:", error)
      updateStep(sessionId, assistantMessageId, "analyze", "error", error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const updateStep = (sessionId: string, messageId: string, stepId: string, status: AgentStep["status"], description?: string) => {
    setSessions((prev) =>
      prev.map((s) => s.id === sessionId ? {
        ...s,
        messages: s.messages.map(m => m.id === messageId ? {
          ...m,
          steps: m.steps?.map(step => step.id === stepId ? { ...step, status, description } : step)
        } : m)
      } : s)
    )
  }

  return (
    <div className="w-96 border-r border-gray-800 bg-gray-950 flex flex-col h-full">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/50">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-blue-400" />
          <h2 className="font-bold text-white">Sparrow AI</h2>
        </div>
        <Button size="sm" variant="ghost" onClick={createNewSession} className="h-8 w-8 p-0">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {currentSession && sessions.find(s => s.id === currentSession)?.messages.map((message) => (
            <div key={message.id} className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"}`}>
              <div className={`max-w-[90%] p-3 rounded-lg text-sm ${
                message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-900 text-gray-200 border border-gray-800"
              }`}>
                {message.content || (message.role === "assistant" && "Thinking...")}
              </div>
              
              {message.steps && (
                <div className="mt-3 w-full space-y-2 bg-gray-900/50 p-3 rounded-md border border-gray-800/50">
                  {message.steps.map(step => (
                    <div key={step.id} className="flex items-center space-x-3 text-xs">
                      {step.status === "running" ? (
                        <Loader2 className="w-3 h-3 animate-spin text-blue-400" />
                      ) : step.status === "completed" ? (
                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                      ) : step.status === "error" ? (
                        <X className="w-3 h-3 text-red-500" />
                      ) : (
                        <Circle className="w-3 h-3 text-gray-600" />
                      )}
                      <span className={step.status === "running" ? "text-blue-400 font-medium" : "text-gray-400"}>
                        {step.title}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-gray-800 bg-gray-900/30">
        <div className="relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Sparrow to build something..."
            className="min-h-[100px] bg-gray-900 border-gray-700 text-white resize-none focus-visible:ring-blue-500"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
          />
          <div className="absolute bottom-2 right-2 flex items-center space-x-2">
            <select 
              value={selectedModel} 
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-gray-800 text-[10px] text-gray-400 border-none rounded px-1 py-0.5 focus:ring-0"
            >
              {availableModels.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
            <Button 
              size="sm" 
              onClick={sendMessage} 
              disabled={isLoading || (!input.trim() && !selectedImage)}
              className="h-8 w-8 p-0 bg-blue-600 hover:bg-blue-500"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
