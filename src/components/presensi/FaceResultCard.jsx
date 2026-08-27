import { UserRound, CheckCircle2, ScanFace, Clock, AlertCircle } from 'lucide-react'

export default function FaceResultCard({ result, onClose }) {
  if (!result) return null

  const isSuccess = !result.notFound

  return (
    <div className={`mt-5 rounded-xl border p-5 ${isSuccess ? 'border-surface-border bg-surface' : 'border-red-200 bg-red-50'}`}>
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-surface-border bg-navy/10">
          {result.avatar ? (
            <img src={result.avatar} alt={result.nama} className="h-full w-full object-cover" />
          ) : (
            <UserRound className="h-7 w-7 text-navy" />
          )}
        </div>
        <div className="flex-1">
          <p className="font-display text-lg font-bold text-navy">{result.nama}</p>
          <p className="text-sm text-slate-500">{result.kelas}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Tutup"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy/10">
            <ScanFace className="h-4 w-4 text-navy" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Metode</p>
            <p className="text-sm font-semibold text-navy">Scan Wajah</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy/10">
            <Clock className="h-4 w-4 text-navy" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Waktu</p>
            <p className="text-sm font-semibold text-navy">{result.waktu}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy/10">
            <UserRound className="h-4 w-4 text-navy" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Status</p>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                result.status === 'Hadir'
                  ? 'bg-emerald-50 text-emerald-700'
                  : result.status === 'Terlambat'
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-red-50 text-red-500'
              }`}
            >
              {result.status}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy/10">
            {isSuccess ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
          </div>
          <div>
            <p className="text-xs text-slate-400">Verifikasi</p>
            <p className="text-sm font-semibold text-navy">
              {isSuccess ? `${result.confidence || 0}% cocok` : 'Gagal'}
            </p>
          </div>
        </div>
      </div>

      {isSuccess && (
        <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-emerald-600">
          <CheckCircle2 className="h-4 w-4" />
          Wajah berhasil dikenali. Presensi dicatat.
        </p>
      )}
      {!isSuccess && (
        <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-red-500">
          Wajah tidak dikenali. Silakan coba lagi atau hubungi admin.
        </p>
      )}
    </div>
  )
}
