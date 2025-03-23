import { getAllCategories } from "@/lib/projects"
import { NextResponse } from "next/server"

export async function GET() {
  const categories = getAllCategories()

  // Return just the name for each category to keep the response small
  const simplifiedCategories: Record<string, { name: string }> = {}

  Object.entries(categories).forEach(([id, category]) => {
    simplifiedCategories[id] = { name: category.name }
  })

  return NextResponse.json(simplifiedCategories)
}

