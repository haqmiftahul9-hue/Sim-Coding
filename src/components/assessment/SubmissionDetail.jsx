import { Code, Link as LinkIcon, MessageSquare, FileDown, CheckCircle, Download } from 'lucide-react'

export default function SubmissionDetail({ student, submission }) {
  if (!student) {
    return (
      <div className="bg-surface rounded-xl shadow-level-1 border border-[#F1F5F9] p-6">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4">
            <FileDown className="h-8 w-8 text-outline" />
          </div>
          <p className="text-on-surface-variant">Pilih siswa untuk melihat detail pengumpulan</p>
        </div>
      </div>
    )
  }

  const isSubmitted = submission && (submission.file || submission.file_data_url)

  return (
    <div className="bg-surface rounded-xl shadow-level-1 border border-[#F1F5F9] p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-headline-sm text-headline-sm text-primary">Detail Pengumpulan</h3>
        {isSubmitted ? (
          <span className="bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            {submission?.submitted_at ? `Dikumpulkan ${submission.submitted_at}` : 'Tepat Waktu'}
          </span>
        ) : (
          <span className="bg-error-container text-on-error-container px-3 py-1 rounded-full font-label-sm text-label-sm">
            Belum Mengumpulkan
          </span>
        )}
      </div>

      {isSubmitted ? (
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <div className="w-full sm:w-1/3 bg-surface-container-lowest rounded-lg border border-outline-variant p-4 text-center">
            <Code className="h-12 w-12 text-secondary mx-auto mb-2" />
            <p className="font-label-md text-label-md truncate">{submission.file}</p>
            {submission.file_data_url && (
              <a
                href={submission.file_data_url}
                download={submission.file}
                className="mt-3 text-secondary font-label-sm text-label-sm hover:underline flex items-center justify-center gap-1 mx-auto"
              >
                <Download className="h-3 w-3" />
                Unduh Berkas
              </a>
            )}
            {!submission.file_data_url && (
              <button className="mt-3 text-secondary font-label-sm text-label-sm hover:underline flex items-center justify-center gap-1 mx-auto">
                <FileDown className="h-3 w-3" />
                Unduh Berkas
              </button>
            )}
          </div>

          <div className="flex-1 space-y-3">
            {(submission.link || submission.github) && (
              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Tautan</label>
                <a
                  href={`https://${submission.link || submission.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body-sm text-body-sm text-secondary flex items-center gap-1 hover:underline"
                >
                  <LinkIcon className="h-4 w-4" />
                  {submission.link || submission.github}
                </a>
              </div>
            )}

            {(submission.note || submission.catatan) && (
              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Catatan Siswa</label>
                <div className="flex gap-2">
                  <MessageSquare className="h-4 w-4 text-outline shrink-0 mt-0.5" />
                  <p className="font-body-sm text-body-sm text-on-surface bg-surface-container-low p-3 rounded-lg border border-outline-variant italic">
                    "{submission.note || submission.catatan}"
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-12 h-12 bg-error-container rounded-full flex items-center justify-center mb-3">
            <FileDown className="h-6 w-6 text-on-error-container" />
          </div>
          <p className="font-label-md text-label-md text-on-surface-variant">{student.nama} belum mengumpulkan tugas ini</p>
        </div>
      )}
    </div>
  )
}
