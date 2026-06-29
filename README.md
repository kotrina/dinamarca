# 🇩🇰 Copenhague

Guía diaria del viaje a Copenhague (20–27 julio), como **web optimizada para móvil**.
Cada parada del viaje tiene un checkbox para marcar que la habéis visto. Hay vista
por día, una sección de **Pendientes** (todo lo que queda) y una página para
**Añadir** cosas nuevas que queráis ver.

El estado (marcas de "visto") se **comparte y sincroniza en tiempo real** entre los
dos móviles mediante Supabase.

## Stack

- [Vite](https://vitejs.dev/) + React + TypeScript
- [Supabase](https://supabase.com/) (Postgres + API + realtime) para el estado compartido
- Despliegue en [Vercel](https://vercel.com/)

## Desarrollo local

```bash
npm install
npm run dev        # http://localhost:5173
```

Sin configurar Supabase, la app funciona igual usando el almacenamiento local del
navegador (cada móvil con su propio estado, sin sincronizar). Para activar la
sincronización, configura Supabase (abajo).

## Configurar Supabase (estado compartido)

1. Crea una cuenta gratis en [supabase.com](https://supabase.com/) y un proyecto nuevo.
2. En el panel del proyecto: **SQL Editor → New query**, pega el contenido de
   [`supabase/schema.sql`](supabase/schema.sql) y pulsa **Run**. Esto crea la tabla
   `items` y activa el tiempo real.
3. Ve a **Settings → API** y copia:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`
4. Crea un archivo `.env` (copia de `.env.example`) con esos dos valores.
5. En **Vercel**, añade esas mismas dos variables de entorno al proyecto.

La primera vez que se abre la app con Supabase configurado y la tabla vacía, se
siembra automáticamente con todo el itinerario.

## Despliegue en Vercel

1. Importa este repositorio en [vercel.com/new](https://vercel.com/new).
2. Framework preset: **Vite** (se detecta solo). Build: `npm run build`, output: `dist`.
3. Añade las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
4. Deploy. Tendréis una URL para abrir desde el móvil (y "Añadir a pantalla de inicio").

## Estructura

```
src/
  data/trip.ts        # Itinerario (datos semilla extraídos de la guía)
  lib/
    supabase.ts       # Cliente de Supabase (o null si no está configurado)
    useTrip.ts        # Estado: carga, realtime, toggle, añadir, borrar
    types.ts
  components/ItemRow.tsx
  views/
    DaysView.tsx      # Vista por día
    PendingView.tsx   # Todo lo pendiente, agrupado por día
    AddView.tsx       # Añadir cosas nuevas
  App.tsx             # Cabecera, progreso y navegación inferior
supabase/schema.sql   # Esquema para Supabase
```
