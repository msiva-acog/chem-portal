export default function MoleculeSVG() {
  return (
    <svg
      width="600"
      height="600"
      viewBox="0 0 600 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="opacity-80"
    >
      <path
        d="M300 150C300 150 400 250 500 250C500 250 400 350 300 450C300 450 200 350 100 250C100 250 200 250 300 150Z"
        stroke="rgba(255, 255, 255, 0.3)"
        strokeWidth="8"
        fill="none"
      />
      <path d="M300 150C300 150 200 250 100 250" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="8" fill="none" />
      <path d="M300 150C300 150 300 50 300 50" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="8" fill="none" />
      <circle cx="300" cy="150" r="15" fill="#4ade80" />
      <circle cx="300" cy="50" r="15" fill="#60a5fa" />
      <circle cx="100" cy="250" r="15" fill="#60a5fa" />
      <circle cx="500" cy="250" r="15" fill="#60a5fa" />
      <circle cx="300" cy="450" r="15" fill="#60a5fa" />
    </svg>
  )
}

