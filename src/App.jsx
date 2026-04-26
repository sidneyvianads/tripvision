import { useEffect, useState, useMemo } from "react";
import Layout from "./components/Layout";
import TabBar from "./components/TabBar";
import Welcome from "./components/Welcome";
import Countdown from "./components/Countdown";
import DayCard from "./components/DayCard";
import GroupChat from "./components/GroupChat";
import AiChat from "./components/AiChat";
import Checklist from "./components/Checklist";
import Admin from "./components/Admin";
import { useAuth } from "./hooks/useAuth";
import { useRoteiro } from "./hooks/useRoteiro";

const TAB_TITLES = {
  roteiro: "📅 Roteiro",
  chat:    "💬 Chat do grupo",
  ia:      "🤖 Concierge IA",
  tarefas: "✅ Tarefas",
};

function getRoute() {
  if (typeof window === "undefined") return "/";
  return window.location.pathname || "/";
}

function navigate(path) {
  if (typeof window === "undefined") return;
  if (window.location.pathname === path) return;
  window.history.pushState(null, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export default function App() {
  const { user, signOut } = useAuth();
  const [tab, setTab] = useState("roteiro");
  const [route, setRoute] = useState(getRoute);

  useEffect(() => {
    const onPop = () => setRoute(getRoute());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const handleLogout = () => {
    if (!confirm("Sair? Suas mensagens e progresso ficam salvos.")) return;
    signOut();
    navigate("/");
  };

  if (!user) return <Welcome />;

  if (route === "/admin") {
    if (!user.is_admin) {
      navigate("/");
      return null;
    }
    return <Admin onBack={() => navigate("/")} />;
  }

  return (
    <>
      <Layout
        tabLabel={TAB_TITLES[tab]}
        user={user}
        onLogout={handleLogout}
        onOpenAdmin={user.is_admin ? () => navigate("/admin") : undefined}
      >
        {tab === "roteiro" && <RoteiroView />}
        {tab === "chat"    && <GroupChat user={user} />}
        {tab === "ia"      && <AiChat />}
        {tab === "tarefas" && <Checklist user={user} />}
      </Layout>
      <TabBar active={tab} onChange={setTab} />
    </>
  );
}

function RoteiroView() {
  const { days } = useRoteiro();
  const todayKey = new Date().toISOString().slice(0, 10);

  const initialExpanded = useMemo(() => {
    if (!days?.length) return null;
    const todayIdx = days.findIndex((d) => d.date === todayKey);
    if (todayIdx >= 0) return days[todayIdx].day;
    if (todayKey < days[0].date) return 1;
    return null;
  }, [days, todayKey]);

  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (expanded == null && initialExpanded != null) setExpanded(initialExpanded);
  }, [initialExpanded, expanded]);

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
        {days.map((day) => (
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
