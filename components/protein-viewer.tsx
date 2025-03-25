"use client"

import { useEffect, useRef } from "react"
import * as NGL from "ngl";

export default function ProteinViewer() {
  const containerRef = useRef<HTMLDivElement>(null)
  const loadedRef = useRef(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stageRef = useRef<any>(null)

  useEffect(() => {
    // Skip if already loaded or no container
    if (loadedRef.current || !containerRef.current) return

    // Mark as loaded to prevent multiple initialization attempts
    loadedRef.current = true

    // Load NGL and initialize viewer
    const initViewer = async () => {
      try {
        // Dynamically import NGL
        // const NGL = await import("ngl")
        // figured it out that we dont have to import it dynamically it might cuse further issues in production build


        // Create NGL Stage object
        // for now setting this type as any 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const stage:any = new NGL.Stage(containerRef.current, {
          backgroundColor: "transparent",
          quality: "medium",
        })
        stageRef.current = stage

        // Handle window resize
        const handleResize = () => {
          stage.handleResize()
        }
        window.addEventListener("resize", handleResize)

        // Load a simple sample structure (Lysozyme - a small, well-known protein)
        // This is a reliable PDB that should load quickly
        // for now setting this type as any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const structure:any = await stage.loadFile("rcsb://4LZT")

        // Add representations
        structure.addRepresentation("cartoon", {
          color: "chainname",
          opacity: 0.8,
        })

        structure.addRepresentation("surface", {
          opacity: 0.2,
          colorScheme: "electrostatic",
        })

        structure.addRepresentation("ball+stick", {
          sele: "hetero",
          opacity: 0.8,
        })

        // Set camera position
        structure.autoView()

        // Start a gentle rotation animation
        stage.spinAnimation.axis.set(0, 1, 0)
        stage.spinAnimation.angle = 0.005
        stage.setSpin(true)

        // Clean up on unmount
        return () => {
          window.removeEventListener("resize", handleResize)
          if (stageRef.current) {
            stageRef.current.dispose()
          }
        }
      } catch (error) {
        console.error("Error initializing NGL:", error)
        // Show error state in the container
        if (containerRef.current) {
          containerRef.current.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full p-4 text-center">
              <div class="text-red-500 mb-2">⚠️</div>
              <p class="text-muted-foreground">Could not load 3D viewer</p>
              <button class="mt-4 px-4 py-2 bg-primary/20 rounded-md text-sm" onclick="window.location.reload()">
                Retry
              </button>
            </div>
          `
        }
      }
    }

    initViewer()
  }, [])

  return (
    <div className="relative w-full">
      <div
        ref={containerRef}
        className="w-full h-[500px] rounded-lg overflow-hidden flex items-center justify-center"
        style={{
          boxShadow: "0 0 30px rgba(74, 222, 128, 0.2)",
          background: "rgba(0, 0, 0, 0.2)",
        }}
      >
        {/* Initial loading state */}
        {/* <div className="text-center p-8">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading 3D protein structure...</p>
        </div> */}
      </div>
    </div>
  )
}

