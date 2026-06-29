export interface Item {
  id: string;
  /** Slug estable para los ítems sembrados; null/generado para los añadidos a mano. */
  slug: string;
  /** Clave del día ("20".."27") o null si es de la lista de deseos sin día asignado. */
  day: string | null;
  title: string;
  notes: string | null;
  sort: number;
  is_custom: boolean;
  checked: boolean;
  checked_at: string | null;
}
