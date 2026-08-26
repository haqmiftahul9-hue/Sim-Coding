// Data dummy detail siswa, disederhanakan untuk kebutuhan administrasi guru.
// Struktur ini siap diganti dengan hasil query Supabase nanti.

export const studentDetail = {
  id: 1,
  name: 'Budi Santoso',
  nis: '2023001',
  kelas: '9A',
  terdaftar: 'Agustus 2023',
  status: 'Aktif',
  jenisKelamin: 'Laki-laki',
  tanggalLahir: '01 Januari 2012',
  phone: '+62 812-3456-7890',
  address: 'Jl. Merdeka No.45',
  avatar:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDlFPU7wKep1sO0IK5kYq6KiES_02vktvlUYRu9E-zNkj9ypmHvkGuW4Maau6seqLsMkKKAGA-xsj16wh9kqhc_iiC8i91YloXIbrTh8k0Xux8M3_eZK2DnBkQayn5OcLQSDbgyZjTzP19PHuFlH4ruEeLybJhswiN-t5n2RsEJ0KNWgq4SztXJEBqKsz9GK3wUTzGVZKVxvOIZVjHiMes0mjm0YcMbZWj56qFwvQJ8BRbcbTVpPPXqEg',
  ringkasan: {
    totalKehadiran: '98%',
    tugasSelesai: '12/14',
    rataRataNilai: '88',
  },
  presensi: [
    { id: 1, tanggal: '12 Agustus 2023', masuk: '07:05', pulang: '15:00', metode: 'Barcode', status: 'Hadir', period: 'minggu' },
    { id: 2, tanggal: '11 Agustus 2023', masuk: '07:10', pulang: '15:00', metode: 'Barcode', status: 'Hadir', period: 'minggu' },
    { id: 3, tanggal: '04 Agustus 2023', masuk: '07:02', pulang: '15:05', metode: 'Scan Wajah', status: 'Hadir', period: 'bulan' },
    { id: 4, tanggal: '28 Juli 2023', masuk: '07:15', pulang: '15:00', metode: 'Barcode', status: 'Izin', period: 'bulan' },
    { id: 5, tanggal: '21 Juli 2023', masuk: '-', pulang: '-', metode: '-', status: 'Sakit', period: 'bulan' },
  ],
  tugas: [
    { id: 1, nama: 'Project Scratch Game', diberikan: '20 Agustus 2023', deadline: '30 Agustus 2023', status: 'Selesai', nilai: '90' },
    { id: 2, nama: 'Python Data Structures - Final', diberikan: '12 Agustus 2023', deadline: '20 Agustus 2023', status: 'Selesai', nilai: '92' },
    { id: 3, nama: 'Web API Integration', diberikan: '08 Agustus 2023', deadline: '15 Agustus 2023', status: 'Selesai', nilai: '85' },
    { id: 4, nama: 'Basic UI Layouts', diberikan: '05 Agustus 2023', deadline: '12 Agustus 2023', status: 'Menunggu', nilai: '-' },
    { id: 5, nama: 'Logic Basics', diberikan: '01 Agustus 2023', deadline: '08 Agustus 2023', status: 'Selesai', nilai: '88' },
  ],
  penilaian: {
    nilaiProject: '88',
    nilaiKemampuan: '85',
    nilaiAkhir: '87',
  },
  riwayatPenilaian: [
    { id: 1, tugas: 'Project Scratch Game', nilai: '90', komentar: 'Logika sangat baik, terus berlatih.' },
    { id: 2, tugas: 'Python Data Structures - Final', nilai: '92', komentar: 'Struktur data dipahami dengan baik.' },
    { id: 3, tugas: 'Web API Integration', nilai: '85', komentar: 'Bisa ditingkatkan pada penanganan error.' },
    { id: 4, tugas: 'Logic Basics', nilai: '88', komentar: 'Pemahaman logika dasar sudah mantap.' },
  ],
  rapor: {
    semester: 'Ganjil 2023/2024',
    nilaiAkhirCoding: '87',
    deskripsi:
      'Budi menunjukkan perkembangan yang baik dalam logika pemrograman dan penyelesaian masalah. Partisipasi aktif dan kedisiplinan hadir sangat memuaskan.',
    guru: 'Pak Budi',
  },
}
