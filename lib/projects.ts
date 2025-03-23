import fs from "fs"
import path from "path"
import yaml from "js-yaml"

export interface ProjectLink {
  title: string
  url: string
}

export interface Project {
  projectName: string
  imageURL: string
  shortDescription: string
  longDescription: string
  industry?: string[]
  function?: string[]
  technology?: string[]
  links: ProjectLink[]
}

export interface Subcategory {
  name: string
  description: string
  projects: Project[]
}

export interface Category {
  name: string
  description: string
  subcategories: {
    [key: string]: Subcategory
  }
}

export interface ProjectsData {
  categories: {
    [key: string]: Category
  }
}

// This function is only called on the server side
export function getProjectsData(): ProjectsData {
  const filePath = path.join(process.cwd(), "data", "projects.yaml")
  const fileContents = fs.readFileSync(filePath, "utf8")
  const data = yaml.load(fileContents) as ProjectsData
  return data
}

// Server-side functions
export function getAllCategories() {
  const data = getProjectsData()
  return data.categories
}

export function getCategory(categoryId: string) {
  const data = getProjectsData()
  return data.categories[categoryId]
}

export function getSubcategory(categoryId: string, subcategoryId: string) {
  const category = getCategory(categoryId)
  if (!category) return null
  return category.subcategories[subcategoryId]
}

export function getProjectsForSubcategory(categoryId: string, subcategoryId: string) {
  const subcategory = getSubcategory(categoryId, subcategoryId)
  if (!subcategory) return []
  return subcategory.projects
}

export function getAllProjects() {
  const data = getProjectsData()
  const allProjects: Project[] = []

  Object.keys(data.categories).forEach((categoryId) => {
    const category = data.categories[categoryId]
    Object.keys(category.subcategories).forEach((subcategoryId) => {
      const subcategory = category.subcategories[subcategoryId]
      allProjects.push(...subcategory.projects)
    })
  })

  return allProjects
}

export function getProjectByName(name: string): Project | null {
  const allProjects = getAllProjects()
  return allProjects.find((project) => project.projectName === name) || null
}

export function findProjectBySlug(slug: string): Project | null {
  const allProjects = getAllProjects()
  return (
    allProjects.find((project) => {
      const projectSlug = project.projectName.toLowerCase().replace(/\s+/g, "-")
      return projectSlug === slug
    }) || null
  )
}

export function getInternalProjects() {
  const data = getProjectsData()
  const internalCategory = data.categories["internal"]
  if (!internalCategory) return { capabilities: [], products: [] }

  const capabilities = Object.values(internalCategory.subcategories["capabilities"]?.projects || [])
  const products = Object.values(internalCategory.subcategories["products"]?.projects || [])

  return { capabilities, products }
}

export function getPipelineProjects() {
  const data = getProjectsData()
  const pipelineCategory = data.categories["customer2"]
  if (!pipelineCategory) return []

  let projects: Project[] = []
  for (const subcategoryKey in pipelineCategory.subcategories) {
    const subcategory = pipelineCategory.subcategories[subcategoryKey]
    if (subcategory && subcategory.projects) {
      projects = projects.concat(subcategory.projects)
    }
  }
  return projects
}

export function getPotentialProjects() {
  const data = getProjectsData()
  const potentialCategory = data.categories["potential"]
  if (!potentialCategory) return []

  let projects: Project[] = []
  for (const subcategoryKey in potentialCategory.subcategories) {
    const subcategory = potentialCategory.subcategories[subcategoryKey]
    if (subcategory && subcategory.projects) {
      projects = projects.concat(subcategory.projects)
    }
  }
  return projects
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
  organizationType: "category" | "industry" | "function" | "technology",
): Record<string, Project[]> {
  const allProjects = getAllProjects()
  const organizedProjects: Record<string, Project[]> = {}

  if (organizationType === "category") {
    const data = getProjectsData()
    Object.entries(data.categories).forEach(([categoryId, category]) => {
      organizedProjects[category.name] = []

      Object.values(category.subcategories).forEach((subcategory) => {
        organizedProjects[category.name].push(...subcategory.projects)
      })
    })
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

  // Sort the keys alphabetically
  return Object.fromEntries(Object.entries(organizedProjects).sort(([a], [b]) => a.localeCompare(b)))
}

