import * as XLSX from 'xlsx'

// Header template disamakan dengan pemetaan di src/lib/excel.js agar kompatibel
// dengan fitur Import Excel (kolom ekstra seperti Tanggal Lahir akan diabaikan parser).
const TEMPLATE_HEADERS = [
  'Nama Lengkap',
  'NIS',
  'Kelas',
  'Jenis Kelamin',
  'Tanggal Lahir',
  'Email',
  'Nomor HP',
  'Status',
]

const EXAMPLE_ROW = [
  'Budi Santoso',
  '2023001',
  '9A',
  'Laki-laki',
  '01/01/2012',
  'budi@email.com',
  '08123456789',
  'Aktif',
]

export function downloadStudentTemplate() {
  const ws = XLSX.utils.aoa_to_sheet([TEMPLATE_HEADERS, EXAMPLE_ROW])
  ws['!cols'] = TEMPLATE_HEADERS.map((h) => ({ wch: Math.max(12, h.length + 2) }))
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Siswa')
  XLSX.writeFile(wb, 'Template_Data_Siswa_SimCoding.xlsx')
}
