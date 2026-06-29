import { useMemo } from "react";
import type { Item } from "../lib/types";
import { DAYS } from "../data/trip";
import ItemRow from "../components/ItemRow";

interface Props {
  items: Item[];
  activeDay: string;
  setActiveDay: (key: string) => void;
  onToggle: (item: Item) => void;
  onRemove: (item: Item) => void;
}

export default function DaysView({
  items,
  activeDay,
  setActiveDay,
  onToggle,
  onRemove,
}: Props) {
  const byDay = useMemo(() => {
    const map = new Map<string, Item[]>();
    for (const it of items) {
      if (it.day == null) continue;
      const arr = map.get(it.day) ?? [];
      arr.push(it);
      map.set(it.day, arr);
    }
    for (const arr of map.values()) arr.sort((a, b) => a.sort - b.sort);
    return map;
  }, [items]);

  const day = DAYS.find((d) => d.key === activeDay) ?? DAYS[0];
  const dayItems = byDay.get(day.key) ?? [];
  const done = dayItems.filter((i) => i.checked).length;

  return (
    <>
      <div className="day-strip">
        {DAYS.map((d) => {
          const di = byDay.get(d.key) ?? [];
          const allDone = di.length > 0 && di.every((i) => i.checked);
          const [, num] = d.label.split(" ");
          const dow = d.label.split(" ")[0];
          return (
            <button
              key={d.key}
              className={`day-chip${d.key === activeDay ? " active" : ""}${
                allDone ? " done" : ""
              }`}
              onClick={() => setActiveDay(d.key)}
            >
              {allDone && <span className="dot" />}
              <span className="d-num">{num}</span>
              <span className="d-dow">{dow}</span>
            </button>
          );
        })}
      </div>

      <div className="day-head">
        <h2>{day.title}</h2>
        {day.subtitle && <p>{day.subtitle}</p>}
        {dayItems.length > 0 && (
          <div className="day-count">
            {done} de {dayItems.length} visto{dayItems.length === 1 ? "" : "s"}
          </div>
        )}
      </div>

      {dayItems.length === 0 ? (
        <div className="empty">
          <div className="big">🗺️</div>
          Nada planeado para este día.
        </div>
      ) : (
        <div className="card-list">
          {dayItems.map((it) => (
            <ItemRow key={it.id} item={it} onToggle={onToggle} onRemove={onRemove} />
          ))}
        </div>
      )}
    </>
  );
}
