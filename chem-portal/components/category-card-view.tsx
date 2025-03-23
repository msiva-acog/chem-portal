import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database, FlaskRoundIcon as Flask, Lightbulb, Rocket, ChevronRight } from "lucide-react"
import type { Category } from "@/lib/projects"

// Map category IDs to icons
const categoryIcons: Record<string, JSX.Element> = {
  internal: <Flask className="h-6 w-6 text-primary" />,
  abbvie: <Database className="h-6 w-6 text-primary" />,
  pipeline: <Rocket className="h-6 w-6 text-primary" />,
  potential: <Lightbulb className="h-6 w-6 text-primary" />,
}

interface CategoryCardViewProps {
  categories: Record<string, Category>
}

export default function CategoryCardView({ categories }: CategoryCardViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.entries(categories).map(([categoryId, category]) => {
        // Count total projects in this category
        const totalProjects = Object.values(category.subcategories).reduce(
          (sum, subcategory) => sum + subcategory.projects.length,
          0,
        )

        return (
          <Card key={categoryId} className="h-full flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                {categoryIcons[categoryId] || <Database className="h-6 w-6 text-primary" />}
                <CardTitle>{category.name}</CardTitle>
              </div>
              <CardDescription className="line-clamp-2">{category.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Subcategories</h4>
                  <Badge variant="outline">{Object.keys(category.subcategories).length}</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.values(category.subcategories).map((subcategory, index) => (
                    <Badge key={index} variant="secondary">
                      {subcategory.name}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-4">
                  <h4 className="text-sm font-medium">Projects</h4>
                  <Badge variant="outline">{totalProjects}</Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href={`/categories#${categoryId}`}>
                  Explore Category <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}

