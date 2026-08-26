import { ChevronLeft, ChevronRight } from 'lucide-react'

// Windowed pagination: prev, nomor halaman (dengan ellipsis), next.
function getPages(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  if (start > 2) pages.push('...')
  for (let p = start; p <= end; p++) pages.push(p)
  if (end < total - 1) pages.push('...')
  pages.push(total)
  return pages
}

export default function Pagination({ from, to, total, page, totalPages, onPageChange }) {
  const pages = getPages(page, totalPages)
  const btn =
    'flex h-8 min-w-8 items-center justify-center rounded border px-2 text-sm transition-colors'

  return (
    <div className="flex flex-col gap-3 border-t border-surface-border bg-white p-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
      <span>
        Menampilkan {from}-{to} dari {total} siswa
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className={`${btn} border-surface-border hover:bg-surface disabled:opacity-40`}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`e${i}`} className="px-1 text-slate-400">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={
                p === page
                  ? `${btn} border-brand bg-brand-50 font-medium text-navy`
                  : `${btn} border-surface-border hover:bg-surface`
              }
            >
              {p}
            </button>
          )
        )}
        <button
          type="button"
          disabled={page === totalPages || totalPages === 0}
          onClick={() => onPageChange(page + 1)}
          className={`${btn} border-surface-border hover:bg-surface disabled:opacity-40`}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
