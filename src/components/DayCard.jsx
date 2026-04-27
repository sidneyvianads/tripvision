import { ChevronDown } from "lucide-react";
import { CITIES } from "../data/tripData";
import DayDetail from "./DayDetail";

export default function DayCard({ day, expanded, onToggle, isToday }) {
  const city = CITIES[day.city];

  return (
    <article
      className="card overflow-hidden transition-shadow"
      style={{
        borderLeft: `4px solid ${city?.text ?? "#7CB9E8"}`,
        boxShadow: expanded
          ? "0 12px 28px rgba(15, 27, 45, 0.35)"
          : "0 4px 16px rgba(15, 27, 45, 0.18)",
      }}
    >
      <button
        onClick={onToggle}
        className="w-full text-left flex items-center gap-3 p-4 hover:bg-[#E8F0FE]/40 transition-colors"
        aria-expanded={expanded}
      >
        <div className="text-3xl select-none">{day.cover}</div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-display font-bold tabular text-[#1A3A4A] uppercase tracking-wide">
              Dia {day.day} • {day.weekday} {formatBR(day.date)}
            </span>
            {isToday && (
              <span className="badge bg-emerald-100 text-emerald-700">HOJE</span>
            )}
            {day.alert && (
              <span className="badge bg-amber-100 text-amber-800">⚠️</span>
            )}
          </div>
          <div className="font-display font-extrabold text-base text-[#0F1B2D] leading-tight mt-0.5 truncate">
            {day.title}
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span
              className="badge"
              style={{ background: city?.badge, color: city?.text }}
            >
              <span>{city?.icon}</span>
              {day.city}
            </span>
            <span className="text-xs text-[#1A3A4A]/70 font-display font-bold">
              {day.activities.length} {day.activities.length === 1 ? "atividade" : "atividades"}
            </span>
          </div>
        </div>

        <ChevronDown
          className="w-5 h-5 text-[#7CB9E8] shrink-0 transition-transform"
          style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {expanded && (
        <div className="px-4 pb-4">
          <DayDetail day={day} />
        </div>
      )}
    </article>
  );
}

function formatBR(iso) {
  const [, m, d] = iso.split("-");
  return `${d}/${m}`;
}
