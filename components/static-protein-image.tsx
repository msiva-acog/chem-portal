import Image from "next/image"

export default function StaticProteinImage() {
  return (
    <div
      className="w-full h-[500px] rounded-lg overflow-hidden relative"
      style={{
        boxShadow: "0 0 30px rgba(74, 222, 128, 0.2)",
        background: "rgba(0, 0, 0, 0.2)",
      }}
    >
      <Image
        src="/images/protein-structure.png"
        alt="Protein structure visualization"
        fill
        className="object-contain p-4"
      />
    </div>
  )
}

