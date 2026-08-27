import { useState } from 'react'
import { Download, Loader2, CheckCircle } from 'lucide-react'
import { assessments, reportDetails, projects } from '../../Data/reportData'
import { generateReportData, downloadPDF } from './ReportGenerator'

export default function DownloadReportButton({ student }) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [isDownloaded, setIsDownloaded] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)

    try {
      const assessment = assessments.find((a) => a.student_id === student.id)
      const reportDetail = reportDetails.find((r) => r.student_id === student.id)

      if (!assessment) {
        alert('Data penilaian tidak ditemukan untuk siswa ini.')
        setIsDownloading(false)
        return
      }

      const reportData = generateReportData(student, assessment, reportDetail, projects)
      await downloadPDF(reportData)

      setIsDownloaded(true)
      setTimeout(() => setIsDownloaded(false), 3000)
    } catch (error) {
      console.error('Error downloading PDF:', error)
      alert('Gagal mengunduh PDF. Silakan coba lagi.')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={isDownloading}
      className={`rounded-lg p-2 transition-colors disabled:opacity-50 ${
        isDownloaded
          ? 'text-emerald-500 bg-emerald-50'
          : 'text-slate-400 hover:bg-brand/10 hover:text-brand'
      }`}
      title="Download PDF"
    >
      {isDownloading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isDownloaded ? (
        <CheckCircle className="h-4 w-4" />
      ) : (
        <Download className="h-4 w-4" />
      )}
    </button>
  )
}
