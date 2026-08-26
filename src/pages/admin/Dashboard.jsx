import { adminProfile, stats } from '../../data/dummyData'
import StatisticCard from '../../components/dashboard/StatisticCard'
import ChartCard from '../../components/dashboard/ChartCard'
import LineChart from '../../components/dashboard/LineChart'
import BarChart from '../../components/dashboard/BarChart'
import QuickAction from '../../components/dashboard/QuickAction'
import ActivityList from '../../components/dashboard/ActivityList'

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-container-max space-y-6">
      {/* Hero */}
      <section>
        <h1 className="font-display text-2xl font-bold text-navy sm:text-3xl">
          Selamat Datang, {adminProfile.name}
        </h1>
        <p className="mt-1 text-sm text-slate-500 sm:text-base">
          Berikut ringkasan aktivitas hari ini.
        </p>
      </section>

      {/* Statistic Cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatisticCard key={stat.id} stat={stat} />
        ))}
      </section>

      {/* Charts & Quick Actions */}
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <ChartCard title="Tren Kehadiran Mingguan" className="xl:col-span-2">
          <LineChart />
        </ChartCard>
        <QuickAction />
      </section>

      {/* Activity & Submissions */}
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
