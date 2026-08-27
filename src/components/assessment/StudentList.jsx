import { useState } from 'react'
import { Search, CheckCircle, Clock, Upload, AlertCircle } from 'lucide-react'

const statusConfig = {
  graded: { label: 'Dinilai', color: 'bg-secondary', textColor: 'text-on-secondary-fixed', icon: CheckCircle },
  submitted: { label: 'Terkumpul', color: 'bg-blue-500', textColor: 'text-white', icon: Upload },
  not_submitted: { label: 'Belum', color: 'bg-error', textColor: 'text-white', icon: AlertCircle },
}

export default function StudentList({ students, submissions, assessments, selectedStudentId, onSelectStudent }) {
  const [search, setSearch] = useState('')

  const getStudentStatus = (studentId) => {
    const submission = submissions.find((s) => s.student_id === studentId)
    const assessment = assessments.find((a) => a.student_id === studentId)

    if (assessment?.status === 'published') return 'graded'
    if (submission?.status === 'submitted') return 'submitted'
    return 'not_submitted'
  }

  const getStudentScore = (studentId) => {
    const assessment = assessments.find((a) => a.student_id === studentId)
    return assessment?.final_score || null
  }

  const filteredStudents = students.filter((s) =>
    s.nama.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="bg-surface rounded-xl shadow-level-1 border border-[#F1F5F9] flex flex-col h-full overflow-hidden">
      {/* Search */}
      <div className="p-4 border-b border-outline-variant bg-surface-container-lowest">
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
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-label-sm ${
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
                <p className="font-label-sm text-label-sm text-outline flex items-center gap-1 mt-0.5">
                  <span className={`w-2 h-2 rounded-full ${config.color}`} />
                  {config.label}
                </p>
              </div>

              {/* Score or Arrow */}
              {score !== null && score > 0 ? (
                <span className="font-label-md text-label-md text-primary opacity-50 group-hover:opacity-100">
                  {score}
                </span>
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
