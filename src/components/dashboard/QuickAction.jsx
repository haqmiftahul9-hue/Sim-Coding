import { UserPlus, FilePlus, ScanLine } from 'lucide-react'
import { quickActions } from '../../data/dummyData'

const iconMap = {
  userPlus: UserPlus,
  postAdd: FilePlus,
  scan: ScanLine,
}

const variantMap = {
  primary:
    'bg-navy text-white hover:bg-navy-light shadow-sm',
  outline:
    'border border-surface-border bg-white text-navy hover:bg-surface',
}

// Tombol aksi cepat di sisi kanan dashboard.
export default function QuickAction() {
  return (
    <div className="card flex flex-col p-5 sm:p-6">
      <h2 className="mb-5 font-display text-lg font-semibold text-navy">Aksi Cepat</h2>
      <div className="flex flex-1 flex-col justify-center gap-3">
        {quickActions.map((action) => {
          const Icon = iconMap[action.icon] ?? UserPlus
          return (
            <button
              key={action.id}
              type="button"
              className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${
                variantMap[action.variant] ?? variantMap.outline
              }`}
            >
              <Icon className="h-5 w-5" />
              {action.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
