import { findProjectBySlug } from "@/lib/projects"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BookOpen, Building2, Cog, Cpu, ExternalLink, Tag } from "lucide-react"
import { VideoPlayer } from "@/components/video-player"

interface param {
  slug:string
}
interface ProjectPageProps{
  params?: Promise<param>
  // params: {
  //   slug: string
  // }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = findProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="hover:bg-transparent p-0">
          <Link href="/modules" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Modules
          </Link>
        </Button>
      </div>
      {/* Module header with status badge */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">{project.moduleName}</h1>
          <p className="text-xl text-muted-foreground">{project.shortDescription}</p>
        </div>
      </div>
      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Media section - takes up 2/3 of the space on desktop */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden h-full">
            <div className="relative h-full">
              {project.videoURL ? (
                <VideoPlayer url={project.videoURL}  title={project.moduleName} />
              ) : (
                <div className="relative aspect-video w-full">
                  <Image
                    src={project.imageURL || "/placeholder.svg?height=400&width=600"}
                    alt={project.moduleName}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar with key information - takes up 1/3 of the space on desktop */}
        <div className="space-y-6 flex flex-col h-full">
          {/* Quick facts card */}
          <Card className="flex-grow">
            <CardContent className="pt-6 h-full flex flex-col">
              <h2 className="text-xl font-semibold mb-4">Module Information</h2>

              <div className="space-y-4 flex-grow">
                {project.industry && (
                  <div className="flex items-start gap-3">
                    <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium mb-1">Industries</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.industry.map((ind, i) => (
                          <Badge key={i} variant="secondary" className="bg-blue-500/10">
                            {ind}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {project.function && (
                  <div className="flex items-start gap-3">
                    <Cog className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium mb-1">Functions</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.function.map((func, i) => (
                          <Badge key={i} variant="secondary" className="bg-green-500/10">
                            {func}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {project.keywords && (
                  <div className="flex items-start gap-3">
                    <Tag className="h-4 w-4 text-muted-foreground relative top-[1px] flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium mb-1"> Keywords</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.keywords.map((func, i) => (
                          <Badge key={i} variant="secondary" className="bg-blue-500/10">
                            {func}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Resources card */}
          <Card className="flex-grow">
            <CardContent className="pt-6 h-full flex flex-col">
              <h2 className="text-xl font-semibold mb-4">Resources</h2>

              <div className="space-y-3 flex-grow">
                {project.links
                  .filter((link) => link.title !== "User Guide") // Filter out User Guide
                  .map((link) => {
                    // Choose icon based on link type
                    let icon = <ExternalLink className="h-4 w-4" />
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    let variant:any = "outline"

                    if (link.title === "Try the App") {
                      icon = <Cpu className="h-4 w-4" />
                      variant = "default"
                    } else if (link.title === "Know More") {
                      icon = <BookOpen className="h-4 w-4" />
                      variant = "secondary"
                    }

                    return (
                      <Button key={link.url} variant={variant} className="w-full justify-start" asChild>
                        <Link href={link.url} target="_blank" rel="noopener noreferrer">
                          <span className="mr-2">{icon}</span>
                          {link.title}
                        </Link>
                      </Button>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        </div>
        </div>

      {/* <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="relative aspect-video overflow-hidden rounded-lg">
          <Image
            src={project.imageURL || "/placeholder.svg?height=400&width=600"}
            alt={project.moduleName}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{project.moduleName}</h1>
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
      </div> */}

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

