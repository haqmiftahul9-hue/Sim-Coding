import { useMemo, useState } from 'react'
import { Pencil, FileDown, QrCode, Camera, ListChecks } from 'lucide-react'
import { presensi } from '../../data/presensi'
import { students } from '../../data/students'
import AttendanceFilter from '../../components/presensi/AttendanceFilter'
import AttendanceTable from '../../components/presensi/AttendanceTable'
import ManualAttendanceModal from '../../components/presensi/ManualAttendanceModal'
import BarcodeScanner from '../../components/presensi/BarcodeScanner'
import FaceScanner from '../../components/presensi/FaceScanner'
import Pagination from '../../components/admin/Pagination'
import { exportPresensiPdf } from '../../lib/presensiPdf'

const PAGE_SIZE = 8

const tabs = [
  { id: 'barcode', label: 'Scan Barcode', icon: QrCode },
  { id: 'wajah', label: 'Scan Wajah', icon: Camera },
  { id: 'rekap', label: 'Rekap Presensi', icon: ListChecks },
]

export default function PresensiDigital() {
  const [active, setActive] = useState('rekap')
  const [rows, setRows] = useState(presensi)
  const [tanggal, setTanggal] = useState('')
  const [kelas, setKelas] = useState('')
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState('tanggal')
  const [sortDir, setSortDir] = useState('desc')
  const [page, setPage] = useState(1)
  const [manualOpen, setManualOpen] = useState(false)

  const resetPage = () => setPage(1)

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return rows.filter(
      (p) =>
        (!q || p.nama.toLowerCase().includes(q)) &&
        (!kelas || p.kelas === kelas) &&
        (!status || p.status === status) &&
        (!tanggal || p.tanggalIso === tanggal)
    )
  }, [rows, search, kelas, status, tanggal])

  const handleAddAttendance = (entry) => {
    const nextId = rows.reduce((max, r) => Math.max(max, r.id), 0) + 1
    setRows((prev) => [{ id: nextId, ...entry }, ...prev])
    setManualOpen(false)
    resetPage()
  }

  const sorted = useMemo(() => {
    const arr = [...filtered]
    arr.sort((a, b) => {
      const av = String(a[sortKey] ?? '')
      const bv = String(b[sortKey] ?? '')
      const cmp = av.localeCompare(bv, 'id', { numeric: true })
      return sortDir === 'asc' ? cmp : -cmp
    })
    return arr
  }, [filtered, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * PAGE_SIZE
  const pageItems = sorted.slice(start, start + PAGE_SIZE)

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  return (
    <div className="mx-auto max-w-container-max space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy sm:text-3xl">Presensi Digital</h1>
          <p className="mt-1 text-sm text-slate-500 sm:text-base">
            Kelola dan pantau kehadiran siswa secara real-time.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setManualOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-surface-border bg-white px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-surface"
          >
            <Pencil className="h-5 w-5" />
            Edit Manual
          </button>
          <button
            type="button"
            onClick={() => exportPresensiPdf(sorted, { tanggal, kelas, status })}
            className="flex items-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-light"
          >
            <FileDown className="h-5 w-5" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-surface-border">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = active === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActive(tab.id)}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
                isActive
                  ? 'border-brand text-navy'
                  : 'border-transparent text-slate-400 hover:text-navy'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      {active === 'rekap' ? (
        <section className="card overflow-hidden">
          <AttendanceFilter
            tanggal={tanggal}
            kelas={kelas}
            status={status}
            search={search}
            onTanggal={(v) => {
              setTanggal(v)
              resetPage()
            }}
            onKelas={(v) => {
              setKelas(v)
              resetPage()
            }}
            onStatus={(v) => {
              setStatus(v)
              resetPage()
            }}
            onSearch={(v) => {
              setSearch(v)
              resetPage()
            }}
          />

          <AttendanceTable
            rows={pageItems}
            startNo={start + 1}
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={handleSort}
          />

          <Pagination
            from={sorted.length === 0 ? 0 : start + 1}
            to={start + pageItems.length}
            total={sorted.length}
            page={safePage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </section>
      ) : active === 'barcode' ? (
        <BarcodeScanner students={students} onScan={handleAddAttendance} />
      ) : active === 'wajah' ? (
        <FaceScanner students={students} onScan={handleAddAttendance} />
      ) : (
        <section className="card p-10 text-center text-sm text-slate-400">
          Fitur “{tabs.find((t) => t.id === active)?.label}” akan segera tersedia.
        </section>
      )}

      <ManualAttendanceModal
        open={manualOpen}
        onClose={() => setManualOpen(false)}
        students={students}
        onSave={handleAddAttendance}
      />
    </div>
  )
}
