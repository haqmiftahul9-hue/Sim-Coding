import { taskSubmissions } from '../../data/dummyData'

// Bar chart statistik pengumpulan tugas, dibuat murni dengan div + Tailwind.
export default function BarChart({ data = taskSubmissions }) {
  return (
    <div>
      <div className="flex h-[200px] items-end justify-between gap-3 border-b border-surface-border pt-4">
        {data.map((d) => (
          <div key={d.module} className="flex h-full flex-1 flex-col items-center justify-end">
            <span className="mb-2 text-xs font-semibold text-slate-500">{d.value}%</span>
            <div
              className={`w-full max-w-[44px] rounded-t-md transition-all ${
                d.value < 50 ? 'bg-slate-300' : 'bg-brand'
              }`}
              style={{ height: `${d.value}%` }}
              title={`${d.module}: ${d.value}%`}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between gap-3">
        {data.map((d) => (
          <div key={d.module} className="flex-1 text-center text-xs font-medium text-slate-500">
            {d.module}
          </div>
        ))}
      </div>
    </div>
  )
}
