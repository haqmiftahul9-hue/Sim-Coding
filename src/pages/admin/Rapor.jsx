import { useState } from 'react'
import { FileText, Plus, Download, BarChart3 } from 'lucide-react'
import { students } from '../../Data/students'
import { assessments, reportDetails, projects, gradeDistribution } from '../../Data/reportData'
import ReportCard from '../../components/report/ReportCard'
import ReportPreview from '../../components/report/ReportPreview'
import ReportAnalysis from '../../components/report/ReportAnalysis'
import ReportTable from '../../components/report/ReportTable'
import BulkExportReport from '../../components/report/BulkExportReport'

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'analysis', label: 'Analisis', icon: FileText },
  { id: 'reports', label: 'Daftar Rapor', icon: FileText },
  { id: 'download', label: 'Download', icon: Download },
]

const reportStats = [
  { id: 1, label: 'Total Siswa', value: students.length, icon: 'users', iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
  { id: 2, label: 'Rapor Published', value: reportDetails.filter((r) => r.status === 'published').length, icon: 'completed', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
  { id: 3, label: 'Rapor Draft', value: reportDetails.filter((r) => r.status === 'draft').length, icon: 'pending', iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
  { id: 4, label: 'Rata-rata Nilai', value: Math.round(assessments.reduce((sum, a) => sum + a.final_score, 0) / assessments.length), icon: 'average', iconBg: 'bg-purple-50', iconColor: 'text-purple-600' },
]

export default function Rapor() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [previewStudent, setPreviewStudent] = useState(null)
  const [editStudent, setEditStudent] = useState(null)
  const [notification, setNotification] = useState(null)

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const handlePreview = (student) => {
    setPreviewStudent(student)
  }

  const handleEdit = (student) => {
    setEditStudent(student)
  }

  const handleGenerated = (studentId) => {
    showNotification('Rapor berhasil dibuat dan diunduh!')
  }

  const closePreview = () => {
    setPreviewStudent(null)
  }

  const closeEdit = () => {
    setEditStudent(null)
  }

  const getStudentAssessment = (studentId) => {
    return assessments.find((a) => a.student_id === studentId)
  }

  const getStudentReportDetail = (studentId) => {
    return reportDetails.find((r) => r.student_id === studentId)
  }

  const handleGenerateAll = async () => {
    showNotification('Fitur Generate Semua Rapor akan segera tersedia!')
  }

  return (
    <div className="mx-auto max-w-container-max space-y-6">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg transition-all ${
            notification.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <ErrorCircle className="h-5 w-5" />
          )}
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy sm:text-3xl">Rapor Siswa</h1>
          <p className="mt-1 text-sm text-slate-500 sm:text-base">
            Kelola dan analisis rapor hasil belajar siswa.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleGenerateAll}
            className="flex items-center gap-2 rounded-lg border border-surface-border bg-white px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-surface"
          >
            <Plus className="h-5 w-5" />
            Buat Semua Rapor
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('download')}
            className="flex items-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-light"
          >
            <Download className="h-5 w-5" />
            Export Semua
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-surface-border">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
                isActive
                  ? 'border-brand text-navy'
                  : 'border-transparent text-slate-400 hover:text-navy'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <ReportCard stats={reportStats} />

          {/* Grade Distribution */}
          <section className="card p-6">
            <h3 className="font-display text-lg font-semibold text-navy mb-4">Distribusi Predikat</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {gradeDistribution.map((item) => (
                <div key={item.grade} className="rounded-xl border border-surface-border bg-surface p-4 text-center">
                  <div className="text-3xl font-bold" style={{ color: item.color }}>{item.count}</div>
                  <div className="text-sm text-slate-500 mt-1">Grade {item.grade}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Analysis */}
          <ReportAnalysis students={students.slice(0, 3)} assessments={assessments} />
        </div>
      )}

      {activeTab === 'analysis' && (
        <ReportAnalysis students={students} assessments={assessments} />
      )}

      {activeTab === 'reports' && (
        <div className="space-y-6">
          <ReportTable
            students={students}
            assessments={assessments}
            reportDetails={reportDetails}
            projects={projects}
          />
        </div>
      )}

      {activeTab === 'download' && (
        <BulkExportReport />
      )}

      {/* Preview Modal */}
      {previewStudent && (
        <ReportPreview
          student={previewStudent}
          assessment={getStudentAssessment(previewStudent.id)}
          reportDetail={getStudentReportDetail(previewStudent.id)}
          projects={projects}
          onClose={closePreview}
        />
      )}

      {/* Edit Modal */}
      {editStudent && (
        <ReportPreview
          student={editStudent}
          assessment={getStudentAssessment(editStudent.id)}
          reportDetail={getStudentReportDetail(editStudent.id)}
          projects={projects}
          onClose={closeEdit}
          isEditMode
        />
      )}
    </div>
  )
}

function CheckCircle(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

function ErrorCircle(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  )
}
