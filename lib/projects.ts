import fs from "fs"
import path from "path"
import yaml from "js-yaml"

export interface ProjectLink {
  title: string
  url: string
}

export interface Project {
  moduleName: string
  imageURL: string
  status: string
  shortDescription: string
  longDescription: string
  industry?: string[]
  function?: string[]
  technology?: string[]
  links: ProjectLink[]
}

export interface Category {
  name: string
  description: string
  subcategories: {
    [key: string]: Subcategory
  }
}

export interface Subcategory {
  name: string
  description: string
  projects: Project[]
}

export interface ProjectsData {
  modules: {
    [key: string]: Project
  }
}

export interface CategoriesData {
  [key: string]: Category
}

// This function is only called on the server side
export function getProjectsData(): ProjectsData {
  const filePath = path.join(process.cwd(), "data", "projects.yaml")
  const fileContents = fs.readFileSync(filePath, "utf8")
  const data = yaml.load(fileContents) as ProjectsData
  return data
}

// This function is only called on the server side
export function getCategoriesData(): CategoriesData {
  const filePath = path.join(process.cwd(), "data", "categories.yaml")
  const fileContents = fs.readFileSync(filePath, "utf8")
  const data = yaml.load(fileContents) as CategoriesData
  return data
}

// Server-side functions
export function getAllProjects() {
  const data = getProjectsData()
  return Object.values(data.modules)
}

export function getProjectByName(name: string): Project | null {
  const allProjects = getAllProjects()
  return allProjects.find((project) => project.moduleName === name) || null
}

export function findProjectBySlug(slug: string): Project | null {
  const allProjects = getAllProjects()
  return (
    allProjects.find((project) => {
      const projectSlug = project.moduleName.toLowerCase().replace(/\s+/g, "-")
      return projectSlug === slug
    }) || null
  )
}

export function getCompletedProjects() {
  const allProjects = getAllProjects()
  return allProjects.filter((project) => project.status === "completed")
}

export function getWorkInProgressProjects() {
  const allProjects = getAllProjects()
  return allProjects.filter((project) => project.status === "work-in-progress")
}

// New functions to support organization by different parameters
export function getAllIndustries(): string[] {
  const allProjects = getAllProjects()
  const industriesSet = new Set<string>()

  allProjects.forEach((project) => {
    if (project.industry) {
      project.industry.forEach((industry) => industriesSet.add(industry))
    }
  })

  return Array.from(industriesSet).sort()
}

export function getAllFunctions(): string[] {
  const allProjects = getAllProjects()
  const functionsSet = new Set<string>()

  allProjects.forEach((project) => {
    if (project.function) {
      project.function.forEach((func) => functionsSet.add(func))
    }
  })

  return Array.from(functionsSet).sort()
}

export function getAllTechnologies(): string[] {
  const allProjects = getAllProjects()
  const technologiesSet = new Set<string>()

  allProjects.forEach((project) => {
    if (project.technology) {
      project.technology.forEach((tech) => technologiesSet.add(tech))
    }
  })

  return Array.from(technologiesSet).sort()
}

export function getProjectsByOrganization(
  organizationType: "all" | "industry" | "function" | "technology" | "status",
): Record<string, Project[]> {
  const allProjects = getAllProjects()
  const organizedProjects: Record<string, Project[]> = {}

  if (organizationType === "all") {
    organizedProjects["All Modules"] = allProjects
  } else if (organizationType === "status") {
    organizedProjects["Completed"] = allProjects.filter((project) => project.status === "completed")
    organizedProjects["Work in Progress"] = allProjects.filter((project) => project.status === "work-in-progress")
  } else {
    allProjects.forEach((project) => {
      let values: string[] = []

      if (organizationType === "industry" && project.industry) {
        values = project.industry
      } else if (organizationType === "function" && project.function) {
        values = project.function
      } else if (organizationType === "technology" && project.technology) {
        values = project.technology
      }

      values.forEach((value) => {
        if (!organizedProjects[value]) {
          organizedProjects[value] = []
        }
        organizedProjects[value].push(project)
      })
    })
  }

  // Sort the keys alphabetically, but ensure "Completed" comes before "Work in Progress"
  if (organizationType === "status") {
    return organizedProjects
  }

  return Object.fromEntries(Object.entries(organizedProjects).sort(([a], [b]) => a.localeCompare(b)))
}

export function getAllCategories(): Record<string, Category> {
  const data = getCategoriesData()
  return data
}

export function getInternalProjects(): { capabilities: Project[]; products: Project[] } {
  const allProjects = getAllProjects()
  return {
    capabilities: allProjects.slice(0, 3),
    products: allProjects.slice(3, 6),
  }
}

export function getPipelineProjects(): Project[] {
  const allProjects = getAllProjects()
  return allProjects.slice(6, 9)
}

export function getPotentialProjects(): Project[] {
  const allProjects = getAllProjects()
  return allProjects.slice(9, 12)
}

export function getCategory(categoryId: string): Category | undefined {
  const categories = getAllCategories()
  return categories[categoryId]
}

export function getSubcategory(categoryId: string, subcategoryId: string): Subcategory | undefined {
  const category = getCategory(categoryId)
  if (!category) return undefined
  return category.subcategories[subcategoryId]
}

export function getProjectsForSubcategory(categoryId: string, subcategoryId: string): Project[] {
  const subcategory = getSubcategory(categoryId, subcategoryId)
  if (!subcategory) return []
  return subcategory.projects
}

