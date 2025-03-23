import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, Database, FlaskRoundIcon as Flask, Lightbulb, Rocket } from "lucide-react"
import { getAllCategories } from "@/lib/projects"
import type { JSX } from "react"

// Map category IDs to icons
const categoryIcons: Record<string, JSX.Element> = {
  internal: <Flask className="h-6 w-6 text-primary" />,
  abbvie: <Database className="h-6 w-6 text-primary" />,
  pipeline: <Rocket className="h-6 w-6 text-primary" />,
  potential: <Lightbulb className="h-6 w-6 text-primary" />,
}

export default function CategoryTimeline() {
  const categories = getAllCategories()

  return (
    <section className="bg-background py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-center">Our Research Journey</h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Explore our computational chemistry research areas from foundational capabilities to future potential
        </p>

        <div className="relative max-w-4xl mx-auto">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary/20 z-0"></div>

          <div className="space-y-24">
            {Object.entries(categories).map(([categoryId, category], index) => (
              <div
                key={categoryId}
                className={`relative z-10 flex ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
              >
                <div className="w-1/2 px-6">
                  <Card className="border-2 border-primary/20 hover:border-primary/50 transition-all">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        {categoryIcons[categoryId] || <Database className="h-6 w-6 text-primary" />}
                        <CardTitle>{category.name}</CardTitle>
                      </div>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <h4 className="text-sm font-medium mb-2">Key Subcategories:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {Object.values(category.subcategories)
                          .slice(0, 3)
                          .map((subcategory, i) => (
                            <li key={i}>• {subcategory.name}</li>
                          ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <Link href={`/categories#${categoryId}`}>
                          Explore <ChevronRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>

                {/* Timeline node */}
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-white font-bold">{index + 1}</span>
                  </div>
                </div>

                <div className="w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

