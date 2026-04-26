import { CalendarDays, Bot, CheckSquare } from "lucide-react";

const TABS = [
  { id: "roteiro", label: "Roteiro", Icon: CalendarDays },
  { id: "ia",      label: "IA",      Icon: Bot },
  { id: "tarefas", label: "Tarefas", Icon: CheckSquare },
];

export default function TabBar({ active, onChange }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-[#FCE4D6] shadow-[0_-4px_24px_rgba(255,107,107,0.08)] safe-bottom">
      <div className="max-w-2xl mx-auto grid grid-cols-3">
        {TABS.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className="flex flex-col items-center justify-center gap-1 py-2.5 transition-colors"
              aria-label={label}
            >
              <Icon
                className="w-5 h-5"
                style={{ color: isActive ? "#FF6B6B" : "#B2BEC3" }}
                strokeWidth={isActive ? 2.5 : 2}
                fill={isActive ? "rgba(255,107,107,0.12)" : "none"}
              />
              <span
                className="text-[11px] font-display font-bold"
                style={{ color: isActive ? "#FF6B6B" : "#B2BEC3" }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
