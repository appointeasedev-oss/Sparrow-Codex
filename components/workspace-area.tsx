"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Code, Activity, Settings } from "lucide-react"
import { CodeEditor } from "./code-editor"
import { PreviewPanel } from "./preview-panel"
import { StatusPanel } from "./status-panel"
import { ProjectManager } from "./project-manager"

export interface ProjectFile {
  id: string
  name: string
  content: string
  language: string
  path: string // Full path including folders, e.g., "src/components/Button.tsx"
  lastModified: Date
  type: "file" | "folder"
  parentId: string | null // For folder structure
}

export interface Project {
  id: string
  name: string
  description: string
  files: ProjectFile[]
  createdAt: Date
  lastModified: Date
}

export function WorkspaceArea() {
  const [activeTab, setActiveTab] = useState("preview")
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [activeFileId, setActiveFileId] = useState<string | null>(null)

  const createDefaultProject = () => {
    const now = new Date()
    const defaultFiles: ProjectFile[] = [
      {
        id: "root_index_html",
        name: "index.html",
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sparrow AI Generated App</title>
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
</body>
</html>`,
        language: "html",
        path: "index.html",
        lastModified: now,
        type: "file",
        parentId: null,
      },
      {
        id: "root_package_json",
        name: "package.json",
        content: JSON.stringify({
          name: "sparrow-react-ts",
          private: true,
          version: "0.0.0",
          type: "module",
          scripts: {
            dev: "vite",
            build: "tsc && vite build",
            preview: "vite preview"
          },
          dependencies: {
            "react": "^18.2.0",
            "react-dom": "^18.2.0",
            "lucide-react": "latest"
          },
          devDependencies: {
            "@types/react": "^18.2.0",
            "@types/react-dom": "^18.2.0",
            "@vitejs/plugin-react": "^4.0.0",
            "typescript": "^5.0.0",
            "vite": "^4.4.0"
          }
        }, null, 2),
        language: "json",
        path: "package.json",
        lastModified: now,
        type: "file",
        parentId: null,
      },
      {
        id: "folder_src",
        name: "src",
        content: "",
        language: "",
        path: "src",
        lastModified: now,
        type: "folder",
        parentId: null,
      },
      {
        id: "src_main_tsx",
        name: "main.tsx",
        content: `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`,
        language: "typescript",
        path: "src/main.tsx",
        lastModified: now,
        type: "file",
        parentId: "folder_src",
      },
      {
        id: "src_app_tsx",
        name: "App.tsx",
        content: `import React from 'react'
import { Sparkles } from 'lucide-react'

function App() {
  return (
    <div className="app-container">
      <header>
        <Sparkles className="icon" />
        <h1>Sparrow AI</h1>
      </header>
      <main>
        <p>Welcome to your React + TypeScript project!</p>
        <p>Start chatting to build your application.</p>
      </main>
    </div>
  )
}

export default App`,
        language: "typescript",
        path: "src/App.tsx",
        lastModified: now,
        type: "file",
        parentId: "folder_src",
      },
      {
        id: "src_index_css",
        name: "index.css",
        content: `body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #0f172a;
  color: white;
}

.app-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
}

header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.icon {
  width: 3rem;
  height: 3rem;
  color: #38bdf8;
}`,
        language: "css",
        path: "src/index.css",
        lastModified: now,
        type: "file",
        parentId: "folder_src",
      }
    ]

    const newProject: Project = {
      id: Date.now().toString(),
      name: "Sparrow React Project",
      description: "React + TypeScript application",
      files: defaultFiles,
      createdAt: now,
      lastModified: now,
    }

    setCurrentProject(newProject)
    setActiveFileId("src_app_tsx")
  }

  useEffect(() => {
    const savedProject = localStorage.getItem("sparrow_current_project")
    if (savedProject) {
      try {
        const project = JSON.parse(savedProject)
        setCurrentProject({
          ...project,
          createdAt: new Date(project.createdAt),
          lastModified: new Date(project.lastModified),
          files: project.files.map((f: any) => ({
            ...f,
            lastModified: new Date(f.lastModified),
          })),
        })
      } catch (error) {
        console.error("Failed to load saved project:", error)
        createDefaultProject()
      }
    } else {
      createDefaultProject()
    }
  }, [])

  useEffect(() => {
    if (currentProject) {
      localStorage.setItem("sparrow_current_project", JSON.stringify(currentProject))
    }
  }, [currentProject])

  useEffect(() => {
    const handleCodeGenerated = (event: CustomEvent) => {
      const { code, language, filename } = event.detail
      addOrUpdateFile(filename, code, language)
    }

    const handleCreateProjectFiles = (event: CustomEvent) => {
      const { files } = event.detail
      if (!currentProject) {
        createDefaultProject()
        return
      }

      const now = new Date()
      setCurrentProject((prev) => {
        if (!prev) return null
        const updatedFiles = [...prev.files]
        
        files.forEach((filePath: string) => {
          ensurePathExists(updatedFiles, filePath, now)
        })

        return {
          ...prev,
          files: updatedFiles,
          lastModified: now,
        }
      })
    }

    const handleCreateNewProject = (event: CustomEvent) => {
      const { sessionId, projectName } = event.detail
      createDefaultProject()
      setCurrentProject(prev => prev ? { ...prev, id: sessionId, name: projectName || prev.name } : null)
      setActiveTab("preview")
    }

    window.addEventListener("codeGenerated", handleCodeGenerated as EventListener)
    window.addEventListener("createProjectFiles", handleCreateProjectFiles as EventListener)
    window.addEventListener("createNewProject", handleCreateNewProject as EventListener)

    return () => {
      window.removeEventListener("codeGenerated", handleCodeGenerated as EventListener)
      window.removeEventListener("createProjectFiles", handleCreateProjectFiles as EventListener)
      window.removeEventListener("createNewProject", handleCreateNewProject as EventListener)
    }
  }, [currentProject])

  const ensurePathExists = (files: ProjectFile[], fullPath: string, now: Date) => {
    const parts = fullPath.split('/')
    let currentPath = ""
    let currentParentId: string | null = null

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      currentPath = currentPath ? `${currentPath}/${part}` : part
      const isLast = i === parts.length - 1
      const type = isLast && part.includes('.') ? "file" : "folder"
      
      const existing = files.find(f => f.path === currentPath)
      if (!existing) {
        const id = currentPath.replace(/[^a-zA-Z0-9]/g, "_")
        const newFile: ProjectFile = {
          id,
          name: part,
          content: type === "file" ? `// ${part} - Generated by Sparrow AI` : "",
          language: type === "file" ? getLanguageFromFilename(part) : "",
          path: currentPath,
          lastModified: now,
          type,
          parentId: currentParentId
        }
        files.push(newFile)
        currentParentId = id
      } else {
        currentParentId = existing.id
      }
    }
  }

  const getLanguageFromFilename = (filename: string): string => {
    const ext = filename.split(".").pop()?.toLowerCase()
    const map: Record<string, string> = {
      html: "html", css: "css", js: "javascript", ts: "typescript",
      tsx: "typescript", jsx: "javascript", json: "json"
    }
    return map[ext || ""] || "text"
  }

  const addOrUpdateFile = (filePath: string, content: string, language: string) => {
    const now = new Date()
    setCurrentProject((prev) => {
      if (!prev) return null
      const updatedFiles = [...prev.files]
      ensurePathExists(updatedFiles, filePath, now)
      
      const fileIndex = updatedFiles.findIndex(f => f.path === filePath)
      if (fileIndex >= 0) {
        updatedFiles[fileIndex] = {
          ...updatedFiles[fileIndex],
          content,
          language: language || updatedFiles[fileIndex].language,
          lastModified: now
        }
      }
      
      return { ...prev, files: updatedFiles, lastModified: now }
    })
  }

  const handleFileUpdate = (fileId: string, content: string) => {
    setCurrentProject((prev) => {
      if (!prev) return null
      return {
        ...prev,
        files: prev.files.map((f) => (f.id === fileId ? { ...f, content, lastModified: new Date() } : f)),
        lastModified: new Date(),
      }
    })
  }

  const handleFileDelete = (fileId: string) => {
    setCurrentProject((prev) => {
      if (!prev) return null
      // Also delete children if it's a folder
      const toDelete = new Set([fileId])
      let changed = true
      while (changed) {
        changed = false
        prev.files.forEach(f => {
          if (f.parentId && toDelete.has(f.parentId) && !toDelete.has(f.id)) {
            toDelete.add(f.id)
            changed = true
          }
        })
      }
      return {
        ...prev,
        files: prev.files.filter((f) => !toDelete.has(f.id)),
        lastModified: new Date(),
      }
    })
    if (activeFileId === fileId) setActiveFileId(null)
  }

  const handleFileRename = (fileId: string, newName: string) => {
    setCurrentProject((prev) => {
      if (!prev) return null
      const file = prev.files.find(f => f.id === fileId)
      if (!file) return prev
      
      const oldPath = file.path
      const pathParts = oldPath.split('/')
      pathParts[pathParts.length - 1] = newName
      const newPath = pathParts.join('/')
      
      return {
        ...prev,
        files: prev.files.map((f) => {
          if (f.id === fileId) {
            return { ...f, name: newName, path: newPath, lastModified: new Date() }
          }
          if (f.path.startsWith(oldPath + '/')) {
            return { ...f, path: f.path.replace(oldPath, newPath) }
          }
          return f
        }),
        lastModified: new Date(),
      }
    })
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="px-4 border-b border-gray-800 bg-gray-900/50 flex items-center justify-between">
          <TabsList className="bg-transparent border-none">
            <TabsTrigger value="preview" className="data-[state=active]:bg-gray-800">
              <Eye className="w-4 h-4 mr-2" /> Preview
            </TabsTrigger>
            <TabsTrigger value="code" className="data-[state=active]:bg-gray-800">
              <Code className="w-4 h-4 mr-2" /> Code
            </TabsTrigger>
            <TabsTrigger value="status" className="data-[state=active]:bg-gray-800">
              <Activity className="w-4 h-4 mr-2" /> Status
            </TabsTrigger>
            <TabsTrigger value="project" className="data-[state=active]:bg-gray-800">
              <Settings className="w-4 h-4 mr-2" /> Project
            </TabsTrigger>
          </TabsList>
          {currentProject && (
            <div className="text-xs text-gray-500 font-mono">
              {currentProject.name}
            </div>
          )}
        </div>

        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <TabsContent value="preview" className="absolute inset-0 m-0 p-4">
              <PreviewPanel files={currentProject?.files || []} />
            </TabsContent>
            <TabsContent value="code" className="absolute inset-0 m-0 p-4">
              <CodeEditor
                files={currentProject?.files || []}
                activeFileId={activeFileId}
                onFileSelect={setActiveFileId}
                onFileUpdate={handleFileUpdate}
                onFileDelete={handleFileDelete}
                onFileRename={handleFileRename}
              />
            </TabsContent>
            <TabsContent value="status" className="absolute inset-0 m-0 p-4">
              <StatusPanel />
            </TabsContent>
            <TabsContent value="project" className="absolute inset-0 m-0 p-4">
              <ProjectManager
                currentProject={currentProject}
                onProjectCreate={createDefaultProject}
                onProjectUpdate={setCurrentProject}
              />
            </TabsContent>
          </AnimatePresence>
        </div>
      </Tabs>
    </div>
  )
}
