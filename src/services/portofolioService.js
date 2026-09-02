// Service untuk portofolio siswa
// Data tersimpan di localStorage sehingga perubahan siswa langsung terbaca admin

const STORAGE_KEY = 'simcoding_portofolio'

const DEFAULT_DATA = {
  1: { deskripsi: 'Saya suka belajar coding dan membuat game sederhana.', hobi: 'Bermain game, membaca, menggambar', citaCita: 'Programer game', keahlian: 'Scratch, HTML dasar' },
  2: { deskripsi: 'Saya senang belajar membuat website.', hobi: 'Olahraga, musik', citaCita: 'Web Developer', keahlian: 'JavaScript, CSS' },
  3: { deskripsi: 'Saya suka memecahkan masalah dengan logika.', hobi: 'Membaca komik', citaCita: 'AI Engineer', keahlian: 'Python dasar, Scratch' },
  4: { deskripsi: 'Saya ingin belajar membuat aplikasi bermanfaat.', hobi: 'Bersepeda', citaCita: 'Software Engineer', keahlian: 'HTML, Scratch' },
  5: { deskripsi: 'Saya baru mulai belajar coding.', hobi: 'Main bola', citaCita: 'IT Support', keahlian: 'Belum ada' },
}

function getStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch (e) {
    console.error('Error reading portofolio:', e)
  }
  return null
}

function setStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('Error saving portofolio:', e)
  }
}

function initialize() {
  const stored = getStorage()
  if (stored && Object.keys(stored).length > 0) {
    return stored
  }
  setStorage(DEFAULT_DATA)
  return { ...DEFAULT_DATA }
}

let portofolioData = initialize()
let listeners = []

function notify() {
  listeners.forEach((fn) => fn(portofolioData))
}

function emptyPortofolio() {
  return {
    foto: null,
    deskripsi: '',
    hobi: '',
    citaCita: '',
    keahlian: '',
    updatedAt: null,
  }
}

export const portofolioService = {
  getAll() {
    return { ...portofolioData }
  },

  getByStudentId(studentId) {
    return portofolioData[studentId] ? { ...portofolioData[studentId] } : emptyPortofolio()
  },

  update(studentId, updates) {
    const current = portofolioData[studentId] || emptyPortofolio()
    portofolioData = {
      ...portofolioData,
      [studentId]: {
        ...current,
        ...updates,
        updatedAt: new Date().toISOString(),
      },
    }
    setStorage(portofolioData)
    notify()
    return { success: true, data: portofolioData[studentId] }
  },

  updateFoto(studentId, fotoDataUrl) {
    return this.update(studentId, { foto: fotoDataUrl })
  },

  subscribe(fn) {
    listeners.push(fn)
    return () => {
      listeners = listeners.filter((l) => l !== fn)
    }
  },
}
