import { jsPDF } from 'jspdf'

// Generate PDF rapor sederhana untuk satu siswa.
export function downloadRaporPdf(student) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })

  // Header navy
  doc.setFillColor(15, 45, 92)
  doc.rect(0, 0, 210, 32, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text('RAPOR SIMCODING', 14, 14)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text('Sistem Informasi Ekstrakurikuler Coding', 14, 22)
  doc.text(`Semester ${student.rapor.semester}`, 14, 28)

  // Identitas siswa
  doc.setTextColor(20, 20, 20)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.text(student.name, 14, 46)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(90, 90, 90)
  doc.text(`NIS: ${student.nis}`, 14, 54)
  doc.text(`Kelas: ${student.kelas}`, 14, 60)
  doc.text(`Status: ${student.status}`, 14, 66)

  // Nilai akhir coding
  doc.setDrawColor(210)
  doc.line(14, 74, 196, 74)
  doc.setTextColor(20, 20, 20)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text('Nilai Akhir Coding', 14, 84)
  doc.setFontSize(20)
  doc.setTextColor(15, 45, 92)
  doc.text(`${student.rapor.nilaiAkhirCoding}`, 14, 96)

  // Deskripsi perkembangan
  doc.setTextColor(20, 20, 20)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text('Deskripsi Perkembangan', 14, 116)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  const lines = doc.splitTextToSize(student.rapor.deskripsi, 180)
  doc.text(lines, 14, 124)

  // Tanda tangan guru
  const signY = 250
  doc.setDrawColor(120)
  doc.line(130, signY, 196, signY)
  doc.setFontSize(10)
  doc.setTextColor(90, 90, 90)
  doc.text(`Guru: ${student.rapor.guru}`, 130, signY + 6)

  doc.save(`Rapor_${student.nis}.pdf`)
}
