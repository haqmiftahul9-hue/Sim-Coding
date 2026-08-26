import { QrCode, Upload, UserRound } from 'lucide-react'
import { recentActivities } from '../../data/dummyData'

const iconMap = {
  qrCode: QrCode,
  upload: Upload,
  face: UserRound,
}

const typeStyle = {
  attendance: 'bg-brand-50 text-brand-600',
  task: 'bg-navy/10 text-navy',
}

// Daftar aktivitas terkini.
export default function ActivityList() {
  return (
    <div className="card flex flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-surface-border p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold text-navy">Aktivitas Terkini</h2>
        <a href="#" className="text-xs font-semibold text-brand-600 hover:underline">
          Lihat Semua
        </a>
      </div>
      <ul className="divide-y divide-surface-border">
        {recentActivities.map((activity) => {
          const Icon = iconMap[activity.icon] ?? QrCode2
          return (
            <li
              key={activity.id}
              className="flex items-start gap-4 p-4 transition-colors hover:bg-surface sm:p-5"
            >
              <span
                className={`mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                  typeStyle[activity.type] ?? typeStyle.attendance
                }`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <p className="text-sm text-slate-700">
                  <span className="font-semibold text-navy">{activity.student}</span> -{' '}
                  {activity.description}
                </p>
                <p className="mt-1 text-xs text-slate-400">{activity.time}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
