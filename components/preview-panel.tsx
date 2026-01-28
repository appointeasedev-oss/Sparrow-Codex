"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Eye, RefreshCw, ExternalLink, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ProjectFile } from "./workspace-area"
import { generateCodeSandboxParameters, getCodeSandboxEmbedUrl } from "@/lib/codesandbox"

interface PreviewPanelProps {
  files: ProjectFile[]
}

export function PreviewPanel({ files }: PreviewPanelProps) {
  const [previewUrl, setPreviewUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const updatePreview = () => {
    if (files.length === 0) {
      setPreviewUrl("")
      return
    }

    setIsLoading(true)
    
    // Convert ProjectFile[] to SandboxFiles format
    const sandboxFiles = files.reduce((acc, file) => {
      if (file.type === "file") {
        acc[file.path] = { content: file.content }
      }
      return acc
    }, {} as any)

    try {
      const parameters = generateCodeSandboxParameters(sandboxFiles)
      const url = getCodeSandboxEmbedUrl(parameters, { 
        view: "preview", 
        runonclick: 0 
      })
      setPreviewUrl(url)
    } catch (error) {
      console.error("Failed to generate CodeSandbox preview:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      updatePreview()
    }, 1000) // Debounce preview updates
    return () => clearTimeout(timer)
  }, [files])

  const refreshPreview = () => {
    setIsRefreshing(true)
    updatePreview()
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const openInCodeSandbox = () => {
    if (previewUrl) {
      window.open(previewUrl.replace("embed=1", "embed=0"), "_blank")
    }
  }

  if (files.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full h-full bg-gray-900 rounded-lg border border-gray-800 flex items-center justify-center"
      >
        <div className="text-center text-gray-500">
          <Eye className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">Preview will appear here</p>
          <p className="text-sm">Start a conversation to generate code</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full bg-white rounded-lg border border-gray-800 flex flex-col overflow-hidden"
    >
      {/* Preview Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2">
          <Eye className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Live Preview (CodeSandbox)</span>
          {isLoading && <Loader2 className="w-3 h-3 animate-spin text-blue-500" />}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={refreshPreview}
            disabled={isRefreshing || isLoading}
            className="text-gray-600 hover:text-gray-800 h-8 w-8 p-0"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={openInCodeSandbox} 
            className="text-gray-600 hover:text-gray-800 h-8 w-8 p-0"
            title="Open in CodeSandbox"
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 bg-white relative">
        {previewUrl ? (
          <iframe
            src={previewUrl}
            className="w-full h-full border-none"
            allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
            sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
            title="CodeSandbox Preview"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <Loader2 className="w-12 h-12 mx-auto mb-2 animate-spin opacity-20" />
              <p>Preparing preview...</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
