import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, Database, FlaskRoundIcon as Flask, Lightbulb, Rocket } from "lucide-react"
import { getAllCategories } from "@/lib/projects"

// Map category IDs to icons
const categoryIcons: Record<string, JSX.Element> = {
  internal: <Flask className="h-6 w-6 text-primary" />,
  abbvie: <Database className="h-6 w-6 text-primary" />,
  pipeline: <Rocket className="h-6 w-6 text-primary" />,
  potential: <Lightbulb className="h-6 w-6 text-primary" />,
}

export default function CategoryAccordion() {
  const categories = getAllCategories()

  return (
    <section className="bg-background py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-center">Our Research Areas</h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Explore our computational chemistry categories and their subcategories
        </p>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {Object.entries(categories).map(([categoryId, category]) => (
              <AccordionItem key={categoryId} value={categoryId}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3 text-left">
                    <div className="bg-primary/10 p-2 rounded-full">
                      {categoryIcons[categoryId] || <Database className="h-5 w-5 text-primary" />}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 pl-12">
                    {Object.entries(category.subcategories).map(([subcategoryId, subcategory]) => (
                      <Card key={subcategoryId} className="border border-muted">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{subcategory.name}</CardTitle>
                          <CardDescription>{subcategory.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button variant="outline" size="sm" className="w-full" asChild>
                            <Link href={`/category/${categoryId}/${subcategoryId}`}>
                              View Projects <ChevronRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="flex justify-center mt-12">
            <Button asChild>
              <Link href="/categories">View All Categories</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

