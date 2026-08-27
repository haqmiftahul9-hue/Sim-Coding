// Data dummy rekap presensi. Struktur siap diganti dengan query Supabase nanti.
// `tanggalIso` dipakai untuk filter tanggal (input type="date", format yyyy-mm-dd).
export const presensi = [
  { id: 1, nama: 'Ahmad Rizky', kelas: 'X RPL 1', tanggal: '24/10/2023', tanggalIso: '2023-10-24', jamMasuk: '06:45', jamPulang: '15:00', metode: 'Barcode', status: 'Hadir', keterangan: '-' },
  { id: 2, nama: 'Budi Santoso', kelas: 'X RPL 1', tanggal: '24/10/2023', tanggalIso: '2023-10-24', jamMasuk: '07:15', jamPulang: '15:00', metode: 'Scan Wajah', status: 'Terlambat', keterangan: 'Terlambat 30 menit' },
  { id: 3, nama: 'Siti Aminah', kelas: 'X RPL 2', tanggal: '24/10/2023', tanggalIso: '2023-10-24', jamMasuk: '06:50', jamPulang: '15:00', metode: 'Barcode', status: 'Hadir', keterangan: '-' },
  { id: 4, nama: 'Andi Wijaya', kelas: 'X RPL 2', tanggal: '24/10/2023', tanggalIso: '2023-10-24', jamMasuk: '-', jamPulang: '-', metode: '-', status: 'Absen', keterangan: 'Sakit' },
  { id: 5, nama: 'Rina Kusuma', kelas: 'X RPL 1', tanggal: '23/10/2023', tanggalIso: '2023-10-23', jamMasuk: '06:55', jamPulang: '15:00', metode: 'Barcode', status: 'Hadir', keterangan: '-' },
  { id: 6, nama: 'Deni Pratama', kelas: 'X RPL 2', tanggal: '23/10/2023', tanggalIso: '2023-10-23', jamMasuk: '07:05', jamPulang: '15:00', metode: 'Barcode', status: 'Hadir', keterangan: '-' },
  { id: 7, nama: 'Ahmad Rizky', kelas: 'X RPL 1', tanggal: '23/10/2023', tanggalIso: '2023-10-23', jamMasuk: '06:40', jamPulang: '15:00', metode: 'Barcode', status: 'Hadir', keterangan: '-' },
  { id: 8, nama: 'Budi Santoso', kelas: 'X RPL 1', tanggal: '22/10/2023', tanggalIso: '2023-10-22', jamMasuk: '07:20', jamPulang: '15:00', metode: 'Scan Wajah', status: 'Terlambat', keterangan: 'Terlambat' },
  { id: 9, nama: 'Siti Aminah', kelas: 'X RPL 2', tanggal: '22/10/2023', tanggalIso: '2023-10-22', jamMasuk: '06:48', jamPulang: '15:00', metode: 'Barcode', status: 'Hadir', keterangan: '-' },
  { id: 10, nama: 'Andi Wijaya', kelas: 'X RPL 2', tanggal: '22/10/2023', tanggalIso: '2023-10-22', jamMasuk: '06:52', jamPulang: '15:00', metode: 'Barcode', status: 'Hadir', keterangan: '-' },
  { id: 11, nama: 'Rina Kusuma', kelas: 'X RPL 1', tanggal: '21/10/2023', tanggalIso: '2023-10-21', jamMasuk: '06:58', jamPulang: '15:00', metode: 'Barcode', status: 'Hadir', keterangan: '-' },
  { id: 12, nama: 'Deni Pratama', kelas: 'X RPL 2', tanggal: '21/10/2023', tanggalIso: '2023-10-21', jamMasuk: '07:10', jamPulang: '15:00', metode: 'Barcode', status: 'Terlambat', keterangan: 'Terlambat' },
]
