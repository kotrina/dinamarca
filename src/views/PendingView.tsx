import { useMemo } from "react";
import type { Item } from "../lib/types";
import { DAYS } from "../data/trip";
import ItemRow from "../components/ItemRow";

interface Props {
  items: Item[];
  onToggle: (item: Item) => void;
  onRemove: (item: Item) => void;
}

// Orden de días + un grupo final para la lista de deseos (sin día).
const DAY_ORDER = [...DAYS.map((d) => d.key), "__wishlist__"];

export default function PendingView({ items, onToggle, onRemove }: Props) {
  const pending = useMemo(
    () => items.filter((i) => !i.checked),
    [items]
  );

  const groups = useMemo(() => {
    const map = new Map<string, Item[]>();
    for (const it of pending) {
      const key = it.day ?? "__wishlist__";
      const arr = map.get(key) ?? [];
      arr.push(it);
      map.set(key, arr);
    }
    for (const arr of map.values()) arr.sort((a, b) => a.sort - b.sort);
    return map;
  }, [pending]);

  if (pending.length === 0) {
    return (
      <div className="empty">
        <div className="big">🎉</div>
        ¡Lo habéis visto todo!
      </div>
    );
  }

  return (
    <>
      <div className="day-head">
        <h2>Pendientes</h2>
        <div className="day-count">{pending.length} cosas por ver</div>
      </div>
      {DAY_ORDER.map((key) => {
        const arr = groups.get(key);
        if (!arr || arr.length === 0) return null;
        const day = DAYS.find((d) => d.key === key);
        const title = day ? `${day.label} · ${day.title}` : "Lista de deseos";
        return (
          <div key={key}>
            <div className="section-title">{title}</div>
            <div className="card-list">
              {arr.map((it) => (
                <ItemRow key={it.id} item={it} onToggle={onToggle} onRemove={onRemove} />
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}
