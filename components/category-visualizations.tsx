"use client"

import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"
import type { CategoryViewType } from "./category-view-selector"
import CategoryGrid from "./category-grid"
import CategoryTable from "./category-table"
import CategoryAccordion from "./category-accordion"
import CategoryTimeline from "./category-timeline"
import { motion, AnimatePresence } from "framer-motion"

// Dynamically import heavier components to improve initial load time
const CategoryNetwork = dynamic(() => import("./category-network"), {
  loading: () => <LoadingState label="Loading network graph..." />,
})

const CategoryScroll = dynamic(() => import("./category-scroll"), {
  loading: () => <LoadingState label="Loading horizontal scroll view..." />,
})

const CategoryBubbles = dynamic(() => import("./category-bubbles"), {
  loading: () => <LoadingState label="Loading bubble view..." />,
})

const CategoryTree = dynamic(() => import("./category-tree"), {
  loading: () => <LoadingState label="Loading tree view..." />,
})

const CategoryCarousel = dynamic(() => import("./category-carousel"), {
  loading: () => <LoadingState label="Loading carousel..." />,
})

const CategoryCloud = dynamic(() => import("./category-cloud"), {
  loading: () => <LoadingState label="Loading tag cloud..." />,
})

interface CategoryVisualizationsProps {
  viewType: CategoryViewType
}

function LoadingState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground">{label}</p>
    </div>
  )
}

export default function CategoryVisualizations({ viewType }: CategoryVisualizationsProps) {
  // Render the appropriate visualization based on the selected type
  const renderVisualization = () => {
    switch (viewType) {
      case "grid":
        return <CategoryGrid />
      case "network":
        return <CategoryNetwork />
      case "table":
        return <CategoryTable />
      case "accordion":
        return <CategoryAccordion />
      case "scroll":
        return <CategoryScroll />
      case "bubbles":
        return <CategoryBubbles />
      case "timeline":
        return <CategoryTimeline />
      case "tree":
        return <CategoryTree />
      case "carousel":
        return <CategoryCarousel />
      case "cloud":
        return <CategoryCloud />
      default:
        return <CategoryGrid />
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={viewType}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {renderVisualization()}
      </motion.div>
    </AnimatePresence>
  )
}

