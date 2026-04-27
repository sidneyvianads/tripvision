import { useState } from "react";
import { Phone, LogOut, Shield } from "lucide-react";
import Contacts from "./Contacts";
import Mountains from "./ambient/Mountains";

export default function Layout({ tabLabel, user, onLogout, onOpenAdmin, children }) {
  const [contactsOpen, setContactsOpen] = useState(false);

  const initial = (user?.nome ?? "?").trim().charAt(0).toUpperCase();
  const firstName = (user?.nome ?? "").trim().split(/\s+/)[0];
  const cor = user?.avatar_cor ?? "#7CB9E8";

  return (
    <div className="min-h-screen flex flex-col gradient-winter">
      <header className="gradient-header text-white safe-top relative overflow-hidden">
        <Mountains className="h-16" color="#7CB9E8" />

        <div className="px-4 pt-4 pb-5 flex items-center gap-3 relative z-10">
          <div className="text-2xl">❄️</div>
          <div className="flex-1 min-w-0">
            <div className="font-display font-extrabold text-lg leading-tight">TripVision</div>
            <div className="text-[#7CB9E8] text-xs truncate font-display font-bold tracking-wide">
              {firstName ? `Olá, ${firstName}!` : "Inverno 2026 · Serra"}
            </div>
          </div>
          {user?.is_admin && onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="rounded-full bg-white/15 hover:bg-white/25 transition p-2"
              aria-label="Admin"
              title="Admin"
            >
              <Shield className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setContactsOpen(true)}
            className="rounded-full bg-white/15 hover:bg-white/25 transition p-2"
            aria-label="Contatos"
          >
            <Phone className="w-4 h-4" />
          </button>
          {onLogout && (
            <button
              onClick={onLogout}
              className="rounded-full bg-white/15 hover:bg-white/25 transition p-2"
              aria-label="Sair"
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
          {firstName && (
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
              style={{ background: cor, boxShadow: "0 0 0 2px rgba(255,255,255,0.45)" }}
              aria-hidden
            >
              {initial}
            </div>
          )}
        </div>

        {tabLabel && (
          <div className="px-4 pb-3 -mt-1 text-white/85 text-sm font-display font-bold relative z-10">
            {tabLabel}
          </div>
        )}
      </header>

      <main className="flex-1 overflow-y-auto pb-24">
        {children}
      </main>

      {contactsOpen && (
        <Contacts onClose={() => setContactsOpen(false)} />
      )}
    </div>
  );
}
