export default function ProteinLigandSVG() {
  return (
    <svg
      width="600"
      height="600"
      viewBox="0 0 600 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="opacity-80"
    >
      {/* Protein backbone structure */}
      <path
        d="M150,200 C180,150 220,170 250,150 C280,130 310,180 340,200 C370,220 400,180 430,200 C460,220 480,250 450,280 C420,310 450,340 420,370 C390,400 350,380 320,400 C290,420 260,370 230,350 C200,330 170,370 140,350 C110,330 90,300 120,270 C150,240 120,250 150,200"
        stroke="rgba(255, 255, 255, 0.3)"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />

      {/* Alpha helix representation */}
      <path
        d="M180,220 C190,210 200,205 210,210 C220,215 230,225 240,220 C250,215 260,205 270,210 C280,215 290,225 300,220"
        stroke="rgba(255, 255, 255, 0.4)"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />

      {/* Beta sheet representation */}
      <path
        d="M320,250 L370,270 L370,300 L320,320 L320,250"
        stroke="rgba(255, 255, 255, 0.4)"
        strokeWidth="6"
        fill="none"
      />
      <path d="M330,260 L360,275 L360,295 L330,310" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="3" fill="none" />

      {/* Ligand molecule */}
      <path d="M280,300 L320,280 L350,310 L330,350 L290,340 L280,300" stroke="#4ade80" strokeWidth="4" fill="none" />
      <line x1="320" y1="280" x2="340" y2="260" stroke="#4ade80" strokeWidth="4" />
      <line x1="350" y1="310" x2="380" y2="315" stroke="#4ade80" strokeWidth="4" />
      <line x1="330" y1="350" x2="340" y2="380" stroke="#4ade80" strokeWidth="4" />

      {/* Binding site highlights */}
      <circle cx="300" cy="320" r="15" fill="rgba(96, 165, 250, 0.5)" />
      <circle cx="330" cy="300" r="15" fill="rgba(96, 165, 250, 0.5)" />
      <circle cx="320" cy="340" r="15" fill="rgba(96, 165, 250, 0.5)" />

      {/* Atoms in ligand */}
      <circle cx="280" cy="300" r="8" fill="#4ade80" />
      <circle cx="320" cy="280" r="8" fill="#4ade80" />
      <circle cx="350" cy="310" r="8" fill="#4ade80" />
      <circle cx="330" cy="350" r="8" fill="#4ade80" />
      <circle cx="290" cy="340" r="8" fill="#4ade80" />
      <circle cx="340" cy="260" r="8" fill="#4ade80" />
      <circle cx="380" cy="315" r="8" fill="#4ade80" />
      <circle cx="340" cy="380" r="8" fill="#4ade80" />

      {/* Hydrogen bonds */}
      <line
        x1="300"
        y1="320"
        x2="290"
        y2="340"
        stroke="rgba(96, 165, 250, 0.8)"
        strokeWidth="2"
        strokeDasharray="5,5"
      />
      <line
        x1="330"
        y1="300"
        x2="320"
        y2="280"
        stroke="rgba(96, 165, 250, 0.8)"
        strokeWidth="2"
        strokeDasharray="5,5"
      />
      <line
        x1="320"
        y1="340"
        x2="330"
        y2="350"
        stroke="rgba(96, 165, 250, 0.8)"
        strokeWidth="2"
        strokeDasharray="5,5"
      />

      {/* Water molecules */}
      <circle cx="270" cy="270" r="6" fill="#60a5fa" />
      <circle cx="370" cy="350" r="6" fill="#60a5fa" />
      <circle cx="250" cy="330" r="6" fill="#60a5fa" />

      {/* Labels */}
      <text x="400" y="200" fill="white" fontSize="14">
        Protein
      </text>
      <text x="400" y="300" fill="#4ade80" fontSize="14">
        Ligand
      </text>
      <text x="400" y="330" fill="#60a5fa" fontSize="14">
        Binding Site
      </text>
    </svg>
  )
}

