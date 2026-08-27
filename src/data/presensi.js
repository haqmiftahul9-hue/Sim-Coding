// Data dummy rekap presensi. Struktur siap diganti dengan query Supabase nanti.
// `tanggalIso` dipakai untuk filter tanggal (input type="date", format yyyy-mm-dd).
// Data mencakup semua siswa dengan student_id yang sesuai.

export const presensi = [
  { id: 1, nama: 'Ahmad Dani', kelas: '5A', tanggal: '24/10/2023', tanggalIso: '2023-10-24', jamMasuk: '06:45', jamPulang: '15:00', metode: 'Barcode', status: 'Hadir', keterangan: '-' },
  { id: 2, nama: 'Budi Santoso', kelas: '5A', tanggal: '24/10/2023', tanggalIso: '2023-10-24', jamMasuk: '07:15', jamPulang: '15:00', metode: 'Scan Wajah', status: 'Terlambat', keterangan: 'Terlambat 30 menit' },
  { id: 3, nama: 'Citra Dewi', kelas: '5A', tanggal: '24/10/2023', tanggalIso: '2023-10-24', jamMasuk: '06:50', jamPulang: '15:00', metode: 'Barcode', status: 'Hadir', keterangan: '-' },
  { id: 4, nama: 'Dian Pratama', kelas: '5A', tanggal: '24/10/2023', tanggalIso: '2023-10-24', jamMasuk: '-', jamPulang: '-', metode: '-', status: 'Absen', keterangan: 'Sakit' },
  { id: 5, nama: 'Ahmad Dani', kelas: '5A', tanggal: '23/10/2023', tanggalIso: '2023-10-23', jamMasuk: '06:40', jamPulang: '15:00', metode: 'Barcode', status: 'Hadir', keterangan: '-' },
  { id: 6, nama: 'Budi Santoso', kelas: '5A', tanggal: '23/10/2023', tanggalIso: '2023-10-23', jamMasuk: '07:20', jamPulang: '15:00', metode: 'Scan Wajah', status: 'Terlambat', keterangan: 'Terlambat' },
  { id: 7, nama: 'Citra Dewi', kelas: '5A', tanggal: '23/10/2023', tanggalIso: '2023-10-23', jamMasuk: '06:48', jamPulang: '15:00', metode: 'Barcode', status: 'Hadir', keterangan: '-' },
  { id: 8, nama: 'Dian Pratama', kelas: '5A', tanggal: '23/10/2023', tanggalIso: '2023-10-23', jamMasuk: '06:52', jamPulang: '15:00', metode: 'Barcode', status: 'Hadir', keterangan: '-' },
  { id: 9, nama: 'Ahmad Dani', kelas: '5A', tanggal: '22/10/2023', tanggalIso: '2023-10-22', jamMasuk: '06:55', jamPulang: '15:00', metode: 'Barcode', status: 'Hadir', keterangan: '-' },
  { id: 10, nama: 'Budi Santoso', kelas: '5A', tanggal: '22/10/2023', tanggalIso: '2023-10-22', jamMasuk: '07:10', jamPulang: '15:00', metode: 'Scan Wajah', status: 'Terlambat', keterangan: 'Terlambat' },
  { id: 11, nama: 'Citra Dewi', kelas: '5A', tanggal: '22/10/2023', tanggalIso: '2023-10-22', jamMasuk: '06:58', jamPulang: '15:00', metode: 'Barcode', status: 'Hadir', keterangan: '-' },
  { id: 12, nama: 'Dian Pratama', kelas: '5A', tanggal: '22/10/2023', tanggalIso: '2023-10-22', jamMasuk: '07:05', jamPulang: '15:00', metode: 'Barcode', status: 'Terlambat', keterangan: 'Terlambat' },
  { id: 13, nama: 'Ahmad Dani', kelas: '5A', tanggal: '21/10/2023', tanggalIso: '2023-10-21', jamMasuk: '06:42', jamPulang: '15:00', metode: 'Barcode', status: 'Hadir', keterangan: '-' },
  { id: 14, nama: 'Budi Santoso', kelas: '5A', tanggal: '21/10/2023', tanggalIso: '2023-10-21', jamMasuk: '06:50', jamPulang: '15:00', metode: 'Scan Wajah', status: 'Hadir', keterangan: '-' },
  { id: 15, nama: 'Citra Dewi', kelas: '5A', tanggal: '21/10/2023', tanggalIso: '2023-10-21', jamMasuk: '06:48', jamPulang: '15:00', metode: 'Barcode', status: 'Hadir', keterangan: '-' },
  { id: 16, nama: 'Dian Pratama', kelas: '5A', tanggal: '21/10/2023', tanggalIso: '2023-10-21', jamMasuk: '06:55', jamPulang: '15:00', metode: 'Barcode', status: 'Hadir', keterangan: '-' },
]
