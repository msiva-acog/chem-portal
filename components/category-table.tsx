import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Database, FlaskRoundIcon as Flask, Lightbulb, Rocket } from "lucide-react"
import { getAllCategories } from "@/lib/projects"

// Map category IDs to icons
const categoryIcons: Record<string, JSX.Element> = {
  internal: <Flask className="h-5 w-5 text-primary" />,
  abbvie: <Database className="h-5 w-5 text-primary" />,
  pipeline: <Rocket className="h-5 w-5 text-primary" />,
  potential: <Lightbulb className="h-5 w-5 text-primary" />,
}

export default function CategoryTable() {
  const categories = getAllCategories()

  return (
    <section className="bg-background py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-center">Our Research Areas</h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          A comprehensive overview of our computational chemistry research categories
        </p>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Subcategories</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(categories).map(([categoryId, category]) => (
                <TableRow key={categoryId}>
                  <TableCell>
                    <div className="bg-primary/10 p-2 rounded-full">
                      {categoryIcons[categoryId] || <Database className="h-5 w-5 text-primary" />}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="max-w-md">{category.description}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {Object.values(category.subcategories).map((subcategory, index) => (
                        <Badge key={index} variant="outline">
                          {subcategory.name}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/categories#${categoryId}`}>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  )
}

