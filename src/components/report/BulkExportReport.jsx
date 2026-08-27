import { useState } from 'react'
import { Download, Loader2, CheckCircle, Users, GraduationCap } from 'lucide-react'
import { students } from '../../Data/students'
import { assessments, reportDetails, projects } from '../../Data/reportData'
import { generateBulkPDF, generateReportForClass } from './ReportGenerator'

export default function BulkExportReport({ selectedKelas = '' }) {
  const [isExporting, setIsExporting] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0 })
  const [isCompleted, setIsCompleted] = useState(false)
  const [filterKelas, setFilterKelas] = useState(selectedKelas)

  const kelasOptions = [...new Set(students.map((s) => s.kelas))]

  const filteredStudents = filterKelas
    ? students.filter((s) => s.kelas === filterKelas)
    : students

  const studentsWithAssessment = filteredStudents.filter((s) =>
    assessments.some((a) => a.student_id === s.id)
  )

  const handleExportAll = async () => {
    if (studentsWithAssessment.length === 0) {
      alert('Tidak ada data siswa yang dapat diekspor.')
      return
    }

    setIsExporting(true)
    setIsCompleted(false)
    setProgress({ current: 0, total: studentsWithAssessment.length })

    try {
      if (filterKelas) {
        await generateReportForClass(
          filterKelas,
          students,
          assessments,
          reportDetails,
          projects,
          (current, total) => setProgress({ current, total })
        )
      } else {
        await generateBulkPDF(
          studentsWithAssessment,
          assessments,
          reportDetails,
          projects,
          (current, total) => setProgress({ current, total })
        )
      }

      setIsCompleted(true)
      setTimeout(() => setIsCompleted(false), 3000)
    } catch (error) {
      console.error('Error exporting bulk PDF:', error)
      alert('Gagal mengekspor PDF massal. Silakan coba lagi.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <section className="card overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Download className="h-5 w-5 text-brand" />
          <h3 className="font-display text-lg font-semibold text-navy">Export Rapor Massal</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Filter Section */}
          <div className="lg:col-span-1 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Filter Kelas</label>
              <select
                value={filterKelas}
                onChange={(e) => setFilterKelas(e.target.value)}
                disabled={isExporting}
                className="w-full rounded-lg border border-surface-border bg-surface px-4 py-2 text-sm focus:border-brand focus:outline-none disabled:opacity-50"
              >
                <option value="">Semua Kelas</option>
                {kelasOptions.map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>

            <div className="rounded-xl bg-surface p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <Users className="h-4 w-4" />
                <span>Ringkasan</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Filter</span>
                  <span className="font-semibold text-navy">{filterKelas || 'Semua Kelas'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Siswa</span>
                  <span className="font-semibold text-navy">{filteredStudents.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Siap Ekspor</span>
                  <span className="font-semibold text-emerald-600">{studentsWithAssessment.length}</span>
                </div>
              </div>
            </div>

            {isExporting && (
              <div className="rounded-xl bg-brand/5 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-navy">Progress</span>
                  <span className="text-sm text-slate-500">
                    {progress.current}/{progress.total}
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand rounded-full transition-all duration-300"
                    style={{ width: `${(progress.current / progress.total) * 100}%` }}
                  />
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleExportAll}
              disabled={isExporting || studentsWithAssessment.length === 0}
              className={`w-full flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${
                isCompleted
                  ? 'bg-emerald-500 text-white'
                  : 'bg-navy text-white hover:bg-navy-light'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Mengekspor...
                </>
              ) : isCompleted ? (
                <>
                  <CheckCircle className="h-5 w-5" />
                  Berhasil!
                </>
              ) : (
                <>
                  <Download className="h-5 w-5" />
                  Export {studentsWithAssessment.length} PDF
                </>
              )}
            </button>
          </div>

          {/* Student List Preview */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="h-5 w-5 text-slate-400" />
              <span className="text-sm font-medium text-slate-600">
                Daftar Siswa ({studentsWithAssessment.length})
              </span>
            </div>

            {studentsWithAssessment.length === 0 ? (
              <div className="rounded-xl border border-surface-border bg-surface p-8 text-center">
                <Users className="h-10 w-10 mx-auto mb-3 text-slate-300" />
                <p className="text-sm text-slate-400">Tidak ada data siswa yang dapat diekspor</p>
                <p className="text-xs text-slate-300 mt-1">Pastikan data penilaian sudah tersedia</p>
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto rounded-xl border border-surface-border divide-y divide-surface-border">
                {studentsWithAssessment.map((student) => {
                  const assessment = assessments.find((a) => a.student_id === student.id)
                  return (
                    <div key={student.id} className="flex items-center justify-between p-3 hover:bg-surface/50">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <div>
                          <p className="text-sm font-medium text-navy">{student.name}</p>
                          <p className="text-xs text-slate-400">{student.kelas}</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-navy">{assessment?.final_score}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
