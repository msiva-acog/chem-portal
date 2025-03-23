"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Database, FlaskRoundIcon as Flask, Lightbulb, Rocket, ChevronDown } from "lucide-react"
import { useState } from "react"
import type { Category } from "@/lib/projects"
import React from "react"

// Map category IDs to icons
const categoryIcons: Record<string, JSX.Element> = {
  internal: <Flask className="h-5 w-5 text-primary" />,
  abbvie: <Database className="h-5 w-5 text-primary" />,
  pipeline: <Rocket className="h-5 w-5 text-primary" />,
  potential: <Lightbulb className="h-5 w-5 text-primary" />,
}

interface CategoryTableViewProps {
  categories: Record<string, Category>
}

export default function CategoryTableView({ categories }: CategoryTableViewProps) {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  const [expandedSubcategories, setExpandedSubcategories] = useState<Record<string, boolean>>({})

  const toggleCategory = (categoryId: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent event bubbling
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }))
  }

  const toggleSubcategory = (subcategoryKey: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent event bubbling
    setExpandedSubcategories((prev) => ({
      ...prev,
      [subcategoryKey]: !prev[subcategoryKey],
    }))
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Category / Subcategory / Project</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(categories).map(([categoryId, category]) => {
            const isExpanded = expandedCategories[categoryId] || false

            return (
              <React.Fragment key={categoryId}>
                <TableRow className="hover:bg-muted/50">
                  <TableCell>
                    <div className="bg-primary/10 p-2 rounded-full">
                      {categoryIcons[categoryId] || <Database className="h-5 w-5 text-primary" />}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button onClick={(e) => toggleCategory(categoryId, e)} className="hover:bg-muted p-1 rounded">
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </button>
                      <span className="font-medium">{category.name}</span>
                      <Badge variant="outline">{Object.keys(category.subcategories).length} subcategories</Badge>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-md">{category.description}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/categories#${categoryId}`}>
                        View <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>

                {isExpanded &&
                  Object.entries(category.subcategories).map(([subcategoryId, subcategory]) => {
                    const subcategoryKey = `${categoryId}-${subcategoryId}`
                    const isSubcategoryExpanded = expandedSubcategories[subcategoryKey] || false

                    return (
                      <React.Fragment key={subcategoryKey}>
                        <TableRow className="bg-muted/30">
                          <TableCell></TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 pl-6">
                              <button
                                onClick={(e) => toggleSubcategory(subcategoryKey, e)}
                                className="hover:bg-muted p-1 rounded"
                              >
                                {isSubcategoryExpanded ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </button>
                              <span className="font-medium">{subcategory.name}</span>
                              <Badge variant="outline">{subcategory.projects.length} projects</Badge>
                            </div>
                          </TableCell>
                          <TableCell>{subcategory.description}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/category/${categoryId}/${subcategoryId}`}>
                                View <ChevronRight className="ml-1 h-4 w-4" />
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>

                        {isSubcategoryExpanded &&
                          subcategory.projects.map((project, index) => (
                            <TableRow key={`${subcategoryKey}-${index}`} className="bg-muted/10">
                              <TableCell></TableCell>
                              <TableCell>
                                <div className="pl-12 font-medium">{project.projectName}</div>
                              </TableCell>
                              <TableCell>{project.shortDescription}</TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm" asChild>
                                  <Link href={`/project/${project.projectName.toLowerCase().replace(/\s+/g, "-")}`}>
                                    Details <ChevronRight className="ml-1 h-4 w-4" />
                                  </Link>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </React.Fragment>
                    )
                  })}
              </React.Fragment>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

