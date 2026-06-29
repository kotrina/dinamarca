import type { Item } from "../lib/types";
import { DAYS } from "../data/trip";

const DAY_LABEL = new Map(DAYS.map((d) => [d.key, d.label]));

interface Props {
  item: Item;
  onToggle: (item: Item) => void;
  onRemove?: (item: Item) => void;
  showDayTag?: boolean;
}

export default function ItemRow({ item, onToggle, onRemove, showDayTag }: Props) {
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
      {item.is_custom && onRemove && (
        <button
          className="del-btn"
          onClick={() => {
            if (confirm(`¿Borrar "${item.title}"?`)) onRemove(item);
          }}
          aria-label="Borrar"
        >
          ✕
        </button>
      )}
    </div>
  );
}
