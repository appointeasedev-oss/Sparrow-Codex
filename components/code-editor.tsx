"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { 
  File, FileText, Globe, Palette, Settings, Copy, Download, 
  Trash2, Edit3, Plus, Save, X, Folder, ChevronRight, ChevronDown 
} from "lucide-react"
import { Code } from "lucide-react"
import type { ProjectFile } from "./workspace-area"

interface CodeEditorProps {
  files: ProjectFile[]
  activeFileId: string | null
  onFileSelect: (fileId: string) => void
  onFileUpdate: (fileId: string, content: string) => void
  onFileDelete: (fileId: string) => void
  onFileRename: (fileId: string, newName: string) => void
}

export function CodeEditor({
  files,
  activeFileId,
  onFileSelect,
  onFileUpdate,
  onFileDelete,
  onFileRename,
}: CodeEditorProps) {
  const [editorContent, setEditorContent] = useState("")
  const [editingFileId, setEditingFileId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")
  const [isCreatingFile, setIsCreatingFile] = useState(false)
  const [newFileName, setNewFileName] = useState("")
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["folder_src"]))

  const activeFile = files.find((f) => f.id === activeFileId)

  useEffect(() => {
    if (activeFile) {
      setEditorContent(activeFile.content)
    }
  }, [activeFile])

  const handleContentChange = (content: string) => {
    setEditorContent(content)
    if (activeFileId) {
      onFileUpdate(activeFileId, content)
    }
  }

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId)
    } else {
      newExpanded.add(folderId)
    }
    setExpandedFolders(newExpanded)
  }

  const renderFileTree = (parentId: string | null = null, level = 0) => {
    const children = files.filter(f => f.parentId === parentId)
      .sort((a, b) => {
        if (a.type !== b.type) return a.type === "folder" ? -1 : 1
        return a.name.localeCompare(b.name)
      })

    return children.map(file => {
      const isExpanded = expandedFolders.has(file.id)
      const isSelected = activeFileId === file.id

      return (
        <div key={file.id}>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`group flex items-center space-x-2 p-1.5 rounded cursor-pointer transition-colors ${
              isSelected ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
            }`}
            style={{ paddingLeft: `${level * 12 + 8}px` }}
            onClick={() => {
              if (file.type === "folder") {
                toggleFolder(file.id)
              } else {
                onFileSelect(file.id)
              }
            }}
          >
            {file.type === "folder" ? (
              isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />
            ) : (
              <div className="w-3.5" />
            )}
            
            {file.type === "folder" ? (
              <Folder className={`w-4 h-4 ${isExpanded ? "text-blue-400" : "text-blue-500"}`} />
            ) : (
              getFileIcon(file.name)
            )}

            {editingFileId === file.id ? (
              <Input
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                className="text-xs bg-gray-900 border-gray-700 h-6 py-0 px-1 focus-visible:ring-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onFileRename(file.id, editingName)
                    setEditingFileId(null)
                  }
                  if (e.key === "Escape") setEditingFileId(null)
                }}
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className="truncate text-sm flex-1">{file.name}</span>
            )}

            {!editingFileId && (
              <div className="opacity-0 group-hover:opacity-100 flex items-center">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-6 w-6 p-0" 
                  onClick={(e) => {
                    e.stopPropagation()
                    setEditingFileId(file.id)
                    setEditingName(file.name)
                  }}
                >
                  <Edit3 className="w-3 h-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                  onClick={(e) => {
                    e.stopPropagation()
                    onFileDelete(file.id)
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            )}
          </motion.div>
          {file.type === "folder" && isExpanded && (
            <div>{renderFileTree(file.id, level + 1)}</div>
          )}
        </div>
      )
    })
  }

  const getFileIcon = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase()
    switch (ext) {
      case "html": return <Globe className="w-4 h-4 text-orange-400" />
      case "css": return <Palette className="w-4 h-4 text-blue-400" />
      case "js":
      case "jsx": return <FileText className="w-4 h-4 text-yellow-400" />
      case "ts":
      case "tsx": return <FileText className="w-4 h-4 text-blue-500" />
      case "json": return <Settings className="w-4 h-4 text-green-400" />
      default: return <File className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full bg-gray-950 rounded-lg border border-gray-800 flex overflow-hidden"
    >
      {/* File Explorer Sidebar */}
      <div className="w-64 border-r border-gray-800 flex flex-col bg-gray-900/30">
        <div className="p-3 border-b border-gray-800 flex items-center justify-between bg-gray-900/50">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Explorer</h3>
          <div className="flex space-x-1">
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => setIsCreatingFile(true)}>
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="py-2">
            {renderFileTree(null)}
          </div>
        </ScrollArea>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col bg-black">
        {activeFile ? (
          <>
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-gray-900/20">
              <div className="flex items-center space-x-2">
                {getFileIcon(activeFile.name)}
                <span className="text-sm text-gray-300 font-medium">{activeFile.path}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-7 px-2 text-gray-400 hover:text-white"
                  onClick={() => navigator.clipboard.writeText(activeFile.content)}
                >
                  <Copy className="w-3.5 h-3.5 mr-1.5" />
                  <span className="text-xs">Copy</span>
                </Button>
              </div>
            </div>
            <div className="flex-1 relative">
              <textarea
                value={editorContent}
                onChange={(e) => handleContentChange(e.target.value)}
                className="absolute inset-0 w-full h-full bg-transparent text-gray-300 font-mono text-sm p-6 resize-none focus:outline-none"
                spellCheck={false}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-600">
            <div className="text-center">
              <Code className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm">Select a file to view its content</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
