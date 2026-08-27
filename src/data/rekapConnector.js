// Data Connector untuk halaman Rekapitulasi
// Menggabungkan data dari seluruh modul: students, presensi, tugas, penilaian
// Struktur siap untuk integrasi Supabase

import { students } from './students'
import { presensi } from './presensi'
import { tasksData, submissionsData, studentsData } from './tugasData'
import { tasks as tasksPenilaian, studentsPenilaian, submissions, assessments } from './penilaianData'

// ============ HELPER FUNCTIONS ============

const getStudentName = (studentId) => {
  const student = studentsData.find((s) => s.id === studentId)
  if (student) return student.nama
  const studentPenilaian = studentsPenilaian.find((s) => s.id === studentId)
  if (studentPenilaian) return studentPenilaian.nama
  const studentMain = students.find((s) => s.id === studentId)
  return studentMain?.name || 'Unknown'
}

const getStudentKelas = (studentId) => {
  const student = studentsData.find((s) => s.id === studentId)
  if (student) return student.kelas
  const studentPenilaian = studentsPenilaian.find((s) => s.id === studentId)
  if (studentPenilaian) return studentPenilaian.kelas
  const studentMain = students.find((s) => s.id === studentId)
  return studentMain?.kelas || 'Unknown'
}

const getInitials = (nama) => {
  return nama.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
}

// ============ REKAP PRESENSI ============

export const getRekapPresensi = (filterDateFrom = '', filterDateTo = '', filterKelas = '') => {
  let filteredData = [...presensi]

  if (filterDateFrom) {
    filteredData = filteredData.filter((p) => p.tanggalIso >= filterDateFrom)
  }
  if (filterDateTo) {
    filteredData = filteredData.filter((p) => p.tanggalIso <= filterDateTo)
  }
  if (filterKelas) {
    filteredData = filteredData.filter((p) => p.kelas === filterKelas)
  }

  const rekapMap = new Map()

  filteredData.forEach((item) => {
    const key = `${item.nama}-${item.kelas}`
    if (!rekapMap.has(key)) {
      rekapMap.set(key, {
        nama: item.nama,
        kelas: item.kelas,
        hadir: 0,
        terlambat: 0,
        izin: 0,
        sakit: 0,
        alfa: 0,
        total: 0,
      })
    }
    const rekap = rekapMap.get(key)
    rekap.total++

    switch (item.status) {
      case 'Hadir':
        rekap.hadir++
        break
      case 'Terlambat':
        rekap.terlambat++
        break
      case 'Izin':
        rekap.izin++
        break
      case 'Sakit':
        rekap.sakit++
        break
      case 'Absen':
        rekap.alfa++
        break
      default:
        rekap.alfa++
    }
  })

  return Array.from(rekapMap.values()).map((item) => ({
    ...item,
    persentase: item.total > 0 ? Math.round(((item.hadir + item.terlambat) / item.total) * 100) : 0,
  }))
}

export const getPresensiDetail = (filterDateFrom = '', filterDateTo = '', filterKelas = '', filterMetode = '', filterStatus = '') => {
  let filteredData = [...presensi]

  if (filterDateFrom) {
    filteredData = filteredData.filter((p) => p.tanggalIso >= filterDateFrom)
  }
  if (filterDateTo) {
    filteredData = filteredData.filter((p) => p.tanggalIso <= filterDateTo)
  }
  if (filterKelas) {
    filteredData = filteredData.filter((p) => p.kelas === filterKelas)
  }
  if (filterMetode) {
    filteredData = filteredData.filter((p) => p.metode === filterMetode)
  }
  if (filterStatus) {
    filteredData = filteredData.filter((p) => p.status === filterStatus)
  }

  return filteredData.map((item) => ({
    ...item,
    initials: getInitials(item.nama),
  }))
}

// ============ REKAP TUGAS ============

