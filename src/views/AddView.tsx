import { useState } from "react";
import { DAYS } from "../data/trip";

interface Props {
  onAdd: (input: { title: string; notes?: string; day: string | null }) => Promise<void>;
  goToDays: () => void;
}

export default function AddView({ onAdd, goToDays }: Props) {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [day, setDay] = useState<string>("__wishlist__");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    await onAdd({
      title,
      notes,
      day: day === "__wishlist__" ? null : day,
    });
    setSaving(false);
    setTitle("");
    setNotes("");
    setDone(true);
    setTimeout(() => setDone(false), 2500);
  }

  return (
    <>
      <div className="day-head">
        <h2>Añadir algo nuevo</h2>
        <p>Una cosa que queréis ver o hacer.</p>
      </div>
      <form className="form" onSubmit={submit}>
        <div className="field">
          <label htmlFor="title">¿Qué es?</label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: Heladería de Torvehallerne"
            autoComplete="off"
          />
        </div>
        <div className="field">
          <label htmlFor="notes">Notas (opcional)</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Dirección, horario, por qué nos interesa…"
          />
        </div>
        <div className="field">
          <label htmlFor="day">¿Para qué día?</label>
          <select id="day" value={day} onChange={(e) => setDay(e.target.value)}>
            <option value="__wishlist__">Lista de deseos (sin día)</option>
            {DAYS.map((d) => (
              <option key={d.key} value={d.key}>
                {d.label} · {d.title}
              </option>
            ))}
          </select>
        </div>
        <button className="btn-primary" type="submit" disabled={saving || !title.trim()}>
          {saving ? "Guardando…" : "Añadir"}
        </button>
        {done && (
          <div className="toast" onClick={goToDays}>
            ✓ Añadido. ¡Toca aquí para verlo!
          </div>
        )}
      </form>
    </>
  );
}
