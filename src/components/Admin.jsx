import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Trash2, Save, Loader2, AlertTriangle } from "lucide-react";
import { useRoteiro, saveDay } from "../hooks/useRoteiro";
import { ACTIVITY_TYPES } from "../data/tripData";

const TYPE_OPTIONS = Object.keys(ACTIVITY_TYPES);
const STATUS_OPTIONS = ["confirmado", "aberto"];
const empty = () => ({ time: "", title: "", type: "passeio", desc: "", price: null, status: "confirmado" });

export default function Admin({ onBack }) {
  const { days, loading, usingFallback } = useRoteiro();
  const [editingDay, setEditingDay] = useState(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF9F5]">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF6B6B]" />
      </div>
    );
  }

  if (editingDay) {
    return (
      <DayEditor
        day={editingDay}
        onCancel={() => setEditingDay(null)}
        onSaved={() => setEditingDay(null)}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F5]">
      <header className="gradient-header text-white safe-top">
        <div className="px-4 py-4 flex items-center gap-3">
          <button onClick={onBack} className="rounded-full bg-white/20 hover:bg-white/30 p-2" aria-label="Voltar">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1">
            <div className="font-display font-extrabold text-lg leading-tight">Admin · Roteiro</div>
            <div className="text-white/80 text-xs">Editar atividades dos 14 dias</div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {usingFallback && (
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-amber-900 text-sm flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>Sem conexão com Supabase — alterações não serão salvas.</span>
          </div>
        )}
        {days.map((d) => (
          <button
            key={d.day}
            onClick={() => setEditingDay(d)}
            className="card w-full p-3 flex items-center gap-3 text-left active:scale-[0.99]"
          >
            <div className="text-2xl">{d.cover}</div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] uppercase font-display font-bold text-[#B2BEC3] tabular tracking-wide">
                Dia {d.day} · {d.weekday} {d.date?.slice(8, 10)}/{d.date?.slice(5, 7)}
              </div>
              <div className="font-display font-extrabold truncate">{d.title}</div>
              <div className="text-xs text-[#636E72]">
                {d.activities.length} atividades · {d.city}
              </div>
            </div>
          </button>
        ))}
      </main>
    </div>
  );
}

