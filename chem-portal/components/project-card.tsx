import Link from "next/link"
import Image from "next/image"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Project } from "@/lib/projects"

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { projectName, imageURL, shortDescription } = project

  // Create a URL-friendly slug from the project name
  const slug = projectName.toLowerCase().replace(/\s+/g, "-")

  return (
    <Card className="overflow-hidden flex flex-col h-full transition-all hover:shadow-lg">
      <div className="relative h-48 w-full">
        <Image
          src={imageURL || "/placeholder.svg?height=200&width=400"}
          alt={projectName}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader className="flex-grow">
        <CardTitle className="line-clamp-2">{projectName}</CardTitle>
        <CardDescription className="line-clamp-3">{shortDescription}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/project/${encodeURIComponent(slug)}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

