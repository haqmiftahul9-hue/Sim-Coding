// Badge status siswa (Aktif / Nonaktif), reusable di seluruh aplikasi.
const statusStyle = {
  Aktif: 'bg-emerald-50 text-emerald-700',
  Nonaktif: 'bg-slate-100 text-slate-500',
}

const dotStyle = {
  Aktif: 'bg-emerald-500',
  Nonaktif: 'bg-slate-400',
}

export default function StatusBadge({ status }) {
  const badge = statusStyle[status] ?? statusStyle.Nonaktif
  const dot = dotStyle[status] ?? dotStyle.Nonaktif
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  )
}