function DayEditor({ day: initial, onCancel, onSaved }) {
  const [day, setDay] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  const setField = (k, v) => setDay((d) => ({ ...d, [k]: v }));
  const setActivity = (idx, patch) => setDay((d) => {
    const next = [...d.activities];
    next[idx] = { ...next[idx], ...patch };
    return { ...d, activities: next };
  });
  const addActivity = () => setDay((d) => ({ ...d, activities: [...d.activities, empty()] }));
  const removeActivity = (idx) => setDay((d) => ({ ...d, activities: d.activities.filter((_, i) => i !== idx) }));
  const moveActivity = (idx, dir) => setDay((d) => {
    const target = idx + dir;
    if (target < 0 || target >= d.activities.length) return d;
    const next = [...d.activities];
    [next[idx], next[target]] = [next[target], next[idx]];
    return { ...d, activities: next };
  });

  const handleSave = async () => {
    setSaving(true);
    setErr(null);
    const cleaned = {
      ...day,
      activities: day.activities.map((a) => ({
        time: (a.time ?? "").trim(),
        title: (a.title ?? "").trim(),
        desc: (a.desc ?? "").trim(),
        type: a.type ?? "passeio",
        price: a.price ? String(a.price).trim() || null : null,
        status: a.status ?? "confirmado",
      })),
    };
    const { error } = await saveDay(cleaned);
    setSaving(false);
    if (error) setErr(error.message);
    else onSaved();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F5]">
      <header className="gradient-header text-white safe-top">
        <div className="px-4 py-4 flex items-center gap-2">
          <button onClick={onCancel} className="rounded-full bg-white/20 hover:bg-white/30 p-2" aria-label="Voltar">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1">
            <div className="text-[11px] font-display font-bold opacity-90 uppercase tracking-wide">
              Dia {day.day} · {day.weekday}
            </div>
            <div className="font-display font-extrabold text-lg leading-tight truncate">{day.title}</div>
          </div>
          <button onClick={handleSave} className="rounded-full bg-white text-[#FF6B6B] px-3 py-2 inline-flex items-center gap-1.5 text-sm font-display font-extrabold disabled:opacity-50" disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Salvar
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        <section className="card p-3 space-y-2">
          <Field label="Título" value={day.title ?? ""} onChange={(v) => setField("title", v)} />
          <Field label="Cidade" value={day.city ?? ""} onChange={(v) => setField("city", v)} />
          <Field label="Hotel" value={day.hotel ?? ""} onChange={(v) => setField("hotel", v)} />
          <Field label="Telefone hotel" value={day.hotelPhone ?? ""} onChange={(v) => setField("hotelPhone", v)} />
          <Field label="Endereço hotel" value={day.hotelAddress ?? ""} onChange={(v) => setField("hotelAddress", v)} />
          <Field label="Cover (emoji)" value={day.cover ?? ""} onChange={(v) => setField("cover", v)} />
          <Field
            label="Alerta (deixe vazio se não houver)"
            value={day.alert ?? ""}
            onChange={(v) => setField("alert", v.trim() === "" ? null : v)}
          />
        </section>

        <section className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <div className="font-display font-extrabold">Atividades ({day.activities.length})</div>
            <button onClick={addActivity} className="text-sm font-display font-bold text-[#FF6B6B] inline-flex items-center gap-1">
              <Plus className="w-4 h-4" /> Adicionar
            </button>
          </div>

          {day.activities.map((a, idx) => (
            <div key={idx} className="card p-3 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  className="input !py-2"
                  style={{ maxWidth: 110 }}
                  value={a.time ?? ""}
                  onChange={(e) => setActivity(idx, { time: e.target.value })}
                />
                <select
                  className="input !py-2 flex-1"
                  value={a.type ?? "passeio"}
                  onChange={(e) => setActivity(idx, { type: e.target.value })}
                >
                  {TYPE_OPTIONS.map((t) => (
                    <option key={t} value={t}>{ACTIVITY_TYPES[t].icon} {ACTIVITY_TYPES[t].label}</option>
                  ))}
                </select>
                <button onClick={() => moveActivity(idx, -1)} className="text-[#B2BEC3] px-1" aria-label="Mover pra cima">↑</button>
                <button onClick={() => moveActivity(idx, +1)} className="text-[#B2BEC3] px-1" aria-label="Mover pra baixo">↓</button>
                <button onClick={() => removeActivity(idx)} className="text-red-500 p-1" aria-label="Remover">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <input
                className="input"
                placeholder="Título"
                value={a.title ?? ""}
                onChange={(e) => setActivity(idx, { title: e.target.value })}
              />
              <input
                className="input"
                placeholder="Descrição"
                value={a.desc ?? ""}
                onChange={(e) => setActivity(idx, { desc: e.target.value })}
              />
              <div className="flex gap-2">
                <input
                  className="input flex-1"
                  placeholder="Preço (ex: R$79,90)"
                  value={a.price ?? ""}
                  onChange={(e) => setActivity(idx, { price: e.target.value || null })}
                />
                <select
                  className="input flex-1"
                  value={a.status ?? "confirmado"}
                  onChange={(e) => setActivity(idx, { status: e.target.value })}
                >
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          ))}

          {day.activities.length === 0 && (
            <div className="card p-6 text-center text-[#B2BEC3] text-sm">
              Nenhuma atividade. Clique em "Adicionar".
            </div>
          )}
        </section>

        {err && <div className="text-red-600 text-sm text-center">{err}</div>}

        <button onClick={handleSave} className="btn-primary w-full inline-flex items-center justify-center gap-2 mt-4" disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Salvar alterações
        </button>
      </main>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="text-xs font-display font-bold text-[#636E72]">{label}</span>
      <input
        className="input mt-1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
