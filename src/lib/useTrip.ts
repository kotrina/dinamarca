import { useCallback, useEffect, useRef, useState } from "react";
import { supabase, isSupabaseConfigured } from "./supabase";
import type { Item } from "./types";
import { ALL_SEED_ITEMS, DEFAULT_DAY_NOTES } from "../data/trip";

const LOCAL_KEY = "dinamarca-items-v1";
const LOCAL_NOTES_KEY = "dinamarca-daynotes-v1";

function seedItems(): Item[] {
  return ALL_SEED_ITEMS.map(({ day, sort, item }) => ({
    id: item.slug,
    slug: item.slug,
    day,
    title: item.title,
    notes: item.notes ?? null,
    sort,
    is_custom: false,
    checked: false,
    checked_at: null,
  }));
}

// ---- Backend local (localStorage) -----------------------------------------

function loadLocal(): Item[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) {
      const seeded = seedItems();
      localStorage.setItem(LOCAL_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const stored: Item[] = JSON.parse(raw);
    // Mezcla: añade ítems semilla nuevos que aún no estuvieran guardados.
    const bySlug = new Map(stored.map((i) => [i.slug, i]));
    for (const seed of seedItems()) {
      if (!bySlug.has(seed.slug)) bySlug.set(seed.slug, seed);
    }
    const merged = Array.from(bySlug.values());
    localStorage.setItem(LOCAL_KEY, JSON.stringify(merged));
    return merged;
  } catch {
    return seedItems();
  }
}

function saveLocal(items: Item[]) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
}

function loadLocalNotes(): Record<string, string> {
  try {
    const raw = localStorage.getItem(LOCAL_NOTES_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_NOTES_KEY, JSON.stringify(DEFAULT_DAY_NOTES));
      return { ...DEFAULT_DAY_NOTES };
    }
    return JSON.parse(raw);
  } catch {
    return { ...DEFAULT_DAY_NOTES };
  }
}

function saveLocalNotes(notes: Record<string, string>) {
  localStorage.setItem(LOCAL_NOTES_KEY, JSON.stringify(notes));
}

// ---- Hook principal --------------------------------------------------------

export interface TripStore {
  items: Item[];
  dayNotes: Record<string, string>;
  loading: boolean;
  error: string | null;
  synced: boolean; // true si está conectado a Supabase
  toggle: (item: Item) => Promise<void>;
  addItem: (input: { title: string; notes?: string; day: string | null }) => Promise<void>;
  updateItem: (item: Item, changes: { title: string; notes: string }) => Promise<void>;
  removeItem: (item: Item) => Promise<void>;
  updateDayNotes: (day: string, notes: string) => Promise<void>;
}

