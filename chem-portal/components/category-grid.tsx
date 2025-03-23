import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Database, FlaskRoundIcon as Flask, Lightbulb, Rocket } from "lucide-react"
import { getAllCategories } from "@/lib/projects"
import type { JSX } from "react"

// Map category IDs to icons
const categoryIcons: Record<string, JSX.Element> = {
  internal: <Flask className="h-6 w-6 text-primary" />,
  abbvie: <Database className="h-6 w-6 text-primary" />,
  pipeline: <Rocket className="h-6 w-6 text-primary" />,
  potential: <Lightbulb className="h-6 w-6 text-primary" />,
}

export default function CategoryGrid() {
  const categories = getAllCategories()

  return (
    <section className="bg-background py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">Our Research Areas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Object.entries(categories).map(([categoryId, category]) => (
            <div key={categoryId} className="bg-muted/50 p-8 rounded-lg hover:bg-muted/70 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                {categoryIcons[categoryId] || <Database className="h-6 w-6 text-primary" />}
                <h3 className="text-xl font-semibold">{category.name}</h3>
              </div>
              <p className="text-muted-foreground mb-6">{category.description}</p>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/categories#${categoryId}`}>Learn More</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

