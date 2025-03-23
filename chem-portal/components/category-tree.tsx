"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, Database, FlaskRoundIcon as Flask, Lightbulb, Rocket } from "lucide-react"
import { getAllCategories } from "@/lib/projects"
import { motion } from "framer-motion"
import type { JSX } from "react/jsx-runtime"

// Map category IDs to icons
const categoryIcons: Record<string, JSX.Element> = {
  internal: <Flask className="h-6 w-6 text-primary" />,
  abbvie: <Database className="h-6 w-6 text-primary" />,
  pipeline: <Rocket className="h-6 w-6 text-primary" />,
  potential: <Lightbulb className="h-6 w-6 text-primary" />,
}

export default function CategoryTree() {
  const categories = getAllCategories()
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  return (
    <section className="bg-background py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-center">Research Hierarchy</h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Explore our computational chemistry research structure
        </p>

        <div className="max-w-5xl mx-auto">
          {/* Root node */}
          <div className="flex justify-center mb-8">
            <Card className="w-64 border-2 border-primary">
              <CardHeader className="pb-2">
                <CardTitle className="text-center">Computational Chemistry</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-center text-muted-foreground">
                  Our research categories and their subcategories
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Category nodes */}
          <div className="flex justify-center mb-8">
            <div className="grid grid-cols-4 gap-8">
              {Object.entries(categories).map(([categoryId, category]) => (
                <div key={categoryId} className="flex flex-col items-center">
                  {/* Connector line */}
                  <div className="h-8 w-px bg-border"></div>

                  {/* Category card */}
                  <Card
                    className={`w-full border-2 ${expandedCategory === categoryId ? "border-primary" : "border-primary/20 hover:border-primary/50"} transition-all cursor-pointer`}
                    onClick={() => setExpandedCategory(expandedCategory === categoryId ? null : categoryId)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2 justify-center">
                        {categoryIcons[categoryId] || <Database className="h-5 w-5 text-primary" />}
                        <CardTitle className="text-base">{category.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-xs text-center">{category.description}</CardDescription>
                    </CardContent>
                  </Card>

                  {/* Subcategory nodes */}
                  {expandedCategory === categoryId && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-8 w-full space-y-6"
                    >
                      {/* Connector line */}
                      <div className="h-8 w-px bg-border mx-auto"></div>

                      <div className="grid grid-cols-1 gap-4">
                        {Object.entries(category.subcategories).map(([subcategoryId, subcategory]) => (
                          <Card key={subcategoryId} className="border border-primary/10">
                            <CardHeader className="py-2">
                              <CardTitle className="text-sm">{subcategory.name}</CardTitle>
                            </CardHeader>
                            <CardFooter className="pt-0">
                              <Button variant="ghost" size="sm" className="w-full" asChild>
                                <Link href={`/category/${categoryId}/${subcategoryId}`}>
                                  <ChevronRight className="h-4 w-4 mr-1" /> View
                                </Link>
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

