

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "./mode-toggle"
import Image from "next/image"

// We need to use client-side fetching for the header since it's a client component
// interface Category {
//   name: string
// }

// interface Categories {
//   [key: string]: Category
// }

export default function Header() {
  const pathname = usePathname()
  // const [categories, setCategories] = useState<Categories>({})

  // useEffect(() => {
  //   // Fetch categories on the client side
  //   fetch("/api/categories")
  //     .then((res) => res.json())
  //     .then((data) => setCategories(data))
  //     .catch((err) => console.error("Error fetching categories:", err))
  // }, [])

  // Base navigation items
  const baseNavItems = [
    { name: "Home", href: "/" },
    { name: "Modules", href: "/modules" },
  ]

  // // Add category items
  // const categoryNavItems = Object.entries(categories).map(([id, category]) => ({
  //   name: category.name,
  //   href: `/categories#${id}`,
  // }))

  const navItems = [...baseNavItems]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center">
        <div className="mr-8 flex items-center">
        <Link href="/" className="font-bold text-xl">
            <Image src="/aganitha-logo (1).png" alt="aganitha" width={150} height={150}></Image>
          </Link>
        </div>
        <nav className="flex items-center space-x-6 mx-6 overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary whitespace-nowrap",
                pathname === item.href ||
                  (pathname.startsWith("/categories") &&
                    item.href.startsWith("/categories#") &&
                    pathname.includes(item.href.split("#")[1]))
                  ? "text-primary"
                  : "text-muted-foreground",
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle/>
          <Button variant="outline" size="sm">
            LOGIN
          </Button>
          <Button size="sm">CONTACT US</Button>
        </div>
      </div>
    </header>
  )
}

