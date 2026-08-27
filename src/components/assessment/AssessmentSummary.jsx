import { Star, TrendingUp, Award } from 'lucide-react'

function getPredikat(score) {
  if (score >= 85) return { label: 'Sangat Baik', color: 'text-emerald-600', bg: 'bg-emerald-50' }
  if (score >= 70) return { label: 'Baik', color: 'text-blue-600', bg: 'bg-blue-50' }
  if (score >= 60) return { label: 'Cukup', color: 'text-amber-600', bg: 'bg-amber-50' }
  return { label: 'Perlu Bimbingan', color: 'text-red-500', bg: 'bg-red-50' }
}

export default function AssessmentSummary({ students, tasks, assessments }) {
  // Hitung rata-rata per siswa
  const studentAverages = students.map((student) => {
    const studentAssessments = assessments.filter(
      (a) => a.student_id === student.id && a.status === 'published'
    )

    const taskScores = tasks.map((task) => {
      const assessment = studentAssessments.find((a) => a.task_id === task.id)
      return {
        task_id: task.id,
        judul: task.judul_tugas,
        score: assessment?.final_score || null,
      }
    })

    const validScores = taskScores.filter((t) => t.score !== null)
    const average =
      validScores.length > 0
        ? Math.round(validScores.reduce((sum, t) => sum + t.score, 0) / validScores.length)
        : null

    return {
      ...student,
      taskScores,
      average,
      gradedCount: validScores.length,
    }
  })

  // Urutkan berdasarkan rata-rata
  const sortedStudents = [...studentAverages].sort((a, b) => (b.average || 0) - (a.average || 0))

  return (
    <section className="card overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="h-5 w-5 text-brand" />
          <h3 className="font-display text-lg font-semibold text-navy">Rekap Nilai Siswa</h3>
        </div>

        <div className="space-y-4">
          {sortedStudents.map((student, index) => {
            const predikat = student.average !== null ? getPredikat(student.average) : null

            return (
              <div
                key={student.id}
                className="rounded-xl border border-surface-border bg-surface p-4"
              >
                <div className="flex items-center gap-4 mb-3">
                  {/* Ranking */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0
                        ? 'bg-amber-100 text-amber-700'
                        : index === 1
                        ? 'bg-slate-200 text-slate-600'
                        : index === 2
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-surface-container text-slate-500'
                    }`}
                  >
                    {index + 1}
                  </div>

                  {/* Name */}
                  <div className="flex-1">
                    <p className="font-semibold text-navy">{student.name}</p>
                    <p className="text-xs text-slate-400">
                      {student.gradedCount}/{tasks.length} tugas dinilai
                    </p>
                  </div>

                  {/* Average */}
                  <div className="text-right">
                    {student.average !== null ? (
                      <>
                        <p className="text-2xl font-bold text-navy">{student.average}</p>
                        {predikat && (
                          <span className={`text-xs font-medium ${predikat.color}`}>
                            {predikat.label}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-sm text-slate-400">Belum ada nilai</span>
                    )}
                  </div>
                </div>

                {/* Task Scores */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {student.taskScores.map((task) => (
                    <div
                      key={task.task_id}
                      className={`rounded-lg p-2 text-center ${
                        task.score !== null ? 'bg-surface-container-low' : 'bg-slate-50'
                      }`}
                    >
                      <p className="text-xs text-slate-400 truncate">{task.judul}</p>
                      <p className={`text-lg font-bold ${task.score !== null ? 'text-navy' : 'text-slate-300'}`}>
                        {task.score !== null ? task.score : '-'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
