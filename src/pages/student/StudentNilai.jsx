import { useAuth } from '../../context/AuthContext'
import { assessments } from '../../data/penilaianData'
import { tasksData } from '../../data/tugasData'
import { Award, TrendingUp, FileText, Star } from 'lucide-react'

export default function StudentNilai() {
  const { currentStudent } = useAuth()

  const studentId = currentStudent?.id

  const myAssessments = assessments.filter((a) => a.student_id === studentId)
  const publishedAssessments = myAssessments.filter((a) => a.status === 'published')

  const rataRataNilai =
    publishedAssessments.length > 0
      ? Math.round(
          publishedAssessments.reduce((sum, a) => sum + a.final_score, 0) /
            publishedAssessments.length
        )
      : 0

  const highestScore = publishedAssessments.length > 0
    ? Math.max(...publishedAssessments.map((a) => a.final_score))
    : 0

  const lowestScore = publishedAssessments.length > 0
    ? Math.min(...publishedAssessments.map((a) => a.final_score))
    : 0

  const getTaskTitle = (taskId) => {
    const task = tasksData.find((t) => t.id === taskId)
    return task?.judul || 'Tugas'
  }

  const getGradeColor = (score) => {
    if (score >= 90) return 'text-emerald-600'
    if (score >= 80) return 'text-blue-600'
    if (score >= 70) return 'text-amber-600'
    return 'text-red-600'
  }

  const getGradeBg = (score) => {
    if (score >= 90) return 'bg-emerald-50 border-emerald-200'
    if (score >= 80) return 'bg-blue-50 border-blue-200'
    if (score >= 70) return 'bg-amber-50 border-amber-200'
    return 'bg-red-50 border-red-200'
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#00183d] flex items-center gap-3">
          <Award className="h-7 w-7" />
          Nilai Siswa
        </h1>
        <p className="text-slate-500 mt-1">
          Hasil penilaian tugas yang telah dikerjakan
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-slate-500">Rata-rata</p>
          <p className="text-2xl font-semibold text-[#00183d]">{rataRataNilai}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
              <Star className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
          <p className="text-sm text-slate-500">Tertinggi</p>
          <p className="text-2xl font-semibold text-emerald-600">{highestScore}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-amber-600" />
            </div>
          </div>
          <p className="text-sm text-slate-500">Terendah</p>
          <p className="text-2xl font-semibold text-amber-600">{lowestScore}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-slate-500">Total Tugas</p>
          <p className="text-2xl font-semibold text-[#00183d]">{publishedAssessments.length}</p>
        </div>
      </div>

      {/* Grade List */}
      <div className="space-y-4">
        {publishedAssessments.map((assessment) => (
          <div
            key={assessment.id}
            className={`bg-white rounded-xl border shadow-sm overflow-hidden ${getGradeBg(assessment.final_score)}`}
          >
            <div className="p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-semibold text-slate-800">
                    {getTaskTitle(assessment.task_id)}
                  </h3>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Status: {assessment.status === 'published' ? 'Dinilai' : 'Menunggu'}
                  </p>
                </div>
                <div className={`text-3xl font-bold ${getGradeColor(assessment.final_score)}`}>
                  {assessment.final_score}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="bg-white/60 rounded-lg p-3">
                  <p className="text-xs text-slate-500">Design</p>
                  <p className="font-semibold text-slate-700">{assessment.design_score}</p>
                </div>
                <div className="bg-white/60 rounded-lg p-3">
                  <p className="text-xs text-slate-500">Logic</p>
                  <p className="font-semibold text-slate-700">{assessment.logic_score}</p>
                </div>
                <div className="bg-white/60 rounded-lg p-3">
                  <p className="text-xs text-slate-500">Creativity</p>
                  <p className="font-semibold text-slate-700">{assessment.creativity_score}</p>
                </div>
                <div className="bg-white/60 rounded-lg p-3">
                  <p className="text-xs text-slate-500">Concept</p>
                  <p className="font-semibold text-slate-700">{assessment.concept_score}</p>
                </div>
                <div className="bg-white/60 rounded-lg p-3">
                  <p className="text-xs text-slate-500">Problem</p>
                  <p className="font-semibold text-slate-700">{assessment.problem_score}</p>
                </div>
              </div>

              {assessment.teacher_note && (
                <div className="mt-4 p-3 bg-white/60 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Catatan Guru:</p>
                  <p className="text-sm text-slate-700 italic">"{assessment.teacher_note}"</p>
                </div>
              )}
            </div>
          </div>
        ))}

        {publishedAssessments.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
            <Award className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">Belum ada nilai yang dipublikasikan</p>
          </div>
        )}
      </div>
    </div>
  )
}
