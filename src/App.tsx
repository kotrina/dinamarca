import { useMemo, useState } from "react";
import { useTrip } from "./lib/useTrip";
import { DAYS, TRIP_DATES, TRIP_TITLE } from "./data/trip";
import DaysView from "./views/DaysView";
import PendingView from "./views/PendingView";
import AddView from "./views/AddView";

type Tab = "days" | "pending" | "add";

function todayDayKey(): string {
  const today = new Date().toISOString().slice(0, 10);
  const match = DAYS.find((d) => d.date === today);
  return match ? match.key : DAYS[0].key;
}

export default function App() {
  const { items, loading, error, synced, toggle, addItem, removeItem } = useTrip();
  const [tab, setTab] = useState<Tab>("days");
  const [activeDay, setActiveDay] = useState<string>(todayDayKey());

  const { total, done, pendingCount } = useMemo(() => {
    const total = items.length;
    const done = items.filter((i) => i.checked).length;
    return { total, done, pendingCount: total - done };
  }, [items]);

  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <>
      <header className="header">
        <h1>
          <span aria-hidden>🇩🇰</span> {TRIP_TITLE}
        </h1>
        <p className="dates">{TRIP_DATES} · {synced ? "sincronizado" : "solo este móvil"}</p>
        <div className="progress">
          <div className="progress-bar">
            <span style={{ width: `${pct}%` }} />
          </div>
          <span className="progress-label">
            {done}/{total}
          </span>
        </div>
      </header>

      <main className="main">
        {error && (
          <div className="banner">
            Error de conexión: {error}. Los cambios pueden no guardarse.
          </div>
        )}
        {loading ? (
          <div className="empty">
            <div className="big">⏳</div>
            Cargando…
          </div>
        ) : tab === "days" ? (
          <DaysView
            items={items}
            activeDay={activeDay}
            setActiveDay={setActiveDay}
            onToggle={toggle}
            onRemove={removeItem}
          />
        ) : tab === "pending" ? (
          <PendingView items={items} onToggle={toggle} onRemove={removeItem} />
        ) : (
          <AddView onAdd={addItem} goToDays={() => setTab("days")} />
        )}
      </main>

      <nav className="nav">
        <button
          className={tab === "days" ? "active" : ""}
          onClick={() => setTab("days")}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M3 10h18M8 2v4M16 2v4" strokeLinecap="round" />
          </svg>
          Días
        </button>
        <button
          className={tab === "pending" ? "active" : ""}
          onClick={() => setTab("pending")}
        >
          {pendingCount > 0 && <span className="badge">{pendingCount}</span>}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 11l3 3L22 4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Pendientes
        </button>
        <button
          className={tab === "add" ? "active" : ""}
          onClick={() => setTab("add")}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v8M8 12h8" strokeLinecap="round" />
          </svg>
          Añadir
        </button>
      </nav>
    </>
  );
}
