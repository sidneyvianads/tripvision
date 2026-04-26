import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import TRIP_DATA from "../data/tripData";

function rowToDay(r) {
  return {
    day: r.dia,
    date: r.data,
    weekday: r.weekday,
    title: r.title,
    city: r.city,
    hotel: r.hotel,
    hotelPhone: r.hotel_phone,
    hotelAddress: r.hotel_address,
    cover: r.cover,
    alert: r.alert,
    activities: Array.isArray(r.atividades) ? r.atividades : [],
    _id: r.id,
    _updatedAt: r.updated_at,
  };
}

export function useRoteiro() {
  const [days, setDays] = useState(TRIP_DATA);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const { data, error } = await supabase
        .from("tv_roteiro")
        .select("*")
        .order("dia", { ascending: true });
      if (!active) return;
      if (!error && Array.isArray(data) && data.length > 0) {
        setDays(data.map(rowToDay));
        setUsingFallback(false);
      }
      setLoading(false);
    };
    load();

    const channel = supabase
      .channel("tv_roteiro-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tv_roteiro" },
        (payload) => {
          if (payload.eventType === "UPDATE") {
            const updated = rowToDay(payload.new);
            setDays((prev) => prev.map((d) => (d.day === updated.day ? updated : d)));
          }
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return { days, loading, usingFallback };
}

export async function saveDay(day) {
  const payload = {
    weekday: day.weekday ?? null,
    title: day.title ?? null,
    city: day.city ?? null,
    hotel: day.hotel ?? null,
    hotel_phone: day.hotelPhone ?? null,
    hotel_address: day.hotelAddress ?? null,
    cover: day.cover ?? null,
    alert: day.alert ?? null,
    atividades: Array.isArray(day.activities) ? day.activities : [],
    updated_at: new Date().toISOString(),
  };
  return supabase.from("tv_roteiro").update(payload).eq("dia", day.day);
}
