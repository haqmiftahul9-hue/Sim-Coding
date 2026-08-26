import { jsPDF } from 'jspdf'
import JsBarcode from 'jsbarcode'

// Generate kartu barcode siswa dalam 1 file PDF (2 kolom per halaman).
export function downloadBarcodeCards(students) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()

  const cardW = 85
  const cardH = 54
  const marginX = 12
  const marginY = 14
  const gapX = 8
  const gapY = 8
  const cols = 2
  const rowsPerPage = Math.floor((pageH - marginY * 2 + gapY) / (cardH + gapY))

  let pageRow = 0

  students.forEach((s, i) => {
    const col = i % cols
    if (col === 0) {
      pageRow += 1
      if (pageRow > rowsPerPage) {
        doc.addPage()
        pageRow = 1
      }
    }
    const x = marginX + col * (cardW + gapX)
    const y = marginY + (pageRow - 1) * (cardH + gapY)

    // Card border
    doc.setDrawColor(210)
    doc.roundedRect(x, y, cardW, cardH, 2, 2)

    // Header
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(15, 45, 92)
    doc.text('SIMCODING - KARTU PRESENSI', x + 6, y + 8)

    // Nama & info
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(13)
    doc.setTextColor(20, 20, 20)
    doc.text(String(s.name).slice(0, 22), x + 6, y + 20)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(90, 90, 90)
    doc.text(`NIS: ${s.nis}   Kelas: ${s.kelas}`, x + 6, y + 27)
    doc.text(`ID: ${s.barcode}`, x + 6, y + 32)

    // Barcode
    const canvas = document.createElement('canvas')
    JsBarcode(canvas, s.barcode || s.nis, {
      format: 'CODE128',
      displayValue: true,
      fontSize: 10,
      width: 1.4,
      height: 28,
      margin: 0,
    })
    doc.addImage(canvas.toDataURL('image/png'), 'PNG', x + 6, y + 36, cardW - 12, 14)
  })

  const filename =
    students.length === 1
      ? `kartu-barcode-${students[0].nis}.pdf`
      : `kartu-barcode-siswa-${students.length}.pdf`
  doc.save(filename)
}
