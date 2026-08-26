// Data dummy untuk halaman Dashboard Admin SimCoding.
// Struktur ini dirancang agar mudah diganti dengan hasil query Supabase nanti.

export const adminProfile = {
  name: 'Pak Budi',
  role: 'Administrator Portal',
  avatar:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD2i_sE0uduJc__LGMvpv3MDJUBda7jGncxdXBr_fEQWzDCdjYWGADNU4T3lY1-0IZbSV0PBjijyt1ELAkMEOxBxCDU-QmxnWdWRfXKCMzM1NBCRMb6rYI09df5ITOmSxddO0drl37aUZIaKW-igHdQNPBSRfmNdUbktzV-OPAmgrYSYcDV9Qy_vGwOY098fBhXhFwUW_Azpf2Z-7EjANf8SXwVH8trt7oyPGDezJzNSJOD8swT9qvueA',
}

export const stats = [
  {
    id: 'total-students',
    label: 'Total Siswa',
    value: '120',
    icon: 'users',
    accent: 'navy',
  },
  {
    id: 'attendance-today',
    label: 'Kehadiran Hari Ini',
    value: '95%',
    icon: 'check',
    accent: 'brand',
  },
  {
    id: 'tasks-in',
    label: 'Tugas Masuk',
    value: '15',
    icon: 'inbox',
    accent: 'navy',
  },
  {
    id: 'tasks-pending',
    label: 'Tugas Belum Dinilai',
    value: '8',
    icon: 'pending',
    accent: 'error',
  },
]

// Tren kehadiran mingguan (persentase per hari)
export const weeklyAttendance = [
  { day: 'Sen', value: 80 },
  { day: 'Sel', value: 88 },
  { day: 'Rab', value: 70 },
  { day: 'Kam', value: 83 },
  { day: 'Jum', value: 92 },
  { day: 'Sab', value: 76 },
]

// Aksi cepat di sisi kanan dashboard
export const quickActions = [
  {
    id: 'add-student',
    label: 'Tambah Siswa',
    icon: 'userPlus',
    variant: 'primary',
  },
  {
    id: 'create-task',
    label: 'Buat Tugas',
    icon: 'postAdd',
    variant: 'outline',
  },
  {
    id: 'open-scanner',
    label: 'Buka Scanner',
    icon: 'scan',
    variant: 'outline',
  },
]

// Aktivitas terkini
export const recentActivities = [
  {
    id: 1,
    student: 'Andi Saputra',
    description: 'Hadir via Barcode',
    time: 'Hari ini, 08:00',
    type: 'attendance',
    icon: 'qrCode',
  },
  {
    id: 2,
    student: 'Siti Aminah',
    description: 'Mengumpulkan Tugas: Logic Basics',
    time: 'Hari ini, 08:15',
    type: 'task',
    icon: 'upload',
  },
  {
    id: 3,
    student: 'Budi Hartono',
    description: 'Hadir via Scan Wajah',
    time: 'Hari ini, 08:05',
    type: 'attendance',
    icon: 'face',
  },
]

// Statistik pengumpulan tugas per modul (persentase)
export const taskSubmissions = [
  { module: 'Modul 1', value: 85 },
  { module: 'Modul 2', value: 92 },
  { module: 'Modul 3', value: 65 },
  { module: 'Modul 4', value: 40 },
  { module: 'Modul 5', value: 10 },
]
