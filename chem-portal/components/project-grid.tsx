import ProjectCard from "./project-card"
import type { Project } from "@/lib/projects"

interface ProjectGridProps {
  projects: Project[]
  title?: string
}

export default function ProjectGrid({ projects, title }: ProjectGridProps) {
  return (
    <div className="space-y-6">
      {title && <h2 className="text-2xl font-bold tracking-tight">{title}</h2>}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.projectName} project={project} />
        ))}
      </div>
    </div>
  )
}

