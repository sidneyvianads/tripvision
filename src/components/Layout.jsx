import { useState } from "react";
import { Phone, LogOut, Shield } from "lucide-react";
import Contacts from "./Contacts";

export default function Layout({ tabLabel, user, onLogout, onOpenAdmin, children }) {
  const [contactsOpen, setContactsOpen] = useState(false);

  const initial = (user?.nome ?? "?").trim().charAt(0).toUpperCase();
  const firstName = (user?.nome ?? "").trim().split(/\s+/)[0];
  const cor = user?.avatar_cor ?? "#FF6B6B";

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F5]">
      <header className="gradient-header text-white safe-top">
        <div className="px-4 pt-4 pb-5 flex items-center gap-3">
          <div className="text-2xl">🧳</div>
          <div className="flex-1 min-w-0">
            <div className="font-display font-extrabold text-lg leading-tight">TripVision</div>
            <div className="text-white/80 text-xs truncate">
              {firstName ? `Olá, ${firstName}!` : "Serra Catarinense & Gaúcha 2026"}
            </div>
          </div>
          {user?.is_admin && onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="rounded-full bg-white/20 hover:bg-white/30 transition p-2"
              aria-label="Admin"
              title="Admin"
            >
              <Shield className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setContactsOpen(true)}
            className="rounded-full bg-white/20 hover:bg-white/30 transition p-2"
            aria-label="Contatos"
          >
            <Phone className="w-4 h-4" />
          </button>
          {onLogout && (
            <button
              onClick={onLogout}
              className="rounded-full bg-white/20 hover:bg-white/30 transition p-2"
              aria-label="Sair"
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
          {firstName && (
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
              style={{ background: cor, boxShadow: "0 0 0 2px rgba(255,255,255,0.4)" }}
              aria-hidden
            >
              {initial}
            </div>
          )}
        </div>
        {tabLabel && (
          <div className="px-4 pb-4 -mt-1 text-white/90 text-sm font-display font-bold">
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
