import { useState } from 'react'
import { Search, UserRound, CheckCircle, Clock, Upload, AlertCircle, FileDown, Link } from 'lucide-react'

const statusConfig = {
  published: { label: 'Dinilai', color: 'bg-emerald-500', textColor: 'text-emerald-700', icon: CheckCircle },
  submitted: { label: 'Terkumpul', color: 'bg-blue-500', textColor: 'text-blue-700', icon: Upload },
  not_submitted: { label: 'Belum', color: 'bg-red-500', textColor: 'text-red-700', icon: AlertCircle },
}

export default function StudentSubmissionList({
  task,
  students,
  submissions,
  assessments,
  selectedStudentId,
  onSelectStudent,
}) {
  const [search, setSearch] = useState('')

  const taskSubmissions = submissions.filter((s) => s.task_id === task?.id)

  const getStudentStatus = (studentId) => {
    const submission = taskSubmissions.find((s) => s.student_id === studentId)
    const assessment = assessments.find((a) => a.task_id === task?.id && a.student_id === studentId)

    if (assessment?.status === 'published') return 'published'
    if (submission?.file) return 'submitted'
    return 'not_submitted'
  }

  const getStudentScore = (studentId) => {
    const assessment = assessments.find((a) => a.task_id === task?.id && a.student_id === studentId)
    return assessment?.final_score || null
  }

  const filteredStudents = students.filter((s) =>
    s.nama.toLowerCase().includes(search.toLowerCase())
  )

  if (!task) {
    return (
      <div className="bg-surface rounded-xl shadow-level-1 border border-[#F1F5F9] p-6 h-full">
        <div className="flex flex-col items-center justify-center h-full text-center py-12">
          <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4">
            <ClipboardList className="h-8 w-8 text-outline" />
          </div>
          <p className="text-on-surface-variant">Pilih tugas untuk melihat daftar siswa</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface rounded-xl shadow-level-1 border border-[#F1F5F9] flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-outline-variant bg-surface-container-lowest">
        <h3 className="font-headline-sm text-headline-sm text-primary truncate">{task.judul_tugas}</h3>
        <p className="font-label-sm text-label-sm text-outline mt-0.5">{task.kelas}</p>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-outline-variant">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
          <input
            type="text"
            placeholder="Cari siswa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-2 pl-10 pr-3 text-body-sm font-body-sm focus:border-secondary-fixed focus:ring-0 input-glow"
          />
        </div>
      </div>

      {/* Student List */}
      <div className="overflow-y-auto flex-1 p-2 space-y-1">
        {filteredStudents.map((student) => {
          const status = getStudentStatus(student.id)
          const config = statusConfig[status]
          const score = getStudentScore(student.id)
          const submission = taskSubmissions.find((s) => s.student_id === student.id)
          const isSelected = selectedStudentId === student.id
          const Icon = config.icon

          return (
            <button
              key={student.id}
              type="button"
              onClick={() => onSelectStudent(student)}
              className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors ${
                isSelected
                  ? 'bg-primary-fixed-dim/10 border-l-2 border-secondary'
                  : 'hover:bg-surface-container-low'
              } ${status === 'not_submitted' ? 'opacity-60' : ''}`}
            >
              {/* Avatar */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-label-sm shrink-0 ${
                  isSelected
                    ? 'bg-secondary-container text-on-secondary-container'
                    : 'bg-surface-container-highest text-on-surface'
                }`}
              >
                {student.initials}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p
                  className={`font-label-md text-label-md truncate ${
                    isSelected ? 'text-primary font-bold' : 'text-on-surface'
                  }`}
                >
                  {student.nama}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`flex items-center gap-1 text-xs ${config.textColor}`}>
                    <Icon className="h-3 w-3" />
                    {config.label}
                  </span>
                </div>
              </div>

              {/* Score or Arrow */}
              {score !== null ? (
                <div className="text-right">
                  <span className="font-bold text-primary">{score}</span>
                </div>
              ) : (
                isSelected && <span className="material-symbols-outlined text-outline">chevron_right</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ClipboardList(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11h4" />
      <path d="M12 16h4" />
      <path d="M8 11h.01" />
      <path d="M8 16h.01" />
    </svg>
  )
}
