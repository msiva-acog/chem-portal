import { findProjectBySlug } from "@/lib/projects"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ExternalLink } from "lucide-react"

interface ProjectPageProps {
  params: {
    slug: string
  }
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = params
  const project = findProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Button variant="outline" asChild className="mb-8">
        <Link href="/categories">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
        </Link>
      </Button>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="relative aspect-video overflow-hidden rounded-lg">
          <Image
            src={project.imageURL || "/placeholder.svg?height=400&width=600"}
            alt={project.projectName}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{project.projectName}</h1>
            <p className="text-xl text-muted-foreground mt-2">{project.shortDescription}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.industry && (
              <div className="space-y-2 w-full">
                <h3 className="text-sm font-medium">Industries:</h3>
                <div className="flex flex-wrap gap-2">
                  {project.industry.map((ind, i) => (
                    <Badge key={i} variant="secondary" className="bg-blue-500/10">
                      {ind}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {project.function && (
              <div className="space-y-2 w-full">
                <h3 className="text-sm font-medium">Functions:</h3>
                <div className="flex flex-wrap gap-2">
                  {project.function.map((func, i) => (
                    <Badge key={i} variant="secondary" className="bg-green-500/10">
                      {func}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {project.technology && (
              <div className="space-y-2 w-full">
                <h3 className="text-sm font-medium">Technologies:</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technology.map((tech, i) => (
                    <Badge key={i} variant="secondary" className="bg-purple-500/10">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Resources</h2>
            <div className="flex flex-wrap gap-3">
              {project.links.map((link) => (
                <Button key={link.url} variant="outline" asChild>
                  <Link href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.title} <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <h2 className="text-2xl font-semibold mb-4">About This Project</h2>
          <div className="prose dark:prose-invert max-w-none">
            <p>{project.longDescription}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

