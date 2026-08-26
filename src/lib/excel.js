import * as XLSX from 'xlsx'

// Mapping header Excel (case-insensitive) -> field siswa.
// Struktur ini memudahkan penyesuaian saat nanti mengambil data dari Supabase.
const headerMap = {
  nama: 'name',
  'nama lengkap': 'name',
  name: 'name',
  nis: 'nis',
  kelas: 'kelas',
  class: 'kelas',
  'jenis kelamin': 'gender',
  gender: 'gender',
  'barcode id': 'barcode',
  barcodeid: 'barcode',
  barcode: 'barcode',
  status: 'status',
}

export function parseStudentsFromExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'array' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json(ws, { defval: '' })
        const mapped = rows.map((row, i) => {
          const norm = {}
          Object.keys(row).forEach((k) => {
            const field = headerMap[String(k).toLowerCase().trim()]
            if (field) norm[field] = row[k]
          })
          const status = String(norm.status || 'Aktif').trim()
          return {
            name: String(norm.name || '').trim(),
            nis: String(norm.nis || '').trim(),
            kelas: String(norm.kelas || '').trim(),
            gender: norm.gender || 'Laki-laki',
            barcode: String(norm.barcode || '').trim(),
            status: status === 'Nonaktif' ? 'Nonaktif' : 'Aktif',
            _row: i + 2,
          }
        })
        resolve(mapped)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}
