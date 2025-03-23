"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { LayoutGrid, List, Network, Table2 } from "lucide-react"
import type { CategoryViewType } from "./category-view-selector"

// We'll limit the toggle to just 4 common views for simplicity
const toggleOptions: { value: CategoryViewType; icon: React.ReactNode; label: string }[] = [
  { value: "grid", icon: <LayoutGrid className="h-4 w-4" />, label: "Grid" },
  { value: "table", icon: <Table2 className="h-4 w-4" />, label: "Table" },
  { value: "accordion", icon: <List className="h-4 w-4" />, label: "List" },
  { value: "network", icon: <Network className="h-4 w-4" />, label: "Network" },
]

interface CategoryViewToggleProps {
  value: CategoryViewType
  onChange: (value: CategoryViewType) => void
}

export function CategoryViewToggle({ value, onChange }: CategoryViewToggleProps) {
  return (
    <div className="flex space-x-1 bg-muted p-1 rounded-md">
      {toggleOptions.map((option) => (
        <Button
          key={option.value}
          variant={value === option.value ? "default" : "ghost"}
          size="sm"
          className="flex items-center gap-2"
          onClick={() => onChange(option.value)}
          aria-label={`Switch to ${option.label} view`}
        >
          {option.icon}
          <span className="hidden sm:inline">{option.label}</span>
        </Button>
      ))}
    </div>
  )
}

