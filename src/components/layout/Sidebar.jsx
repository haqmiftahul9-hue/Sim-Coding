import { NavLink } from 'react-router-dom'
import { navItems, settingsItem } from '../../config/navigation'

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] flex-col bg-navy lg:flex">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-6">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqf2hMxQ6SFX5ZMjnreNEmfPVBlqE-EGkXLHetoE92kAzVZ4EMMBWKJUC_f6P7umuUSLQDftEBXkXlmVfrl3WCgyWTWlbA0G0xLvUDLo6KzGltftJtJseZjOzRL1595kcRU4lndlsQc0ywHgspg2nWBplws8dQLCsAUYw67XY8DW1GdxaZNZztJ1UbKOhnKhYlh2Ou0AoeDERetD0ytuV6fNQkKX0rNqRB4UEelej2aqBtpUgW4Itj8A"
          alt="SimCoding Admin"
          className="h-10 w-10 rounded-full object-cover bg-navy-light"
        />
        <div>
          <h2 className="font-display text-base font-bold leading-tight text-white">
            SimCoding Admin
          </h2>
          <p className="text-xs text-slate-300">Administrator Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          if (item.active) {
            return (
              <span
                key={item.id}
                className="flex items-center gap-3 rounded-lg border-l-2 border-brand bg-white/10 px-3 py-2.5 text-sm font-semibold text-white"
                aria-current="page"
              >
                <Icon className="h-5 w-5 text-white" strokeWidth={2} />
                {item.label}
              </span>
            )
          }
          return (
            <NavLink
              key={item.id}
              to={item.to}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#D1D5DB] transition-colors hover:bg-brand/15 hover:text-white"
            >
              <Icon className="h-5 w-5 text-[#CBD5E1]" strokeWidth={2} />
              {item.label}
            </NavLink>
          )
        })}
      </nav>

      {/* Settings */}
      <div className="border-t border-white/10 px-3 py-4">
        <NavLink
          to={settingsItem.to}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#D1D5DB] transition-colors hover:bg-brand/15 hover:text-white"
        >
          <settingsItem.icon className="h-5 w-5 text-[#CBD5E1]" strokeWidth={2} />
          {settingsItem.label}
        </NavLink>
      </div>
    </aside>
  )
}
