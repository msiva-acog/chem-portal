import { getPipelineProjects } from "@/lib/projects"
import ProjectGrid from "@/components/project-grid"
import { Rocket } from "lucide-react"

export default function PipelinePage() {
  const pipelineProjects = getPipelineProjects()

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center">
          <Rocket className="mr-2 h-7 w-7 text-primary" />
          Pipeline Projects
        </h1>
        <p className="text-muted-foreground">Discover our ongoing research and development initiatives</p>
      </div>

      <ProjectGrid projects={pipelineProjects} />
    </div>
  )
}

