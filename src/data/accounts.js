// Sumber data utama untuk semua akun user
// File ini adalah SINGLE SOURCE OF TRUTH untuk:
// - Login Page
// - Manajemen Akun Siswa
// - AuthContext
//
// Role: admin, guru, siswa
// Status: aktif, nonaktif

export const accounts = [
  {
    id: 1,
    student_id: null,
    nama: 'Administrator SimCoding',
    username: 'admin',
    password: '123456',
    role: 'admin',
    status: 'aktif',
    kelas: null,
  },
  {
    id: 2,
    student_id: null,
    nama: 'Ahmad Programmer, S.Kom',
    username: 'guru',
    password: '123456',
    role: 'guru',
    status: 'aktif',
    kelas: null,
  },
  {
    id: 3,
    student_id: 1,
    nama: 'Ahmad Dani',
    username: 'siswa',
    password: '123456',
    role: 'siswa',
    status: 'aktif',
    kelas: '5A',
  },
  {
    id: 4,
    student_id: 2,
    nama: 'Budi Santoso',
    username: 'budi',
    password: '123456',
    role: 'siswa',
    status: 'aktif',
    kelas: '5A',
  },
  {
    id: 5,
    student_id: 3,
    nama: 'Citra Dewi',
    username: 'citra',
    password: '123456',
    role: 'siswa',
    status: 'aktif',
    kelas: '5A',
  },
  {
    id: 6,
    student_id: 4,
    nama: 'Dian Pratama',
    username: 'dian',
    password: '123456',
    role: 'siswa',
    status: 'aktif',
    kelas: '5A',
  },
  {
    id: 7,
    student_id: 5,
    nama: 'Test Siswa',
    username: 'testsiswa',
    password: '123456',
    role: 'siswa',
    status: 'aktif',
    kelas: '5A',
  },
]
