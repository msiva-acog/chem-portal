"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Database, FlaskRoundIcon as Flask, Lightbulb, Rocket } from "lucide-react"
import { getAllCategories } from "@/lib/projects"
import { motion } from "framer-motion"
import type { JSX } from "react"

// Map category IDs to icons
const categoryIcons: Record<string, JSX.Element> = {
  internal: <Flask className="h-8 w-8 text-primary" />,
  abbvie: <Database className="h-8 w-8 text-primary" />,
  pipeline: <Rocket className="h-8 w-8 text-primary" />,
  potential: <Lightbulb className="h-8 w-8 text-primary" />,
}

// Map category IDs to colors
const categoryColors: Record<string, string> = {
  internal: "from-emerald-500/20 to-emerald-500/10",
  abbvie: "from-blue-500/20 to-blue-500/10",
  pipeline: "from-purple-500/20 to-purple-500/10",
  potential: "from-amber-500/20 to-amber-500/10",
}

export default function CategoryBubbles() {
  const categories = getAllCategories()
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  return (
    <section className="bg-background py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-center">Our Research Areas</h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Explore our computational chemistry research categories
        </p>

        <div className="flex flex-wrap justify-center gap-8 mb-16">
          {Object.entries(categories).map(([categoryId, category]) => (
            <motion.div
              key={categoryId}
              className={`relative cursor-pointer ${activeCategory === categoryId ? "z-10" : "z-0"}`}
              whileHover={{ scale: 1.05 }}
              onClick={() => setActiveCategory(activeCategory === categoryId ? null : categoryId)}
            >
              <div
                className={`w-48 h-48 rounded-full flex flex-col items-center justify-center p-6 text-center
                  bg-gradient-to-b ${categoryColors[categoryId] || "from-gray-500/20 to-gray-500/10"}
                  border-2 border-primary/20 hover:border-primary/50 transition-all`}
              >
                <div className="mb-3">{categoryIcons[categoryId] || <Database className="h-8 w-8 text-primary" />}</div>
                <h3 className="font-semibold">{category.name}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{category.description}</p>
              </div>

              {activeCategory === categoryId && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 w-64 bg-card p-4 rounded-lg shadow-lg border border-border"
                >
                  <h4 className="font-semibold mb-2">Subcategories:</h4>
                  <ul className="space-y-1 mb-4">
                    {Object.values(category.subcategories).map((subcategory, index) => (
                      <li key={index} className="text-sm">
                        • {subcategory.name}
                      </li>
                    ))}
                  </ul>
                  <Button size="sm" className="w-full" asChild>
                    <Link href={`/categories#${categoryId}`}>Explore</Link>
                  </Button>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center">
          <Button asChild>
            <Link href="/categories">View All Categories</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

