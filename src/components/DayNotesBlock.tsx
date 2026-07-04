import { useState } from "react";

interface Props {
  notes: string;
  onSave: (notes: string) => void;
}

export default function DayNotesBlock({ notes, onSave }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(notes);

  function startEdit() {
    setDraft(notes);
    setEditing(true);
  }

  function save() {
    onSave(draft);
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="info-box">
        <div className="info-box-title">📌 Notas</div>
        <textarea
          className="notes-editor"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Escribe aquí las notas del día…"
          autoFocus
        />
        <div className="edit-actions">
          <button className="btn-sm ghost" onClick={() => setEditing(false)}>
            Cancelar
          </button>
          <button className="btn-sm solid" onClick={save}>
            Guardar
          </button>
        </div>
      </div>
    );
  }

  const hasNotes = notes.trim().length > 0;

  return (
    <div className="info-box">
      <div className="info-box-head">
        <span className="info-box-title">📌 Notas</span>
        <button className="tool-btn" onClick={startEdit} aria-label="Editar notas">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 20h9" strokeLinecap="round" />
            <path
              d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      {hasNotes ? (
        <div className="notes-text">{notes}</div>
      ) : (
        <button className="add-notes" onClick={startEdit}>
          ＋ Añadir notas
        </button>
      )}
    </div>
  );
}
