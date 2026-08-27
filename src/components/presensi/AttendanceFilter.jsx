import { Search, Calendar } from 'lucide-react'

// Filter bar untuk rekap presensi: cari nama, tanggal, kelas, status.
export default function AttendanceFilter({
  tanggal,
  kelas,
  status,
  search,
  onTanggal,
  onKelas,
  onStatus,
  onSearch,
}) {
  const selectClass =
    'w-full cursor-pointer rounded-lg border border-surface-border bg-white px-3 py-2 text-sm text-slate-700 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20'
  const labelClass = 'mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400'

  return (
    <div className="flex flex-col gap-4 border-b border-surface-border p-5 lg:flex-row lg:items-end">
      <div className="flex-1">
        <label className={labelClass}>Cari Nama</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Cari nama siswa..."
            className="w-full rounded-lg border border-surface-border bg-white py-2 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </div>
      </div>

      <div className="w-full lg:w-44">
        <label className={labelClass}>Tanggal</label>
        <div className="relative">
          <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="date"
            value={tanggal}
            onChange={(e) => onTanggal(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-white py-2 pl-10 pr-3 text-sm text-slate-700 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </div>
      </div>

      <div className="w-full lg:w-44">
        <label className={labelClass}>Kelas</label>
        <select value={kelas} onChange={(e) => onKelas(e.target.value)} className={selectClass}>
          <option value="">Semua Kelas</option>
          <option value="X RPL 1">X RPL 1</option>
          <option value="X RPL 2">X RPL 2</option>
        </select>
      </div>

      <div className="w-full lg:w-44">
        <label className={labelClass}>Status</label>
        <select value={status} onChange={(e) => onStatus(e.target.value)} className={selectClass}>
          <option value="">Semua Status</option>
          <option value="Hadir">Hadir</option>
          <option value="Terlambat">Terlambat</option>
          <option value="Absen">Absen</option>
        </select>
      </div>
    </div>
  )
}
