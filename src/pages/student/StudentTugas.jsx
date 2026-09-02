import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { tasksData } from '../../data/tugasData'
import { submissionService } from '../../services/submissionService'
import { gradingService } from '../../services/gradingService'
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Upload,
  X,
  File,
  Image as ImageIcon,
  Pencil,
  Save,
  Award,
} from 'lucide-react'

const ACCEPTED_EXTENSIONS = [
  '.pdf',
  '.doc',
  '.docx',
  '.ppt',
  '.pptx',
  '.xls',
  '.xlsx',
  '.jpg',
  '.jpeg',
  '.png',
  '.zip',
  '.rar',
  '.txt',
  '.sb3',
  '.py',
  '.js',
  '.html',
  '.css',
]

const ACCEPTED_MIME =
  '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.zip,.rar,.txt,.sb3,.py,.js,.html,.css'

const MAX_FILE_SIZE = 25 * 1024 * 1024 // 25MB

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function formatBytes(bytes) {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getFileIcon(name) {
  if (!name) return File
  const lower = name.toLowerCase()
  if (lower.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) return ImageIcon
  return FileText
}

function UploadModal({ task, studentId, studentName, existing, onClose, onSaved }) {
  const [file, setFile] = useState(null)
  const [note, setNote] = useState(existing?.note || '')
  const [link, setLink] = useState(existing?.link || '')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef(null)

  const handleFile = async (selected) => {
    setError('')
    if (!selected) return

    if (selected.size > MAX_FILE_SIZE) {
      setError(`Ukuran file terlalu besar. Maksimal 25 MB.`)
      return
    }

    const lower = selected.name.toLowerCase()
    const allowed = ACCEPTED_EXTENSIONS.some((ext) => lower.endsWith(ext))
    if (!allowed) {
      setError('Tipe file tidak didukung.')
      return
    }

    try {
      const dataUrl = await readFileAsDataUrl(selected)
      setFile({
        name: selected.name,
        size: selected.size,
        type: selected.type,
        dataUrl,
      })
    } catch (e) {
      setError('Gagal membaca file.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!file && !link.trim()) {
      setError('Pilih file atau isi tautan (link) tugas.')
      return
    }

    setSaving(true)
    try {
      const result = submissionService.upsertSubmission({
        studentId,
        studentName,
        taskId: task.id,
        fileName: file?.name || existing?.file || null,
        fileSize: file?.size || existing?.file_size || null,
        fileType: file?.type || existing?.file_type || null,
        fileDataUrl: file?.dataUrl || existing?.file_data_url || null,
        note: note.trim(),
        link: link.trim(),
      })
      if (result.success) {
        onSaved(result.submission)
        onClose()
      } else {
        setError('Gagal menyimpan pengumpulan.')
      }
    } catch (err) {
      setError('Terjadi kesalahan saat menyimpan.')
    } finally {
      setSaving(false)
    }
  }

  const FileIcon = getFileIcon(file?.name || existing?.file)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg bg-white shadow-2xl rounded-xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
          <div>
            <h3 className="font-semibold text-slate-900">
              {existing?.submitted_at ? 'Ganti File Tugas' : 'Upload Tugas'}
            </h3>
            <p className="text-xs text-slate-500">{task.judul}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-100 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
              <span className="text-sm text-red-600">{error}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              File Tugas
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault()
                e.currentTarget.classList.add('border-[#00183d]', 'bg-blue-50/40')
              }}
              onDragLeave={(e) => {
                e.currentTarget.classList.remove('border-[#00183d]', 'bg-blue-50/40')
              }}
              onDrop={(e) => {
                e.preventDefault()
                e.currentTarget.classList.remove('border-[#00183d]', 'bg-blue-50/40')
                const dropped = e.dataTransfer.files?.[0]
                if (dropped) handleFile(dropped)
              }}
              className="cursor-pointer border-2 border-dashed border-slate-200 rounded-xl p-5 text-center hover:border-[#00183d] transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_MIME}
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
              <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-700">
                Klik atau seret file ke sini
              </p>
              <p className="text-xs text-slate-500 mt-1">
                PDF, DOC/DOCX, PPT, XLS/XLSX, JPG/PNG, ZIP, dan file umum lainnya (maks 25 MB)
              </p>
            </div>

            {(file || existing?.file) && (
              <div className="mt-3 flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                  <FileIcon className="h-5 w-5 text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">
                    {file?.name || existing?.file}
                  </p>
                  <p className="text-xs text-slate-500">
                    {file ? formatBytes(file.size) : existing?.file_size ? formatBytes(existing.file_size) : 'File tersimpan'}
                    {existing && !file ? ' (file sebelumnya)' : ''}
                  </p>
                </div>
                {file && (
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Tautan (opsional)
            </label>
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Contoh: github.com/user/project"
              className="block w-full px-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#00183d]/20 focus:border-[#00183d] focus:bg-white transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Catatan (opsional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Tambahkan catatan untuk guru..."
              className="block w-full px-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#00183d]/20 focus:border-[#00183d] focus:bg-white transition-all text-sm resize-none"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#00183d] text-white hover:bg-[#0F2D5C] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Mengirim...' : 'Kirim Tugas'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function StudentTugas() {
  const { currentStudent, currentUser } = useAuth()
  const [filter, setFilter] = useState('semua')
  const [submissions, setSubmissions] = useState(() => submissionService.getAll())
  const [grades, setGrades] = useState(() => gradingService.getAll())
  const [openTask, setOpenTask] = useState(null)
  const [toast, setToast] = useState({ visible: false, message: '' })

  useEffect(() => {
    const unsub = submissionService.subscribe((next) => setSubmissions([...next]))
    const unsubG = gradingService.subscribe((next) => setGrades([...next]))
    return () => {
      unsub && unsub()
      unsubG && unsubG()
    }
  }, [])

  const studentId = currentStudent?.id
  const studentName = currentStudent?.nama || currentUser?.nama
  const studentKelas = currentStudent?.kelas || currentUser?.kelas

  const mySubmissions = submissions.filter((s) => s.student_id === studentId)

  const filteredTasks = tasksData.filter((task) => {
    const submission = mySubmissions.find((s) => s.task_id === task.id)
    if (filter === 'selesai') return !!submission?.submitted_at
    if (filter === 'belum') return !submission?.submitted_at
    return true
  })

  const getSubmission = (taskId) => mySubmissions.find((s) => s.task_id === taskId)

  const isOverdue = (deadline) => {
    if (!deadline) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return new Date(deadline) < today
  }

  const showToast = (message) => {
    setToast({ visible: true, message })
    setTimeout(() => setToast({ visible: false, message: '' }), 3000)
  }

  const handleSaved = (submission) => {
    if (submission?.status) {
      showToast('Tugas berhasil dikumpulkan. Status: Menunggu Penilaian')
    } else {
      showToast('Tugas berhasil diperbarui')
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    if (Number.isNaN(date.getTime())) return dateStr
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const totalTugas = tasksData.length
  const tugasSelesai = mySubmissions.filter((s) => s.submitted_at).length

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#00183d] flex items-center gap-3">
          <ClipboardList className="h-7 w-7" />
          Tugas Saya
        </h1>
        <p className="text-slate-500 mt-1">
          Kerjakan dan kumpulkan tugas tepat waktu
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-sm text-slate-500">Total Tugas</p>
          <p className="text-2xl font-semibold text-[#00183d]">{totalTugas}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-sm text-slate-500">Dikumpulkan</p>
          <p className="text-2xl font-semibold text-emerald-600">{tugasSelesai}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-sm text-slate-500">Belum Selesai</p>
          <p className="text-2xl font-semibold text-amber-600">
            {totalTugas - tugasSelesai}
          </p>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('semua')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'semua'
              ? 'bg-[#00183d] text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Semua
        </button>
        <button
          onClick={() => setFilter('selesai')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'selesai'
              ? 'bg-[#00183d] text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Dikumpulkan
        </button>
        <button
          onClick={() => setFilter('belum')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'belum'
              ? 'bg-[#00183d] text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Belum
        </button>
      </div>

      <div className="space-y-4">
        {filteredTasks.map((task) => {
          const submission = getSubmission(task.id)
          const grade = grades.find((g) => g.task_id === task.id && g.student_id === studentId)
          const overdue = isOverdue(task.deadline)
          const FileIcon = getFileIcon(submission?.file)
          const isPublished = grade && grade.status === 'published'

          return (
            <div
              key={task.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="h-4 w-4 text-slate-400" />
                      <span className="text-xs text-slate-500">{task.kelas}</span>
                      {overdue && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-700 font-medium">
                          Lewat deadline
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-slate-800">{task.judul}</h3>
                    <p className="text-sm text-slate-500 mt-1">{task.deskripsi}</p>
                  </div>
                  {isPublished ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 whitespace-nowrap">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Sudah Dinilai
                    </span>
                  ) : submission?.submitted_at ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 whitespace-nowrap">
                      <Clock className="h-3.5 w-3.5" />
                      Menunggu Penilaian
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 whitespace-nowrap">
                      <Clock className="h-3.5 w-3.5" />
                      Belum
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Deadline: {formatDate(task.deadline)}</span>
                  </div>
                </div>

                {isPublished && (
                  <div className="mb-4 p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                        <Award className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs text-emerald-700">Nilai dari Guru</p>
                        <p className="text-2xl font-bold text-emerald-700">
                          {grade.final_score}
                          <span className="text-sm text-emerald-600">/100</span>
                        </p>
                      </div>
                    </div>
                    {grade.teacher_note && (
                      <p className="text-sm text-emerald-700 italic">"{grade.teacher_note}"</p>
                    )}
                  </div>
                )}

                {submission?.submitted_at && (
                  <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                    <div className="flex items-center gap-2 text-sm text-emerald-700 mb-2">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Dikumpulkan: {formatDate(submission.submitted_at)}</span>
                    </div>
                    {submission.file && (
                      <div className="flex items-center gap-2 text-sm text-emerald-700">
                        <FileIcon className="h-4 w-4" />
                        <span className="truncate">{submission.file}</span>
                      </div>
                    )}
                    {submission.link && (
                      <div className="flex items-center gap-2 text-sm text-emerald-700 mt-1">
                        <span>🔗 {submission.link}</span>
                      </div>
                    )}
                    {submission.note && (
                      <p className="text-sm text-emerald-700 mt-1 italic">
                        "{submission.note}"
                      </p>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setOpenTask(task)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      submission?.submitted_at
                        ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                        : 'bg-[#00183d] text-white hover:bg-[#0F2D5C]'
                    }`}
                  >
                    {submission?.submitted_at ? (
                      <>
                        <Pencil className="h-4 w-4" />
                        Ganti File
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        Upload Tugas
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
        {filteredTasks.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
            <ClipboardList className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">Tidak ada tugas</p>
          </div>
        )}
      </div>

      {openTask && (
        <UploadModal
          task={openTask}
          studentId={studentId}
          studentName={studentName}
          existing={getSubmission(openTask.id)}
          onClose={() => setOpenTask(null)}
          onSaved={handleSaved}
        />
      )}

      {toast.visible && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg text-sm flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          {toast.message}
        </div>
      )}
    </div>
  )
}
