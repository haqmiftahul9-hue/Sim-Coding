import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { BookOpen, Calendar, ClipboardCheck, Award, Clock, LogIn, LogOut as LogOutIcon, CheckCircle2, AlertCircle, XCircle } from 'lucide-react'
import { attendanceService } from '../../services/attendanceService'
import { submissionService } from '../../services/submissionService'
import { gradingService } from '../../services/gradingService'
import { tasksData } from '../../data/tugasData'

const JAM_MASUK_KBM = '08:00'
const JAM_PULANG_KBM = '15:00'

export default function StudentDashboard() {
  const { currentStudent, currentUser } = useAuth()
  const [todayStatus, setTodayStatus] = useState(null)
  const [presensiList, setPresensiList] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [grades, setGrades] = useState([])

  const studentId = currentStudent?.id
  const studentNama = currentStudent?.nama || currentUser?.nama
  const studentKelas = currentStudent?.kelas || currentUser?.kelas
  const studentInitials = studentNama
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  useEffect(() => {
    if (!studentId) {
      setTodayStatus(null)
      setPresensiList([])
      setSubmissions([])
      setGrades([])
      return undefined
    }
    const refresh = () => {
      setTodayStatus(attendanceService.getTodayStatusByStudentId(studentId))
      setPresensiList(attendanceService.getByStudentId(studentId))
      setSubmissions(submissionService.getByStudentId(studentId))
      setGrades(gradingService.getByStudentId(studentId))
    }
    refresh()
    const unsubA = attendanceService.subscribe(refresh)
    const unsubS = submissionService.subscribe(refresh)
    const unsubG = gradingService.subscribe(refresh)
    return () => {
      unsubA && unsubA()
      unsubS && unsubS()
      unsubG && unsubG()
    }
  }, [studentId])

  const hadirCount = presensiList.filter((p) => p.status === 'Hadir').length
  const totalPresensi = presensiList.length
  const kehadiranPercent = totalPresensi > 0 ? Math.round((hadirCount / totalPresensi) * 100) : 0

  const mySubmissions = submissions
  const tugasSelesai = mySubmissions.filter((s) => s.submitted_at).length
  const totalTugas = tasksData.length

  const publishedAssessments = grades.filter((a) => a.status === 'published')
  const rataRataNilai =
    publishedAssessments.length > 0
      ? Math.round(
          publishedAssessments.reduce((sum, a) => sum + (a.final_score || 0), 0) /
            publishedAssessments.length
        )
      : 0

  const presensiStatus = todayStatus?.status || 'Belum Presensi'
  const presensiColor =
    presensiStatus === 'Hadir'
      ? 'from-emerald-500 to-emerald-600'
      : presensiStatus === 'Terlambat'
      ? 'from-amber-500 to-amber-600'
      : 'from-rose-500 to-rose-600'
  const presensiBgSoft =
    presensiStatus === 'Hadir'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : presensiStatus === 'Terlambat'
      ? 'bg-amber-50 text-amber-700 border-amber-200'
      : 'bg-rose-50 text-rose-700 border-rose-200'
  const PresensiIcon =
    presensiStatus === 'Hadir'
      ? CheckCircle2
      : presensiStatus === 'Terlambat'
      ? AlertCircle
      : XCircle

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

      {/* Presensi Harian */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
        <div className="flex items-center gap-3 mb-5">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${presensiColor} flex items-center justify-center`}>
            <Clock className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Presensi Hari Ini</h3>
            <p className="text-xs text-slate-500">Data diambil dari sistem Presensi Digital Admin</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`rounded-xl border p-4 ${presensiBgSoft}`}>
            <div className="flex items-center gap-2 mb-1">
              <PresensiIcon className="h-4 w-4" />
              <span className="text-xs font-medium opacity-80">Status</span>
            </div>
            <p className="text-lg font-bold">{presensiStatus}</p>
            {todayStatus?.metode && (
              <p className="text-xs opacity-80 mt-0.5">{todayStatus.metode}</p>
            )}
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2 mb-1 text-slate-500">
              <LogIn className="h-4 w-4" />
              <span className="text-xs font-medium">Jam Masuk</span>
            </div>
            <p className="text-lg font-bold text-slate-800">{JAM_MASUK_KBM}</p>
            {todayStatus?.jamMasuk && (
              <p className="text-xs text-emerald-600 mt-0.5">
                Tercatat: {todayStatus.jamMasuk}
              </p>
            )}
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2 mb-1 text-slate-500">
              <LogOutIcon className="h-4 w-4" />
              <span className="text-xs font-medium">Jam Pulang</span>
            </div>
            <p className="text-lg font-bold text-slate-800">{JAM_PULANG_KBM}</p>
            {todayStatus?.jamPulang && todayStatus.jamPulang !== '-' && (
              <p className="text-xs text-slate-600 mt-0.5">
                Tercatat: {todayStatus.jamPulang}
              </p>
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