export const getRekapTugas = (filterDateFrom = '', filterDateTo = '', filterKelas = '') => {
  let filteredTugas = [...tasksData]

  if (filterDateFrom) {
    filteredTugas = filteredTugas.filter((t) => t.tanggal_mulai >= filterDateFrom)
  }
  if (filterDateTo) {
    filteredTugas = filteredTugas.filter((t) => t.deadline <= filterDateTo)
  }
  if (filterKelas) {
    filteredTugas = filteredTugas.filter((t) => t.kelas === filterKelas || t.kelas === 'Semua Kelas')
  }

  return filteredTugas.map((tugas) => {
    const tugasSubmissions = submissionsData.filter((s) => s.task_id === tugas.id)
    const sudahSubmit = tugasSubmissions.filter((s) => s.file !== null).length
    const belumSubmit = tugasSubmissions.filter((s) => s.file === null).length

    const sudahDinilai = assessments.filter((a) => a.task_id === tugas.id && a.status === 'published').length

    return {
      task_id: tugas.id,
      judul: tugas.judul,
      kelas: tugas.kelas,
      tanggal_dibuat: tugas.tanggal_mulai,
      deadline: tugas.deadline,
      status: tugas.status,
      total_siswa: tugasSubmissions.length,
      sudah_submit: sudahSubmit,
      belum_submit: belumSubmit,
      sudah_dinilai: sudahDinilai,
      progress: tugasSubmissions.length > 0 ? Math.round((sudahSubmit / tugasSubmissions.length) * 100) : 0,
    }
  })
}

// ============ REKAP NILAI ============

export const getRekapNilai = (filterDateFrom = '', filterDateTo = '', filterKelas = '') => {
  let filteredAssessments = [...assessments]

  if (filterKelas) {
    filteredAssessments = filteredAssessments.filter((a) => {
      const studentKelas = getStudentKelas(a.student_id)
      return studentKelas === filterKelas
    })
  }

  return filteredAssessments.map((item) => {
    const nama = getStudentName(item.student_id)
    const kelas = getStudentKelas(item.student_id)
    const tugas = tasksPenilaian.find((t) => t.id === item.task_id)
    const submission = submissions.find((s) => s.id === item.submission_id)

    return {
      id: item.id,
      student_id: item.student_id,
      nama,
      kelas,
      task_id: item.task_id,
      judul_tugas: tugas?.judul_tugas || 'Unknown',
      tanggal_penilaian: submission?.submitted_at || '-',
      design: item.design_score,
      logika: item.logic_score,
      kreativitas: item.creativity_score,
      pemahaman_konsep: item.concept_score,
      problem_solving: item.problem_score,
      nilai_projek: item.project_score,
      nilai_kemampuan: item.skill_score,
      nilai_akhir: item.final_score,
      status: item.status,
      catatan: item.teacher_note,
    }
  })
}

export const getRataRataSiswa = (filterKelas = '') => {
  let filteredAssessments = assessments.filter((a) => a.status === 'published')

  if (filterKelas) {
    filteredAssessments = filteredAssessments.filter((a) => {
      const studentKelas = getStudentKelas(a.student_id)
      return studentKelas === filterKelas
    })
  }

  const siswaMap = new Map()

  filteredAssessments.forEach((item) => {
    if (!siswaMap.has(item.student_id)) {
      siswaMap.set(item.student_id, {
        student_id: item.student_id,
        nama: getStudentName(item.student_id),
        kelas: getStudentKelas(item.student_id),
        totalNilai: 0,
        jumlahTugas: 0,
        nilaiTertinggi: 0,
        nilaiTerendah: 100,
      })
    }
    const siswa = siswaMap.get(item.student_id)
    siswa.totalNilai += item.final_score
    siswa.jumlahTugas++
    siswa.nilaiTertinggi = Math.max(siswa.nilaiTertinggi, item.final_score)
    siswa.nilaiTerendah = Math.min(siswa.nilaiTerendah, item.final_score)
  })

  return Array.from(siswaMap.values()).map((item) => ({
    ...item,
    rata_rata: item.jumlahTugas > 0 ? Math.round(item.totalNilai / item.jumlahTugas) : 0,
  }))
}

// ============ DASHBOARD SUMMARY ============

