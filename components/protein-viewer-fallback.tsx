export default function ProteinViewerFallback() {
  return (
    <div
      className="w-full h-[500px] rounded-lg overflow-hidden flex items-center justify-center"
      style={{
        boxShadow: "0 0 30px rgba(74, 222, 128, 0.2)",
        background: "rgba(0, 0, 0, 0.2)",
      }}
    >
      <div className="text-center p-8">
        <div className="animate-pulse mb-4">
          <div className="h-32 w-32 bg-primary/20 rounded-full mx-auto"></div>
        </div>
        <p className="text-muted-foreground">Loading 3D protein structure...</p>
      </div>
    </div>
  )
}

