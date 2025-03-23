"use client"

import { useEffect, useRef, useState } from "react"
import ProteinViewerFallback from "./protein-viewer-fallback"

export default function NGLComponent() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    let stage: any = null
    let cleanup: (() => void) | null = null

    const initNGL = async () => {
      try {
        // Dynamically import NGL
        const NGL = await import("ngl")

        // Create NGL Stage object
        stage = new NGL.Stage(containerRef.current, {
          backgroundColor: "transparent",
          quality: "medium",
          antialias: true,
        })

        // Handle window resize
        const handleResize = () => {
          stage.handleResize()
        }
        window.addEventListener("resize", handleResize)

        // Load PDB structure - HIV-1 protease with inhibitor
        const structure = await stage.loadFile("https://files.rcsb.org/view/3EKV.pdb")

        // Create representations for different parts of the structure

        // Protein representation
        structure.addRepresentation("cartoon", {
          color: "chainname",
          opacity: 0.8,
          smoothSheet: true,
        })

        // Surface representation with transparency
        structure.addRepresentation("surface", {
          opacity: 0.2,
          colorScheme: "bfactor",
        })

        // Ligand representation (highlight the drug molecule)
        structure.addRepresentation("ball+stick", {
          sele: "ligand",
          color: "element",
          opacity: 1.0,
          multipleBond: true,
        })

        // Binding site representation (residues near the ligand)
        structure.addRepresentation("licorice", {
          sele: "sidechainAttached and within 5 of ligand",
          color: "resname",
          opacity: 0.8,
        })

        // Water molecules near the binding site
        structure.addRepresentation("ball+stick", {
          sele: "water and within 5 of ligand",
          color: "#60a5fa",
          opacity: 0.6,
        })

        // Set camera position
        structure.autoView()
        stage.spinAnimation.axis.set(0, 1, 0)
        stage.spinAnimation.angle = 0.005
        stage.setParameters({ clipDist: 0 })

        // Start a gentle rotation animation
        stage.setSpin(true)

        setIsLoading(false)

        cleanup = () => {
          window.removeEventListener("resize", handleResize)
          if (stage) {
            stage.dispose()
          }
        }
      } catch (error) {
        console.error("Error initializing NGL:", error)
        setHasError(true)
        setIsLoading(false)
      }
    }

    initNGL()

    return () => {
      if (cleanup) cleanup()
    }
  }, [])

  if (isLoading || hasError) {
    return <ProteinViewerFallback />
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-[500px] rounded-lg overflow-hidden"
      style={{
        boxShadow: "0 0 30px rgba(74, 222, 128, 0.2)",
        background: "rgba(0, 0, 0, 0.2)",
      }}
    />
  )
}

