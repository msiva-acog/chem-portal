"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getAllCategories } from "@/lib/projects"
import * as d3 from "d3"
import d3Cloud from "d3-cloud"
import { useRouter } from "next/navigation"

export default function CategoryCloud() {
  const svgRef = useRef<SVGSVGElement>(null)
  const categories = getAllCategories()
  const router = useRouter()

  useEffect(() => {
    if (!svgRef.current) return

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove()

    // Prepare data for the word cloud
    const words: any[] = []

    // Add categories (larger font)
    Object.entries(categories).forEach(([categoryId, category]) => {
      words.push({
        text: category.name,
        size: 40,
        href: `/categories#${categoryId}`,
        group: "category",
        color: "#4ade80",
      })

      // Add subcategories (smaller font)
      Object.entries(category.subcategories).forEach(([subcategoryId, subcategory]) => {
        words.push({
          text: subcategory.name,
          size: 20,
          href: `/category/${categoryId}/${subcategoryId}`,
          group: "subcategory",
          color: "#60a5fa",
        })
      })
    })

    // Set up the word cloud layout
    const layout = d3Cloud()
      .size([800, 500])
      .words(words)
      .padding(5)
      .rotate(() => 0)
      .fontSize((d: any) => d.size)
      .on("end", draw)

    layout.start()

    // Draw the word cloud
    function draw(words: any) {
      const svg = d3
        .select(svgRef.current)
        .attr("viewBox", "0 0 800 500")
        .attr("width", "100%")
        .attr("height", "100%")
        .append("g")
        .attr("transform", "translate(400,250)")

      // Add words with all styling but without events
      const wordElements = svg
        .selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .attr("text-anchor", "middle")
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`)
        .text((d: any) => d.text)
        .style("font-size", (d: any) => `${d.size}px`)
        .style("fill", (d: any) => d.color)
        .style("cursor", "pointer")
        .style("font-weight", (d: any) => (d.group === "category" ? "bold" : "normal"))
        .style("opacity", 0)

      // Add fade-in animation
      wordElements.transition().duration(1000).style("opacity", 1)

      // Add click handler using standard DOM API
      wordElements.nodes().forEach((node, i) => {
        const data = words[i]
        node.addEventListener("click", () => {
          router.push(data.href)
        })

        // Add hover effects
        node.addEventListener("mouseover", () => {
          d3.select(node)
            .transition()
            .duration(200)
            .style("font-size", `${data.size * 1.2}px`)
            .style("fill", "#ffffff")
        })

        node.addEventListener("mouseout", () => {
          d3.select(node).transition().duration(200).style("font-size", `${data.size}px`).style("fill", data.color)
        })
      })
    }

    // Cleanup function
    return () => {
      if (svgRef.current) {
        const textElements = svgRef.current.querySelectorAll("text")
        textElements.forEach((element) => {
          const newElement = element.cloneNode(true)
          if (element.parentNode) {
            element.parentNode.replaceChild(newElement, element)
          }
        })
      }
    }
  }, [categories, router])

  return (
    <section className="bg-background py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-center">Research Categories Cloud</h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Explore our computational chemistry research areas - click on any term to learn more
        </p>

        <div className="bg-muted/30 p-4 rounded-lg mb-8">
          <svg ref={svgRef} className="w-full h-[500px]" />
        </div>

        <div className="flex justify-center">
          <Button asChild>
            <Link href="/categories">View All Categories</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

