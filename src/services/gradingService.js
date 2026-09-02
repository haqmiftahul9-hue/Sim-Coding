// gradingService
// Single source of truth untuk nilai siswa.
// Schema siap Supabase (table: grades):
//   id, submission_id, task_id, student_id,
//   design_score, logic_score, creativity_score, concept_score, problem_score,
//   project_score, skill_score, final_score,
//   teacher_note, status (draft/published), created_at, updated_at
//
// Relasi:
//   grades.submission_id -> submissions.id
//   grades.task_id      -> tasks.id
//   grades.student_id   -> students.id

import { assessments as initialAssessments } from '../data/penilaianData'

const STORAGE_KEY = 'simcoding_grades'

function getStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch (e) {
    console.error('Error reading grades from storage:', e)
  }
  return null
}

function setStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('Error saving grades to storage:', e)
  }
}

function initialize() {
  const stored = getStorage()
  if (stored && Array.isArray(stored) && stored.length > 0) {
    const storedIds = new Set(
      stored.map((a) => `${a.task_id}-${a.student_id}`)
    )
    const merged = [...stored]
    initialAssessments.forEach((a) => {
      const key = `${a.task_id}-${a.student_id}`
      if (!storedIds.has(key)) merged.push(a)
    })
    setStorage(merged)
    return merged
  }
  setStorage(initialAssessments)
  return [...initialAssessments]
}

let grades = initialize()
const listeners = new Set()

function notify() {
  listeners.forEach((fn) => {
    try {
      fn(grades)
    } catch (e) {
      console.error(e)
    }
  })
}

function nextId() {
  if (!grades.length) return 1
  return Math.max(...grades.map((g) => Number(g.id) || 0)) + 1
}

export const gradingService = {
  getAll() {
    return [...grades]
  },

  getByStudentId(studentId) {
    return grades.filter((g) => g.student_id === studentId)
  },

  getByTaskId(taskId) {
    return grades.filter((g) => g.task_id === taskId)
  },

  getByStudentAndTask(studentId, taskId) {
    return (
      grades.find(
        (g) => g.student_id === studentId && g.task_id === taskId
      ) || null
    )
  },

  getPublishedByStudentId(studentId) {
    return grades.filter(
      (g) => g.student_id === studentId && g.status === 'published'
    )
  },

  upsertGrade(payload) {
    const {
      student_id,
      task_id,
      submission_id,
      design_score = 0,
      logic_score = 0,
      creativity_score = 0,
      concept_score = 0,
      problem_score = 0,
      project_score = 0,
      skill_score = 0,
      final_score = 0,
      teacher_note = '',
      status = 'draft',
    } = payload || {}

    if (!student_id || !task_id) {
      return { success: false, message: 'student_id dan task_id wajib diisi' }
    }

    const index = grades.findIndex(
      (g) => g.student_id === student_id && g.task_id === task_id
    )

    if (index >= 0) {
      grades[index] = {
        ...grades[index],
        ...payload,
        status,
        updated_at: new Date().toISOString(),
      }
      grades = [...grades]
    } else {
      grades = [
        ...grades,
        {
          id: nextId(),
          student_id,
          task_id,
          submission_id: submission_id ?? null,
          design_score,
          logic_score,
          creativity_score,
          concept_score,
          problem_score,
          project_score,
          skill_score,
          final_score,
          teacher_note,
          status,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]
    }

    setStorage(grades)
    notify()
    return { success: true, grade: index >= 0 ? grades[index] : grades[grades.length - 1] }
  },

  publishGrade(studentId, taskId, payload = {}) {
    return this.upsertGrade({ ...payload, student_id: studentId, task_id: taskId, status: 'published' })
  },

  removeByTaskId(taskId) {
    grades = grades.filter((g) => g.task_id !== taskId)
    setStorage(grades)
    notify()
  },

  subscribe(fn) {
    listeners.add(fn)
    return () => listeners.delete(fn)
  },

  reset() {
    grades = [...initialAssessments]
    setStorage(grades)
    notify()
  },
}
