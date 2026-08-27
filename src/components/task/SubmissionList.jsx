import { useState } from 'react'
import { X, UserRound, FileDown, Link, Clock, CheckCircle, AlertCircle } from 'lucide-react'

export default function SubmissionList({ task, students, submissions, assessments, onClose }) {
  const [search, setSearch] = useState('')

  const taskSubmissions = submissions.filter((s) => s.task_id === task?.id)
  const submittedStudents = students.filter((s) => taskSubmissions.some((sub) => sub.student_id === s.id && sub.file))
  const notSubmittedStudents = students.filter((s) => !taskSubmissions.some((sub) => sub.student_id === s.id && sub.file))

  const filteredSubmitted = submittedStudents.filter((s) =>
    s.nama.toLowerCase().includes(search.toLowerCase())
  )

  const getSubmission = (studentId) => taskSubmissions.find((s) => s.student_id === studentId)
  const isGraded = (studentId) => assessments.some((a) => a.task_id === task?.id && a.student_id === studentId && a.status === 'published')

  if (!task) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-surface-border p-4">
          <div>
            <h3 className="font-semibold text-navy">Pengumpulan Tugas</h3>
            <p className="text-sm text-slate-500">{task.judul}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-surface hover:text-navy transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-surface-border">
          <input
            type="text"
            placeholder="Cari siswa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface px-4 py-2 text-sm focus:border-secondary-fixed focus:outline-none focus:ring-2 focus:ring-secondary-fixed/20"
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Submitted */}
          <div className="mb-6">
            <h4 className="font-label-md text-label-md text-on-surface-variant mb-3 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              Sudah Mengumpulkan ({filteredSubmitted.length})
            </h4>
            <div className="space-y-3">
              {filteredSubmitted.length === 0 ? (
                <p className="text-sm text-slate-400 py-4 text-center">Belum ada pengumpulan</p>
              ) : (
                filteredSubmitted.map((student) => {
                  const submission = getSubmission(student.id)
                  const graded = isGraded(student.id)

                  return (
                    <div
                      key={student.id}
                      className="rounded-xl border border-surface-border bg-surface p-4"
                    >
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-sm shrink-0">
                          {student.initials}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <p className="font-medium text-navy">{student.nama}</p>
                            <span
                              className={`text-xs font-medium px-2 py-1 rounded-full ${
                                graded
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-amber-100 text-amber-700'
                              }`}
                            >
                              {graded ? 'Sudah Dinilai' : 'Belum Dinilai'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mb-2">{student.kelas}</p>

                          {/* File & Link */}
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            {submission?.file && (
                              <span className="flex items-center gap-1 text-xs text-slate-500 bg-surface-container-low px-2 py-1 rounded">
                                <FileDown className="h-3 w-3" />
                                {submission.file}
                              </span>
                            )}
                            {submission?.link && (
                              <a
                                href={`https://${submission.link}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs text-secondary hover:underline"
                              >
                                <Link className="h-3 w-3" />
                                {submission.link}
                              </a>
                            )}
                          </div>

                          {/* Note */}
                          {submission?.note && (
                            <p className="text-xs text-slate-500 italic bg-surface-container-low p-2 rounded">
                              "{submission.note}"
                            </p>
                          )}

                          {/* Time */}
                          {submission?.submitted_at && (
                            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {submission.submitted_at}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Not Submitted */}
          {notSubmittedStudents.length > 0 && (
            <div>
              <h4 className="font-label-md text-label-md text-on-surface-variant mb-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-error" />
                Belum Mengumpulkan ({notSubmittedStudents.length})
              </h4>
              <div className="space-y-2">
                {notSubmittedStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-low"
                  >
                    <div className="w-8 h-8 rounded-full bg-error-container text-on-error-container flex items-center justify-center font-bold text-xs">
                      {student.initials}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-navy">{student.nama}</p>
                      <p className="text-xs text-slate-400">{student.kelas}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
