import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

function getPredikat(grade) {
  const predikatMap = {
    'A': 'Sangat Baik',
    'A-': 'Sangat Baik',
    'B+': 'Baik',
    'B': 'Baik',
    'C+': 'Cukup',
    'C': 'Cukup',
    'D': 'Kurang',
  }
  return predikatMap[grade] || '-'
}

function getGradeFromScore(score) {
  if (score >= 90) return 'A'
  if (score >= 85) return 'A-'
  if (score >= 80) return 'B+'
  if (score >= 75) return 'B'
  if (score >= 70) return 'C+'
  if (score >= 65) return 'C'
  return 'D'
}

export const generateReportData = (student, assessment, reportDetail, projects) => {
  const studentProjects = projects.filter((p) => {
    const selectedIds = reportDetail?.selected_projects || []
    return selectedIds.length > 0 ? selectedIds.includes(p.id) : p.student_id === student.id
  })

  const competencies = [
    {
      no: 1,
      kompetensi: 'Logic Coding (Algoritma)',
      nilai: getGradeFromScore(assessment?.skill_score || 0),
    },
    {
      no: 2,
      kompetensi: 'Concept Understanding',
      nilai: getGradeFromScore(assessment ? assessment.skill_score - 5 : 0),
    },
    {
      no: 3,
      kompetensi: 'Problem Solving',
      nilai: getGradeFromScore(assessment ? assessment.project_score - 3 : 0),
    },
  ]

  return {
    student,
    assessment,
    reportDetail,
    projects: studentProjects,
    competencies,
    predikat: getPredikat(assessment?.grade || 'D'),
    generatedAt: new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
  }
}

export const generatePDF = async (reportData) => {
  const { student, assessment, reportDetail, projects, competencies, predikat } = reportData

  const pdf = new jsPDF('p', 'mm', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const margin = 20
  let yPos = margin

  // Header
  pdf.setFontSize(16)
  pdf.setFont('helvetica', 'bold')
  pdf.text('SIMCODING ACADEMY', pageWidth / 2, yPos, { align: 'center' })
  yPos += 6
  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'normal')
  pdf.text('Pusat Pelatihan Pemrograman & Logika Komputasi', pageWidth / 2, yPos, { align: 'center' })
  yPos += 10

  // Line
  pdf.setDrawColor(0, 24, 61)
  pdf.setLineWidth(0.5)
  pdf.line(margin, yPos, pageWidth - margin, yPos)
  yPos += 8

  // Title
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.text('LAPORAN HASIL BELAJAR', pageWidth / 2, yPos, { align: 'center' })
  yPos += 6
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  pdf.text(`Semester ${assessment?.semester || 'Ganjil 2023/2024'}`, pageWidth / 2, yPos, { align: 'center' })
  yPos += 12

  // Student Info
  pdf.setFontSize(11)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Data Siswa', margin, yPos)
  yPos += 8
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')

  const infoLines = [
    `Nama Siswa: ${student?.name || '-'}`,
    `NIS: ${student?.nis || '-'}`,
    `Kelas: ${student?.kelas || '-'}`,
    `Fasilitator: Pak Budi Hartono`,
  ]
  infoLines.forEach((line) => {
    pdf.text(line, margin, yPos)
    yPos += 6
  })
  yPos += 6

  // Competencies
  pdf.setFontSize(11)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Pencapaian Kompetensi', margin, yPos)
  yPos += 8
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')

  competencies.forEach((item) => {
    pdf.text(`${item.no}. ${item.kompetensi}`, margin, yPos)
    pdf.text(item.nilai, margin + 140, yPos)
    yPos += 6
  })
  yPos += 6

  // Projects
  pdf.setFontSize(11)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Portofolio Proyek', margin, yPos)
  yPos += 8
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')

  projects.forEach((project) => {
    pdf.text(`- ${project.nama}`, margin, yPos)
    pdf.text(`${project.score}/100`, margin + 140, yPos)
    yPos += 6
  })
  yPos += 6

  // Teacher Note
  pdf.setFontSize(11)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Catatan Fasilitator', margin, yPos)
  yPos += 8
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'italic')
  const noteLines = pdf.splitTextToSize(reportDetail?.teacher_note || 'Belum ada catatan', pageWidth - 2 * margin)
  pdf.text(noteLines, margin, yPos)
  yPos += noteLines.length * 6 + 10

  // Final Score Box
  pdf.setFillColor(235, 243, 255)
  pdf.roundedRect(margin, yPos, pageWidth - 2 * margin, 35, 3, 3, 'F')
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  pdf.text('Nilai Akhir', margin + 10, yPos + 10)
  pdf.setFontSize(24)
  pdf.setFont('helvetica', 'bold')
  pdf.text(`${assessment?.final_score || 0}`, margin + 10, yPos + 25)
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  pdf.text(`Predikat: ${predikat}`, margin + 60, yPos + 20)
  yPos += 45

  // Signature
  pdf.setFontSize(10)
  let sigY = yPos + 10
  pdf.text('Mengetahui,', margin + 20, sigY)
  pdf.text('Fasilitator Kelas', margin + 110, sigY)
  sigY += 20
  pdf.text('(Orang Tua/Wali)', margin + 20, sigY)
  pdf.text('Pak Budi Hartono', margin + 110, sigY)

  // Footer
  pdf.setFontSize(8)
  pdf.setTextColor(150)
  pdf.text(
    `SimCoding Academy - Laporan Hasil Belajar ${assessment?.semester || 'Ganjil 2023/2024'}`,
    pageWidth / 2,
    280,
    { align: 'center' }
  )

  return pdf
}

export const downloadPDF = async (reportData) => {
  const pdf = await generatePDF(reportData)
  const fileName = `Rapor_${reportData.student?.name?.replace(/\s+/g, '') || 'Siswa'}.pdf`
  pdf.save(fileName)
  return fileName
}

export const generateBulkPDF = async (students, assessments, reportDetails, projects, onProgress) => {
  const zip = new JSZip()
  const total = students.length
  let completed = 0

  for (const student of students) {
    const assessment = assessments.find((a) => a.student_id === student.id)
    const reportDetail = reportDetails.find((r) => r.student_id === student.id)

    if (assessment) {
      const reportData = generateReportData(student, assessment, reportDetail, projects)
      const pdf = await generatePDF(reportData)
      const fileName = `Rapor_${student.name?.replace(/\s+/g, '') || 'Siswa'}.pdf`
      zip.file(fileName, pdf.output('blob'))
    }

    completed++
    onProgress?.(completed, total)
  }

  const content = await zip.generateAsync({ type: 'blob' })
  saveAs(content, 'Rapor_SimCoding.zip')
  return content
}

export const generateReportForClass = async (kelas, students, assessments, reportDetails, projects, onProgress) => {
  const filteredStudents = students.filter((s) => s.kelas === kelas)
  return generateBulkPDF(filteredStudents, assessments, reportDetails, projects, onProgress)
}
