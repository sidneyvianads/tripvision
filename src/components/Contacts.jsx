import { Phone, MapPin, X } from "lucide-react";
import { CONTATOS, CITIES } from "../data/tripData";

export default function Contacts({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 animate-fade-up" onClick={onClose}>
      <div
        className="w-full sm:max-w-md sm:mx-4 rounded-t-3xl sm:rounded-2xl max-h-[85vh] overflow-hidden flex flex-col animate-pop"
        style={{ background: "linear-gradient(180deg, #E8F0FE 0%, #FFFFFF 100%)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="gradient-header text-white px-4 py-3 flex items-center gap-2">
          <div className="text-xl">📞</div>
          <div className="font-display font-extrabold flex-1">Contatos da viagem</div>
          <button onClick={onClose} className="p-1 rounded-full bg-white/15 hover:bg-white/25">
            <X className="w-4 h-4" />
          </button>
        </div>

        <ul className="flex-1 overflow-y-auto p-3 space-y-2">
          {CONTATOS.map((c, i) => {
            const city = CITIES[c.city];
            const telDigits = (c.tel ?? "").replace(/\D/g, "");
            const mapsQuery = encodeURIComponent(`${c.endereco ?? ""} ${c.loc ?? ""}`.trim());
            return (
              <li key={i} className="card p-3">
                <div className="flex items-start gap-3">
                  <div className="text-xl mt-0.5">{city?.icon ?? "📍"}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-extrabold text-[#0F1B2D]">{c.nome}</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span
                        className="badge"
                        style={{ background: city?.badge, color: city?.text }}
                      >
                        {c.loc}
                      </span>
                    </div>
                    {c.endereco && (
                      <div className="text-xs text-[#1A3A4A]/70 mt-1">{c.endereco}</div>
                    )}
                    {c.tel && (
                      <div className="text-xs text-[#1A3A4A]/70 mt-0.5">{c.tel}</div>
                    )}
                  </div>
                </div>

                <div className="mt-2.5 flex gap-2">
                  {telDigits && (
                    <a
                      href={`tel:${telDigits}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl text-white text-sm font-display font-bold py-2 hover:opacity-90"
                      style={{ background: "linear-gradient(135deg, #27AE60 0%, #1B6B3F 100%)" }}
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Ligar
                    </a>
                  )}
                  {mapsQuery && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl text-white text-sm font-display font-bold py-2 hover:opacity-90"
                      style={{ background: "linear-gradient(135deg, #2E86C1 0%, #1B4F72 100%)" }}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      Mapa
                    </a>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
