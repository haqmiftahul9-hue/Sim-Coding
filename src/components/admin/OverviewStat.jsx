// Kartu statistik ringkas untuk halaman Detail Siswa (reusable).
import { Circle } from 'lucide-react'

const accentMap = {
  navy: 'bg-navy/10 text-navy',
  brand: 'bg-brand-50 text-brand-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
}

export default function OverviewStat({ icon: Icon, label, value, hint, accent = 'navy' }) {
  const IconCmp = Icon ?? Circle
  return (
    <div className="card flex flex-col p-5">
      <div className="mb-4 flex items-start justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</h3>
        <span className={`rounded-full p-2 ${accentMap[accent] ?? accentMap.navy}`}>
          <IconCmp className="h-5 w-5" />
        </span>
      </div>
      <div className="mt-auto font-display text-3xl font-bold text-navy">{value}</div>
      {hint && <p className="mt-1 text-xs font-medium text-slate-400">{hint}</p>}
    </div>
  )
}
