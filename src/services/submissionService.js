// Service untuk pengumpulan tugas siswa
// Data tersimpan di localStorage sehingga admin dan siswa berbagi data
// Struktur siap untuk integrasi Supabase (table: submissions)

import { submissionsData as initialSubmissions } from '../data/tugasData'

const STORAGE_KEY = 'simcoding_submissions'

function getStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch (e) {
    console.error('Error reading submissions from storage:', e)
  }
  return null
}

function setStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('Error saving submissions to storage:', e)
  }
}

function initialize() {
  const stored = getStorage()
  if (stored && Array.isArray(stored) && stored.length > 0) {
    const storedIds = new Set(stored.map((s) => `${s.task_id}-${s.student_id}`))
    const merged = [...stored]
    initialSubmissions.forEach((s) => {
      const key = `${s.task_id}-${s.student_id}`
      if (!storedIds.has(key)) merged.push(s)
    })
    setStorage(merged)
    return merged
  }
  setStorage(initialSubmissions)
  return [...initialSubmissions]
}

let submissions = initialize()
let listeners = []

function notify() {
  listeners.forEach((fn) => fn(submissions))
}

export const submissionService = {
  getAll() {
    return [...submissions]
  },

  getByStudentId(studentId) {
    return submissions.filter((s) => s.student_id === studentId)
  },

  getByTaskId(taskId) {
    return submissions.filter((s) => s.task_id === taskId)
  },

  getByStudentAndTask(studentId, taskId) {
    return (
      submissions.find((s) => s.student_id === studentId && s.task_id === taskId) ||
      null
    )
  },

  getByStudentName(name) {
    return submissions.filter((s) => s.student_name === name)
  },

  upsertSubmission({ studentId, studentName, taskId, fileName, fileSize, fileType, fileDataUrl, note, link }) {
    const now = new Date()
    const tanggal = `${String(now.getDate()).padStart(2, '0')}/${String(
      now.getMonth() + 1
    ).padStart(2, '0')}/${now.getFullYear()}`
    const tanggalIso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      '0'
    )}-${String(now.getDate()).padStart(2, '0')}`

    const existingIndex = submissions.findIndex(
      (s) => s.student_id === studentId && s.task_id === taskId
    )

    const baseRecord = {
      student_id: studentId,
      student_name: studentName,
      task_id: taskId,
      file: fileName || null,
      file_size: fileSize || null,
      file_type: fileType || null,
      file_data_url: fileDataUrl || null,
      link: link || null,
      note: note || '',
      status: 'Menunggu Penilaian',
      submitted_at: tanggal,
      submitted_at_iso: tanggalIso,
    }

    if (existingIndex >= 0) {
      submissions[existingIndex] = {
        ...submissions[existingIndex],
        ...baseRecord,
        id: submissions[existingIndex].id,
      }
    } else {
      const newId = submissions.length
        ? Math.max(...submissions.map((s) => s.id || 0)) + 1
        : 1
      submissions = [
        ...submissions,
        { id: newId, ...baseRecord },
      ]
    }

    setStorage(submissions)
    notify()
    return { success: true, submission: existingIndex >= 0 ? submissions[existingIndex] : submissions[submissions.length - 1] }
  },

  removeByTaskId(taskId) {
    submissions = submissions.filter((s) => s.task_id !== taskId)
    setStorage(submissions)
    notify()
  },

  subscribe(fn) {
    listeners.push(fn)
    return () => {
      listeners = listeners.filter((l) => l !== fn)
    }
  },

  reset() {
    submissions = [...initialSubmissions]
    setStorage(submissions)
    notify()
  },
}
