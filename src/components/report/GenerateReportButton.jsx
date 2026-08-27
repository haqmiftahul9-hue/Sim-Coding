import { useState } from 'react'
import { Plus, CheckCircle, Loader2 } from 'lucide-react'
import { students } from '../../data/students'
import { assessments, reportDetails, projects } from '../../Data/reportData'
import { generateReportData, downloadPDF } from './ReportGenerator'

export default function GenerateReportButton({ student, assessment, reportDetail, onGenerated }) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const reportData = generateReportData(student, assessment, reportDetail, projects)

      await downloadPDF(reportData)

      setIsGenerated(true)
      onGenerated?.(student.id)

      setTimeout(() => setIsGenerated(false), 3000)
    } catch (error) {
      console.error('Error generating report:', error)
      alert('Gagal membuat rapor. Silakan coba lagi.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleGenerate}
      disabled={isGenerating}
      className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
        isGenerated
          ? 'bg-emerald-500 text-white'
          : 'bg-brand text-white hover:bg-brand/90'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Membuat...
        </>
      ) : isGenerated ? (
        <>
          <CheckCircle className="h-4 w-4" />
          Berhasil!
        </>
      ) : (
        <>
          <Plus className="h-4 w-4" />
          Buat Rapor
        </>
      )}
    </button>
  )
}
