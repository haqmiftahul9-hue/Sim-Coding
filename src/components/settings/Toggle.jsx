export default function Toggle({ label, description, icon, checked, onChange }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-outline-variant/30 hover:bg-surface-container-low/50 transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-secondary-container/30 flex items-center justify-center text-on-secondary-container">
          {icon}
        </div>
        <div>
          <h3 className="font-label-md text-label-md text-on-surface">{label}</h3>
          {description && (
            <p className="font-body-sm text-body-sm text-outline">{description}</p>
          )}
        </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-outline-variant rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary" />
      </label>
    </div>
  )
}
