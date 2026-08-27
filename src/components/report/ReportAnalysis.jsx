import { UserRound, TrendingUp } from 'lucide-react'

function ProgressBar({ label, value, max = 100, color = 'bg-brand' }) {
  const percentage = Math.min((value / max) * 100, 100)
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-slate-600">{label}</span>
        <span className="text-sm font-semibold text-navy">{value}</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

function getGradeColor(grade) {
  if (grade.startsWith('A')) return 'text-emerald-600'
  if (grade.startsWith('B')) return 'text-blue-600'
  if (grade.startsWith('C')) return 'text-amber-600'
  return 'text-red-600'
}

function getPredikat(grade) {
  const predikatMap = {
    'A': 'Sangat Baik',
    'A-': 'Sangat Baik',
    'B+': 'Baik',
    'B': 'Baik',
    'C+': 'Cukup',
    'C': 'Cukup',
    'D': 'Kurang',
  }
  return predikatMap[grade] || '-'
}

export default function ReportAnalysis({ students, assessments }) {
  const studentsWithData = students.map((student) => {
    const assessment = assessments.find((a) => a.student_id === student.id)
    return { ...student, assessment }
  }).filter((s) => s.assessment)

  return (
    <section className="card overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="h-5 w-5 text-brand" />
          <h3 className="font-display text-lg font-semibold text-navy">Analisis Perkembangan Siswa</h3>
        </div>

        <div className="space-y-6">
          {studentsWithData.map((student) => {
            const a = student.assessment
            return (
              <div key={student.id} className="rounded-xl border border-surface-border bg-surface p-5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-surface-border bg-navy/10 overflow-hidden">
                    {student.avatar ? (
                      <img src={student.avatar} alt={student.name} className="h-full w-full object-cover" />
                    ) : (
                      <UserRound className="h-6 w-6 text-navy" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-navy">{student.name}</p>
                    <p className="text-sm text-slate-500">{student.kelas}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${getGradeColor(a.grade)}`}>{a.final_score}</p>
                    <p className="text-xs text-slate-400">{getPredikat(a.grade)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ProgressBar label="Project" value={a.project_score} color="bg-emerald-500" />
                  <ProgressBar label="Coding Skill" value={a.skill_score} color="bg-blue-500" />
                  <ProgressBar label="Tugas" value={a.assignment_score} color="bg-amber-500" />
                  <ProgressBar label="Kehadiran" value={a.attendance_score} color="bg-purple-500" />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
