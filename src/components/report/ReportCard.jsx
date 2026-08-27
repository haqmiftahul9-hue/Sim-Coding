import { FileText, Users, CheckCircle, Clock, TrendingUp } from 'lucide-react'

const iconMap = {
  users: Users,
  completed: CheckCircle,
  pending: Clock,
  average: TrendingUp,
}

export default function ReportCard({ stats }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = iconMap[stat.icon] || FileText
        return (
          <div key={stat.id} className="card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold text-navy">{stat.value}</p>
                {stat.subtitle && (
                  <p className="mt-1 text-xs text-slate-400">{stat.subtitle}</p>
                )}
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.iconBg || 'bg-brand/10'}`}>
                <Icon className={`h-6 w-6 ${stat.iconColor || 'text-brand'}`} />
              </div>
            </div>
            {stat.trend && (
              <div className="mt-3 flex items-center gap-1">
                <span className={`text-xs font-medium ${stat.trend > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {stat.trend > 0 ? '+' : ''}{stat.trend}%
                </span>
                <span className="text-xs text-slate-400">dari semester lalu</span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
