import { QrCode, Camera, ChevronUp, ChevronDown } from 'lucide-react'

const statusBadge = {
  Hadir: 'bg-emerald-50 text-emerald-700',
  Terlambat: 'bg-amber-50 text-amber-700',
  Absen: 'bg-red-50 text-red-500',
}

const metodeIcon = {
  Barcode: QrCode,
  'Scan Wajah': Camera,
}

// Daftar kolom yang bisa di-sort.
const sortable = {
  nama: true,
  kelas: true,
  tanggal: true,
  jamMasuk: true,
  status: true,
}

function SortHeader({ label, sortKey, activeKey, dir, onSort, className = '' }) {
  const active = activeKey === sortKey
  return (
    <th className={`p-4 font-medium ${className}`}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={`inline-flex items-center gap-1 transition-colors hover:text-navy ${
          active ? 'text-navy' : ''
        }`}
      >
        {label}
        {active &&
          (dir === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />)}
      </button>
    </th>
  )
}

export default function AttendanceTable({ rows, startNo, sortKey, sortDir, onSort }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[860px] border-collapse text-left">
        <thead>
          <tr className="border-b border-surface-border bg-surface font-label-sm text-label-sm uppercase tracking-wider text-slate-400">
            <th className="p-4 font-medium">No</th>
            <SortHeader label="Nama Siswa" sortKey="nama" activeKey={sortKey} dir={sortDir} onSort={onSort} />
            <SortHeader label="Kelas" sortKey="kelas" activeKey={sortKey} dir={sortDir} onSort={onSort} />
            <SortHeader label="Tanggal" sortKey="tanggal" activeKey={sortKey} dir={sortDir} onSort={onSort} />
            <SortHeader label="Jam Masuk" sortKey="jamMasuk" activeKey={sortKey} dir={sortDir} onSort={onSort} />
            <th className="p-4 font-medium">Jam Pulang</th>
            <th className="p-4 font-medium">Metode</th>
            <SortHeader label="Status" sortKey="status" activeKey={sortKey} dir={sortDir} onSort={onSort} />
            <th className="p-4 font-medium">Keterangan</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-border font-body-sm text-slate-600">
          {rows.map((p, i) => {
            const Icon = metodeIcon[p.metode]
            return (
              <tr key={p.id} className="transition-colors hover:bg-brand-50/40">
                <td className="p-4 text-slate-400">{startNo + i}</td>
                <td className="p-4 font-semibold text-navy">{p.nama}</td>
                <td className="p-4 text-slate-500">{p.kelas}</td>
                <td className="p-4 text-slate-500">{p.tanggal}</td>
                <td className="p-4 text-slate-500">{p.jamMasuk}</td>
                <td className="p-4 text-slate-500">{p.jamPulang}</td>
                <td className="p-4 text-slate-500">
                  <span className="flex items-center gap-1.5">
                    {Icon && <Icon className="h-4 w-4" />}
                    {p.metode}
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                      statusBadge[p.status] ?? 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="p-4 text-slate-500">{p.keterangan}</td>
              </tr>
            )
          })}
          {rows.length === 0 && (
            <tr>
              <td colSpan={9} className="p-10 text-center text-sm text-slate-400">
                Tidak ada data presensi yang cocok.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
