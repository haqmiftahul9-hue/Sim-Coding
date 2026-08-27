import { useState } from 'react'
import { UserRound, CheckCircle, Clock, FileText } from 'lucide-react'
import ReportPreviewButton from './ReportPreviewButton'
import EditReportModal from './EditReportModal'
import DownloadReportButton from './DownloadReportButton'

function StatusBadge({ status }) {
  const config = {
    published: { label: 'Published', cls: 'bg-emerald-50 text-emerald-700' },
    draft: { label: 'Draft', cls: 'bg-amber-50 text-amber-700' },
    pending: { label: 'Pending', cls: 'bg-slate-100 text-slate-500' },
  }
  const { label, cls } = config[status] || config.pending
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${cls}`}>
      {status === 'published' && <CheckCircle className="h-3 w-3" />}
      {status === 'draft' && <Clock className="h-3 w-3" />}
      {label}
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
  return predikatMap[grade] || '-'
}

export default function ReportTable({ students, assessments, reportDetails, onEditSave }) {
  const [search, setSearch] = useState('')
  const [filterKelas, setFilterKelas] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)

  const kelasOptions = [...new Set(students.map((s) => s.kelas))]

  const studentsWithData = students.map((student) => {
    const assessment = assessments.find((a) => a.student_id === student.id)
    const reportDetail = reportDetails.find((r) => r.student_id === student.id)
    return { ...student, assessment, reportDetail }
  })

  const filtered = studentsWithData.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.nis.includes(search)
    const matchKelas = !filterKelas || s.kelas === filterKelas
    const matchStatus = !filterStatus || s.reportDetail?.status === filterStatus
    return matchSearch && matchKelas && matchStatus
  })

  const handleEdit = (student) => {
    setSelectedStudent(student)
    setEditModalOpen(true)
  }

  const handleEditSave = (studentId, formData) => {
    onEditSave?.(studentId, formData)
    setEditModalOpen(false)
    setSelectedStudent(null)
  }

  const handleCloseModal = () => {
    setEditModalOpen(false)
    setSelectedStudent(null)
  }

  return (
    <>
      <section className="card overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="h-5 w-5 text-brand" />
            <h3 className="font-display text-lg font-semibold text-navy">Daftar Rapor Siswa</h3>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Cari nama atau NIS..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-surface-border bg-surface px-4 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
            </div>
            <select
              value={filterKelas}
              onChange={(e) => setFilterKelas(e.target.value)}
              className="rounded-lg border border-surface-border bg-surface px-4 py-2 text-sm focus:border-brand focus:outline-none"
            >
              <option value="">Semua Kelas</option>
              {kelasOptions.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-lg border border-surface-border bg-surface px-4 py-2 text-sm focus:border-brand focus:outline-none"
            >
              <option value="">Semua Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-border">
                  <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Siswa</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Kelas</th>
                  <th className="py-3 px-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Nilai Akhir</th>
                  <th className="py-3 px-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Predikat</th>
                  <th className="py-3 px-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {filtered.map((student) => (
                  <tr key={student.id} className="hover:bg-surface/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-surface-border bg-navy/10 overflow-hidden">
                          {student.avatar ? (
                            <img src={student.avatar} alt={student.name} className="h-full w-full object-cover" />
                          ) : (
                            <UserRound className="h-5 w-5 text-navy" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-navy">{student.name}</p>
                          <p className="text-xs text-slate-400">{student.nis}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">{student.kelas}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-bold text-navy">{student.assessment?.final_score || '-'}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-sm text-slate-600">{student.assessment ? getPredikat(student.assessment.grade) : '-'}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <StatusBadge status={student.reportDetail?.status || 'pending'} />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <ReportPreviewButton student={student} />
                        <button
                          type="button"
                          onClick={() => handleEdit(student)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-brand/10 hover:text-brand transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <DownloadReportButton student={student} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-slate-400">
              Tidak ada data yang ditemukan
            </div>
          )}
        </div>
      </section>

      {/* Edit Modal */}
      {editModalOpen && selectedStudent && (
        <EditReportModal
          student={selectedStudent}
          assessment={selectedStudent.assessment}
          reportDetail={selectedStudent.reportDetail}
          projects={[]}
          onClose={handleCloseModal}
          onSave={handleEditSave}
        />
      )}
    </>
  )
}

function Edit3(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  )
}
