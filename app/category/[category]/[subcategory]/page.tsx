import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"
import { getCategory, getSubcategory, getProjectsForSubcategory } from "@/lib/projects"
import ProjectGrid from "@/components/project-grid"

interface CategoryPageProps {
  params: {
    category: string
    subcategory: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { category: categoryId, subcategory: subcategoryId } = params

  // Get category and subcategory data from YAML
  const category = getCategory(categoryId)
  if (!category) {
    notFound()
  }

  const subcategory = getSubcategory(categoryId, subcategoryId)
  if (!subcategory) {
    notFound()
  }

  const projects = getProjectsForSubcategory(categoryId, subcategoryId)

  return (
    <div className="container mx-auto py-12">
      <Button variant="outline" asChild className="mb-8">
        <Link href="/categories">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Categories
        </Link>
      </Button>

      <h1 className="text-4xl font-bold mb-4">
        {category.name}: {subcategory.name}
      </h1>
      <p className="text-xl text-muted-foreground mb-12">{subcategory.description}</p>

      {projects.length > 0 ? (
        <ProjectGrid projects={projects} />
      ) : (
        <div className="bg-muted/30 p-12 rounded-lg text-center">
          <h2 className="text-2xl font-semibold mb-4">Projects Coming Soon</h2>
          <p className="text-muted-foreground mb-6">
            We're currently populating this section with projects. Check back soon!
          </p>
        </div>
      )}
    </div>
  )
}

