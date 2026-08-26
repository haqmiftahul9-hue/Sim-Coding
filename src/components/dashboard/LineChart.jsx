import { weeklyAttendance } from '../../data/dummyData'

// Line chart tren kehadiran mingguan, dibuat murni dengan SVG agar ringan & profesional.
export default function LineChart({ data = weeklyAttendance, height = 240 }) {
  const padding = { top: 16, right: 16, bottom: 28, left: 32 }
  const width = 600
  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom

  const max = 100
  const points = data.map((d, i) => {
    const x = padding.left + (chartW / (data.length - 1)) * i
    const y = padding.top + chartH - (d.value / max) * chartH
    return { x, y, ...d }
  })

  const linePath = points.map((p) => `${p.x},${p.y}`).join(' ')
  const areaPath =
    `${points[0].x},${padding.top + chartH} ` +
    points.map((p) => `${p.x},${p.y}`).join(' ') +
    ` ${points[points.length - 1].x},${padding.top + chartH}`

  const gridLines = [100, 75, 50, 25, 0]

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        preserveAspectRatio="none"
        role="img"
        aria-label="Tren kehadiran mingguan"
      >
        <defs>
          <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid + Y labels */}
        {gridLines.map((g) => {
          const y = padding.top + chartH - (g / max) * chartH
          return (
            <g key={g}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="#E2E8F0"
                strokeDasharray="4 4"
              />
              <text x={4} y={y + 4} fontSize="11" fill="#94A3B8">
                {g}%
              </text>
            </g>
          )
        })}

        {/* Area + Line */}
        <polygon points={areaPath} fill="url(#lineFill)" />
        <polyline
          points={linePath}
          fill="none"
          stroke="#2563EB"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4.5" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2.5" />
            <text
              x={p.x}
              y={height - 8}
              fontSize="11"
              fill="#64748B"
              textAnchor="middle"
            >
              {p.day}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
