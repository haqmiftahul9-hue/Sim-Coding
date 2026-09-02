// attendanceService
// Single source of truth untuk data presensi.
// Dipakai oleh:
//   - Student Portal: dashboard, presensi page
//   - Admin Portal: PresensiDigital (Rekap), DetailSiswa, Dashboard
//
// Schema siap Supabase (table: attendance):
//   id, student_id, nama, kelas, tanggal, tanggal_iso,
//   jam_masuk, jam_pulang, metode, lokasi, status, keterangan,
//   created_at
//
// Relasi:
//   attendance.student_id -> students.id

import { presensi as initialPresensi } from '../data/presensi'

const STORAGE_KEY = 'simcoding_attendance'

const VALID_METHODS = ['Barcode', 'Scan Wajah', 'Manual', 'Face Recognition']
const VALID_STATUS = ['Hadir', 'Terlambat', 'Absen']

function todayParts() {
  const now = new Date()
  return {
    day: String(now.getDate()).padStart(2, '0'),
    month: String(now.getMonth() + 1).padStart(2, '0'),
    year: now.getFullYear(),
    hours: String(now.getHours()).padStart(2, '0'),
    minutes: String(now.getMinutes()).padStart(2, '0'),
    seconds: String(now.getSeconds()).padStart(2, '0'),
  }
}

function nowIso() {
  return new Date().toISOString()
}

function getStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch (e) {
    console.error('Error reading attendance from storage:', e)
  }
  return null
}

function setStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('Error saving attendance to storage:', e)
  }
}

function initialize() {
  const stored = getStorage()
  if (stored && Array.isArray(stored) && stored.length > 0) {
    return stored
  }
  setStorage(initialPresensi)
  return [...initialPresensi]
}

let attendanceData = initialize()
const listeners = new Set()

function notify() {
  listeners.forEach((fn) => {
    try {
      fn(attendanceData)
    } catch (e) {
      console.error(e)
    }
  })
}

function nextId() {
  if (!attendanceData.length) return 1
  return Math.max(...attendanceData.map((a) => Number(a.id) || 0)) + 1
}

function determineStatus(jamMasuk) {
  if (!jamMasuk || jamMasuk === '-') return 'Hadir'
  const [h, m] = jamMasuk.split(':').map(Number)
  if (h > 7 || (h === 7 && m > 0)) return 'Terlambat'
  return 'Hadir'
}

export const attendanceService = {
  getAll() {
    return [...attendanceData].sort((a, b) => {
      const ka = `${a.tanggalIso || ''}T${a.jamMasuk || ''}`
      const kb = `${b.tanggalIso || ''}T${b.jamMasuk || ''}`
      return kb.localeCompare(ka)
    })
  },

  getById(id) {
    return attendanceData.find((a) => a.id === id) || null
  },

  getByStudentId(studentId) {
    return attendanceData.filter((a) => a.student_id === studentId)
  },

  getTodayStatusByStudentId(studentId) {
    if (!studentId) return null
    const { year, month, day } = todayParts()
    const todayStr = `${day}/${month}/${year}`
    const todayIso = `${year}-${month}-${day}`
    return (
      attendanceData.find(
        (a) =>
          a.student_id === studentId &&
          (a.tanggalIso === todayIso || a.tanggal === todayStr)
      ) || null
    )
  },

  addAttendance({
    studentId,
    nama,
    kelas,
    tanggal,
    tanggalIso,
    jamMasuk,
    jamPulang = '-',
    metode = 'Manual',
    lokasi = '-',
    status,
    keterangan = '-',
  }) {
    const tp = todayParts()
    const finalTanggal = tanggal || `${tp.day}/${tp.month}/${tp.year}`
    const finalTanggalIso = tanggalIso || `${tp.year}-${tp.month}-${tp.day}`
    const finalJamMasuk = jamMasuk || `${tp.hours}:${tp.minutes}`
    const finalMetode = VALID_METHODS.includes(metode) ? metode : 'Manual'
    const finalStatus = status || determineStatus(finalJamMasuk)

    const entry = {
      id: nextId(),
      student_id: studentId ?? null,
      nama: nama || '-',
      kelas: kelas || '-',
      tanggal: finalTanggal,
      tanggalIso: finalTanggalIso,
      jamMasuk: finalJamMasuk,
      jamPulang,
      metode: finalMetode,
      lokasi: lokasi || '-',
      status: VALID_STATUS.includes(finalStatus) ? finalStatus : 'Hadir',
      keterangan: keterangan || '-',
      created_at: nowIso(),
    }

    attendanceData = [entry, ...attendanceData]
    setStorage(attendanceData)
    notify()
    return entry
  },

  updateAttendance(id, updates) {
    const index = attendanceData.findIndex((a) => a.id === id)
    if (index === -1) return { success: false, message: 'Presensi tidak ditemukan' }
    attendanceData[index] = { ...attendanceData[index], ...updates }
    attendanceData = [...attendanceData]
    setStorage(attendanceData)
    notify()
    return { success: true, data: attendanceData[index] }
  },

  removeById(id) {
    attendanceData = attendanceData.filter((a) => a.id !== id)
    setStorage(attendanceData)
    notify()
  },

  subscribe(fn) {
    listeners.add(fn)
    return () => listeners.delete(fn)
  },

  reset() {
    attendanceData = [...initialPresensi]
    setStorage(attendanceData)
    notify()
  },
}
