"use client"

import { useEffect, useRef } from "react"
import { getAllCategories } from "@/lib/projects"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import * as d3 from "d3"

export default function CategoryNetwork() {
  const svgRef = useRef<SVGSVGElement>(null)
  const categories = getAllCategories()

  useEffect(() => {
    if (!svgRef.current) return

    const width = 800
    const height = 600

    // Clear previous graph
    d3.select(svgRef.current).selectAll("*").remove()

    // Create nodes for categories and subcategories
    const nodes: any[] = []
    const links: any[] = []

    // Add category nodes
    Object.entries(categories).forEach(([categoryId, category], i) => {
      nodes.push({
        id: categoryId,
        name: category.name,
        group: 1,
        radius: 30,
        color: "#4ade80",
      })

      // Add subcategory nodes and links to parent category
      Object.entries(category.subcategories).forEach(([subcategoryId, subcategory]) => {
        const nodeId = `${categoryId}-${subcategoryId}`
        nodes.push({
          id: nodeId,
          name: subcategory.name,
          group: 2,
          radius: 20,
          color: "#60a5fa",
        })

        links.push({
          source: categoryId,
          target: nodeId,
          value: 1,
        })
      })
    })

    // Create force simulation
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d: any) => d.id)
          .distance(100),
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collision",
        d3.forceCollide().radius((d: any) => d.radius + 10),
      )

    // Create SVG elements
    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", "100%")
      .attr("height", "100%")

    // Add links
    const link = svg
      .append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#888")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 2)

    // Add nodes
    const node = svg
      .append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", (d: any) => d.radius)
      .attr("fill", (d: any) => d.color)
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .call(d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended) as any)

    // Add labels
    const label = svg
      .append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .text((d: any) => d.name)
      .attr("font-size", 12)
      .attr("text-anchor", "middle")
      .attr("dy", 4)
      .attr("fill", "#fff")

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y)

      node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y)

      label.attr("x", (d: any) => d.x).attr("y", (d: any) => d.y)
    })

    // Drag functions
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }

    function dragged(event: any, d: any) {
      d.fx = event.x
      d.fy = event.y
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    }

    return () => {
      simulation.stop()
    }
  }, [categories])

  return (
    <section className="bg-background py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-center">Our Research Network</h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Explore the interconnected areas of our computational chemistry research. Drag nodes to rearrange the network
          visualization.
        </p>

        <div className="bg-muted/30 p-4 rounded-lg mb-8">
          <svg ref={svgRef} className="w-full h-[600px]" />
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

