"use client"

import { useState, useEffect } from "react"
import { LoadingScreen } from "@/components/loading-screen"
import { MainInterface } from "@/components/main-interface"
import { TermsAndConditions } from "@/components/terms-and-conditions"

export default function Home() {
  const [appState, setAppState] = useState<"loading" | "terms" | "main">("loading")
  const [isMounted, setIsMounted] = useState(false)

  const handleTermsAccepted = () => {
    localStorage.setItem("sparrow_terms_accepted", "true")
    setAppState("main")
  }

  useEffect(() => {
    setIsMounted(true)

    try {
      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.get("code")
      const error = urlParams.get("error")

      if (code) {
        localStorage.setItem("netlify_oauth_code", code)
        window.history.replaceState({}, document.title, window.location.pathname)
        if (window.opener) {
          window.close()
          return
        }
      }

      if (error) {
        console.error("OAuth error:", error)
        window.history.replaceState({}, document.title, window.location.pathname)
      }
    } catch (err) {
      console.error("Error handling OAuth callback:", err)
    }

    const timer = setTimeout(() => {
      try {
        const termsAccepted = localStorage.getItem("sparrow_terms_accepted")
        setAppState(termsAccepted ? "main" : "terms")
      } catch (err) {
        console.error("Error accessing localStorage:", err)
        setAppState("terms")
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (!isMounted) {
    return <div style={{ height: "100vh", backgroundColor: "#000" }} />
  }

  if (appState === "loading") {
    return <LoadingScreen />
  }

  if (appState === "terms") {
    return <TermsAndConditions onAccept={handleTermsAccepted} />
  }

  return <MainInterface />
}
