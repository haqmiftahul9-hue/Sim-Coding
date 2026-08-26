import { Bell, HelpCircle, Search } from 'lucide-react'
import { adminProfile } from '../../data/dummyData'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-surface-border bg-surface/90 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex flex-1 items-center">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari siswa atau tugas..."
            className="w-full rounded-full border border-surface-border bg-white py-2 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          aria-label="Notifikasi"
          className="rounded-full p-2 text-slate-500 transition-colors hover:bg-white hover:text-navy"
        >
          <Bell className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Bantuan"
          className="rounded-full p-2 text-slate-500 transition-colors hover:bg-white hover:text-navy"
        >
          <HelpCircle className="h-5 w-5" />
        </button>
        <div className="ml-1 h-9 w-9 overflow-hidden rounded-full border border-surface-border">
          <img
            src={adminProfile.avatar}
            alt="Profil Admin"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </header>
  )
}
