import { useEffect, useState, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "./hooks/useAuth";
import Login from "./components/Login";
import Layout from "./components/Layout";
import TabBar from "./components/TabBar";
import Countdown from "./components/Countdown";
import DayCard from "./components/DayCard";
import GroupChat from "./components/GroupChat";
import AiChat from "./components/AiChat";
import Checklist from "./components/Checklist";
import TRIP_DATA from "./data/tripData";

const TAB_TITLES = {
  roteiro: "📅 Roteiro",
  chat:    "💬 Chat do grupo",
  ia:      "🤖 Concierge IA",
  tarefas: "✅ Tarefas",
};

export default function App() {
  const { user, loading } = useAuth();
  const [tab, setTab] = useState("roteiro");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF9F5]">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF6B6B]" />
      </div>
    );
  }

  if (!user) return <Login />;

  return (
    <>
      <Layout tabLabel={TAB_TITLES[tab]}>
        {tab === "roteiro" && <RoteiroView />}
        {tab === "chat"    && <GroupChat />}
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
