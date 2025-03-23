"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, Database, FlaskRoundIcon as Flask, Lightbulb, Rocket, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { Category } from "@/lib/projects"
import type React from "react"

// Map category IDs to icons
const categoryIcons: Record<string, JSX.Element> = {
  internal: <Flask className="h-6 w-6 text-primary" />,
  abbvie: <Database className="h-6 w-6 text-primary" />,
  pipeline: <Rocket className="h-6 w-6 text-primary" />,
  potential: <Lightbulb className="h-6 w-6 text-primary" />,
}

interface CategoryTreeViewProps {
  categories: Record<string, Category>
}

export default function CategoryTreeView({ categories }: CategoryTreeViewProps) {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  const [expandedSubcategories, setExpandedSubcategories] = useState<Record<string, boolean>>({})
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({})

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

  const toggleProject = (projectKey: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent event bubbling
    setExpandedProjects((prev) => ({
      ...prev,
      [projectKey]: !prev[projectKey],
    }))
  }

  return (
    <div className="space-y-6">
      {/* Root node */}
      <div className="flex justify-center mb-8">
        <Card className="w-full max-w-md border-2 border-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-center">Computational Chemistry</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-center text-muted-foreground">
              Our research categories, subcategories, and projects
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Connector line */}
      <div className="h-8 w-px bg-border mx-auto"></div>

      {/* Categories */}
      <div className="space-y-12">
        {Object.entries(categories).map(([categoryId, category]) => {
          const isCategoryExpanded = expandedCategories[categoryId] || false

          return (
            <div key={categoryId} className="space-y-4">
              <div className="flex justify-center">
                <Card
                  className={`w-full max-w-2xl border-2 ${
                    isCategoryExpanded ? "border-primary" : "border-primary/20 hover:border-primary/50"
                  } transition-all`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3 justify-between">
                      <div className="flex items-center gap-3">
                        {categoryIcons[categoryId] || <Database className="h-6 w-6 text-primary" />}
                        <CardTitle>{category.name}</CardTitle>
                      </div>
                      <button onClick={(e) => toggleCategory(categoryId, e)} className="hover:bg-muted p-1 rounded">
                        {isCategoryExpanded ? (
                          <ChevronDown className="h-5 w-5" />
                        ) : (
                          <ChevronRight className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    <CardDescription className="mt-2">{category.description}</CardDescription>
                  </CardHeader>
                </Card>
              </div>

              <AnimatePresence>
                {isCategoryExpanded && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    {/* Connector line */}
                    <div className="h-8 w-px bg-border mx-auto"></div>

                    {/* Subcategories */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                      {Object.entries(category.subcategories).map(([subcategoryId, subcategory]) => {
                        const subcategoryKey = `${categoryId}-${subcategoryId}`
                        const isSubcategoryExpanded = expandedSubcategories[subcategoryKey] || false

                        return (
                          <div key={subcategoryKey} className="space-y-4">
                            <Card
                              className={`border-2 ${
                                isSubcategoryExpanded ? "border-primary" : "border-primary/20 hover:border-primary/50"
                              } transition-all`}
                            >
                              <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                  <CardTitle className="text-lg">{subcategory.name}</CardTitle>
                                  <button
                                    onClick={(e) => toggleSubcategory(subcategoryKey, e)}
                                    className="hover:bg-muted p-1 rounded"
                                  >
                                    {isSubcategoryExpanded ? (
                                      <ChevronDown className="h-5 w-5" />
                                    ) : (
                                      <ChevronRight className="h-5 w-5" />
                                    )}
                                  </button>
                                </div>
                                <CardDescription>{subcategory.description}</CardDescription>
                              </CardHeader>
                              <CardFooter>
                                <Button variant="outline" size="sm" className="w-full" asChild>
                                  <Link href={`/category/${categoryId}/${subcategoryId}`}>
                                    View All Projects <ChevronRight className="ml-2 h-4 w-4" />
                                  </Link>
                                </Button>
                              </CardFooter>
                            </Card>

                            <AnimatePresence>
                              {isSubcategoryExpanded && (
                                <motion.div
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  className="space-y-4 pl-4 border-l-2 border-primary/20"
                                >
                                  {/* Projects */}
                                  {subcategory.projects.map((project, index) => {
                                    const projectKey = `${subcategoryKey}-${index}`
                                    const isProjectExpanded = expandedProjects[projectKey] || false

                                    return (
                                      <div key={projectKey} className="space-y-4">
                                        <Card
                                          className={`border ${
                                            isProjectExpanded
                                              ? "border-primary"
                                              : "border-primary/10 hover:border-primary/30"
                                          } transition-all`}
                                        >
                                          <CardHeader className="py-3">
                                            <div className="flex items-center justify-between">
                                              <CardTitle className="text-base">{project.projectName}</CardTitle>
                                              <button
                                                onClick={(e) => toggleProject(projectKey, e)}
                                                className="hover:bg-muted p-1 rounded"
                                              >
                                                {isProjectExpanded ? (
                                                  <ChevronDown className="h-4 w-4" />
                                                ) : (
                                                  <ChevronRight className="h-4 w-4" />
                                                )}
                                              </button>
                                            </div>
                                            <CardDescription className="line-clamp-2">
                                              {project.shortDescription}
                                            </CardDescription>
                                          </CardHeader>
                                        </Card>

                                        <AnimatePresence>
                                          {isProjectExpanded && (
                                            <motion.div
                                              initial={{ opacity: 0, y: -10 }}
                                              animate={{ opacity: 1, y: 0 }}
                                              exit={{ opacity: 0, y: -10 }}
                                              className="pl-4 border-l-2 border-primary/10"
                                            >
                                              <Card className="bg-muted/20">
                                                <CardContent className="pt-6">
                                                  <div className="space-y-4">
                                                    <div>
                                                      <h4 className="text-sm font-medium mb-1">Description</h4>
                                                      <p className="text-sm text-muted-foreground">
                                                        {project.longDescription}
                                                      </p>
                                                    </div>

                                                    {project.links.length > 0 && (
                                                      <div>
                                                        <h4 className="text-sm font-medium mb-1">Resources</h4>
                                                        <div className="flex flex-wrap gap-2">
                                                          {project.links.map((link, linkIndex) => (
                                                            <Button key={linkIndex} variant="outline" size="sm" asChild>
                                                              <Link
                                                                href={link.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                              >
                                                                {link.title}
                                                              </Link>
                                                            </Button>
                                                          ))}
                                                        </div>
                                                      </div>
                                                    )}

                                                    <Button asChild>
                                                      <Link
                                                        href={`/project/${project.projectName.toLowerCase().replace(/\s+/g, "-")}`}
                                                      >
                                                        View Project Details
                                                      </Link>
                                                    </Button>
                                                  </div>
                                                </CardContent>
                                              </Card>
                                            </motion.div>
                                          )}
                                        </AnimatePresence>
                                      </div>
                                    )
                                  })}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}