export const getDashboardSummary = (filterDateFrom = '', filterDateTo = '', filterKelas = '') => {
  const rekapPresensiData = getRekapPresensi(filterDateFrom, filterDateTo, filterKelas)
  const rekapTugasData = getRekapTugas(filterDateFrom, filterDateTo, filterKelas)
  const rekapNilaiData = getRekapNilai(filterDateFrom, filterDateTo, filterKelas)

  const totalSiswa = filterKelas
    ? students.filter((s) => s.kelas === filterKelas).length || studentsData.filter((s) => s.kelas === filterKelas).length
    : students.length || studentsData.length

  const totalHadir = rekapPresensiData.reduce((sum, s) => sum + s.hadir, 0)
  const totalTerlambat = rekapPresensiData.reduce((sum, s) => sum + s.terlambat, 0)
  const totalRecords = rekapPresensiData.reduce((sum, s) => sum + s.total, 0)
  const rataKehadiran = totalRecords > 0 ? Math.round(((totalHadir + totalTerlambat) / totalRecords) * 100) : 0

  const totalTugas = rekapTugasData.length
  const totalSubmit = rekapTugasData.reduce((sum, t) => sum + t.sudah_submit, 0)
  const totalHarusSubmit = rekapTugasData.reduce((sum, t) => sum + t.total_siswa, 0)
  const progressTugas = totalHarusSubmit > 0 ? Math.round((totalSubmit / totalHarusSubmit) * 100) : 0

  const nilaiList = rekapNilaiData.filter((n) => n.nilai_akhir > 0)
  const rataNilai = nilaiList.length > 0
    ? Math.round(nilaiList.reduce((sum, n) => sum + n.nilai_akhir, 0) / nilaiList.length)
    : 0
  const nilaiTertinggi = nilaiList.length > 0 ? Math.max(...nilaiList.map((n) => n.nilai_akhir)) : 0
  const nilaiTerendah = nilaiList.length > 0 ? Math.min(...nilaiList.map((n) => n.nilai_akhir)) : 0

  return {
    totalSiswa,
    rataKehadiran,
    totalTugas,
    progressTugas,
    rataNilai,
    nilaiTertinggi,
    nilaiTerendah,
    totalHadir,
    totalTerlambat,
    totalSakit: rekapPresensiData.reduce((sum, s) => sum + s.sakit, 0),
    totalIzin: rekapPresensiData.reduce((sum, s) => sum + s.izin, 0),
    totalAlfa: rekapPresensiData.reduce((sum, s) => sum + s.alfa, 0),
    totalSubmit,
    totalHarusSubmit,
    siswaDinilai: nilaiList.length,
  }
}

// ============ FILTER OPTIONS ============

export const allKelasOptions = () => {
  const kelasSet = new Set()
  students.forEach((s) => kelasSet.add(s.kelas))
  studentsData.forEach((s) => kelasSet.add(s.kelas))
  studentsPenilaian.forEach((s) => kelasSet.add(s.kelas))
  presensi.forEach((p) => kelasSet.add(p.kelas))
  tasksData.forEach((t) => kelasSet.add(t.kelas))
  return ['Semua Kelas', ...Array.from(kelasSet).filter((k) => k !== 'Semua Kelas').sort()]
}

export const periodeOptions = [
  { value: 'harian', label: 'Harian' },
  { value: 'mingguan', label: 'Mingguan' },
  { value: 'bulanan', label: 'Bulanan' },
  { value: 'semester', label: 'Semester' },
  { value: 'tahunan', label: 'Tahunan' },
]

export const bulanOptions = [
  { value: '', label: 'Semua Bulan' },
  { value: '01', label: 'Januari' },
  { value: '02', label: 'Februari' },
  { value: '03', label: 'Maret' },
  { value: '04', label: 'April' },
  { value: '05', label: 'Mei' },
  { value: '06', label: 'Juni' },
  { value: '07', label: 'Juli' },
  { value: '08', label: 'Agustus' },
  { value: '09', label: 'September' },
  { value: '10', label: 'Oktober' },
  { value: '11', label: 'November' },
  { value: '12', label: 'Desember' },
]

export const semesterOptions = ['Semua Semester', 'Semester 1', 'Semester 2']
export const metodeOptions = ['Semua Metode', 'Barcode', 'Scan Wajah', 'Face Recognition']
export const statusOptions = ['Semua Status', 'Hadir', 'Terlambat', 'Sakit', 'Izin', 'Absen']
