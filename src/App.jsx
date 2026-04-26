import { useEffect, useState, useMemo } from "react";
import Layout from "./components/Layout";
import TabBar from "./components/TabBar";
import Welcome from "./components/Welcome";
import Countdown from "./components/Countdown";
import DayCard from "./components/DayCard";
import AiChat from "./components/AiChat";
import Checklist from "./components/Checklist";
import TRIP_DATA from "./data/tripData";

const USER_KEY = "tripvision:user";

const TAB_TITLES = {
  roteiro: "📅 Roteiro",
  ia:      "🤖 Concierge IA",
  tarefas: "✅ Tarefas",
};

function loadUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.nome ? parsed : null;
  } catch {
    return null;
  }
}

export default function App() {
  const [user, setUser] = useState(() => loadUser());
  const [tab, setTab] = useState("roteiro");

  const handleEnter = (nome) => {
    const value = { nome, since: new Date().toISOString() };
    try { localStorage.setItem(USER_KEY, JSON.stringify(value)); } catch {}
    setUser(value);
  };

  const handleLogout = () => {
    if (!confirm("Sair? Seus dados ficam salvos neste navegador.")) return;
    try { localStorage.removeItem(USER_KEY); } catch {}
    setUser(null);
  };

  if (!user) return <Welcome onSubmit={handleEnter} />;

  return (
    <>
      <Layout
        tabLabel={TAB_TITLES[tab]}
        userName={user.nome}
        onLogout={handleLogout}
      >
        {tab === "roteiro" && <RoteiroView />}
        {tab === "ia"      && <AiChat />}
        {tab === "tarefas" && <Checklist />}
      </Layout>
      <TabBar active={tab} onChange={setTab} />
    </>
  );
}

function RoteiroView() {
  const todayKey = new Date().toISOString().slice(0, 10);

  const initialExpanded = useMemo(() => {
    const todayIdx = TRIP_DATA.findIndex((d) => d.date === todayKey);
    if (todayIdx >= 0) return TRIP_DATA[todayIdx].day;
    if (todayKey < TRIP_DATA[0].date) return 1;
    return null;
  }, [todayKey]);

  const [expanded, setExpanded] = useState(initialExpanded);

  useEffect(() => {
    if (expanded != null) {
      setTimeout(() => {
        const el = document.getElementById(`day-${expanded}`);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    }
  }, [expanded]);

  return (
    <div>
      <Countdown />
      <div className="px-4 mt-5 space-y-3 pb-4">
        {TRIP_DATA.map((day) => (
          <div id={`day-${day.day}`} key={day.day} style={{ scrollMarginTop: 16 }}>
            <DayCard
              day={day}
              expanded={expanded === day.day}
              onToggle={() => setExpanded(expanded === day.day ? null : day.day)}
              isToday={day.date === todayKey}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
