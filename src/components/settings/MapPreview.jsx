import { MapPin } from 'lucide-react'

export default function MapPreview({ latitude, longitude, radius }) {
  return (
    <div className="flex-1 rounded-xl overflow-hidden border border-outline-variant/50 relative min-h-[250px] bg-surface-container-low">
      <img
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKaOqkl25uUlqC_zaEguG2J_71ChlhqkJLTwEnN_g463qxhqNBsDrXrqyHNaXquS4cG8vRteUprFC1f5Hg50lLjDnOT4I_u1FgMuc-J9ImnK_UPUcKZZ70uwx4vMLkD_cfItrEcfMaV3nMpqLkuT_uLQsejwo-vIPzMqYinV7PG4pqNe0KjXx0FolpgbtOkdv8lNOTfyReDRZZ45Ji9YgPItAZZLmpFQbUhV0jhBVXUK9oAtE_T-yr6A"
        alt="Map Location"
        className="w-full h-full object-cover absolute inset-0"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-4 h-4 bg-error rounded-full border-2 border-white shadow-md relative z-10" />
        <div
          className="bg-secondary/20 rounded-full border border-secondary/50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            width: `${Math.min(radius / 2, 150)}px`,
            height: `${Math.min(radius / 2, 150)}px`,
          }}
        />
      </div>
      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
        <div className="flex items-center gap-2 text-xs text-on-surface">
          <MapPin className="h-3 w-3 text-secondary" />
          <span>{latitude}, {longitude}</span>
        </div>
      </div>
    </div>
  )
}
