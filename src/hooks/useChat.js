import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadInitial() {
      const { data, error } = await supabase
        .from("messages")
        .select("id, user_id, content, created_at, profiles ( nome, avatar_url )")
        .order("created_at", { ascending: true })
        .limit(200);

      if (!active) return;
      if (error) {
        setError(error.message);
      } else {
        setMessages(data ?? []);
      }
      setLoading(false);
    }

    loadInitial();

    const channel = supabase
      .channel("messages-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("nome, avatar_url")
            .eq("id", payload.new.user_id)
            .single();
          setMessages((prev) => [
            ...prev,
            { ...payload.new, profiles: profile },
          ]);
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const sendMessage = useCallback(async (content, userId) => {
    if (!content?.trim() || !userId) return;
    const { error } = await supabase
      .from("messages")
      .insert({ content: content.trim(), user_id: userId });
    if (error) setError(error.message);
  }, []);

  return { messages, loading, error, sendMessage };
}
