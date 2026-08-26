import { Users, CheckCircle2, Inbox, Clock } from 'lucide-react'

const iconMap = {
  users: Users,
  check: CheckCircle2,
  inbox: Inbox,
  pending: Clock,
}

const accentMap = {
  navy: 'bg-navy/10 text-navy',
  brand: 'bg-brand-50 text-brand-600',
  error: 'bg-red-50 text-red-500',
}

// Kartu statistik minimalis: icon, judul, dan angka besar.
export default function StatisticCard({ stat }) {
  const Icon = iconMap[stat.icon] ?? Users
  return (
    <div className="card flex flex-col p-5 sm:p-6">
      <div className="mb-5 flex items-start justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {stat.label}
        </h3>
        <span className={`rounded-full p-2 ${accentMap[stat.accent] ?? accentMap.navy}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <div className="mt-auto font-display text-4xl font-bold text-navy">{stat.value}</div>
    </div>
  )
}
