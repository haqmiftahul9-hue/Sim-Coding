import { jsPDF } from 'jspdf'

function fmtDisplay(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

// Export laporan Rekap Presensi ke PDF.
export function exportPresensiPdf(rows, filters = {}) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const marginX = 14
  const marginY = 14

  // Logo SimCoding
  doc.setFillColor(15, 45, 92)
  doc.roundedRect(marginX, marginY, 12, 12, 2, 2, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text('SC', marginX + 6, marginY + 8, { align: 'center' })
  doc.setTextColor(15, 45, 92)
  doc.setFontSize(14)
  doc.text('SimCoding', marginX + 16, marginY + 8)

  // Judul
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.setTextColor(20, 20, 20)
  doc.text('Rekap Presensi', marginX, marginY + 28)

  // Periode & filter
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(90, 90, 90)
  const period = filters.tanggal ? fmtDisplay(filters.tanggal) : 'Semua Tanggal'
  doc.text(`Periode: ${period}`, marginX, marginY + 36)
  const filterParts = []
  if (filters.kelas) filterParts.push(`Kelas: ${filters.kelas}`)
  if (filters.status) filterParts.push(`Status: ${filters.status}`)
  if (filterParts.length) doc.text(filterParts.join('    |    '), marginX, marginY + 42)

  // Tabel
  const cols = [
    { key: 'no', label: 'No', w: 10 },
    { key: 'nama', label: 'Nama Siswa', w: 42 },
    { key: 'kelas', label: 'Kelas', w: 22 },
    { key: 'tanggal', label: 'Tanggal', w: 26 },
    { key: 'jamMasuk', label: 'Jam Masuk', w: 20 },
    { key: 'jamPulang', label: 'Jam Pulang', w: 20 },
    { key: 'metode', label: 'Metode', w: 22 },
    { key: 'status', label: 'Status', w: 20 },
  ]
  const totalW = cols.reduce((sum, c) => sum + c.w, 0)

  let y = marginY + 52
  // Header baris
  doc.setFillColor(15, 45, 92)
  doc.rect(marginX, y, totalW, 8, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  let x = marginX
  cols.forEach((c) => {
    doc.text(c.label, x + 2, y + 5.5)
    x += c.w
  })
  y += 8

  // Baris data
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(20, 20, 20)
  doc.setFontSize(8)
  rows.forEach((r, i) => {
    if (y > pageH - marginY) {
      doc.addPage()
      y = marginY
    }
    if (i % 2 === 1) {
      doc.setFillColor(244, 246, 248)
      doc.rect(marginX, y, totalW, 7, 'F')
    }
    const vals = {
      no: String(i + 1),
      nama: r.nama ?? '',
      kelas: r.kelas ?? '',
      tanggal: r.tanggal ?? '',
      jamMasuk: r.jamMasuk ?? '',
      jamPulang: r.jamPulang ?? '',
      metode: r.metode ?? '',
      status: r.status ?? '',
    }
    let cx = marginX
    cols.forEach((c) => {
      doc.text(String(vals[c.key]), cx + 2, y + 5)
      cx += c.w
    })
    y += 7
  })

  doc.setDrawColor(210)
  doc.line(marginX, y, marginX + totalW, y)

  doc.save('Rekap_Presensi_SimCoding.pdf')
}
