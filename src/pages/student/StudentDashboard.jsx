import { useAuth } from '../../context/AuthContext'
import { BookOpen, Calendar, ClipboardCheck, Award } from 'lucide-react'
import { presensiService } from '../../services/presensiService'
import { submissionsData, tasksData } from '../../data/tugasData'
import { assessments } from '../../data/penilaianData'

export default function StudentDashboard() {
  const { currentStudent, currentUser } = useAuth()

  const studentId = currentStudent?.id
  const studentNama = currentStudent?.nama || currentUser?.nama
  const studentKelas = currentStudent?.kelas || currentUser?.kelas
  const studentInitials = studentNama
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const presensiData = studentId ? presensiService.getByStudentId(studentId) : []
  const hadirCount = presensiData.filter((p) => p.status === 'Hadir').length
  const totalPresensi = presensiData.length
  const kehadiranPercent = totalPresensi > 0 ? Math.round((hadirCount / totalPresensi) * 100) : 0

  const mySubmissions = submissionsData.filter((s) => s.student_id === studentId)
  const tugasSelesai = mySubmissions.filter((s) => s.submitted_at !== null).length
  const totalTugas = tasksData.length

  const myAssessments = assessments.filter((a) => a.student_id === studentId)
  const publishedAssessments = myAssessments.filter((a) => a.status === 'published')
  const rataRataNilai =
    publishedAssessments.length > 0
      ? Math.round(
          publishedAssessments.reduce((sum, a) => sum + a.final_score, 0) /
            publishedAssessments.length
        )
      : 0

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Welcome Card with Photo */}
      <div className="bg-gradient-to-r from-[#00183d] to-[#3c5e9b] rounded-2xl p-6 lg:p-8 text-white mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border-2 border-white/30">
            {currentStudent?.foto ? (
              <img
                src={currentStudent.foto}
                alt={studentNama}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl font-semibold text-white">
                {studentInitials}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-1">Selamat Datang, {studentNama}!</h2>
            <p className="text-white/80">
              Kelola tugas, lihat nilai, dan pantau kehadiranmu di sini.
            </p>
            {studentKelas && (
              <p className="text-white/60 text-sm mt-1">Kelas {studentKelas}</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-slate-500">Tugas</span>
          </div>
          <p className="text-2xl font-semibold text-[#00183d]">{totalTugas}</p>
          <p className="text-sm text-slate-500">Total tugas</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
              <ClipboardCheck className="h-5 w-5 text-emerald-600" />
            </div>
            <span className="text-sm font-medium text-slate-500">Dikumpulkan</span>
          </div>
          <p className="text-2xl font-semibold text-[#00183d]">{tugasSelesai}</p>
          <p className="text-sm text-slate-500">Tugas selesai</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
              <Award className="h-5 w-5 text-amber-600" />
            </div>
            <span className="text-sm font-medium text-slate-500">Rata-rata</span>
          </div>
          <p className="text-2xl font-semibold text-[#00183d]">{rataRataNilai}</p>
          <p className="text-sm text-slate-500">Nilai rata-rata</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-slate-500">Kehadiran</span>
          </div>
          <p className="text-2xl font-semibold text-[#00183d]">{kehadiranPercent}%</p>
          <p className="text-sm text-slate-500">Kehadiran</p>
        </div>
      </div>

      {/* Info */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-3">Informasi</h3>
        <p className="text-sm text-slate-500">
          Ini adalah halaman dashboard siswa. Data yang ditampilkan sesuai dengan akun Anda.
          Saat ini Anda dapat melihat ringkasan aktivitas Anda di atas.
        </p>
      </div>
    </div>
  )
}
