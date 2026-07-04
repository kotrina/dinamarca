import { useState } from "react";
import type { Item } from "../lib/types";
import { DAYS } from "../data/trip";

const DAY_LABEL = new Map(DAYS.map((d) => [d.key, d.label]));

interface Props {
  item: Item;
  onToggle: (item: Item) => void;
  onUpdate: (item: Item, changes: { title: string; notes: string }) => void;
  onRemove?: (item: Item) => void;
  showDayTag?: boolean;
}

export default function ItemRow({ item, onToggle, onUpdate, onRemove, showDayTag }: Props) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(item.title);
  const [notes, setNotes] = useState(item.notes ?? "");

  function startEdit() {
    setTitle(item.title);
    setNotes(item.notes ?? "");
    setEditing(true);
  }

  function save() {
    if (!title.trim()) return;
    onUpdate(item, { title, notes });
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="item editing">
        <div className="edit-form">
          <input
            className="edit-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título"
            autoFocus
          />
          <textarea
            className="edit-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Descripción (opcional)"
          />
          <div className="edit-actions">
            <button className="btn-sm ghost" onClick={() => setEditing(false)}>
              Cancelar
            </button>
            <button className="btn-sm solid" onClick={save} disabled={!title.trim()}>
              Guardar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`item${item.checked ? " checked" : ""}`}>
      <button
        className={`check${item.checked ? " on" : ""}`}
        onClick={() => onToggle(item)}
        aria-label={item.checked ? "Marcar como pendiente" : "Marcar como visto"}
      >
        <svg viewBox="0 0 24 24">
          <polyline points="4 12 10 18 20 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div className="item-body" onClick={() => onToggle(item)}>
        {showDayTag && (
          <span className="item-day-tag">
            {item.day ? DAY_LABEL.get(item.day) ?? `Día ${item.day}` : "Lista de deseos"}
          </span>
        )}
        <div className="item-title">{item.title}</div>
        {item.notes && <div className="item-notes">{item.notes}</div>}
      </div>
      <div className="item-tools">
        <button className="tool-btn" onClick={startEdit} aria-label="Editar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 20h9" strokeLinecap="round" />
            <path
              d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        {item.is_custom && onRemove && (
          <button
            className="tool-btn"
            onClick={() => {
              if (confirm(`¿Borrar "${item.title}"?`)) onRemove(item);
            }}
            aria-label="Borrar"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
