export default function SettingCard({ title, description, children }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl card-shadow border border-[#F1F5F9] overflow-hidden">
      <div className="px-lg py-md border-b border-outline-variant/30 bg-surface/50">
        <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">{title}</h2>
        {description && (
          <p className="font-body-sm text-body-sm text-outline mt-1">{description}</p>
        )}
      </div>
      <div className="p-lg">{children}</div>
    </div>
  )
}