export function useTrip(): TripStore {
  const [items, setItems] = useState<Item[]>([]);
  const [dayNotes, setDayNotes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsRef = useRef<Item[]>([]);
  itemsRef.current = items;
  const notesRef = useRef<Record<string, string>>({});
  notesRef.current = dayNotes;

  // Carga inicial + suscripción a tiempo real (si hay Supabase).
  useEffect(() => {
    let cancelled = false;

    if (!isSupabaseConfigured || !supabase) {
      setItems(loadLocal());
      setDayNotes(loadLocalNotes());
      setLoading(false);
      return;
    }

    async function init() {
      const sb = supabase!;
      // Asegura que la tabla de ítems está sembrada (la primera vez).
      const { count, error: countErr } = await sb
        .from("items")
        .select("id", { count: "exact", head: true });
      if (countErr) {
        if (!cancelled) {
          setError(countErr.message);
          setLoading(false);
        }
        return;
      }
      if ((count ?? 0) === 0) {
        const seed = seedItems().map((i) => ({
          slug: i.slug,
          day: i.day,
          title: i.title,
          notes: i.notes,
          sort: i.sort,
          is_custom: i.is_custom,
          checked: i.checked,
          checked_at: i.checked_at,
        }));
        await sb.from("items").insert(seed);
      }

      const { data, error: selErr } = await sb.from("items").select("*");
      if (cancelled) return;
      if (selErr) setError(selErr.message);
      else setItems((data as Item[]) ?? []);

      // Notas por día (tabla day_notes). Se siembra si está vacía.
      const { data: notesData, error: notesErr } = await sb
        .from("day_notes")
        .select("day, notes");
      if (cancelled) return;
      if (notesErr) {
        // La tabla day_notes puede no existir todavía: no es fatal, usamos
        // las notas por defecto hasta que se cree.
        console.warn("day_notes no disponible:", notesErr.message);
        setDayNotes({ ...DEFAULT_DAY_NOTES });
      } else {
        const rows = (notesData as { day: string; notes: string }[]) ?? [];
        if (rows.length === 0 && Object.keys(DEFAULT_DAY_NOTES).length > 0) {
          const seedNotes = Object.entries(DEFAULT_DAY_NOTES).map(([day, notes]) => ({
            day,
            notes,
          }));
          await sb.from("day_notes").insert(seedNotes);
          setDayNotes({ ...DEFAULT_DAY_NOTES });
        } else {
          setDayNotes(Object.fromEntries(rows.map((r) => [r.day, r.notes])));
        }
      }

      setLoading(false);
    }

    init();

    const channel = supabase
      .channel("trip-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "items" },
        (payload) => {
          setItems((prev) => {
            if (payload.eventType === "DELETE") {
              return prev.filter((i) => i.id !== (payload.old as Item).id);
            }
            const row = payload.new as Item;
            const idx = prev.findIndex((i) => i.id === row.id);
            if (idx === -1) return [...prev, row];
            const next = [...prev];
            next[idx] = row;
            return next;
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "day_notes" },
        (payload) => {
          if (payload.eventType === "DELETE") {
            const { day } = payload.old as { day: string };
            setDayNotes((prev) => {
              const next = { ...prev };
              delete next[day];
              return next;
            });
          } else {
            const row = payload.new as { day: string; notes: string };
            setDayNotes((prev) => ({ ...prev, [row.day]: row.notes }));
          }
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase?.removeChannel(channel);
    };
  }, []);

  const toggle = useCallback(async (item: Item) => {
    const checked = !item.checked;
    const checked_at = checked ? new Date().toISOString() : null;
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, checked, checked_at } : i))
    );
    if (isSupabaseConfigured && supabase) {
      const { error: err } = await supabase
        .from("items")
        .update({ checked, checked_at })
        .eq("id", item.id);
      if (err) setError(err.message);
    } else {
      saveLocal(
        itemsRef.current.map((i) =>
          i.id === item.id ? { ...i, checked, checked_at } : i
        )
      );
    }
  }, []);

  const addItem = useCallback(
    async (input: { title: string; notes?: string; day: string | null }) => {
      const base = {
        slug: `custom-${Date.now()}`,
        day: input.day,
        title: input.title.trim(),
        notes: input.notes?.trim() || null,
        sort: 999,
        is_custom: true,
        checked: false,
        checked_at: null,
      };
      if (isSupabaseConfigured && supabase) {
        const { data, error: err } = await supabase
          .from("items")
          .insert(base)
          .select()
          .single();
        if (err) setError(err.message);
        else if (data) setItems((prev) => [...prev, data as Item]);
      } else {
        const newItem: Item = { id: base.slug, ...base };
        const next = [...itemsRef.current, newItem];
        setItems(next);
        saveLocal(next);
      }
    },
    []
  );

  const updateItem = useCallback(
    async (item: Item, changes: { title: string; notes: string }) => {
      const title = changes.title.trim();
      const notes = changes.notes.trim() || null;
      if (!title) return;
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, title, notes } : i))
      );
      if (isSupabaseConfigured && supabase) {
        const { error: err } = await supabase
          .from("items")
          .update({ title, notes })
          .eq("id", item.id);
        if (err) setError(err.message);
      } else {
        saveLocal(
          itemsRef.current.map((i) =>
            i.id === item.id ? { ...i, title, notes } : i
          )
        );
      }
    },
    []
  );

  const removeItem = useCallback(async (item: Item) => {
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    if (isSupabaseConfigured && supabase) {
      const { error: err } = await supabase.from("items").delete().eq("id", item.id);
      if (err) setError(err.message);
    } else {
      saveLocal(itemsRef.current.filter((i) => i.id !== item.id));
    }
  }, []);

  const updateDayNotes = useCallback(async (day: string, notes: string) => {
    const value = notes.trim();
    setDayNotes((prev) => ({ ...prev, [day]: value }));
    if (isSupabaseConfigured && supabase) {
      const { error: err } = await supabase
        .from("day_notes")
        .upsert({ day, notes: value, updated_at: new Date().toISOString() }, { onConflict: "day" });
      if (err) setError(err.message);
    } else {
      saveLocalNotes({ ...notesRef.current, [day]: value });
    }
  }, []);

  return {
    items,
    dayNotes,
    loading,
    error,
    synced: isSupabaseConfigured,
    toggle,
    addItem,
    updateItem,
    removeItem,
    updateDayNotes,
  };
}
