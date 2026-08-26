import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ChevronRight,
  LayoutDashboard,
  Fingerprint,
  ClipboardList,
  GraduationCap,
  FileText,
  Pencil,
  User,
  Hash,
  School,
  Users,
  Calendar,
  Phone,
  Download,
} from 'lucide-react'
import { students } from '../../data/students'
import { studentDetail } from '../../data/studentDetail'
import StatusBadge from '../../components/common/StatusBadge'
import OverviewStat from '../../components/admin/OverviewStat'
import { downloadRaporPdf } from '../../lib/raporPdf'

const tabs = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'presensi', label: 'Riwayat Presensi', icon: Fingerprint },
  { id: 'tugas', label: 'Daftar Tugas', icon: ClipboardList },
  { id: 'penilaian', label: 'Penilaian', icon: GraduationCap },
  { id: 'rapor', label: 'Rapor', icon: FileText },
]

const presensiBadge = {
  Hadir: 'bg-emerald-50 text-emerald-700',
  Izin: 'bg-blue-50 text-blue-700',
  Sakit: 'bg-amber-50 text-amber-700',
}

const tugasBadge = {
  Selesai: 'bg-emerald-50 text-emerald-700',
  Menunggu: 'bg-amber-50 text-amber-700',
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface text-navy">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
        <p className="text-sm font-semibold text-navy">{value}</p>
      </div>
    </div>
  )
}

function Badge({ text, className }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}>
      {text}
    </span>
  )
}

