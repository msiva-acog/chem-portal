import { getPotentialProjects } from "@/lib/projects"
import ProjectGrid from "@/components/project-grid"
import { Lightbulb } from "lucide-react"

export default function PotentialPage() {
  const potentialProjects = getPotentialProjects()

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center">
          <Lightbulb className="mr-2 h-7 w-7 text-primary" />
          Potential Projects
        </h1>
        <p className="text-muted-foreground">Explore future directions and innovative concepts under consideration</p>
      </div>

      <ProjectGrid projects={potentialProjects} />
    </div>
  )
}

