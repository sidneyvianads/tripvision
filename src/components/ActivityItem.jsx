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
          style={{ background: "#FCE4D6" }}
        />
      )}
      <span
        aria-hidden
        className="absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center text-xs"
        style={{ background: t.bg, border: `2px solid ${t.color}` }}
      >
        {t.icon}
      </span>

      <div className="flex items-baseline gap-2">
        <span className="font-display font-extrabold text-sm tabular text-[#2D3436]">
          {activity.time}
        </span>
        {isOpen && (
          <span className="badge bg-amber-100 text-amber-800">em aberto</span>
        )}
      </div>
      <div className={`mt-0.5 font-display font-bold text-base ${isOpen ? "text-[#B2BEC3]" : "text-[#2D3436]"}`}>
        {activity.title}
      </div>
      {activity.desc && (
        <div className={`text-sm ${isOpen ? "text-[#B2BEC3]" : "text-[#636E72]"}`}>
          {activity.desc}
        </div>
      )}
      {activity.price && (
        <div className="mt-1.5">
          <span className="badge bg-emerald-100 text-emerald-700">{activity.price}</span>
        </div>
      )}
    </div>
  );
}
