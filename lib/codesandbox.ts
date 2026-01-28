// @ts-ignore
import { getParameters } from "codesandbox/lib/api/define"

export interface SandboxFile {
  content: string
  isBinary?: boolean
}

export interface SandboxFiles {
  [path: string]: SandboxFile
}

export function generateCodeSandboxParameters(files: SandboxFiles) {
  return getParameters({
    files: Object.entries(files).reduce((acc, [path, file]) => {
      acc[path] = {
        content: file.content,
        isBinary: file.isBinary || false,
      }
      return acc
    }, {} as any),
  })
}

export function getCodeSandboxEmbedUrl(parameters: string, options: { view?: string; runonclick?: number } = {}) {
  const query = new URLSearchParams({
    parameters,
    embed: "1",
    ...Object.entries(options).reduce((acc, [key, value]) => {
      acc[key] = String(value)
      return acc
    }, {} as any),
  }).toString()

  return `https://codesandbox.io/api/v1/sandboxes/define?${query}`
}

export function getCodeSandboxAnchorUrl(parameters: string) {
  return `https://codesandbox.io/api/v1/sandboxes/define?parameters=${parameters}`
}
