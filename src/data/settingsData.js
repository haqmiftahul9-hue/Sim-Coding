// Data dummy untuk halaman Pengaturan
// Struktur siap untuk integrasi Supabase

export const attendanceSettings = {
  attendance_start: '06:00',
  attendance_on_time: '07:15',
  attendance_late: '08:00',
  attendance_end: '15:00',
}

export const geofencingSettings = {
  school_latitude: '-6.200000',
  school_longitude: '106.816666',
  attendance_radius: 200,
}

export const methodSettings = {
  barcode_enabled: true,
  face_enabled: false,
  location_enabled: true,
}

export const schoolProfile = {
  logo: null,
  name: 'SD Coding Indonesia',
  address: 'Jl. Programming No. 123, Jakarta Selatan',
  principal_name: 'Drs. Budi Santoso, M.Pd',
  teacher_name: 'Ahmad Programmer, S.Kom',
}

export const systemConfig = {
  semester: 'Semester 1',
  academic_year: '2024/2025',
  program_name: 'SimCoding - Programming For Kids',
}

export const adminList = [
  {
    id: 1,
    nama: 'Ahmad Programmer, S.Kom',
    email: 'ahmad@simcoding.id',
    role: 'Admin',
  },
  {
    id: 2,
    nama: 'Siti Nurhaliza, S.Pd',
    email: 'siti@simcoding.id',
    role: 'Guru Coding',
  },
  {
    id: 3,
    nama: 'Deni Kurniawan, S.Kom',
    email: 'deni@simcoding.id',
    role: 'Guru Coding',
  },
]

export const semesterOptions = ['Semester 1', 'Semester 2']
export const academicYearOptions = ['2024/2025', '2025/2026', '2026/2027']
export const roleOptions = ['Admin', 'Guru Coding']
