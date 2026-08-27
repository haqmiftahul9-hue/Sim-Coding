import { presensi as initialPresensi } from '../data/presensi'
import { students } from '../services/studentService'

const STORAGE_KEY = 'simcoding_presensi'

function getPresensiStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.error('Error reading presensi from storage:', e)
  }
  return null
}

function setPresensiStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('Error saving presensi to storage:', e)
  }
}

function initializePresensi() {
  const stored = getPresensiStorage()
  if (stored) {
    return stored
  }
  setPresensiStorage(initialPresensi)
  return initialPresensi
}

let presensiData = initializePresensi()
let listeners = []

function notifyListeners() {
  listeners.forEach((fn) => fn(presensiData))
}

export const presensiService = {
  getAll() {
    return [...presensiData]
  },

  getByStudentName(nama) {
    return presensiData.filter((p) => p.nama === nama)
  },

  getByStudentId(studentId) {
    const student = students.find((s) => s.id === studentId)
    if (!student) return []
    return presensiData.filter((p) => p.nama === student.nama)
  },

  getTodayStatusByStudentId(studentId) {
    const student = students.find((s) => s.id === studentId)
    if (!student) return null
    return this.getTodayStatus(student.nama)
  },

  getTodayStatus(nama) {
    const today = new Date()
    const day = String(today.getDate()).padStart(2, '0')
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const year = today.getFullYear()
    const todayStr = `${day}/${month}/${year}`
    const todayIso = `${year}-${month}-${day}`

    const todayRecords = presensiData.filter(
      (p) => p.nama === nama && (p.tanggal === todayStr || p.tanggalIso === todayIso)
    )
    return todayRecords.length > 0 ? todayRecords[0] : null
  },

  addAttendance(entry) {
    const today = new Date()
    const day = String(today.getDate()).padStart(2, '0')
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const year = today.getFullYear()
    const hours = String(today.getHours()).padStart(2, '0')
    const minutes = String(today.getMinutes()).padStart(2, '0')

    const tanggal = `${day}/${month}/${year}`
    const tanggalIso = `${year}-${month}-${day}`
    const jamMasuk = `${hours}:${minutes}`

    const status =
      today.getHours() > 7 || (today.getHours() === 7 && today.getMinutes() > 0)
        ? 'Terlambat'
        : 'Hadir'

    const newEntry = {
      id: Math.max(...presensiData.map((p) => p.id), 0) + 1,
      nama: entry.nama,
      kelas: entry.kelas,
      tanggal,
      tanggalIso,
      jamMasuk,
      jamPulang: '-',
      metode: entry.metode || 'Scan Wajah',
      status,
      keterangan: entry.keterangan || '-',
    }

    presensiData = [newEntry, ...presensiData]
    setPresensiStorage(presensiData)
    notifyListeners()
    return newEntry
  },

  subscribe(fn) {
    listeners.push(fn)
    return () => {
      listeners = listeners.filter((l) => l !== fn)
    }
  },

  reset() {
    presensiData = [...initialPresensi]
    setPresensiStorage(presensiData)
    notifyListeners()
  },
}
