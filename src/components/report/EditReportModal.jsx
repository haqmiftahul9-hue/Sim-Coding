import { useState } from 'react'
import { Edit3, X, Save, Loader2 } from 'lucide-react'

export default function EditReportModal({ student, assessment, reportDetail, projects, onClose, onSave }) {
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    teacher_note: reportDetail?.teacher_note || '',
    custom_description: reportDetail?.custom_description || '',
    selected_projects: reportDetail?.selected_projects || [],
  })

  const studentProjects = projects.filter((p) => p.student_id === student.id)

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleProject = (projectId) => {
    setFormData((prev) => ({
      ...prev,
      selected_projects: prev.selected_projects.includes(projectId)
        ? prev.selected_projects.filter((id) => id !== projectId)
        : [...prev.selected_projects, projectId],
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onSave?.(student.id, formData)
    setIsSaving(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-surface-border bg-white p-4 rounded-t-xl">
          <div>
            <h3 className="font-semibold text-navy">Edit Rapor</h3>
            <p className="text-sm text-slate-500">{student.name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-surface hover:text-navy transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Student Info (Read-only) */}
          <div className="rounded-xl bg-surface p-4">
            <h4 className="text-sm font-semibold text-navy mb-3">Data Siswa</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-400">Nama:</span>
                <span className="ml-2 text-navy font-medium">{student.name}</span>
              </div>
              <div>
                <span className="text-slate-400">NIS:</span>
                <span className="ml-2 text-navy font-medium">{student.nis}</span>
              </div>
              <div>
                <span className="text-slate-400">Kelas:</span>
                <span className="ml-2 text-navy font-medium">{student.kelas}</span>
              </div>
              <div>
                <span className="text-slate-400">Nilai Akhir:</span>
                <span className="ml-2 text-navy font-medium">{assessment?.final_score || '-'}</span>
              </div>
            </div>
          </div>

          {/* Teacher Note */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Catatan Fasilitator</label>
            <textarea
              value={formData.teacher_note}
              onChange={(e) => handleChange('teacher_note', e.target.value)}
              rows={4}
              placeholder="Tambahkan catatan tentang perkembangan siswa..."
              className="w-full rounded-lg border border-surface-border bg-surface px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 resize-none"
            />
          </div>

          {/* Custom Description */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Deskripsi Perkembangan Siswa</label>
            <textarea
              value={formData.custom_description}
              onChange={(e) => handleChange('custom_description', e.target.value)}
              rows={3}
              placeholder="Deskripsikan perkembangan siswa secara singkat..."
              className="w-full rounded-lg border border-surface-border bg-surface px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 resize-none"
            />
          </div>

          {/* Project Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Project yang Ditampilkan</label>
            <div className="space-y-2">
              {studentProjects.length === 0 ? (
                <p className="text-sm text-slate-400">Tidak ada project untuk siswa ini</p>
              ) : (
                studentProjects.map((project) => (
                  <label
                    key={project.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      formData.selected_projects.includes(project.id)
                        ? 'border-brand bg-brand/5'
                        : 'border-surface-border hover:bg-surface'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.selected_projects.includes(project.id)}
                      onChange={() => toggleProject(project.id)}
                      className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-navy">{project.nama}</p>
                      <p className="text-xs text-slate-400">{project.deskripsi}</p>
                    </div>
                    <span className="text-sm font-semibold text-navy">{project.score}</span>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Suggestion */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Saran Pengembangan</label>
            <textarea
              value={formData.suggestion || ''}
              onChange={(e) => handleChange('suggestion', e.target.value)}
              rows={3}
              placeholder="Tambahkan saran untuk pengembangan siswa..."
              className="w-full rounded-lg border border-surface-border bg-surface px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-surface-border bg-white p-4 rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 rounded-lg border border-surface-border px-4 py-2.5 text-sm font-semibold text-navy hover:bg-surface transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Simpan
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
