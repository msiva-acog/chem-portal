"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"
import StaticProteinImage from "./static-protein-image"

// Dynamically import the protein viewer with no SSR
const ProteinViewer = dynamic(() => import("./protein-viewer"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full h-[500px] rounded-lg overflow-hidden flex items-center justify-center"
      style={{
        boxShadow: "0 0 30px rgba(74, 222, 128, 0.2)",
        background: "rgba(0, 0, 0, 0.2)",
      }}
    >
      <div className="text-center p-8">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Loading 3D viewer...</p>
      </div>
    </div>
  ),
})

export default function MolecularVisualization() {
  const [useStaticFallback, setUseStaticFallback] = useState(false)

  useEffect(() => {
    // Set a timeout - if the 3D viewer doesn't load within 5 seconds, show the static image
    const timeoutId = setTimeout(() => {
      setUseStaticFallback(true)
    }, 5000)

    return () => clearTimeout(timeoutId)
  }, [])

  // If we're using the fallback or if we're in a browser that might not support WebGL
  if (useStaticFallback) {
    return <StaticProteinImage />
  }

  // Try to load the 3D viewer
  return <ProteinViewer />
}

