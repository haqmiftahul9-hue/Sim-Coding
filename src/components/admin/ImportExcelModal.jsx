import { useRef, useState } from 'react'
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react'
import Modal from '../common/Modal'
import { parseStudentsFromExcel } from '../../lib/excel'
import StatusBadge from '../common/StatusBadge'

export default function ImportExcelModal({ open, onClose, onImport }) {
  const inputRef = useRef(null)
  const [rows, setRows] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const reset = () => {
    setRows([])
    setError(null)
    setLoading(false)
  }

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    setError(null)
    try {
      const parsed = await parseStudentsFromExcel(file)
      setRows(parsed)
    } catch {
      setError('Gagal membaca file. Pastikan format .xlsx valid.')
      setRows([])
    } finally {
      setLoading(false)
    }
  }

  const validRows = rows.filter((r) => r.name && r.nis)

  const handleImport = () => {
    onImport(validRows)
    reset()
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Import Excel"
      maxWidth="max-w-2xl"
      footer={
        <>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg border border-surface-border bg-white px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-surface"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleImport}
            disabled={validRows.length === 0}
            className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy-light disabled:opacity-50"
          >
            Import {validRows.length} Data
          </button>
        </>
      }
    >
      {rows.length === 0 ? (
        <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-surface-border bg-surface px-6 py-10 text-center transition-colors hover:border-brand">
          <Upload className="h-8 w-8 text-slate-400" />
          <div>
            <p className="text-sm font-semibold text-navy">Pilih file Excel (.xlsx)</p>
            <p className="mt-1 text-xs text-slate-400">
              Kolom: Nama, NIS, Kelas, Jenis Kelamin, Barcode ID, Status
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx, .xls"
            className="hidden"
            onChange={handleFile}
          />
        </label>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-navy">
            <FileSpreadsheet className="h-5 w-5 text-brand-600" />
            Preview ({rows.length} baris)
          </div>
          {error && (
            <p className="flex items-center gap-1 text-xs text-red-500">
              <AlertCircle className="h-4 w-4" /> {error}
            </p>
          )}
          <div className="max-h-72 overflow-y-auto rounded-lg border border-surface-border">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-surface font-label-sm uppercase text-slate-400">
                <tr className="border-b border-surface-border">
                  <th className="p-2">#</th>
                  <th className="p-2">Nama</th>
                  <th className="p-2">NIS</th>
                  <th className="p-2">Kelas</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {rows.map((r, i) => (
                  <tr key={i} className={r.name && r.nis ? '' : 'bg-red-50/50'}>
                    <td className="p-2 text-slate-400">{r._row}</td>
                    <td className="p-2 font-medium text-navy">{r.name || <span className="text-red-400">—</span>}</td>
                    <td className="p-2 text-slate-500">{r.nis || <span className="text-red-400">—</span>}</td>
                    <td className="p-2 text-slate-500">{r.kelas}</td>
                    <td className="p-2">
                      <StatusBadge status={r.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {validRows.length < rows.length && (
            <p className="flex items-center gap-1 text-xs text-red-500">
              <AlertCircle className="h-4 w-4" />
              {rows.length - validRows.length} baris dilewati (Nama/NIS kosong).
            </p>
          )}
        </div>
      )}
      {loading && <p className="text-center text-sm text-slate-400">Membaca file...</p>}
    </Modal>
  )
}
