"use client"

import { useState, useEffect, useMemo} from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Filter, ChevronDown, ChevronRight, Share2, Bookmark, BookmarkCheck} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import type { Project, Category } from "@/lib/projects"
import { useToast } from "@/hooks/use-toast"

type OrganizationType = "all" | "industry" | "function" | "technology"
type ViewMode = "list" | "grid" | "compact"

interface CategoryExplorerProps {
  initialCategories: Record<string, Category>
  initialProjects: Project[]
  initialIndustries: string[]
  initialFunctions: string[]
  initialTechnologies: string[]
}

export default function CategoryExplorer({
  initialCategories,
  initialProjects,
}: CategoryExplorerProps) {
  // State
  const [organizationType, setOrganizationType] = useState<OrganizationType>("all")
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})
  const [favorites, setFavorites] = useState<string[]>([])
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false)
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([])
  const [selectedFilters, setSelectedFilters] = useState<{
    industry: string[]
    function: string[]
    technology: string[]
  }>({
    industry: [],
    function: [],
    technology: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()


  // Initialize data
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    // Load saved preferences from localStorage
    const savedViewMode = localStorage.getItem("projectExplorerViewMode") as ViewMode | null
    if (savedViewMode) setViewMode(savedViewMode)

    const savedOrganizationType = localStorage.getItem("projectExplorerOrganizationType") as OrganizationType | null
    if (savedOrganizationType) setOrganizationType(savedOrganizationType)

    const savedFavorites = localStorage.getItem("projectExplorerFavorites")
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites))

    const savedRecentlyViewed = localStorage.getItem("projectExplorerRecentlyViewed")
    if (savedRecentlyViewed) setRecentlyViewed(JSON.parse(savedRecentlyViewed))

    return () => clearTimeout(timer)
  }, [])

  // Save preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem("projectExplorerViewMode", viewMode)
  }, [viewMode])

  useEffect(() => {
    localStorage.setItem("projectExplorerOrganizationType", organizationType)
  }, [organizationType])

  useEffect(() => {
    localStorage.setItem("projectExplorerFavorites", JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem("projectExplorerRecentlyViewed", JSON.stringify(recentlyViewed))
  }, [recentlyViewed])

  // Organize projects based on selected organization type
  const organizedProjects = useMemo(() => {
    // Client-side implementation of getProjectsByOrganization
    const result: Record<string, Project[]> = {}

    if (organizationType === "all") {
      Object.entries(initialCategories).forEach(([categoryId, category]) => {
        result[category.name] = []
        console.log(categoryId);
        

        Object.values(category.subcategories).forEach((subcategory) => {
          result[category.name].push(...subcategory.projects)
        })
      })
    } else {
      initialProjects.forEach((project) => {
        let values: string[] = []

        if (organizationType === "industry" && project.industry) {
          values = project.industry
        } else if (organizationType === "function" && project.function) {
          values = project.function
        } else if (organizationType === "technology" && project.technology) {
          values = project.technology
        }

        values.forEach((value) => {
          if (!result[value]) {
            result[value] = []
          }
          result[value].push(project)
        })
      })
    }

    // Sort the keys alphabetically
    return Object.fromEntries(Object.entries(result).sort(([a], [b]) => a.localeCompare(b)))
  }, [organizationType, initialCategories, initialProjects])

  // Filter projects based on search query and filters
  const filteredOrganizedProjects = useMemo(() => {
    if (
      !searchQuery &&
      !showOnlyFavorites &&
      selectedFilters.industry.length === 0 &&
      selectedFilters.function.length === 0 &&
      selectedFilters.technology.length === 0
    ) {
      return organizedProjects
    }

    const result: Record<string, Project[]> = {}

    Object.entries(organizedProjects).forEach(([group, projects]) => {
      const filteredProjects = projects.filter((project) => {
        // Filter by search query
        const matchesSearch =
          !searchQuery ||
          project.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.longDescription.toLowerCase().includes(searchQuery.toLowerCase())

        // Filter by favorites
        const matchesFavorites = !showOnlyFavorites || favorites.includes(project.projectName)

        // Filter by industry
        const matchesIndustry =
          selectedFilters.industry.length === 0 ||
          (project.industry && project.industry.some((ind) => selectedFilters.industry.includes(ind)))

        // Filter by function
        const matchesFunction =
          selectedFilters.function.length === 0 ||
          (project.function && project.function.some((func) => selectedFilters.function.includes(func)))

        // Filter by technology
        const matchesTechnology =
          selectedFilters.technology.length === 0 ||
          (project.technology && project.technology.some((tech) => selectedFilters.technology.includes(tech)))

        return matchesSearch && matchesFavorites && matchesIndustry && matchesFunction && matchesTechnology
      })

      if (filteredProjects.length > 0) {
        result[group] = filteredProjects
      }
    })

    return result
  }, [organizedProjects, searchQuery, showOnlyFavorites, selectedFilters, favorites])

  // Toggle group expansion
  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }))
  }

  // Expand all groups initially
  useEffect(() => {
    if (!isLoading) {
      const initialExpandedGroups: Record<string, boolean> = {}
      Object.keys(organizedProjects).forEach((group) => {
        initialExpandedGroups[group] = true
      })
      setExpandedGroups(initialExpandedGroups)
    }
  }, [organizedProjects, isLoading])

  // Toggle favorite status for a project
  const toggleFavorite = (projectName: string) => {
    setFavorites((prev) => {
      if (prev.includes(projectName)) {
        return prev.filter((name) => name !== projectName)
      } else {
        return [...prev, projectName]
      }
    })
  }

  // Add a project to recently viewed
  const addToRecentlyViewed = (projectName: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((name) => name !== projectName)
      return [projectName, ...filtered].slice(0, 5) // Keep only the 5 most recent
    })
  }

  // Share a project
  const shareProject = (project: Project) => {
    const projectSlug = project.projectName.toLowerCase().replace(/\s+/g, "-")
    const url = `${window.location.origin}/project/${projectSlug}`

    if (navigator.share) {
      navigator
        .share({
          title: project.projectName,
          text: project.shortDescription,
          url: url,
        })
        .catch((error) => {
          console.error("Error sharing:", error)
        })
    } else {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          toast({
            title: "Link copied to clipboard",
            description: "You can now share this project with others.",
          })
        })
        .catch((error) => {
          console.error("Error copying to clipboard:", error)
        })
    }
  }

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("")
  }

  // Toggle a filter value
  const toggleFilter = (type: "industry" | "function" | "technology", value: string) => {
    setSelectedFilters((prev) => {
      const current = prev[type]
      return {
        ...prev,
        [type]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value],
      }
    })
  }

  // Calculate statistics
  // const statistics = useMemo(() => {
  //   const totalProjects = initialProjects.length
  //   const projectsByIndustry: Record<string, number> = {}
  //   const projectsByFunction: Record<string, number> = {}
  //   const projectsByTechnology: Record<string, number> = {}

  //   initialProjects.forEach((project) => {
  //     if (project.industry) {
  //       project.industry.forEach((ind) => {
  //         projectsByIndustry[ind] = (projectsByIndustry[ind] || 0) + 1
  //       })
  //     }

  //     if (project.function) {
  //       project.function.forEach((func) => {
  //         projectsByFunction[func] = (projectsByFunction[func] || 0) + 1
  //       })
  //     }

  //     if (project.technology) {
  //       project.technology.forEach((tech) => {
  //         projectsByTechnology[tech] = (projectsByTechnology[tech] || 0) + 1
  //       })
  //     }
  //   })

  //   return {
  //     totalProjects,
  //     projectsByIndustry,
  //     projectsByFunction,
  //     projectsByTechnology,
  //   }
  // }, [initialProjects])

  // Render loading state
  if (isLoading) {
    return null // The parent component will show the loading skeleton
  }

  return (
    <div className="container mx-auto py-12">
      <div className="flex flex-col space-y-8">
        {/* <div>
          <h1 className="text-4xl font-bold">Project Explorer</h1>
          <p className="text-xl text-muted-foreground mt-2 max-w-3xl">
            Explore our comprehensive collection of computational chemistry projects organized by different parameters.
          </p>
        </div> */}

        {/* Search and organization controls */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex-1 w-full md:max-w-md">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search projects..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium hidden md:inline">Organize by:</span>
            </div>
            <Select value={organizationType} onValueChange={(value) => setOrganizationType(value as OrganizationType)}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Organization Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Default</SelectItem>
                <SelectItem value="industry">Industry</SelectItem>
                <SelectItem value="function">Function</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active filters display */}
        {(searchQuery ||
          showOnlyFavorites ||
          selectedFilters.industry.length > 0 ||
          selectedFilters.function.length > 0 ||
          selectedFilters.technology.length > 0) && (
          <div className="flex flex-wrap items-center gap-2 p-2 bg-muted/20 rounded-md">
            <span className="text-sm font-medium">Active filters:</span>

            {searchQuery && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: {searchQuery}
                <Button variant="ghost" size="icon" className="h-4 w-4 ml-1" onClick={() => setSearchQuery("")}>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </Badge>
            )}

            {showOnlyFavorites && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Favorites only
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1"
                  onClick={() => setShowOnlyFavorites(false)}
                >
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </Badge>
            )}

            {selectedFilters.industry.map((industry) => (
              <Badge key={industry} variant="secondary" className="flex items-center gap-1 bg-blue-500/10">
                {industry}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1"
                  onClick={() => toggleFilter("industry", industry)}
                >
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </Badge>
            ))}

            {selectedFilters.function.map((func) => (
              <Badge key={func} variant="secondary" className="flex items-center gap-1 bg-green-500/10">
                {func}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1"
                  onClick={() => toggleFilter("function", func)}
                >
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </Badge>
            ))}

            {selectedFilters.technology.map((tech) => (
              <Badge key={tech} variant="secondary" className="flex items-center gap-1 bg-purple-500/10">
                {tech}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1"
                  onClick={() => toggleFilter("technology", tech)}
                >
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </Badge>
            ))}

            <Button variant="ghost" size="sm" onClick={resetFilters} className="ml-auto">
              Clear all
            </Button>
          </div>
        )}

        {/* Stats */}
        {/* <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{Object.keys(initialCategories).length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{initialProjects.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Industries</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{initialIndustries.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Technologies</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{initialTechnologies.length}</p>
            </CardContent>
          </Card>
        </div> */}

        {/* Recently viewed */}
        {/* {recentlyViewed.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-xl font-semibold">Recently Viewed</h2>
            </div>
            <div className="flex overflow-x-auto gap-4 pb-4">
              {recentlyViewed.map((projectName) => {
                const project = initialProjects.find((p) => p.projectName === projectName)
                if (!project) return null

                return (
                  <Card key={projectName} className="min-w-[250px] max-w-[250px]">
                    <div className="relative h-32 w-full">
                      <Image
                        src={project.imageURL || "/placeholder.svg?height=128&width=250"}
                        alt={project.projectName}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    </div>
                    <CardHeader className="pb-2 pt-3">
                      <CardTitle className="text-base line-clamp-1">{project.projectName}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-muted-foreground line-clamp-2">{project.shortDescription}</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" asChild className="w-full">
                        <Link
                          href={`/project/${project.projectName.toLowerCase().replace(/\s+/g, "-")}`}
                          onClick={() => addToRecentlyViewed(project.projectName)}
                        >
                          View Details
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          </div>
        )} */}

        {/* Project listing */}
        <div className="space-y-6">
          {Object.keys(filteredOrganizedProjects).length === 0 ? (
            <div className="bg-muted/30 p-12 rounded-lg text-center">
              <h2 className="text-2xl font-semibold mb-4">No Projects Found</h2>
              <p className="text-muted-foreground mb-6">Try adjusting your search query.</p>
              <Button onClick={() => setSearchQuery("")}>Clear Search</Button>
            </div>
          ) : (
            Object.entries(filteredOrganizedProjects).map(([group, projects]) => (
              <Collapsible
                key={group}
                open={expandedGroups[group]}
                onOpenChange={() => toggleGroup(group)}
                className="border rounded-lg overflow-hidden"
              >
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between p-4 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-semibold">{group}</h2>
                      <Badge variant="outline">{projects.length} projects</Badge>
                    </div>
                    {expandedGroups[group] ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-4">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-4 font-medium">Project</th>
                          <th className="text-left py-2 px-4 font-medium hidden md:table-cell">Industry</th>
                          <th className="text-left py-2 px-4 font-medium hidden lg:table-cell">Function</th>
                          <th className="text-right py-2 px-4 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projects.map((project, index) => (
                          <tr key={index} className="border-b hover:bg-muted/10">
                            <td className="py-2 px-4">
                              <div className="flex items-center gap-3">
                                <div className="relative h-10 w-10 rounded overflow-hidden">
                                  <Image
                                    src={project.imageURL || "/placeholder.svg?height=40&width=40"}
                                    alt={project.projectName}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <div className="font-medium">{project.projectName}</div>
                                  <div className="text-sm text-muted-foreground line-clamp-1">
                                    {project.shortDescription}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-2 px-4 hidden md:table-cell">
                              <div className="flex flex-wrap gap-1">
                                {project.industry &&
                                  project.industry.slice(0, 2).map((ind, i) => (
                                    <Badge key={i} variant="secondary" className="bg-blue-500/10 text-xs">
                                      {ind}
                                    </Badge>
                                  ))}
                              </div>
                            </td>
                            <td className="py-2 px-4 hidden lg:table-cell">
                              <div className="flex flex-wrap gap-1">
                                {project.function &&
                                  project.function.slice(0, 2).map((func, i) => (
                                    <Badge key={i} variant="secondary" className="bg-green-500/10 text-xs">
                                      {func}
                                    </Badge>
                                  ))}
                              </div>
                            </td>
                            <td className="py-2 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={() => toggleFavorite(project.projectName)}>
                                  {favorites.includes(project.projectName) ? (
                                    <BookmarkCheck className="h-4 w-4 text-primary" />
                                  ) : (
                                    <Bookmark className="h-4 w-4" />
                                  )}
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => shareProject(project)}>
                                  <Share2 className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm" asChild>
                                  <Link
                                    href={`/project/${project.projectName.toLowerCase().replace(/\s+/g, "-")}`}
                                    onClick={() => addToRecentlyViewed(project.projectName)}
                                  >
                                    View
                                  </Link>
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

