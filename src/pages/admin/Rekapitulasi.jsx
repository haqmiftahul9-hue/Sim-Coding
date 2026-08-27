import { useState, useMemo } from 'react'
import {
  Users,
  ClipboardCheck,
  GraduationCap,
  FileSpreadsheet,
  FileText,
  Download,
  TrendingUp,
  TrendingDown,
  Award,
  Calendar,
  Filter,
  Search,
  QrCode,
  ScanFace,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react'
import {
  getRekapPresensi,
  getPresensiDetail,
  getRekapTugas,
  getRekapNilai,
  getRataRataSiswa,
  getDashboardSummary,
  allKelasOptions,
  periodeOptions,
  bulanOptions,
  semesterOptions,
  metodeOptions,
  statusOptions,
} from '../../Data/rekapConnector'

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
  { id: 'presensi', label: 'Presensi', icon: Calendar },
  { id: 'tugas', label: 'Tugas', icon: ClipboardCheck },
  { id: 'nilai', label: 'Nilai', icon: GraduationCap },
]

const statusConfig = {
  Hadir: { color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  Terlambat: { color: 'bg-amber-100 text-amber-700', icon: Clock },
  Sakit: { color: 'bg-blue-100 text-blue-700', icon: AlertCircle },
  Izin: { color: 'bg-purple-100 text-purple-700', icon: AlertCircle },
  Absen: { color: 'bg-red-100 text-red-700', icon: XCircle },
  Alfa: { color: 'bg-red-100 text-red-700', icon: XCircle },
}

const metodeConfig = {
  Barcode: { icon: QrCode, color: 'text-blue-600' },
  'Scan Wajah': { icon: ScanFace, color: 'text-purple-600' },
  'Face Recognition': { icon: ScanFace, color: 'text-purple-600' },
}

export default function Rekapitulasi() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [filterKelas, setFilterKelas] = useState('')
  const [filterPeriode, setFilterPeriode] = useState('bulanan')
  const [filterBulan, setFilterBulan] = useState('')
  const [filterSemester, setFilterSemester] = useState('')
  const [filterMetode, setFilterMetode] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterDateFrom, setFilterDateFrom] = useState('')
  const [filterDateTo, setFilterDateTo] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [toast, setToast] = useState({ visible: false, message: '' })
  const itemsPerPage = 10

  const kelasOpts = useMemo(() => allKelasOptions(), [])

  const dashboardSummary = useMemo(() => getDashboardSummary(filterDateFrom, filterDateTo, filterKelas), [filterDateFrom, filterDateTo, filterKelas])

  const rekapPresensiData = useMemo(() => getRekapPresensi(filterDateFrom, filterDateTo, filterKelas), [filterDateFrom, filterDateTo, filterKelas])

  const presensiDetailData = useMemo(() => {
    const data = getPresensiDetail(filterDateFrom, filterDateTo, filterKelas, filterMetode, filterStatus)
    if (searchQuery) {
      return data.filter((item) => item.nama.toLowerCase().includes(searchQuery.toLowerCase()))
    }
    return data
  }, [filterDateFrom, filterDateTo, filterKelas, filterMetode, filterStatus, searchQuery])

  const rekapTugasData = useMemo(() => getRekapTugas(filterDateFrom, filterDateTo, filterKelas), [filterDateFrom, filterDateTo, filterKelas])

  const rekapNilaiData = useMemo(() => {
    const data = getRekapNilai(filterDateFrom, filterDateTo, filterKelas)
    if (searchQuery) {
      return data.filter((item) => item.nama.toLowerCase().includes(searchQuery.toLowerCase()))
    }
    return data
  }, [filterDateFrom, filterDateTo, filterKelas, searchQuery])

  const rataRataSiswaData = useMemo(() => getRataRataSiswa(filterKelas), [filterKelas])

  const totalPages = Math.ceil(presensiDetailData.length / itemsPerPage)
  const paginatedPresensi = presensiDetailData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const showToast = (message) => {
    setToast({ visible: true, message })
    setTimeout(() => setToast({ visible: false, message: '' }), 3000)
  }

  const handleExportPDF = () => {
    showToast('Export PDF sedang diproses...')
    setTimeout(() => showToast('PDF berhasil diunduh!'), 1500)
  }

  const handleExportExcel = () => {
    showToast('Export Excel sedang diproses...')
    setTimeout(() => showToast('Excel berhasil diunduh!'), 1500)
  }

  const getNilaiColor = (nilai) => {
    if (nilai >= 85) return 'bg-emerald-100 text-emerald-700'
    if (nilai >= 75) return 'bg-blue-100 text-blue-700'
    if (nilai >= 60) return 'bg-amber-100 text-amber-700'
    return 'bg-red-100 text-red-700'
  }

  const getPredikat = (nilai) => {
    if (nilai >= 90) return 'A'
    if (nilai >= 85) return 'A-'
    if (nilai >= 80) return 'B+'
    if (nilai >= 75) return 'B'
    if (nilai >= 70) return 'B-'
    if (nilai >= 65) return 'C+'
    if (nilai >= 60) return 'C'
    return 'D'
  }

  return (
    <div className="mx-auto max-w-container-max space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary font-bold">
            Rekapitulasi Laporan
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Agregasi data dari seluruh modul SimCoding.
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#E2E8F0] text-primary font-label-md text-label-md hover:bg-surface-container-low transition-colors">
            <FileText className="h-4 w-4" />
            Unduh PDF
          </button>
          <button type="button" onClick={handleExportExcel} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#173E7A] text-white font-label-md text-label-md hover:bg-[#0f2d5c] shadow-sm transition-colors">
            <FileSpreadsheet className="h-4 w-4" />
            Ekspor Excel
          </button>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-surface-border">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${isActive ? 'border-[#173E7A] text-primary' : 'border-transparent text-slate-400 hover:text-navy'}`}>
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      <div className="bg-surface-container-lowest p-4 rounded-xl border border-[#F1F5F9] card-shadow">
        <div className="flex items-center gap-2 mb-3 text-on-surface-variant">
          <Filter className="h-5 w-5" />
          <span className="font-label-md text-label-md">Filter Laporan:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <select value={filterKelas} onChange={(e) => setFilterKelas(e.target.value)} className="h-10 py-2 px-3 border border-[#E2E8F0] rounded-lg bg-surface-container-lowest focus:border-[#173E7A] focus:ring-2 focus:ring-[#EFF6FF] font-body-sm text-body-sm outline-none transition-all appearance-none cursor-pointer">
            {kelasOpts.map((k) => (<option key={k} value={k === 'Semua Kelas' ? '' : k}>{k}</option>))}
          </select>
          <select value={filterPeriode} onChange={(e) => setFilterPeriode(e.target.value)} className="h-10 py-2 px-3 border border-[#E2E8F0] rounded-lg bg-surface-container-lowest focus:border-[#173E7A] focus:ring-2 focus:ring-[#EFF6FF] font-body-sm text-body-sm outline-none transition-all appearance-none cursor-pointer">
            {periodeOptions.map((p) => (<option key={p.value} value={p.value}>{p.label}</option>))}
          </select>
          <select value={filterBulan} onChange={(e) => setFilterBulan(e.target.value)} className="h-10 py-2 px-3 border border-[#E2E8F0] rounded-lg bg-surface-container-lowest focus:border-[#173E7A] focus:ring-2 focus:ring-[#EFF6FF] font-body-sm text-body-sm outline-none transition-all appearance-none cursor-pointer">
            {bulanOptions.map((b) => (<option key={b.value} value={b.value}>{b.label}</option>))}
          </select>
          <select value={filterSemester} onChange={(e) => setFilterSemester(e.target.value)} className="h-10 py-2 px-3 border border-[#E2E8F0] rounded-lg bg-surface-container-lowest focus:border-[#173E7A] focus:ring-2 focus:ring-[#EFF6FF] font-body-sm text-body-sm outline-none transition-all appearance-none cursor-pointer">
            {semesterOptions.map((s) => (<option key={s} value={s === 'Semua Semester' ? '' : s}>{s}</option>))}
          </select>
          <input type="date" value={filterDateFrom} onChange={(e) => setFilterDateFrom(e.target.value)} className="h-10 py-2 px-3 border border-[#E2E8F0] rounded-lg bg-surface-container-lowest focus:border-[#173E7A] focus:ring-2 focus:ring-[#EFF6FF] font-body-sm text-body-sm outline-none transition-all" />
          <input type="date" value={filterDateTo} onChange={(e) => setFilterDateTo(e.target.value)} className="h-10 py-2 px-3 border border-[#E2E8F0] rounded-lg bg-surface-container-lowest focus:border-[#173E7A] focus:ring-2 focus:ring-[#EFF6FF] font-body-sm text-body-sm outline-none transition-all" />
          <select value={filterMetode} onChange={(e) => setFilterMetode(e.target.value)} className="h-10 py-2 px-3 border border-[#E2E8F0] rounded-lg bg-surface-container-lowest focus:border-[#173E7A] focus:ring-2 focus:ring-[#EFF6FF] font-body-sm text-body-sm outline-none transition-all appearance-none cursor-pointer">
            {metodeOptions.map((m) => (<option key={m} value={m === 'Semua Metode' ? '' : m}>{m}</option>))}
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="h-10 py-2 px-3 border border-[#E2E8F0] rounded-lg bg-surface-container-lowest focus:border-[#173E7A] focus:ring-2 focus:ring-[#EFF6FF] font-body-sm text-body-sm outline-none transition-all appearance-none cursor-pointer">
            {statusOptions.map((s) => (<option key={s} value={s === 'Semua Status' ? '' : s}>{s}</option>))}
          </select>
        </div>
        <div className="mt-3 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Cari nama siswa..." className="w-full h-10 pl-10 pr-4 border border-[#E2E8F0] rounded-lg bg-surface-container-lowest focus:border-[#173E7A] focus:ring-2 focus:ring-[#EFF6FF] font-body-sm text-body-sm outline-none transition-all" />
        </div>
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-surface-container-lowest rounded-xl border border-[#F1F5F9] card-shadow p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Total Siswa</span>
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center"><Users className="h-5 w-5 text-blue-600" /></div>
              </div>
              <p className="font-headline-md text-headline-md text-primary font-bold">{dashboardSummary.totalSiswa}</p>
            </div>
            <div className="bg-surface-container-lowest rounded-xl border border-[#F1F5F9] card-shadow p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Kehadiran</span>
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center"><TrendingUp className="h-5 w-5 text-emerald-600" /></div>
              </div>
              <p className="font-headline-md text-headline-md text-primary font-bold">{dashboardSummary.rataKehadiran}%</p>
            </div>
            <div className="bg-surface-container-lowest rounded-xl border border-[#F1F5F9] card-shadow p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Total Tugas</span>
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center"><ClipboardCheck className="h-5 w-5 text-amber-600" /></div>
              </div>
              <p className="font-headline-md text-headline-md text-primary font-bold">{dashboardSummary.totalTugas}</p>
            </div>
            <div className="bg-surface-container-lowest rounded-xl border border-[#F1F5F9] card-shadow p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Pengumpulan</span>
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center"><CheckCircle className="h-5 w-5 text-purple-600" /></div>
              </div>
              <p className="font-headline-md text-headline-md text-primary font-bold">{dashboardSummary.progressTugas}%</p>
            </div>
            <div className="bg-surface-container-lowest rounded-xl border border-[#F1F5F9] card-shadow p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Rata-rata Nilai</span>
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center"><Award className="h-5 w-5 text-indigo-600" /></div>
              </div>
              <p className="font-headline-md text-headline-md text-primary font-bold">{dashboardSummary.rataNilai}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-surface-container-lowest rounded-xl border border-[#F1F5F9] card-shadow p-5">
              <h3 className="font-label-md text-label-md text-on-surface mb-4 flex items-center gap-2"><Calendar className="h-4 w-4 text-emerald-600" />Statistik Presensi</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between"><span className="font-body-sm text-body-sm text-outline flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Hadir</span><span className="font-label-md text-label-md text-emerald-600">{dashboardSummary.totalHadir}</span></div>
                <div className="flex items-center justify-between"><span className="font-body-sm text-body-sm text-outline flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500"></span>Terlambat</span><span className="font-label-md text-label-md text-amber-600">{dashboardSummary.totalTerlambat}</span></div>
                <div className="flex items-center justify-between"><span className="font-body-sm text-body-sm text-outline flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500"></span>Sakit</span><span className="font-label-md text-label-md text-blue-600">{dashboardSummary.totalSakit}</span></div>
                <div className="flex items-center justify-between"><span className="font-body-sm text-body-sm text-outline flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500"></span>Izin</span><span className="font-label-md text-label-md text-purple-600">{dashboardSummary.totalIzin}</span></div>
                <div className="flex items-center justify-between"><span className="font-body-sm text-body-sm text-outline flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500"></span>Alfa</span><span className="font-label-md text-label-md text-red-600">{dashboardSummary.totalAlfa}</span></div>
              </div>
            </div>
            <div className="bg-surface-container-lowest rounded-xl border border-[#F1F5F9] card-shadow p-5">
              <h3 className="font-label-md text-label-md text-on-surface mb-4 flex items-center gap-2"><GraduationCap className="h-4 w-4 text-indigo-600" />Statistik Nilai</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between"><span className="font-body-sm text-body-sm text-outline">Rata-rata</span><span className="font-label-md text-label-md text-primary">{dashboardSummary.rataNilai}</span></div>
                <div className="flex items-center justify-between"><span className="font-body-sm text-body-sm text-outline">Tertinggi</span><span className="font-label-md text-label-md text-emerald-600 flex items-center gap-1"><TrendingUp className="h-4 w-4" />{dashboardSummary.nilaiTertinggi}</span></div>
                <div className="flex items-center justify-between"><span className="font-body-sm text-body-sm text-outline">Terendah</span><span className="font-label-md text-label-md text-red-500 flex items-center gap-1"><TrendingDown className="h-4 w-4" />{dashboardSummary.nilaiTerendah}</span></div>
                <div className="flex items-center justify-between"><span className="font-body-sm text-body-sm text-outline">Siswa Dinilai</span><span className="font-label-md text-label-md text-on-surface">{dashboardSummary.siswaDinilai}</span></div>
              </div>
            </div>
            <div className="bg-surface-container-lowest rounded-xl border border-[#F1F5F9] card-shadow p-5">
              <h3 className="font-label-md text-label-md text-on-surface mb-4 flex items-center gap-2"><ClipboardCheck className="h-4 w-4 text-amber-600" />Statistik Tugas</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between"><span className="font-body-sm text-body-sm text-outline">Total Tugas</span><span className="font-label-md text-label-md text-primary">{dashboardSummary.totalTugas}</span></div>
                <div className="flex items-center justify-between"><span className="font-body-sm text-body-sm text-outline">Sudah Submit</span><span className="font-label-md text-label-md text-emerald-600">{dashboardSummary.totalSubmit}</span></div>
                <div className="flex items-center justify-between"><span className="font-body-sm text-body-sm text-outline">Belum Submit</span><span className="font-label-md text-label-md text-red-500">{dashboardSummary.totalHarusSubmit - dashboardSummary.totalSubmit}</span></div>
                <div className="flex items-center justify-between"><span className="font-body-sm text-body-sm text-outline">Progress</span><span className="font-label-md text-label-md text-amber-600">{dashboardSummary.progressTugas}%</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'presensi' && (
        <div className="bg-surface-container-lowest rounded-xl border border-[#F1F5F9] card-shadow overflow-hidden">
          <div className="px-lg py-md border-b border-outline-variant/30 flex items-center justify-between">
            <div><h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Rekap Presensi Siswa</h2><p className="font-body-sm text-body-sm text-outline mt-1">Data kehadiran dari modul Presensi Digital</p></div>
            <span className="font-label-sm text-label-sm text-outline bg-surface-container-low px-3 py-1 rounded-full">{presensiDetailData.length} data</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-surface-container-low">
                <th className="px-4 py-3 text-left font-label-sm text-label-sm text-on-surface-variant">No</th>
                <th className="px-4 py-3 text-left font-label-sm text-label-sm text-on-surface-variant">Nama Siswa</th>
                <th className="px-4 py-3 text-left font-label-sm text-label-sm text-on-surface-variant">Kelas</th>
                <th className="px-4 py-3 text-left font-label-sm text-label-sm text-on-surface-variant">Tanggal</th>
                <th className="px-4 py-3 text-center font-label-sm text-label-sm text-on-surface-variant">Jam Masuk</th>
                <th className="px-4 py-3 text-center font-label-sm text-label-sm text-on-surface-variant">Metode</th>
                <th className="px-4 py-3 text-center font-label-sm text-label-sm text-on-surface-variant">Status</th>
                <th className="px-4 py-3 text-left font-label-sm text-label-sm text-on-surface-variant">Keterangan</th>
              </tr></thead>
              <tbody>
                {paginatedPresensi.length === 0 ? (
                  <tr><td colSpan="8" className="px-4 py-8 text-center font-body-md text-body-md text-outline">Tidak ada data presensi ditemukan.</td></tr>
                ) : paginatedPresensi.map((item, index) => {
                  const statusConf = statusConfig[item.status] || statusConfig['Absen']
                  const metodeConf = metodeConfig[item.metode] || { icon: QrCode, color: 'text-slate-400' }
                  const MetodeIcon = metodeConf.icon
                  return (
                    <tr key={item.id} className="border-t border-surface-border hover:bg-surface-container-low transition-colors">
                      <td className="px-4 py-3 font-body-sm text-body-sm text-on-surface-variant">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-xs">{item.initials}</div><span className="font-body-md text-body-md text-on-surface">{item.nama}</span></div></td>
                      <td className="px-4 py-3 font-body-sm text-body-sm text-on-surface-variant">{item.kelas}</td>
                      <td className="px-4 py-3 font-body-sm text-body-sm text-on-surface-variant">{new Date(item.tanggalIso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td className="px-4 py-3 text-center font-body-sm text-body-sm text-on-surface-variant">{item.jamMasuk}</td>
                      <td className="px-4 py-3 text-center"><span className={`inline-flex items-center gap-1 ${metodeConf.color}`}><MetodeIcon className="h-4 w-4" /><span className="text-xs">{item.metode}</span></span></td>
                      <td className="px-4 py-3 text-center"><span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConf.color}`}><statusConf.icon className="h-3 w-3" />{item.status}</span></td>
                      <td className="px-4 py-3 font-body-sm text-body-sm text-outline">{item.keterangan}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="px-lg py-4 border-t border-surface-border flex items-center justify-between">
              <span className="font-body-sm text-body-sm text-outline">Halaman {currentPage} dari {totalPages}</span>
              <div className="flex gap-2">
                <button type="button" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] text-primary font-label-sm text-label-sm hover:bg-surface-container-low transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Sebelumnya</button>
                <button type="button" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] text-primary font-label-sm text-label-sm hover:bg-surface-container-low transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Selanjutnya</button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'tugas' && (
        <div className="bg-surface-container-lowest rounded-xl border border-[#F1F5F9] card-shadow overflow-hidden">
          <div className="px-lg py-md border-b border-outline-variant/30 flex items-center justify-between">
            <div><h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Rekap Tugas Siswa</h2><p className="font-body-sm text-body-sm text-outline mt-1">Data dari modul Tugas Siswa</p></div>
            <span className="font-label-sm text-label-sm text-outline bg-surface-container-low px-3 py-1 rounded-full">{rekapTugasData.length} tugas</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-surface-container-low">
                <th className="px-4 py-3 text-left font-label-sm text-label-sm text-on-surface-variant">No</th>
                <th className="px-4 py-3 text-left font-label-sm text-label-sm text-on-surface-variant">Nama Tugas</th>
                <th className="px-4 py-3 text-left font-label-sm text-label-sm text-on-surface-variant">Kelas</th>
                <th className="px-4 py-3 text-center font-label-sm text-label-sm text-on-surface-variant">Tanggal Dibuat</th>
                <th className="px-4 py-3 text-center font-label-sm text-label-sm text-on-surface-variant">Deadline</th>
                <th className="px-4 py-3 text-center font-label-sm text-label-sm text-on-surface-variant">Total</th>
                <th className="px-4 py-3 text-center font-label-sm text-label-sm text-on-surface-variant">Sudah</th>
                <th className="px-4 py-3 text-center font-label-sm text-label-sm text-on-surface-variant">Belum</th>
                <th className="px-4 py-3 text-center font-label-sm text-label-sm text-on-surface-variant">Dinilai</th>
                <th className="px-4 py-3 text-center font-label-sm text-label-sm text-on-surface-variant">Progress</th>
              </tr></thead>
              <tbody>
                {rekapTugasData.length === 0 ? (
                  <tr><td colSpan="10" className="px-4 py-8 text-center font-body-md text-body-md text-outline">Tidak ada data tugas ditemukan.</td></tr>
                ) : rekapTugasData.map((item, index) => (
                  <tr key={item.task_id} className="border-t border-surface-border hover:bg-surface-container-low transition-colors">
                    <td className="px-4 py-3 font-body-sm text-body-sm text-on-surface-variant">{index + 1}</td>
                    <td className="px-4 py-3 font-body-md text-body-md text-on-surface">{item.judul}</td>
                    <td className="px-4 py-3 font-body-sm text-body-sm text-on-surface-variant">{item.kelas}</td>
                    <td className="px-4 py-3 text-center font-body-sm text-body-sm text-on-surface-variant">{new Date(item.tanggal_dibuat).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</td>
                    <td className="px-4 py-3 text-center font-body-sm text-body-sm text-on-surface-variant">{new Date(item.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</td>
                    <td className="px-4 py-3 text-center font-body-md text-body-md text-on-surface">{item.total_siswa}</td>
                    <td className="px-4 py-3 text-center"><span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-label-sm text-label-sm">{item.sudah_submit}</span></td>
                    <td className="px-4 py-3 text-center"><span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-700 font-label-sm text-label-sm">{item.belum_submit}</span></td>
                    <td className="px-4 py-3 text-center"><span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-label-sm text-label-sm">{item.sudah_dinilai}</span></td>
                    <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="flex-1 h-2 bg-surface-container-highest rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all ${item.progress >= 80 ? 'bg-emerald-500' : item.progress >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${item.progress}%` }} /></div><span className="font-label-sm text-label-sm text-on-surface-variant w-10 text-right">{item.progress}%</span></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'nilai' && (
        <div className="bg-surface-container-lowest rounded-xl border border-[#F1F5F9] card-shadow overflow-hidden">
          <div className="px-lg py-md border-b border-outline-variant/30 flex items-center justify-between">
            <div><h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Rekap Nilai Siswa</h2><p className="font-body-sm text-body-sm text-outline mt-1">Data dari modul Penilaian</p></div>
            <span className="font-label-sm text-label-sm text-outline bg-surface-container-low px-3 py-1 rounded-full">{rekapNilaiData.length} data</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-surface-container-low">
                <th className="px-4 py-3 text-left font-label-sm text-label-sm text-on-surface-variant">No</th>
                <th className="px-4 py-3 text-left font-label-sm text-label-sm text-on-surface-variant">Nama Siswa</th>
                <th className="px-4 py-3 text-left font-label-sm text-label-sm text-on-surface-variant">Kelas</th>
                <th className="px-4 py-3 text-left font-label-sm text-label-sm text-on-surface-variant">Tugas</th>
                <th className="px-4 py-3 text-center font-label-sm text-label-sm text-on-surface-variant">Tanggal</th>
                <th className="px-4 py-3 text-center font-label-sm text-label-sm text-on-surface-variant">Projek</th>
                <th className="px-4 py-3 text-center font-label-sm text-label-sm text-on-surface-variant">Kemampuan</th>
                <th className="px-4 py-3 text-center font-label-sm text-label-sm text-on-surface-variant">Nilai Akhir</th>
                <th className="px-4 py-3 text-center font-label-sm text-label-sm text-on-surface-variant">Predikat</th>
              </tr></thead>
              <tbody>
                {rekapNilaiData.length === 0 ? (
                  <tr><td colSpan="9" className="px-4 py-8 text-center font-body-md text-body-md text-outline">Tidak ada data nilai ditemukan.</td></tr>
                ) : rekapNilaiData.map((item, index) => (
                  <tr key={item.id} className="border-t border-surface-border hover:bg-surface-container-low transition-colors">
                    <td className="px-4 py-3 font-body-sm text-body-sm text-on-surface-variant">{index + 1}</td>
                    <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-xs">{item.nama.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}</div><span className="font-body-md text-body-md text-on-surface">{item.nama}</span></div></td>
                    <td className="px-4 py-3 font-body-sm text-body-sm text-on-surface-variant">{item.kelas}</td>
                    <td className="px-4 py-3 font-body-sm text-body-sm text-on-surface">{item.judul_tugas}</td>
                    <td className="px-4 py-3 text-center font-body-sm text-body-sm text-on-surface-variant">{item.tanggal_penilaian !== '-' ? new Date(item.tanggal_penilaian).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'}</td>
                    <td className="px-4 py-3 text-center"><span className={`inline-flex items-center justify-center w-12 h-8 rounded font-label-sm text-label-sm ${getNilaiColor(item.nilai_projek)}`}>{item.nilai_projek}</span></td>
                    <td className="px-4 py-3 text-center"><span className={`inline-flex items-center justify-center w-12 h-8 rounded font-label-sm text-label-sm ${getNilaiColor(item.nilai_kemampuan)}`}>{item.nilai_kemampuan}</span></td>
                    <td className="px-4 py-3 text-center"><span className={`inline-flex items-center justify-center w-12 h-8 rounded font-label-md text-label-md ${getNilaiColor(item.nilai_akhir)}`}>{item.nilai_akhir}</span></td>
                    <td className="px-4 py-3 text-center"><span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-label-md text-label-md ${getNilaiColor(item.nilai_akhir)}`}>{getPredikat(item.nilai_akhir)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-lg py-4 border-t border-surface-border bg-surface-container-low">
            <div className="flex flex-wrap gap-6">
              <div><span className="font-label-sm text-label-sm text-outline">Rata-rata Kelas</span><p className="font-headline-sm text-headline-sm text-primary font-bold">{dashboardSummary.rataNilai}</p></div>
              <div><span className="font-label-sm text-label-sm text-outline">Nilai Tertinggi</span><p className="font-headline-sm text-headline-sm text-emerald-600 font-bold">{dashboardSummary.nilaiTertinggi}</p></div>
              <div><span className="font-label-sm text-label-sm text-outline">Nilai Terendah</span><p className="font-headline-sm text-headline-sm text-red-500 font-bold">{dashboardSummary.nilaiTerendah}</p></div>
            </div>
          </div>
        </div>
      )}

      {toast.visible && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
          <div className="flex items-center gap-3 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg">
            <CheckCircle className="h-5 w-5 shrink-0" />
            <span className="font-label-md text-label-md">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  )
}
