import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Upload, QrCode, Search, Download } from 'lucide-react'
import { students as initialStudents } from '../../data/students'
import StudentTable from '../../components/admin/StudentTable'
import Pagination from '../../components/admin/Pagination'
import StudentModal from '../../components/admin/StudentModal'
import ImportExcelModal from '../../components/admin/ImportExcelModal'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { downloadBarcodeCards } from '../../lib/barcodePdf'
import { downloadStudentTemplate } from '../../lib/excelTemplate'

const PAGE_SIZE = 5

function makeBarcode(kelas) {
  const rand = Math.floor(100 + Math.random() * 899)
  return `BC-${(kelas || 'XX').replace(/\s/g, '')}-${rand}`
}

export default function DataSiswa() {
  const [students, setStudents] = useState(initialStudents)
  const [search, setSearch] = useState('')
  const [kelasFilter, setKelasFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState([])

  const [addOpen, setAddOpen] = useState(false)
  const [editStudent, setEditStudent] = useState(null)
  const [importOpen, setImportOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const idRef = useRef(100)
  const navigate = useNavigate()

  const handleView = (student) => navigate(`/admin/students/${student.id}`)

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return students.filter((s) => {
      const matchSearch =
        !q || s.name.toLowerCase().includes(q) || s.nis.toLowerCase().includes(q)
      const matchKelas = !kelasFilter || s.kelas === kelasFilter
      const matchStatus = !statusFilter || s.status === statusFilter
      return matchSearch && matchKelas && matchStatus
    })
  }, [students, search, kelasFilter, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * PAGE_SIZE
  const pageItems = filtered.slice(start, start + PAGE_SIZE)

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = (ids) => {
    const allSelected = ids.every((id) => selectedIds.includes(id))
    setSelectedIds((prev) =>
      allSelected ? prev.filter((id) => !ids.includes(id)) : [...new Set([...prev, ...ids])]
    )
  }

  const handleSave = (data) => {
    if (editStudent) {
      setStudents((prev) =>
        prev.map((s) =>
          s.id === editStudent.id
            ? { ...s, ...data, barcode: s.barcode || makeBarcode(data.kelas) }
            : s
        )
      )
      setEditStudent(null)
    } else {
      const id = ++idRef.current
      setStudents((prev) => [
        ...prev,
        { id, ...data, barcode: data.barcode || makeBarcode(data.kelas) },
      ])
      setAddOpen(false)
    }
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    setStudents((prev) => prev.filter((s) => s.id !== deleteTarget.id))
    setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  const handleImport = (rows) => {
    const newOnes = rows.map((r) => ({
      id: ++idRef.current,
      name: r.name,
      nis: r.nis,
      kelas: r.kelas || '-',
      gender: r.gender || 'Laki-laki',
      status: r.status || 'Aktif',
      barcode: r.barcode || makeBarcode(r.kelas),
      avatar: null,
    }))
    setStudents((prev) => [...prev, ...newOnes])
    setImportOpen(false)
    setPage(1)
  }

  const handleDownloadBarcode = () => {
    const chosen = students.filter((s) => selectedIds.includes(s.id))
    if (chosen.length === 0) {
      window.alert('Pilih minimal satu siswa untuk mencetak kartu barcode.')
      return
    }
    downloadBarcodeCards(chosen)
  }

  return (
    <div className="mx-auto max-w-container-max space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy sm:text-3xl">Data Siswa</h1>
          <p className="mt-1 text-sm text-slate-500 sm:text-base">
            Kelola data siswa dan cetak kartu barcode.
          </p>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap sm:gap-3">
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-navy-light"
          >
            <Plus className="h-5 w-5" />
            Tambah Siswa
          </button>
          <button
            type="button"
            onClick={() => setImportOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-surface-border bg-white px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-surface"
          >
            <Upload className="h-5 w-5" />
            Import Excel
          </button>
          <button
            type="button"
            onClick={downloadStudentTemplate}
            className="flex items-center gap-2 rounded-lg border border-surface-border bg-white px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-surface"
          >
            <Download className="h-5 w-5" />
            Download Template Excel
          </button>
          <button
            type="button"
            onClick={handleDownloadBarcode}
            className="flex items-center gap-2 rounded-lg border border-surface-border bg-white px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-surface"
          >
            <QrCode className="h-5 w-5" />
            Download Kartu Barcode
          </button>
        </div>
      </div>

      {/* Table Card */}
      <section className="card overflow-hidden">
        {/* Filters */}
        <div className="flex flex-col gap-3 border-b border-surface-border p-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder="Cari nama, NIS..."
              className="w-full rounded-lg border border-surface-border bg-white py-2 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={kelasFilter}
              onChange={(e) => {
                setKelasFilter(e.target.value)
                setPage(1)
              }}
              className="min-w-[120px] cursor-pointer rounded-lg border border-surface-border bg-white px-3 py-2 text-sm text-slate-700 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            >
              <option value="">Semua Kelas</option>
              <option value="7">Kelas 7</option>
              <option value="8">Kelas 8</option>
              <option value="9">Kelas 9</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setPage(1)
              }}
              className="min-w-[120px] cursor-pointer rounded-lg border border-surface-border bg-white px-3 py-2 text-sm text-slate-700 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            >
              <option value="">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Nonaktif">Nonaktif</option>
            </select>
          </div>
        </div>

        <StudentTable
          students={pageItems}
          selectedIds={selectedIds}
          onToggle={toggleSelect}
          onToggleAll={toggleSelectAll}
          onView={handleView}
          onEdit={setEditStudent}
          onDelete={setDeleteTarget}
        />

        <Pagination
          from={filtered.length === 0 ? 0 : start + 1}
          to={start + pageItems.length}
          total={filtered.length}
          page={safePage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </section>

      {/* Modals */}
      <StudentModal open={addOpen} onClose={() => setAddOpen(false)} onSave={handleSave} />
      <StudentModal
        open={!!editStudent}
        initial={editStudent}
        onClose={() => setEditStudent(null)}
        onSave={handleSave}
      />
      <ImportExcelModal open={importOpen} onClose={() => setImportOpen(false)} onImport={handleImport} />
      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus Siswa"
        message={
          deleteTarget
            ? `Yakin ingin menghapus "${deleteTarget.name}"? Tindakan ini tidak dapat dibatalkan.`
            : ''
        }
        confirmLabel="Hapus"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
