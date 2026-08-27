import { useState, useEffect } from 'react'
import { X, Save, FileText } from 'lucide-react'
import { kelasOptions } from '../../Data/tugasData'

export default function CreateTaskModal({ task, onClose, onSave }) {
  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: '',
    kelas: '',
    tanggal_mulai: '',
    deadline: '',
    status: 'draft',
    file_instruksi: null,
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (task) {
      setFormData({
        judul: task.judul || '',
        deskripsi: task.deskripsi || '',
        kelas: task.kelas || '',
        tanggal_mulai: task.tanggal_mulai || '',
        deadline: task.deadline || '',
        status: task.status || 'draft',
        file_instruksi: task.file_instruksi || null,
      })
    }
  }, [task])

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async (status) => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    onSave?.({ ...formData, status, id: task?.id || Date.now() })
    setIsSaving(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-surface-border bg-white p-4 rounded-t-xl">
          <h3 className="font-semibold text-navy">{task ? 'Edit Tugas' : 'Buat Tugas Baru'}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-surface hover:text-navy transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Judul */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Judul Tugas</label>
            <input
              type="text"
              value={formData.judul}
              onChange={(e) => handleChange('judul', e.target.value)}
              placeholder="Masukkan judul tugas..."
              className="w-full rounded-lg border border-surface-border bg-surface px-4 py-2.5 text-sm focus:border-secondary-fixed focus:outline-none focus:ring-2 focus:ring-secondary-fixed/20"
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Deskripsi Tugas</label>
            <textarea
              value={formData.deskripsi}
              onChange={(e) => handleChange('deskripsi', e.target.value)}
              placeholder="Jelaskan detail tugas..."
              rows={3}
              className="w-full rounded-lg border border-surface-border bg-surface px-4 py-2.5 text-sm focus:border-secondary-fixed focus:outline-none focus:ring-2 focus:ring-secondary-fixed/20 resize-none"
            />
          </div>

          {/* Kelas */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Kelas</label>
            <select
              value={formData.kelas}
              onChange={(e) => handleChange('kelas', e.target.value)}
              className="w-full rounded-lg border border-surface-border bg-surface px-4 py-2.5 text-sm focus:border-secondary-fixed focus:outline-none focus:ring-2 focus:ring-secondary-fixed/20"
            >
              <option value="">Pilih Kelas</option>
              {kelasOptions.filter((k) => k !== 'Semua Kelas').map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>

          {/* Tanggal */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Tanggal Mulai</label>
              <input
                type="date"
                value={formData.tanggal_mulai}
                onChange={(e) => handleChange('tanggal_mulai', e.target.value)}
                className="w-full rounded-lg border border-surface-border bg-surface px-4 py-2.5 text-sm focus:border-secondary-fixed focus:outline-none focus:ring-2 focus:ring-secondary-fixed/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Deadline</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => handleChange('deadline', e.target.value)}
                className="w-full rounded-lg border border-surface-border bg-surface px-4 py-2.5 text-sm focus:border-secondary-fixed focus:outline-none focus:ring-2 focus:ring-secondary-fixed/20"
              />
            </div>
          </div>

          {/* File Instruksi */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">File Instruksi (Opsional)</label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-4 py-2.5 border border-surface-border rounded-lg cursor-pointer hover:bg-surface transition-colors">
                <FileText className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-500">Pilih File</span>
                <input type="file" className="hidden" />
              </label>
              {formData.file_instruksi && (
                <span className="text-sm text-slate-500">{formData.file_instruksi}</span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-surface-border bg-white p-4 rounded-b-xl">
          <button
            type="button"
            onClick={() => handleSave('draft')}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-lg border border-surface-border px-4 py-2.5 text-sm font-semibold text-navy hover:bg-surface transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            Simpan Draft
          </button>
          <button
            type="button"
            onClick={() => handleSave('aktif')}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-light transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Menyimpan...' : 'Publikasikan'}
          </button>
        </div>
      </div>
    </div>
  )
}
