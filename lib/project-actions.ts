"use server"

import fs from "fs"
import path from "path"
import yaml from "js-yaml"
import type { Project, ProjectsData } from "./projects"

// Server-side function to get project data
export async function getProjectsData(): Promise<ProjectsData> {
  const filePath = path.join(process.cwd(), "data", "projects.yaml")
  const fileContents = fs.readFileSync(filePath, "utf8")
  const data = yaml.load(fileContents) as ProjectsData
  return data
}

// Server action to find a project by slug
export async function findProjectBySlugAction(slug: string): Promise<Project | null> {
  const data = await getProjectsData()
  const allProjects = Object.values(data.modules)

  return (
    allProjects.find((project) => {
      const projectSlug = project.moduleName.toLowerCase().replace(/\s+/g, "-")
      return projectSlug === slug
    }) || null
  )
}

