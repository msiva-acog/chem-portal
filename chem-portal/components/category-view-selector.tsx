"use client"

import type React from "react"
import {
  Check,
  LayoutGrid,
  List,
  Network,
  Table2,
  Layers,
  ScrollText,
  GitBranch,
  SlidersHorizontal,
  Cloud,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export type CategoryViewType =
  | "grid"
  | "network"
  | "table"
  | "accordion"
  | "scroll"
  | "bubbles"
  | "timeline"
  | "tree"
  | "carousel"
  | "cloud"

interface CategoryViewOption {
  value: CategoryViewType
  label: string
  icon: React.ReactNode
}

const viewOptions: CategoryViewOption[] = [
  { value: "grid", label: "Card Grid", icon: <LayoutGrid className="h-4 w-4" /> },
  { value: "network", label: "Network Graph", icon: <Network className="h-4 w-4" /> },
  { value: "table", label: "Table View", icon: <Table2 className="h-4 w-4" /> },
  { value: "accordion", label: "Accordion", icon: <List className="h-4 w-4" /> },
  { value: "scroll", label: "Horizontal Scroll", icon: <ScrollText className="h-4 w-4" /> },
  { value: "bubbles", label: "Bubble View", icon: <Layers className="h-4 w-4" /> },
  { value: "timeline", label: "Timeline", icon: <SlidersHorizontal className="h-4 w-4" /> },
  { value: "tree", label: "Tree View", icon: <GitBranch className="h-4 w-4" /> },
  { value: "carousel", label: "Carousel", icon: <SlidersHorizontal className="h-4 w-4 rotate-90" /> },
  { value: "cloud", label: "Tag Cloud", icon: <Cloud className="h-4 w-4" /> },
]

interface CategoryViewSelectorProps {
  value: CategoryViewType
  onChange: (value: CategoryViewType) => void
}

export function CategoryViewSelector({ value, onChange }: CategoryViewSelectorProps) {
  const selectedOption = viewOptions.find((option) => option.value === value) || viewOptions[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          {selectedOption.icon}
          <span>{selectedOption.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {viewOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            className={cn("flex items-center gap-2 cursor-pointer", value === option.value && "bg-accent")}
            onClick={() => onChange(option.value)}
          >
            {option.icon}
            <span>{option.label}</span>
            {value === option.value && <Check className="h-4 w-4 ml-auto" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

