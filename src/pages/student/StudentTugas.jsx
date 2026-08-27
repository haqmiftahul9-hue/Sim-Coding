import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { tasksData, submissionsData } from '../../data/tugasData'
import { ClipboardList, Clock, CheckCircle2, AlertCircle, FileText, ExternalLink } from 'lucide-react'

export default function StudentTugas() {
  const { currentStudent } = useAuth()
  const [filter, setFilter] = useState('semua')

  const studentId = currentStudent?.id
  const studentKelas = currentStudent?.kelas

  const mySubmissions = submissionsData.filter((s) => s.student_id === studentId)

  const filteredTasks = tasksData.filter((task) => {
    if (filter === 'selesai') {
      const submission = mySubmissions.find((s) => s.task_id === task.id)
      return submission?.submitted_at
    }
    if (filter === 'belum') {
      const submission = mySubmissions.find((s) => s.task_id === task.id)
      return !submission?.submitted_at
    }
    return true
  })

  const getSubmission = (taskId) => mySubmissions.find((s) => s.task_id === taskId)

  const getStatusBadge = (task) => {
    const submission = getSubmission(task.id)
    if (submission?.submitted_at) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Dikumpulkan
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
        <Clock className="h-3.5 w-3.5" />
        Belum
      </span>
    )
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const totalTugas = tasksData.length
  const tugasSelesai = mySubmissions.filter((s) => s.submitted_at).length

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#00183d] flex items-center gap-3">
          <ClipboardList className="h-7 w-7" />
          Tugas Siswa
        </h1>
        <p className="text-slate-500 mt-1">
          Daftar tugas yang harus dikerjakan
        </p>
      </div>

      {/* Stats */}
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
          <p className="text-2xl font-semibold text-amber-600">{totalTugas - tugasSelesai}</p>
        </div>
      </div>

      {/* Filter */}
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

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => {
          const submission = getSubmission(task.id)
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
                    </div>
                    <h3 className="font-semibold text-slate-800">{task.judul}</h3>
                    <p className="text-sm text-slate-500 mt-1">{task.deskripsi}</p>
                  </div>
                  {getStatusBadge(task)}
                </div>

                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Deadline: {formatDate(task.deadline)}</span>
                  </div>
                </div>

                {submission?.submitted_at && (
                  <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                    <div className="flex items-center gap-2 text-sm text-emerald-700">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Dikumpulkan: {formatDate(submission.submitted_at)}</span>
                    </div>
                    {submission.file && (
                      <div className="flex items-center gap-2 text-sm text-emerald-600 mt-1">
                        <FileText className="h-4 w-4" />
                        <span>{submission.file}</span>
                      </div>
                    )}
                    {submission.link && (
                      <div className="flex items-center gap-2 text-sm text-emerald-600 mt-1">
                        <ExternalLink className="h-4 w-4" />
                        <span>{submission.link}</span>
                      </div>
                    )}
                    {submission.catatan && (
                      <p className="text-sm text-emerald-600 mt-1 italic">"{submission.catatan}"</p>
                    )}
                  </div>
                )}

                {!submission?.submitted_at && (
                  <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-100">
                    <div className="flex items-center gap-2 text-sm text-amber-700">
                      <AlertCircle className="h-4 w-4" />
                      <span>Belum dikumpulkan</span>
                    </div>
                  </div>
                )}
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
    </div>
  )
}
