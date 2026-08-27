// Data dummy untuk halaman Tugas Siswa
// Struktur siap untuk integrasi Supabase
// Data terhubung dengan student_id untuk multi-user

export const tasksData = [
  {
    id: 1,
    judul: 'Aplikasi Kalkulator Sederhana',
    deskripsi: 'Buat aplikasi kalkulator dengan operasi dasar menggunakan JavaScript',
    kelas: '5A',
    tanggal_mulai: '2024-01-10',
    deadline: '2024-01-17',
    status: 'aktif',
    file_instruksi: 'kalkulator-instruksi.pdf',
  },
  {
    id: 2,
    judul: 'Logical Operators in JavaScript',
    deskripsi: 'Praktik penggunaan operator logika dalam JavaScript',
    kelas: '5A',
    tanggal_mulai: '2024-01-17',
    deadline: '2024-01-24',
    status: 'aktif',
    file_instruksi: null,
  },
  {
    id: 3,
    judul: 'Struktur HTML Dasar',
    deskripsi: 'Buat halaman web sederhana dengan HTML semantic',
    kelas: '5A',
    tanggal_mulai: '2024-01-24',
    deadline: '2024-01-31',
    status: 'draft',
    file_instruksi: null,
  },
  {
    id: 4,
    judul: 'Animasi Scratch',
    deskripsi: 'Buat animasi sederhana menggunakan Scratch',
    kelas: '5A',
    tanggal_mulai: '2024-01-05',
    deadline: '2024-01-12',
    status: 'berakhir',
    file_instruksi: 'scratch-guide.pdf',
  },
  {
    id: 5,
    judul: 'Game Tebak Angka',
    deskripsi: 'Buat game tebak angka dengan JavaScript',
    kelas: '5A',
    tanggal_mulai: '2024-01-12',
    deadline: '2024-01-19',
    status: 'berakhir',
    file_instruksi: null,
  },
  {
    id: 6,
    judul: 'Mini Project - Portfolio',
    deskripsi: 'Buat halaman portfolio pribadi dengan HTML dan CSS',
    kelas: '5A',
    tanggal_mulai: '2024-01-19',
    deadline: '2024-01-26',
    status: 'aktif',
    file_instruksi: 'portfolio-rubric.pdf',
  },
]

export const submissionsData = [
  // Tugas 1: Kalkulator
  { id: 1, task_id: 1, student_id: 1, file: 'kalkulator-ahmad.zip', link: 'github.com/ahmad-dani/calc', note: 'Pak, saya menambahkan fitur persentase.', submitted_at: '2024-01-15' },
  { id: 2, task_id: 1, student_id: 2, file: 'kalkulator-budi.zip', link: 'github.com/budi-santoso/calc', note: 'Saya menggunakan desain colorful.', submitted_at: '2024-01-16' },
  { id: 3, task_id: 1, student_id: 3, file: 'kalkulator-citra.zip', link: '', note: '', submitted_at: '2024-01-15' },
  { id: 4, task_id: 1, student_id: 4, file: null, link: null, note: null, submitted_at: null },
  // Tugas 2: Logical Operators
  { id: 5, task_id: 2, student_id: 1, file: 'logic-ahmad.zip', link: 'github.com/ahmad-dani/logic', note: '', submitted_at: '2024-01-22' },
  { id: 6, task_id: 2, student_id: 2, file: 'logic-budi.zip', link: '', note: 'Masih ada bug pada OR operator.', submitted_at: '2024-01-23' },
  // Tugas 4: Scratch
  { id: 7, task_id: 4, student_id: 1, file: 'animasi-ahmad.sb3', link: 'scratch.mit.edu/projects/ahmad', note: 'Karakter kucing bisa berjalan.', submitted_at: '2024-01-10' },
  { id: 8, task_id: 4, student_id: 2, file: 'animasi-budi.sb3', link: 'scratch.mit.edu/projects/budi', note: 'Animasi cerita pendek.', submitted_at: '2024-01-11' },
  { id: 9, task_id: 4, student_id: 3, file: 'animasi-citra.sb3', link: '', note: '', submitted_at: '2024-01-10' },
  { id: 10, task_id: 4, student_id: 4, file: null, link: null, note: null, submitted_at: null },
  // Tugas 5: Game Tebak Angka
  { id: 11, task_id: 5, student_id: 1, file: 'game-ahmad.zip', link: 'github.com/ahmad-dani/game', note: 'Ada fitur skor tinggi.', submitted_at: '2024-01-17' },
  { id: 12, task_id: 5, student_id: 2, file: 'game-budi.zip', link: 'github.com/budi-santoso/game', note: '', submitted_at: '2024-01-18' },
  { id: 13, task_id: 5, student_id: 3, file: 'game-citra.zip', link: '', note: '', submitted_at: '2024-01-17' },
]

export const studentsData = [
  { id: 1, nama: 'Ahmad Dani', kelas: '5A', initials: 'AD' },
  { id: 2, nama: 'Budi Santoso', kelas: '5A', initials: 'BS' },
  { id: 3, nama: 'Citra Dewi', kelas: '5A', initials: 'CD' },
  { id: 4, nama: 'Dian Pratama', kelas: '5A', initials: 'DP' },
]

export const kelasOptions = ['Semua Kelas', '5A', '10A', '11B']
export const statusOptions = ['Semua Status', 'aktif', 'berakhir', 'draft']
