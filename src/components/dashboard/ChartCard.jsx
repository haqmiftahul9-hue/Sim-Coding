import { MoreVertical } from 'lucide-react'

// Kartu pembungkus yang dapat digunakan kembali untuk bagian chart/dashboard.
export default function ChartCard({ title, action, children, className = '' }) {
  return (
    <section className={`card p-5 sm:p-6 ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-navy">{title}</h2>
        {action ?? (
          <button
            type="button"
            aria-label="Opsi lainnya"
            className="rounded-md p-1 text-slate-400 transition-colors hover:bg-surface hover:text-navy"
          >
            <MoreVertical className="h-5 w-5" />
          </button>
        )}
      </div>
      {children}
    </section>
  )
}
