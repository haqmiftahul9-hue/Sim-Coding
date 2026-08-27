import { useState } from 'react'
import { Download, Loader2, CheckCircle } from 'lucide-react'
import { assessments, reportDetails, projects } from '../../Data/reportData'
import { generateReportData, downloadPDF } from './ReportGenerator'

export default function ExportPDFButton({ student }) {
  const [isExporting, setIsExporting] = useState(false)
  const [isExported, setIsExported] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)

    try {
      const assessment = assessments.find((a) => a.student_id === student.id)
      const reportDetail = reportDetails.find((r) => r.student_id === student.id)

      if (!assessment) {
        alert('Data penilaian tidak ditemukan untuk siswa ini.')
        setIsExporting(false)
        return
      }

      const reportData = generateReportData(student, assessment, reportDetail, projects)
      await downloadPDF(reportData)

      setIsExported(true)
      setTimeout(() => setIsExported(false), 3000)
    } catch (error) {
      console.error('Error exporting PDF:', error)
      alert('Gagal mengekspor PDF. Silakan coba lagi.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={isExporting}
      className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
        isExported
          ? 'bg-emerald-500 text-white'
          : 'bg-navy text-white hover:bg-navy-light'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
      title="Cetak PDF"
    >
      {isExporting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Mengekspor...
        </>
      ) : isExported ? (
        <>
          <CheckCircle className="h-4 w-4" />
          Terunduh!
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          Cetak PDF
        </>
      )}
    </button>
  )
}
