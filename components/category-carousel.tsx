"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Database, FlaskRoundIcon as Flask, Lightbulb, Rocket } from "lucide-react"
import { getAllCategories } from "@/lib/projects"
import { motion, AnimatePresence } from "framer-motion"

// Map category IDs to icons
const categoryIcons: Record<string, JSX.Element> = {
  internal: <Flask className="h-10 w-10 text-primary" />,
  abbvie: <Database className="h-10 w-10 text-primary" />,
  pipeline: <Rocket className="h-10 w-10 text-primary" />,
  potential: <Lightbulb className="h-10 w-10 text-primary" />,
}

export default function CategoryCarousel() {
  const categories = getAllCategories()
  const categoryIds = Object.keys(categories)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  // Auto-advance the carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1)
      setCurrentIndex((prevIndex) => (prevIndex + 1) % categoryIds.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [categoryIds.length])

  const navigate = (newIndex: number) => {
    setDirection(newIndex > currentIndex ? 1 : -1)
    setCurrentIndex(newIndex)
  }

  const handlePrev = () => {
    setDirection(-1)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + categoryIds.length) % categoryIds.length)
  }

  const handleNext = () => {
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % categoryIds.length)
  }

  const currentCategoryId = categoryIds[currentIndex]
  const currentCategory = categories[currentCategoryId]

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  }

  return (
    <section className="bg-background py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-center">Our Research Areas</h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Explore our computational chemistry research categories
        </p>

        <div className="relative max-w-4xl mx-auto">
          {/* Navigation buttons */}
          <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-6 z-10">
            <Button variant="outline" size="icon" className="rounded-full bg-background/80" onClick={handlePrev}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>

          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-6 z-10">
            <Button variant="outline" size="icon" className="rounded-full bg-background/80" onClick={handleNext}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Carousel content */}
          <div className="overflow-hidden rounded-lg">
            <AnimatePresence custom={direction} initial={false}>
              <motion.div
                key={currentCategoryId}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "tween", duration: 0.5 }}
                className="w-full"
              >
                <Card className="border-0 shadow-xl bg-gradient-to-br from-primary/5 to-primary/20">
                  <CardHeader>
                    <div className="flex items-center justify-center mb-4">
                      <div className="bg-primary/10 p-4 rounded-full">
                        {categoryIcons[currentCategoryId] || <Database className="h-10 w-10 text-primary" />}
                      </div>
                    </div>
                    <CardTitle className="text-center text-2xl">{currentCategory.name}</CardTitle>
                    <CardDescription className="text-center text-lg mt-2">
                      {currentCategory.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {Object.entries(currentCategory.subcategories).map(([subcategoryId, subcategory]) => (
                        <Card key={subcategoryId} className="bg-background/50 backdrop-blur-sm">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">{subcategory.name}</CardTitle>
                            <CardDescription>{subcategory.description}</CardDescription>
                          </CardHeader>
                          <CardFooter>
                            <Button variant="outline" size="sm" className="w-full" asChild>
                              <Link href={`/category/${currentCategoryId}/${subcategoryId}`}>View Projects</Link>
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <Button asChild>
                      <Link href={`/categories#${currentCategoryId}`}>Explore All {currentCategory.name} Projects</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots navigation */}
          <div className="flex justify-center mt-8 gap-2">
            {categoryIds.map((_, index) => (
              <button
                key={index}
                onClick={() => navigate(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex ? "bg-primary scale-125" : "bg-primary/30"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

