import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import ProteinViewer from "@/components/protein-viewer"
// import { getAllCategories } from "@/lib/projects"
// import { Database, FlaskRoundIcon as Flask, Lightbulb, Rocket } from "lucide-react"
// import { JSX } from "react"

// Map category IDs to icons
// const categoryIcons: Record<string, JSX.Element> = {
//   internal: <Flask className="h-6 w-6 text-primary" />,
//   abbvie: <Database className="h-6 w-6 text-primary" />,
//   pipeline: <Rocket className="h-6 w-6 text-primary" />,
//   potential: <Lightbulb className="h-6 w-6 text-primary" />,
// }

export default function Home() {
  // const categories = getAllCategories()

  return (
    <div>
      {/* Hero section with dark gradient and 3D protein visualization */}
      <section className="hero-gradient molecule-hero">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col justify-center space-y-8 max-w-xl mx-auto lg:mx-0">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-center lg:text-left">
              Igniva™ for
              Chemistry: AI/ML &
              GenAI powered
              Computational
              chemistry for
              Molecular & Material Discovery
              </h1>
              <p className="text-xl text-muted-foreground text-center lg:text-left">
              Our biology aware chemistry
              Deep Science platform, rooted in
              first principles based methods
              viz. Molecular Dynamics (MD),
              Quantum Mechanics (QM)
              embracing advances in Deep
              Tech. viz. AI/ML, GenAI, GPU
              acceleration for high throughput
              </p>
              <div className="pt-6 flex justify-center lg:justify-start">
                <Button
                  size="lg"
                  // variant={"default"}
                  // className="bg-primary/20 hover:bg-primary/30 border border-primary/50 text-white"
                  asChild
                >
                  <Link href="/modules">
                    EXPLORE OUR PLATFORM <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <ProteinViewer />
            </div>
          </div>
        </div>
      </section>

      {/* Categories section */}
      {/* <section className="bg-background py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Research Areas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.entries(categories).map(([categoryId, category]) => (
              <div key={categoryId} className="bg-muted/50 p-8 rounded-lg hover:bg-muted/70 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  {categoryIcons[categoryId] || <Database className="h-6 w-6 text-primary" />}
                  <h3 className="text-xl font-semibold">{category.name}</h3>
                </div>
                <p className="text-muted-foreground mb-6">{category.description}</p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/categories#${categoryId}`}>Learn More</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section> */}
    </div>
  )
}

