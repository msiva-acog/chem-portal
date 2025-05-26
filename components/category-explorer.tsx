"use client"

import { useState, useEffect, useMemo} from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Filter, ChevronDown, ChevronRight,CheckCircle, Clock3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import type { Project } from "@/lib/projects"

type OrganizationType = "status" | "function"

interface CategoryExplorerProps {
  initialProjects: Project[]
  initialIndustries: string[]
  initialFunctions: string[]
  initialTechnologies: string[]
}

export default function CategoryExplorer({
  initialProjects,
}: CategoryExplorerProps) {
  // State
  const [organizationType, setOrganizationType] = useState<OrganizationType>("status")
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})
  const [favorites, setFavorites] = useState<string[]>([])
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)



  // Initialize data
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    // Load saved preferences from localStorage
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

  
    if (organizationType === "status") {
      result["Ready to Use"] = initialProjects.filter((project) => project.status === "completed")
      result["Work in Progress"] = initialProjects.filter((project) => project.status === "work-in-progress")
    } else {
      initialProjects.forEach((project) => {
        let values: string[] = []
        if (organizationType === "function" && project.function) {
          values = project.function
        }

        values.forEach((value) => {
          if (!result[value]) {
            result[value] = []
          }
          result[value].push(project)
        })
      })
    }

    // Sort the keys alphabetically, but ensure "Completed" comes before "Work in Progress" for status
    if (organizationType === "status") {
      return result
    }

    return Object.fromEntries(Object.entries(result).sort(([a], [b]) => a.localeCompare(b)))
  }, [organizationType, initialProjects])

  // Filter projects based on search query
  const filteredOrganizedProjects = useMemo(() => {
    if (!searchQuery) {
      return organizedProjects
    }

    const result: Record<string, Project[]> = {}

    Object.entries(organizedProjects).forEach(([group, projects]) => {
      const filteredProjects = projects.filter((project) => {
        console.log(project);
        const searchLower = searchQuery.toLowerCase()
        
        const matchesText =
          project.moduleName.toLowerCase().includes(searchLower) ||
          project.longDescription.toLowerCase().includes(searchLower)

        // Check in keywords
        const matchesKeywords =
          project.keywords?.some((keyword) => keyword.toLowerCase().includes(searchLower)) || false

        return matchesText || matchesKeywords
      })

      if (filteredProjects.length > 0) {
        result[group] = filteredProjects
      }
    })

    return result
  }, [organizedProjects, searchQuery])

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
  // const toggleFavorite = (projectName: string) => {
  //   setFavorites((prev) => {
  //     if (prev.includes(projectName)) {
  //       return prev.filter((name) => name !== projectName)
  //     } else {
  //       return [...prev, projectName]
  //     }
  //   })
  // }

  // Add a project to recently viewed
  const addToRecentlyViewed = (projectName: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((name) => name !== projectName)
      return [projectName, ...filtered].slice(0, 5) // Keep only the 5 most recent
    })
  }

  // Share a project
  // const shareProject = (project: Project) => {
  //   const projectSlug = project.moduleName.toLowerCase().replace(/\s+/g, "-")
  //   const url = `${window.location.origin}/project/${projectSlug}`

  //   if (navigator.share) {
  //     navigator
  //       .share({
  //         title: project.moduleName,
  //         text: project.shortDescription,
  //         url: url,
  //       })
  //       .catch((error) => {
  //         console.error("Error sharing:", error)
  //       })
  //   } else {
  //     navigator.clipboard
  //       .writeText(url)
  //       .then(() => {
  //         toast({
  //           title: "Link copied to clipboard",
  //           description: "You can now share this project with others.",
  //         })
  //       })
  //       .catch((error) => {
  //         console.error("Error copying to clipboard:", error)
  //       })
  //   }
  // }

  // Reset all filters
  // const resetFilters = () => {
  //   setSearchQuery("")
  // }

  // Calculate statistics
  // const statistics = useMemo(() => {
  //   const totalProjects = initialProjects.length
  //   const completedProjects = initialProjects.filter((p) => p.status === "completed").length
  //   const workInProgressProjects = initialProjects.filter((p) => p.status === "work-in-progress").length

  //   return {
  //     totalProjects,
  //     completedProjects,
  //     workInProgressProjects,
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
          <h1 className="text-4xl font-bold">Module Explorer</h1>
          <p className="text-xl text-muted-foreground mt-2 max-w-3xl">
            Explore our comprehensive collection of computational chemistry modules organized by different parameters.
          </p>
        </div> */}

        {/* Search and organization controls */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex-1 w-full md:max-w-md">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search modules..."
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
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="function">Function</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active filters display */}
        {searchQuery && (
          <div className="flex flex-wrap items-center gap-2 p-2 bg-muted/20 rounded-md">
            <span className="text-sm font-medium">Active filters:</span>

            <Badge variant="secondary" className="flex items-center gap-1">
              Search: {searchQuery}
              <Button variant="ghost" size="icon" className="h-4 w-4 ml-1" onClick={() => setSearchQuery("")}>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </Badge>

            <Button variant="ghost" size="sm" onClick={() => setSearchQuery("")} className="ml-auto">
              Clear search
            </Button>
          </div>
        )}

        {/* Stats */}
        {/* <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Modules</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{statistics.totalProjects}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{statistics.completedProjects}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock3 className="h-5 w-5 text-amber-500" />
                In Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{statistics.workInProgressProjects}</p>
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
              {recentlyViewed.map((moduleName) => {
                const project = initialProjects.find((p) => p.moduleName === moduleName)
                if (!project) return null

                return (
                  <Card key={moduleName} className="min-w-[250px] max-w-[250px]">
                    <div className="relative h-32 w-full">
                      <Image
                        src={project.imageURL || "/placeholder.svg?height=128&width=250"}
                        alt={project.moduleName}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge
                          variant={project.status === "completed" ? "default" : "secondary"}
                          className="bg-background/80 backdrop-blur-sm"
                        >
                          {project.status === "completed" ? (
                            <span className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3 text-green-500" /> Completed
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <Clock3 className="h-3 w-3 text-amber-500" /> In Progress
                            </span>
                          )}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-2 pt-3">
                      <CardTitle className="text-base line-clamp-1">{project.moduleName}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-muted-foreground line-clamp-2">{project.shortDescription}</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" asChild className="w-full">
                        <Link
                          href={`/project/${project.moduleName.toLowerCase().replace(/\s+/g, "-")}`}
                          onClick={() => addToRecentlyViewed(project.moduleName)}
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
              <h2 className="text-2xl font-semibold mb-4">No Modules Found</h2>
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
                      <Badge variant="outline">{projects.length} modules</Badge>
                    </div>
                    {expandedGroups[group] ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-4">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-4 font-medium">Module</th>
                          <th className="text-center py-2 px-4 font-medium">Status</th>
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
                                    alt={project.moduleName}
                                    fill
                                    className="object-cover"
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    {project.status === "work-in-progress" && (
                                      <div className="absolute top-0 right-0 w-3 h-3 bg-amber-500 rounded-full"></div>
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <div className="font-medium">{project.moduleName}</div>
                                  <div className="text-sm text-muted-foreground line-clamp-1">
                                    {project.shortDescription}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-2 px-4 text-center">
                              <Badge
                                variant={project.status === "completed" ? "default" : "secondary"}
                                className={project.status === "completed" ? "bg-green-500/20" : "bg-amber-500/20"}
                              >
                                {project.status === "completed" ? (
                                  <span className="flex items-center gap-1 text-primary">
                                    <CheckCircle className="h-3 w-3 text-green-500" /> Ready to Use
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1">
                                    <Clock3 className="h-3 w-3 text-amber-500" /> In Progress
                                  </span>
                                )}
                              </Badge>
                            </td>
                            <td className="py-2 px-4 text-right">
                              <Button variant="outline" size="sm" asChild>
                                <Link
                                  href={`/project/${project.moduleName.toLowerCase().replace(/\s+/g, "-")}`}
                                  onClick={() => addToRecentlyViewed(project.moduleName)}
                                >
                                  View Details
                                </Link>
                              </Button>
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

