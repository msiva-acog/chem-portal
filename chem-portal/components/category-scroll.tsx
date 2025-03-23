"use client"

import { useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Database, FlaskRoundIcon as Flask, Lightbulb, Rocket } from "lucide-react"
import { getAllCategories } from "@/lib/projects"

// Map category IDs to icons
const categoryIcons: Record<string, JSX.Element> = {
  internal: <Flask className="h-10 w-10 text-primary" />,
  abbvie: <Database className="h-10 w-10 text-primary" />,
  pipeline: <Rocket className="h-10 w-10 text-primary" />,
  potential: <Lightbulb className="h-10 w-10 text-primary" />,
}

export default function CategoryScroll() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const categories = getAllCategories()

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return

    const container = scrollContainerRef.current
    const scrollAmount = 400

    if (direction === "left") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" })
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  return (
    <section className="bg-background py-24">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold">Our Research Areas</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => scroll("left")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => scroll("right")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {Object.entries(categories).map(([categoryId, category]) => (
              <Card
                key={categoryId}
                className="min-w-[350px] max-w-[350px] snap-start border-2 hover:border-primary/50 transition-all"
              >
                <CardHeader>
                  <div className="bg-primary/10 p-4 rounded-full w-fit mb-4">
                    {categoryIcons[categoryId] || <Database className="h-10 w-10 text-primary" />}
                  </div>
                  <CardTitle>{category.name}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Subcategories:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {Object.values(category.subcategories)
                        .slice(0, 3)
                        .map((subcategory, index) => (
                          <li key={index}>• {subcategory.name}</li>
                        ))}
                      {Object.values(category.subcategories).length > 3 && (
                        <li>• And {Object.values(category.subcategories).length - 3} more...</li>
                      )}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/categories#${categoryId}`}>Explore {category.name}</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

