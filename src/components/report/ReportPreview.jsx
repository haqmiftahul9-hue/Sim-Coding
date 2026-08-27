import { useState } from 'react'
import { FileText, Award, BookOpen, FolderOpen, MessageSquare, GraduationCap, Loader2, CheckCircle } from 'lucide-react'
import { generateReportData, downloadPDF } from './ReportGenerator'

function GradeBadge({ grade }) {
  const colorMap = {
    'A': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'A-': 'bg-emerald-50 text-emerald-600 border-emerald-200',
    'B+': 'bg-blue-50 text-blue-600 border-blue-200',
    'B': 'bg-blue-50 text-blue-600 border-blue-200',
    'C+': 'bg-amber-50 text-amber-600 border-amber-200',
    'C': 'bg-amber-50 text-amber-600 border-amber-200',
    'D': 'bg-red-50 text-red-600 border-red-200',
  }
  return (
    <span className={`inline-flex items-center justify-center w-10 h-10 rounded-lg border-2 font-bold text-sm ${colorMap[grade] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
      {grade}
    </span>
  )
}

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
  return predikatMap[grade] || 'Belum Ada'
}

export default function ReportPreview({ student, assessment, reportDetail, projects, onClose }) {
  const [isExporting, setIsExporting] = useState(false)
  const [isExported, setIsExported] = useState(false)

  if (!student || !assessment) return null

  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
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

  const studentProjects = projects.filter((p) => {
    const selectedIds = reportDetail?.selected_projects || []
    return selectedIds.length > 0 ? selectedIds.includes(p.id) : p.student_id === student.id
  })

  const competencies = [
    { no: 1, kompetensi: 'Logic Coding (Algoritma)', nilai: assessment.skill_score >= 85 ? 'A' : assessment.skill_score >= 75 ? 'B+' : 'B' },
    { no: 2, kompetensi: 'Concept Understanding', nilai: assessment.skill_score >= 90 ? 'A' : assessment.skill_score >= 80 ? 'A-' : 'B+' },
    { no: 3, kompetensi: 'Problem Solving', nilai: assessment.project_score >= 85 ? 'A' : assessment.project_score >= 75 ? 'B+' : 'B' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="w-full max-w-[210mm] bg-white shadow-2xl rounded-xl max-h-[95vh] overflow-y-auto">
        {/* Actions */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-surface-border bg-white p-4 rounded-t-xl">
          <h3 className="font-semibold text-navy">Preview Rapor</h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleExportPDF}
              disabled={isExporting}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                isExported
                  ? 'bg-emerald-500 text-white'
                  : 'bg-navy text-white hover:bg-navy-light'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
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
                  <FileText className="h-4 w-4" />
                  Cetak PDF
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-2 rounded-lg border border-surface-border px-4 py-2 text-sm font-semibold text-navy hover:bg-surface transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>

        {/* Document */}
        <div className="p-8 sm:p-12 space-y-8" id="rapor-document">
          {/* Header Rapor */}
          <header className="text-center border-b-2 border-navy pb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-navy">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-navy tracking-wide">SIMCODING ACADEMY</h2>
            <p className="text-sm text-slate-500 mt-1">Pusat Pelatihan Pemrograman & Logika Komputasi</p>
            <div className="mt-4 pt-4 border-t border-slate-200">
              <h3 className="text-lg font-bold text-navy">LAPORAN HASIL BELAJAR</h3>
              <p className="text-sm text-slate-500 mt-1">Semester {assessment.semester}</p>
            </div>
          </header>

          {/* Data Siswa */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-brand" />
              <h4 className="font-semibold text-navy">Data Siswa</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl bg-surface p-4">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">Nama Siswa</p>
                <p className="font-semibold text-navy mt-0.5">{student.name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">NIS</p>
                <p className="font-semibold text-navy mt-0.5">{student.nis}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">Kelas</p>
                <p className="font-semibold text-navy mt-0.5">{student.kelas}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">Fasilitator</p>
                <p className="font-semibold text-navy mt-0.5">Pak Budi Hartono</p>
              </div>
            </div>
          </section>

          {/* Pencapaian Kompetensi */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-brand" />
              <h4 className="font-semibold text-navy">Pencapaian Kompetensi</h4>
            </div>
            <div className="overflow-hidden rounded-xl border border-surface-border">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface">
                    <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-12">No</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Kompetensi</th>
                    <th className="py-3 px-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider w-20">Nilai</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {competencies.map((item) => (
                    <tr key={item.no} className="hover:bg-surface/50">
                      <td className="py-3 px-4 text-sm text-slate-500">{item.no}</td>
                      <td className="py-3 px-4 text-sm font-medium text-navy">{item.kompetensi}</td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center">
                          <GradeBadge grade={item.nilai} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Portofolio Proyek */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <FolderOpen className="h-5 w-5 text-brand" />
              <h4 className="font-semibold text-navy">Portofolio Proyek</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {studentProjects.map((project) => (
                <div key={project.id} className="rounded-xl border border-surface-border bg-surface p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-navy">{project.nama}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{project.deskripsi}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-2xl font-bold text-navy">{project.score}</span>
                      <span className="text-xs text-slate-400">/100</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Catatan Fasilitator */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="h-5 w-5 text-brand" />
              <h4 className="font-semibold text-navy">Catatan Fasilitator</h4>
            </div>
            <div className="rounded-xl border border-surface-border bg-surface p-4">
              <p className="text-sm text-slate-600 leading-relaxed italic">
                "{reportDetail?.teacher_note || 'Belum ada catatan'}"
              </p>
              <p className="text-sm text-slate-400 mt-3 text-right">— Pak Budi Hartono</p>
            </div>
          </section>

          {/* Nilai Akhir */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Award className="h-5 w-5 text-brand" />
              <h4 className="font-semibold text-navy">Nilai Akhir</h4>
            </div>
            <div className="rounded-xl border-2 border-brand/20 bg-brand/5 p-6 text-center">
              <p className="text-sm text-slate-500 uppercase tracking-wide mb-2">Nilai Akhir</p>
              <p className="text-6xl font-bold text-navy">{assessment.final_score}</p>
              <div className="mt-3 inline-flex items-center rounded-full bg-emerald-100 px-4 py-1.5">
                <span className="text-sm font-semibold text-emerald-700">Predikat: {getPredikat(assessment.grade)}</span>
              </div>
            </div>
          </section>

          {/* Tanda Tangan */}
          <section className="pt-4">
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <p className="text-sm text-slate-500">Mengetahui,</p>
                <p className="text-sm text-slate-500">Orang Tua/Wali</p>
                <div className="h-20 mt-4 border-b border-dashed border-slate-300" />
                <p className="text-xs text-slate-400 mt-2">(...........................)</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-500">Fasilitator Kelas</p>
                <div className="h-20 mt-7 border-b border-dashed border-slate-300" />
                <p className="text-sm font-semibold text-navy mt-2">Pak Budi Hartono</p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="text-center pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-400">SimCoding Academy — Laporan Hasil Belajar Semester {assessment.semester}</p>
            <p className="text-xs text-slate-300 mt-1">Dokumen ini digenerate secara otomatis oleh sistem</p>
          </footer>
        </div>
      </div>
    </div>
  )
}
