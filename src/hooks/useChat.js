import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [profilesById, setProfilesById] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadInitial() {
      const { data, error } = await supabase
        .from("tv_messages")
        .select("id, user_id, content, created_at")
        .order("created_at", { ascending: false })
        .limit(100);
      if (!active) return;
      if (error) {
        setError(error.message);
      } else {
        setMessages([...(data ?? [])].reverse());
      }
      setLoading(false);
    }

    loadInitial();

    const channel = supabase
      .channel("tv_messages-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "tv_messages" },
        (payload) => {
          setMessages((prev) =>
            prev.some((m) => m.id === payload.new.id) ? prev : [...prev, payload.new]
          );
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const missingIds = Array.from(
      new Set(
        messages
          .map((m) => m.user_id)
          .filter((id) => id && !profilesById[id])
      )
    );
    if (missingIds.length === 0) return;
    let active = true;
    supabase
      .from("tv_users")
      .select("id, nome, avatar_cor")
      .in("id", missingIds)
      .then(({ data }) => {
        if (!active || !data) return;
        setProfilesById((prev) => {
          const next = { ...prev };
          for (const p of data) next[p.id] = p;
          return next;
        });
      });
    return () => { active = false; };
  }, [messages, profilesById]);

  const sendMessage = useCallback(async (content, userId) => {
    if (!content?.trim() || !userId) return;
    const { error } = await supabase
      .from("tv_messages")
      .insert({ content: content.trim(), user_id: userId });
    if (error) setError(error.message);
  }, []);

  return { messages, profilesById, loading, error, sendMessage };
}
