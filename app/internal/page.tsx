import { getInternalProjects } from "@/lib/projects"
import ProjectGrid from "@/components/project-grid"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function InternalPage() {
  const { capabilities, products } = getInternalProjects()

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Internal Projects</h1>
        <p className="text-muted-foreground">Explore our internal capabilities and product development initiatives</p>
      </div>

      <Tabs defaultValue="capabilities" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>
        <TabsContent value="capabilities" className="mt-6">
          <div id="capabilities">
            <ProjectGrid projects={capabilities} />
          </div>
        </TabsContent>
        <TabsContent value="products" className="mt-6">
          <div id="products">
            <ProjectGrid projects={products} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

