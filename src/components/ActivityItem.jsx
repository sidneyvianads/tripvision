import { ACTIVITY_TYPES } from "../data/tripData";

export default function ActivityItem({ activity, isLast }) {
  const t = ACTIVITY_TYPES[activity.type] ?? ACTIVITY_TYPES.livre;
  const isOpen = activity.status === "aberto";

  return (
    <div className="relative pl-9 pb-5 last:pb-0">
      {!isLast && (
        <span
          aria-hidden
          className="absolute left-3 top-5 bottom-0 w-0.5 rounded-full"
          style={{ background: "rgba(124, 185, 232, 0.35)" }}
        />
      )}
      <span
        aria-hidden
        className="absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center text-xs"
        style={{
          background: t.bg,
          border: `2px solid ${t.color}`,
          boxShadow: `0 0 0 3px rgba(124, 185, 232, 0.10)`,
        }}
      >
        {t.icon}
      </span>

      <div className="flex items-baseline gap-2">
        <span className="font-display font-extrabold text-sm tabular text-[#0F1B2D]">
          {activity.time}
        </span>
        {isOpen && (
          <span className="badge bg-amber-100 text-amber-800">em aberto</span>
        )}
      </div>
      <div className={`mt-0.5 font-display font-bold text-base ${isOpen ? "text-[#1A3A4A]/40" : "text-[#0F1B2D]"}`}>
        {activity.title}
      </div>
      {activity.desc && (
        <div className={`text-sm ${isOpen ? "text-[#1A3A4A]/40" : "text-[#1A3A4A]/75"}`}>
          {activity.desc}
        </div>
      )}
      {activity.price && (
        <div className="mt-1.5">
          <span
            className="badge"
            style={{ background: "rgba(212, 165, 116, 0.18)", color: "#8B6F47" }}
          >
            {activity.price}
          </span>
        </div>
      )}
    </div>
  );
}
