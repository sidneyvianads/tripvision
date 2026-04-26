import { useState } from "react";
import { Phone } from "lucide-react";
import Contacts from "./Contacts";

export default function Layout({ tabLabel, children }) {
  const [contactsOpen, setContactsOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F5]">
      <header className="gradient-header text-white safe-top">
        <div className="px-4 pt-4 pb-5 flex items-center gap-3">
          <div className="text-2xl">🧳</div>
          <div className="flex-1 min-w-0">
            <div className="font-display font-extrabold text-lg leading-tight">TripVision</div>
            <div className="text-white/80 text-xs truncate">Serra Catarinense & Gaúcha 2026</div>
          </div>
          <button
            onClick={() => setContactsOpen(true)}
            className="rounded-full bg-white/20 hover:bg-white/30 transition p-2"
            aria-label="Contatos"
          >
            <Phone className="w-4 h-4" />
          </button>
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
