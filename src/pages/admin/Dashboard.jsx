import { useEffect, useState } from 'react'
import { adminProfile, stats } from '../../data/dummyData'
import { attendanceService } from '../../services/attendanceService'
import { submissionService } from '../../services/submissionService'
import { gradingService } from '../../services/gradingService'
import { studentService } from '../../services/studentService'
import StatisticCard from '../../components/dashboard/StatisticCard'
import ChartCard from '../../components/dashboard/ChartCard'
import LineChart from '../../components/dashboard/LineChart'
import BarChart from '../../components/dashboard/BarChart'
import QuickAction from '../../components/dashboard/QuickAction'
import ActivityList from '../../components/dashboard/ActivityList'
import { CheckCircle2, FileUp, Users, ClipboardList } from 'lucide-react'

function todayIso() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function Dashboard() {
  const [today, setToday] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [grades, setGrades] = useState([])

  useEffect(() => {
    const refresh = () => {
      const iso = todayIso()
      setToday(attendanceService.getAll().filter((a) => a.tanggalIso === iso))
      setSubmissions(submissionService.getAll())
      setGrades(gradingService.getAll())
    }
    refresh()
    const u1 = attendanceService.subscribe(refresh)
    const u2 = submissionService.subscribe(refresh)
    const u3 = gradingService.subscribe(refresh)
    return () => {
      u1 && u1()
      u2 && u2()
      u3 && u3()
    }
  }, [])

  const totalStudents = studentService.getAll().length
  const hadir = today.filter((a) => a.status === 'Hadir').length
  const terlambat = today.filter((a) => a.status === 'Terlambat').length
  const submitted = submissions.filter((s) => s.submitted_at).length
  const graded = grades.filter((g) => g.status === 'published').length

  const liveStats = [
    { id: 's1', label: 'Siswa Hadir Hari Ini', value: `${hadir}/${totalStudents}`, icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600' },
    { id: 's2', label: 'Terlambat', value: terlambat, icon: Users, color: 'bg-amber-50 text-amber-600' },
    { id: 's3', label: 'Tugas Dikumpulkan', value: submitted, icon: FileUp, color: 'bg-blue-50 text-blue-600' },
    { id: 's4', label: 'Sudah Dinilai', value: graded, icon: ClipboardList, color: 'bg-purple-50 text-purple-600' },
  ]

  return (
    <div className="mx-auto max-w-container-max space-y-6">
      <section>
        <h1 className="font-display text-2xl font-bold text-navy sm:text-3xl">
          Selamat Datang, {adminProfile.name}
        </h1>
        <p className="mt-1 text-sm text-slate-500 sm:text-base">
          Berikut ringkasan aktivitas hari ini.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {liveStats.map((stat) => (
          <div key={stat.id} className="card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-slate-500">{stat.label}</span>
            </div>
            <p className="text-2xl font-semibold text-navy">{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatisticCard key={stat.id} stat={stat} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <ChartCard title="Tren Kehadiran Mingguan" className="xl:col-span-2">
          <LineChart />
        </ChartCard>
        <QuickAction />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ActivityList />
        <ChartCard
          title="Statistik Pengumpulan Tugas"
          action={
            <select className="cursor-pointer border-none bg-transparent text-xs font-medium text-slate-400 focus:outline-none">
              <option>Minggu Ini</option>
              <option>Bulan Ini</option>
            </select>
          }
        >
          <p className="mb-4 text-sm text-slate-500">
            Persentase siswa yang telah mengumpulkan tugas per modul.
          </p>
          <BarChart />
        </ChartCard>
      </section>
    </div>
  )
}
