import { useCallback, useEffect, useRef, useState } from "react";
import { supabase, isSupabaseConfigured } from "./supabase";
import type { Item } from "./types";
import { ALL_SEED_ITEMS } from "../data/trip";

const LOCAL_KEY = "dinamarca-items-v1";

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

// ---- Hook principal --------------------------------------------------------

export interface TripStore {
  items: Item[];
  loading: boolean;
  error: string | null;
  synced: boolean; // true si está conectado a Supabase
  toggle: (item: Item) => Promise<void>;
  addItem: (input: { title: string; notes?: string; day: string | null }) => Promise<void>;
  removeItem: (item: Item) => Promise<void>;
}

export function useTrip(): TripStore {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsRef = useRef<Item[]>([]);
  itemsRef.current = items;

  // Carga inicial + suscripción a tiempo real (si hay Supabase).
  useEffect(() => {
    let cancelled = false;

    if (!isSupabaseConfigured || !supabase) {
      setItems(loadLocal());
      setLoading(false);
      return;
    }

    async function init() {
      const sb = supabase!;
      // Asegura que la tabla está sembrada (la primera vez que se abre la app).
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
      if (selErr) {
        setError(selErr.message);
      } else {
        setItems((data as Item[]) ?? []);
      }
      setLoading(false);
    }

    init();

    const channel = supabase
      .channel("items-changes")
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
      .subscribe();

    return () => {
      cancelled = true;
      supabase?.removeChannel(channel);
    };
  }, []);

  const toggle = useCallback(async (item: Item) => {
    const checked = !item.checked;
    const checked_at = checked ? new Date().toISOString() : null;
    // Optimista.
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
      saveLocal(itemsRef.current.map((i) =>
        i.id === item.id ? { ...i, checked, checked_at } : i
      ));
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

  const removeItem = useCallback(async (item: Item) => {
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    if (isSupabaseConfigured && supabase) {
      const { error: err } = await supabase.from("items").delete().eq("id", item.id);
      if (err) setError(err.message);
    } else {
      saveLocal(itemsRef.current.filter((i) => i.id !== item.id));
    }
  }, []);

  return {
    items,
    loading,
    error,
    synced: isSupabaseConfigured,
    toggle,
    addItem,
    removeItem,
  };
}
