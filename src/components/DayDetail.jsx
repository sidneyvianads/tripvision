import { AlertTriangle, MapPin, Phone } from "lucide-react";
import { CITIES } from "../data/tripData";
import ActivityItem from "./ActivityItem";

export default function DayDetail({ day }) {
  const city = CITIES[day.city];
  return (
    <div className="animate-fade-up">
      <div
        className="rounded-2xl p-4 text-white mb-4 flex items-center gap-3 relative overflow-hidden"
        style={{ background: city?.gradient ?? "#1A3A4A" }}
      >
        <div className="absolute -right-2 -top-2 text-6xl opacity-15">{city?.icon}</div>
        <div className="text-3xl relative z-10">{day.cover}</div>
        <div className="flex-1 relative z-10">
          <div className="text-xs opacity-90 font-display font-bold uppercase tracking-wide">
            Dia {day.day} • {day.weekday} {formatBR(day.date)}
          </div>
          <div className="font-display font-extrabold text-lg leading-tight">{day.title}</div>
        </div>
      </div>

      {day.alert && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 mb-4 flex items-start gap-2 text-amber-900 text-sm">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{day.alert}</span>
        </div>
      )}

      <div className="card p-4">
        {day.activities.map((a, idx) => (
          <ActivityItem
            key={idx}
            activity={a}
            isLast={idx === day.activities.length - 1}
          />
        ))}
      </div>

      {day.hotel && (
        <div className="card p-4 mt-3">
          <div className="text-xs uppercase font-display font-bold text-[#1A3A4A]/70 tracking-wide">Hotel</div>
          <div className="font-display font-extrabold text-base mt-0.5 text-[#0F1B2D]">{day.hotel}</div>
          {day.hotelAddress && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(day.hotelAddress + " " + day.city)}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-sm text-[#2E86C1] hover:underline"
            >
              <MapPin className="w-3.5 h-3.5" />
              {day.hotelAddress}
            </a>
          )}
          {day.hotelPhone && (
            <a
              href={`tel:${day.hotelPhone.replace(/\D/g, "")}`}
              className="mt-2 ml-3 inline-flex items-center gap-1.5 text-sm text-[#27AE60] hover:underline"
            >
              <Phone className="w-3.5 h-3.5" />
              {day.hotelPhone}
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function formatBR(iso) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}`;
}