export default function DetailSiswa() {
  const { id } = useParams()
  const base = students.find((s) => s.id === Number(id))
  const student = {
    ...studentDetail,
    ...(base
      ? { name: base.name, nis: base.nis, kelas: base.kelas, status: base.status, avatar: base.avatar }
      : {}),
  }

  const [active, setActive] = useState('overview')
  const [presensiFilter, setPresensiFilter] = useState('minggu')

  const presensiList =
    presensiFilter === 'semua'
      ? student.presensi
      : student.presensi.filter((p) => p.period === presensiFilter)

  return (
    <div className="mx-auto max-w-container-max space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-slate-400">
        <Link to="/admin/students" className="transition-colors hover:text-navy">
          Data Siswa
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-navy">Detail Siswa</span>
      </nav>

      {/* Header Siswa */}
      <section className="card flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-5">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-surface-border bg-navy/10">
            {student.avatar ? (
              <img src={student.avatar} alt={student.name} className="h-full w-full object-cover" />
            ) : (
              <span className="font-display text-2xl font-bold text-navy">
                {student.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-navy">{student.name}</h2>
            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-500">
              <span>NIS: {student.nis}</span>
              <span>Kelas: {student.kelas}</span>
            </div>
            <div className="mt-3">
              <StatusBadge status={student.status} />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-light"
          >
            <Pencil className="h-5 w-5" />
            Edit Data Siswa
          </button>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-surface-border">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = active === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActive(tab.id)}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
                isActive
                  ? 'border-brand text-navy'
                  : 'border-transparent text-slate-400 hover:text-navy'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* OVERVIEW */}
      {active === 'overview' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="card p-6">
            <h3 className="mb-2 font-display text-lg font-semibold text-navy">Informasi Siswa</h3>
            <div className="divide-y divide-surface-border">
              <InfoRow icon={User} label="Nama Lengkap" value={student.name} />
              <InfoRow icon={Hash} label="NIS" value={student.nis} />
              <InfoRow icon={School} label="Kelas" value={student.kelas} />
              <InfoRow icon={Users} label="Jenis Kelamin" value={student.jenisKelamin} />
              <InfoRow icon={Calendar} label="Tanggal Lahir" value={student.tanggalLahir} />
              <InfoRow icon={Phone} label="Nomor HP" value={student.phone} />
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="mb-3 font-display text-lg font-semibold text-navy">Ringkasan</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <OverviewStat label="Total Kehadiran" value={student.ringkasan.totalKehadiran} accent="emerald" />
              <OverviewStat label="Tugas Selesai" value={student.ringkasan.tugasSelesai} accent="navy" />
              <OverviewStat label="Rata-rata Nilai" value={student.ringkasan.rataRataNilai} accent="brand" />
            </div>
          </div>
        </div>
      )}

      {/* RIWAYAT PRESENSI */}
      {active === 'presensi' && (
        <section className="card overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-surface-border p-4 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="font-display text-lg font-semibold text-navy">Riwayat Presensi</h3>
            <select
              value={presensiFilter}
              onChange={(e) => setPresensiFilter(e.target.value)}
              className="min-w-[140px] cursor-pointer rounded-lg border border-surface-border bg-white px-3 py-2 text-sm text-slate-700 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            >
              <option value="minggu">Minggu Ini</option>
              <option value="bulan">Bulan Ini</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="border-b border-surface-border bg-surface font-label-sm text-label-sm uppercase tracking-wider text-slate-400">
                  <th className="p-4 font-medium">Tanggal</th>
                  <th className="p-4 font-medium">Jam Masuk</th>
                  <th className="p-4 font-medium">Jam Pulang</th>
                  <th className="p-4 font-medium">Metode</th>
                  <th className="p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border font-body-sm text-slate-600">
                {presensiList.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-brand-50/40">
                    <td className="p-4 font-semibold text-navy">{p.tanggal}</td>
                    <td className="p-4 text-slate-500">{p.masuk}</td>
                    <td className="p-4 text-slate-500">{p.pulang}</td>
                    <td className="p-4 text-slate-500">{p.metode}</td>
                    <td className="p-4">
                      <Badge text={p.status} className={presensiBadge[p.status] ?? 'bg-slate-100 text-slate-500'} />
                    </td>
                  </tr>
                ))}
                {presensiList.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-sm text-slate-400">
                      Tidak ada data presensi pada periode ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* DAFTAR TUGAS */}
      {active === 'tugas' && (
        <section className="card overflow-hidden">
          <div className="border-b border-surface-border p-6">
            <h3 className="font-display text-lg font-semibold text-navy">Daftar Tugas</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="border-b border-surface-border bg-surface font-label-sm text-label-sm uppercase tracking-wider text-slate-400">
                  <th className="p-4 font-medium">Nama Tugas</th>
                  <th className="p-4 font-medium">Tanggal Diberikan</th>
                  <th className="p-4 font-medium">Deadline</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Nilai</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border font-body-sm text-slate-600">
                {student.tugas.map((t) => (
                  <tr key={t.id} className="transition-colors hover:bg-brand-50/40">
                    <td className="p-4 font-semibold text-navy">{t.nama}</td>
                    <td className="p-4 text-slate-500">{t.diberikan}</td>
                    <td className="p-4 text-slate-500">{t.deadline}</td>
                    <td className="p-4">
                      <Badge text={t.status} className={tugasBadge[t.status] ?? 'bg-slate-100 text-slate-500'} />
                    </td>
                    <td className="p-4 font-semibold text-navy">{t.nilai}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* PENILAIAN */}
      {active === 'penilaian' && (
        <div className="space-y-6">
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <OverviewStat label="Nilai Project" value={student.penilaian.nilaiProject} accent="navy" />
            <OverviewStat label="Nilai Kemampuan" value={student.penilaian.nilaiKemampuan} accent="brand" />
            <OverviewStat label="Nilai Akhir" value={student.penilaian.nilaiAkhir} accent="emerald" />
          </section>
          <section className="card overflow-hidden">
            <div className="border-b border-surface-border p-6">
              <h3 className="font-display text-lg font-semibold text-navy">Riwayat Penilaian</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-surface-border bg-surface font-label-sm text-label-sm uppercase tracking-wider text-slate-400">
                    <th className="p-4 font-medium">Nama Tugas</th>
                    <th className="p-4 font-medium">Nilai</th>
                    <th className="p-4 font-medium">Komentar Guru</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border font-body-sm text-slate-600">
                  {student.riwayatPenilaian.map((r) => (
                    <tr key={r.id} className="transition-colors hover:bg-brand-50/40">
                      <td className="p-4 font-semibold text-navy">{r.tugas}</td>
                      <td className="p-4 font-semibold text-navy">{r.nilai}</td>
                      <td className="p-4 text-slate-500">{r.komentar}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* RAPOR */}
      {active === 'rapor' && (
        <section className="card p-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="font-display text-lg font-semibold text-navy">Rapor Siswa</h3>
            <button
              type="button"
              onClick={() => downloadRaporPdf(student)}
              className="flex items-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-light"
            >
              <Download className="h-5 w-5" />
              Download PDF
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 border-b border-surface-border pb-6 md:grid-cols-2">
            <div className="space-y-2 text-sm">
              <p className="text-slate-400">
                Nama: <span className="font-semibold text-navy">{student.name}</span>
              </p>
              <p className="text-slate-400">
                NIS: <span className="font-semibold text-navy">{student.nis}</span>
              </p>
              <p className="text-slate-400">
                Kelas: <span className="font-semibold text-navy">{student.kelas}</span>
              </p>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-slate-400">
                Semester: <span className="font-semibold text-navy">{student.rapor.semester}</span>
              </p>
              <p className="text-slate-400">
                Nilai Akhir Coding:{' '}
                <span className="font-semibold text-navy">{student.rapor.nilaiAkhirCoding}</span>
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-6">
            <div>
              <h4 className="mb-1 text-sm font-semibold text-navy">Deskripsi Perkembangan Siswa</h4>
              <p className="text-sm leading-relaxed text-slate-600">{student.rapor.deskripsi}</p>
            </div>
            <div className="pt-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Tanda Tangan Guru</p>
              <div className="mt-2 h-12 w-48 border-b border-dashed border-slate-300" />
              <p className="mt-1 text-sm font-semibold text-navy">{student.rapor.guru}</p>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
