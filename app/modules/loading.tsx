import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="container mx-auto py-12">
      <div className="flex flex-col space-y-8">
        <div>
          <Skeleton className="h-12 w-64 mb-2" />
          <Skeleton className="h-6 w-full max-w-3xl" />
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <Skeleton className="h-10 w-full md:max-w-md" />
          <Skeleton className="h-10 w-full md:w-[200px]" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-12" />
                </CardContent>
              </Card>
            ))}
        </div>

        <div className="space-y-6">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="border rounded-lg overflow-hidden">
                <Skeleton className="h-14 w-full" />
                <div className="p-4 space-y-4">
                  {Array(2)
                    .fill(0)
                    .map((_, j) => (
                      <div key={j} className="flex flex-col md:flex-row gap-4">
                        <Skeleton className="h-40 w-full md:w-48 rounded-md" />
                        <div className="flex-1 space-y-3">
                          <Skeleton className="h-6 w-3/4" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <div className="flex gap-2">
                            <Skeleton className="h-6 w-16" />
                            <Skeleton className="h-6 w-16" />
                            <Skeleton className="h-6 w-16" />
                          </div>
                          <Skeleton className="h-10 w-32" />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

