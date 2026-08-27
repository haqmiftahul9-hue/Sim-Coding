// Data dummy untuk sistem rapor
// Struktur siap untuk integrasi Supabase

export const assessments = [
  {
    id: 1,
    student_id: 1,
    project_score: 92,
    skill_score: 88,
    assignment_score: 85,
    attendance_score: 98,
    final_score: 90,
    grade: 'A',
    semester: 'Ganjil 2023/2024',
  },
  {
    id: 2,
    student_id: 2,
    project_score: 88,
    skill_score: 90,
    assignment_score: 92,
    attendance_score: 95,
    final_score: 91,
    grade: 'A',
    semester: 'Ganjil 2023/2024',
  },
  {
    id: 3,
    student_id: 3,
    project_score: 75,
    skill_score: 70,
    assignment_score: 72,
    attendance_score: 80,
    final_score: 74,
    grade: 'B',
    semester: 'Ganjil 2023/2024',
  },
  {
    id: 4,
    student_id: 4,
    project_score: 95,
    skill_score: 92,
    assignment_score: 90,
    attendance_score: 100,
    final_score: 94,
    grade: 'A',
    semester: 'Ganjil 2023/2024',
  },
  {
    id: 5,
    student_id: 5,
    project_score: 65,
    skill_score: 60,
    assignment_score: 68,
    attendance_score: 70,
    final_score: 66,
    grade: 'C',
    semester: 'Ganjil 2023/2024',
  },
]

export const reportDetails = [
  {
    id: 1,
    student_id: 1,
    teacher_note: 'Budi menunjukkan perkembangan yang sangat baik selama semester ini. Kemampuan logika dan pemahaman konsep meningkat signifikan.',
    selected_projects: [1, 2],
    custom_description: 'Siswa sangat aktif dalam pembelajaran',
    status: 'published',
  },
  {
    id: 2,
    student_id: 2,
    teacher_note: 'Siti memiliki kemampuan analitis yang sangat baik. Terlihat dari proyek-proyek yang dikerjakan dengan sangat detail.',
    selected_projects: [1, 2],
    custom_description: 'Siswa dengan kemampuan analitis tinggi',
    status: 'published',
  },
  {
    id: 3,
    student_id: 3,
    teacher_note: 'Andi perlu lebih banyak latihan untuk meningkatkan kemampuan problem solving.',
    selected_projects: [1],
    custom_description: 'Perlu pendampingan lebih',
    status: 'draft',
  },
  {
    id: 4,
    student_id: 4,
    teacher_note: 'Rina adalah siswa yang sangat berbakat. Selesaikan semua tantangan dengan sangat baik.',
    selected_projects: [1, 2],
    custom_description: 'Siswa berprestasi',
    status: 'published',
  },
  {
    id: 5,
    student_id: 5,
    teacher_note: 'Deni perlu meningkatkan kehadiran dan partisipasi di kelas.',
    selected_projects: [1],
    custom_description: 'Perlu motivasi lebih',
    status: 'draft',
  },
]

export const projects = [
  {
    id: 1,
    nama: 'Aplikasi Kalkulator Sederhana',
    deskripsi: 'Implementasi kalkulator dengan operasi dasar menggunakan JavaScript',
    student_id: 1,
    score: 92,
  },
  {
    id: 2,
    nama: 'To-Do List Interaktif',
    deskripsi: 'Aplikasi manajemen tugas dengan fitur CRUD dan local storage',
    student_id: 1,
    score: 88,
  },
  {
    id: 3,
    nama: 'Landing Page Portfolio',
    deskripsi: 'Halaman portfolio responsif dengan HTML dan CSS',
    student_id: 2,
    score: 88,
  },
  {
    id: 4,
    nama: 'Aplikasi Cuaca',
    deskripsi: 'Aplikasi cuaca dengan integrasi API',
    student_id: 2,
    score: 90,
  },
  {
    id: 5,
    nama: 'Game Tebak Angka',
    deskripsi: 'Game sederhana dengan JavaScript',
    student_id: 3,
    score: 75,
  },
  {
    id: 6,
    nama: 'Aplikasi Budget Tracker',
    deskripsi: 'Aplikasi pencatat keuangan pribadi',
    student_id: 4,
    score: 95,
  },
  {
    id: 7,
    nama: 'Chat Bot Sederhana',
    deskripsi: 'Bot percabangan dengan JavaScript',
    student_id: 4,
    score: 92,
  },
  {
    id: 8,
    nama: 'Aplikasi Kalkulator BMI',
    deskripsi: 'Kalkulator indeks massa tubuh',
    student_id: 5,
    score: 65,
  },
]

export const competencies = [
  { id: 1, nama: 'Logic Coding (Algoritma)', kategori: 'skill' },
  { id: 2, nama: 'Concept Understanding', kategori: 'skill' },
  { id: 3, nama: 'Problem Solving', kategori: 'skill' },
  { id: 4, nama: 'Project Management', kategori: 'project' },
  { id: 5, nama: 'Team Collaboration', kategori: 'soft_skill' },
]

export const gradeDistribution = [
  { grade: 'A', count: 2, color: '#10b981' },
  { grade: 'B', count: 1, color: '#3b82f6' },
  { grade: 'C', count: 1, color: '#f59e0b' },
  { grade: 'D', count: 0, color: '#ef4444' },
]
