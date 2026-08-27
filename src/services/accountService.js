// Service untuk manajemen akun user
// SINGLE SOURCE OF TRUTH: src/data/accounts.js
// Semua operasi CRUD mengakses data yang sama

import { accounts as initialAccounts } from '../data/accounts'
import { students } from '../services/studentService'

const STORAGE_KEY = 'simcoding_accounts'

function getStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.error('Error reading accounts from storage:', e)
    localStorage.removeItem(STORAGE_KEY)
  }
  return null
}

function setStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('Error saving accounts to storage:', e)
  }
}

function initialize() {
  const stored = getStorage()
  if (!stored || !Array.isArray(stored) || stored.length === 0) {
    setStorage(initialAccounts)
    return initialAccounts
  }

  const storedById = new Map(stored.map((s) => [s.id, s]))
  const storedByUsername = new Map(stored.map((s) => [s.username, s]))

  const merged = [...stored]

  initialAccounts.forEach((initial) => {
    const existing = storedById.get(initial.id) || storedByUsername.get(initial.username)
    if (existing) {
      const index = merged.findIndex((m) => m.id === initial.id || m.username === initial.username)
      if (index !== -1) {
        merged[index] = { ...initial, ...merged[index] }
      }
    } else {
      merged.push(initial)
    }
  })

  console.log('=== ACCOUNT SERVICE INIT (MERGE) ===')
  console.log('Stored accounts:', stored.length)
  console.log('Initial accounts:', initialAccounts.length)
  console.log('Merged accounts:', merged.length)
  console.log('Has testsiswa:', merged.some((a) => a.username === 'testsiswa'))

  setStorage(merged)
  return merged
}

let accountsData = initialize()
let listeners = []

function notifyListeners() {
  listeners.forEach((fn) => fn(accountsData))
}

export const accountService = {
  getAll() {
    return [...accountsData]
  },

  getById(id) {
    return accountsData.find((u) => u.id === id) || null
  },

  getByUsername(username) {
    return accountsData.find((u) => u.username === username) || null
  },

  getByRole(role) {
    return accountsData.filter((u) => u.role === role)
  },

  getSiswa() {
    return accountsData.filter((u) => u.role === 'siswa')
  },

  getGuru() {
    return accountsData.filter((u) => u.role === 'guru')
  },

  getAdmin() {
    return accountsData.filter((u) => u.role === 'admin')
  },

  getByStudentId(studentId) {
    return accountsData.find((u) => u.student_id === studentId) || null
  },

  createUser({ username, password, role, nama, kelas = null, student_id = null }) {
    if (accountsData.find((u) => u.username === username)) {
      return { success: false, message: 'Username sudah digunakan' }
    }

    const newId = Math.max(...accountsData.map((u) => u.id), 0) + 1
    const newUser = {
      id: newId,
      student_id,
      nama,
      username,
      password: password || '123456',
      role,
      status: 'aktif',
      kelas,
    }

    accountsData = [...accountsData, newUser]
    setStorage(accountsData)
    notifyListeners()

    // DEBUG: Log new account creation
    console.log('=== NEW ACCOUNT CREATED ===')
    console.log('New user:', newUser)
    console.log('Total accounts:', accountsData.length)

    return { success: true, user: newUser }
  },

  updateUser(id, updates) {
    const index = accountsData.findIndex((u) => u.id === id)
    if (index === -1) {
      return { success: false, message: 'Akun tidak ditemukan' }
    }

    if (updates.username && updates.username !== accountsData[index].username) {
      if (accountsData.find((u) => u.username === updates.username)) {
        return { success: false, message: 'Username sudah digunakan' }
      }
    }

    accountsData[index] = { ...accountsData[index], ...updates }
    accountsData = [...accountsData]
    setStorage(accountsData)
    notifyListeners()
    return { success: true, user: accountsData[index] }
  },

  resetPassword(id, newPassword = '123456') {
    return this.updateUser(id, { password: newPassword })
  },

  toggleStatus(id) {
    const user = accountsData.find((u) => u.id === id)
    if (!user) {
      return { success: false, message: 'Akun tidak ditemukan' }
    }
    const newStatus = user.status === 'aktif' ? 'nonaktif' : 'aktif'
    return this.updateUser(id, { status: newStatus })
  },

  deleteUser(id) {
    const index = accountsData.findIndex((u) => u.id === id)
    if (index === -1) {
      return { success: false, message: 'Akun tidak ditemukan' }
    }
    accountsData = accountsData.filter((u) => u.id !== id)
    setStorage(accountsData)
    notifyListeners()

    // DEBUG: Log account deletion
    console.log('=== ACCOUNT DELETED ===')
    console.log('Deleted ID:', id)
    console.log('Total accounts:', accountsData.length)

    return { success: true }
  },

  bulkCreateFromStudents(defaultPassword = '123456') {
    const existingUsernames = new Set(accountsData.map((u) => u.username))
    const existingStudentIds = new Set(
      accountsData.filter((u) => u.student_id).map((u) => u.student_id)
    )
    const newUsers = []
    const errors = []

    students.forEach((student) => {
      if (existingStudentIds.has(student.id)) {
        return
      }

      const baseUsername = student.nama.toLowerCase().replace(/\s+/g, '.')
      let username = baseUsername
      let counter = 1

      while (existingUsernames.has(username)) {
        username = `${baseUsername}.${counter}`
        counter++
      }

      const newUser = {
        id: Math.max(...accountsData.map((u) => u.id), 0) + newUsers.length + 1,
        student_id: student.id,
        nama: student.nama,
        username,
        password: defaultPassword,
        role: 'siswa',
        status: 'aktif',
        kelas: student.kelas,
      }

      newUsers.push(newUser)
      existingUsernames.add(username)
      existingStudentIds.add(student.id)
    })

    if (newUsers.length > 0) {
      accountsData = [...accountsData, ...newUsers]
      setStorage(accountsData)
      notifyListeners()
    }

    return {
      success: true,
      created: newUsers.length,
      errors,
      users: newUsers,
    }
  },

  subscribe(fn) {
    listeners.push(fn)
    return () => {
      listeners = listeners.filter((l) => l !== fn)
    }
  },

  reset() {
    accountsData = [...initialAccounts]
    setStorage(accountsData)
    notifyListeners()
  },
}
