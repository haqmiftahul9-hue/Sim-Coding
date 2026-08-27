// Service untuk manajemen data siswa
// Menghubungkan user account dengan profil siswa
// Struktur siap untuk integrasi Supabase

export const students = [
  {
    id: 1,
    user_id: 3,
    nama: 'Ahmad Dani',
    kelas: '5A',
    nis: '2023001',
    email: 'ahmad@simcoding.id',
    foto: null,
    initials: 'AD',
  },
  {
    id: 2,
    user_id: 4,
    nama: 'Budi Santoso',
    kelas: '5A',
    nis: '2023002',
    email: 'budi@simcoding.id',
    foto: null,
    initials: 'BS',
  },
  {
    id: 3,
    user_id: 5,
    nama: 'Citra Dewi',
    kelas: '5A',
    nis: '2023003',
    email: 'citra@simcoding.id',
    foto: null,
    initials: 'CD',
  },
  {
    id: 4,
    user_id: 6,
    nama: 'Dian Pratama',
    kelas: '5A',
    nis: '2023004',
    email: 'dian@simcoding.id',
    foto: null,
    initials: 'DP',
  },
  {
    id: 5,
    user_id: 7,
    nama: 'Test Siswa',
    kelas: '5A',
    nis: '2023005',
    email: 'testsiswa@simcoding.id',
    foto: null,
    initials: 'TS',
  },
]

export const studentService = {
  getAll() {
    return [...students]
  },

  getById(id) {
    return students.find((s) => s.id === id) || null
  },

  getByUserId(userId) {
    return students.find((s) => s.user_id === userId) || null
  },

  getByNama(nama) {
    return students.find((s) => s.nama === nama) || null
  },

  getByKelas(kelas) {
    return students.filter((s) => s.kelas === kelas)
  },

  getNamaById(id) {
    const student = students.find((s) => s.id === id)
    return student ? student.nama : '-'
  },

  getKelasById(id) {
    const student = students.find((s) => s.id === id)
    return student ? student.kelas : '-'
  },

  getInitialsById(id) {
    const student = students.find((s) => s.id === id)
    return student ? student.initials : '??'
  },
}
