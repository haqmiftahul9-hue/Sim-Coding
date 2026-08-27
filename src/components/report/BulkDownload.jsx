import { Download, FileText, Users, CheckSquare, Square } from 'lucide-react'
import { useState } from 'react'

export default function BulkDownload({ students, assessments, reportDetails }) {
  const [selectedKelas, setSelectedKelas] = useState('')
  const [selectedStudents, setSelectedStudents] = useState([])
  const [isDownloading, setIsDownloading] = useState(false)

  const kelasOptions = [...new Set(students.map((s) => s.kelas))]

  const filteredStudents = selectedKelas
    ? students.filter((s) => s.kelas === selectedKelas)
    : students

  const publishedReports = filteredStudents.filter((s) => {
    const report = reportDetails.find((r) => r.student_id === s.id)
    return report?.status === 'published'
  })

  const toggleStudent = (id) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    )
  }

  const selectAll = () => {
    if (selectedStudents.length === publishedReports.length) {
      setSelectedStudents([])
    } else {
      setSelectedStudents(publishedReports.map((s) => s.id))
    }
  }

  const handleDownload = async () => {
    setIsDownloading(true)
    // Simulate download process
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsDownloading(false)
    alert(`Download ${selectedStudents.length || publishedReports.length} PDF berhasil!`)
  }

  return (
    <section className="card overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Download className="h-5 w-5 text-brand" />
          <h3 className="font-display text-lg font-semibold text-navy">Download Massal Rapor</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Filter */}
          <div className="lg:col-span-1 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Filter Kelas</label>
              <select
                value={selectedKelas}
                onChange={(e) => setSelectedKelas(e.target.value)}
                className="w-full rounded-lg border border-surface-border bg-surface px-4 py-2 text-sm focus:border-brand focus:outline-none"
              >
                <option value="">Semua Kelas</option>
                {kelasOptions.map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>

            <div className="rounded-xl bg-surface p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-600">Ringkasan</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Siswa</span>
                  <span className="font-semibold text-navy">{filteredStudents.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Rapor Published</span>
                  <span className="font-semibold text-emerald-600">{publishedReports.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Terpilih</span>
                  <span className="font-semibold text-brand">{selectedStudents.length}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading || publishedReports.length === 0}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-navy px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-light disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="h-5 w-5" />
              {isDownloading ? 'Mengunduh...' : `Download ${selectedStudents.length || publishedReports.length} PDF`}
            </button>
          </div>

          {/* Student List */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-600">Pilih Siswa</span>
              <button
                type="button"
                onClick={selectAll}
                className="flex items-center gap-2 text-sm text-brand hover:text-brand/80"
              >
                {selectedStudents.length === publishedReports.length ? (
                  <CheckSquare className="h-4 w-4" />
                ) : (
                  <Square className="h-4 w-4" />
                )}
                Pilih Semua
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto rounded-xl border border-surface-border">
              {publishedReports.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-400">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  Tidak ada rapor published
                </div>
              ) : (
                <div className="divide-y divide-surface-border">
                  {publishedReports.map((student) => {
                    const assessment = assessments.find((a) => a.student_id === student.id)
                    const isSelected = selectedStudents.includes(student.id)
                    return (
                      <button
                        key={student.id}
                        type="button"
                        onClick={() => toggleStudent(student.id)}
                        className={`w-full flex items-center gap-3 p-3 text-left transition-colors ${
                          isSelected ? 'bg-brand/5' : 'hover:bg-surface'
                        }`}
                      >
                        {isSelected ? (
                          <CheckSquare className="h-5 w-5 text-brand" />
                        ) : (
                          <Square className="h-5 w-5 text-slate-300" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-navy">{student.name}</p>
                          <p className="text-xs text-slate-400">{student.kelas}</p>
                        </div>
                        <span className="text-sm font-semibold text-navy">{assessment?.final_score}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
