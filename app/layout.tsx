import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import Script from "next/script"
import "./globals.css"

export const metadata: Metadata = {
  title: "Sparrow AI - Code Generation Platform",
  description: "AI-powered code generation platform by ARAS Developer",
  generator: "Sparrow AI",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body className="dark">
        <Script src="https://js.puter.com/v2/" strategy="beforeInteractive" />
        {children}
      </body>
    </html>
  )
}
