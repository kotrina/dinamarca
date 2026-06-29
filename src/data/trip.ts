// Datos del viaje a Copenhague (20–27 julio).
// Extraídos de la guía diaria (incluye transporte, costes y notas prácticas).
// Los ítems con checkbox ("qué ver") se sincronizan en Supabase; el resto
// (transporte, costes, notas) es información de referencia de cada día.

export interface SeedItem {
  /** Identificador estable del ítem (slug). Se usa como clave en la base de datos. */
  slug: string;
  title: string;
  notes?: string;
}

export interface TransportLeg {
  /** Tramo / trayecto. */
  from: string;
  /** Medio (tren, bus, andando, taxi…). */
  mode?: string;
  /** Frecuencia (cada 20 min…). */
  freq?: string;
  /** Tiempo aproximado. */
  time?: string;
  /** Coste, si aplica. */
  cost?: string;
}

export interface CostRow {
  concept: string;
  price: string;
  /** Resáltala si es la fila de total. */
  total?: boolean;
}

export interface TripDay {
  /** Clave estable del día, p.ej. "20". */
  key: string;
  date: string; // ISO date, 2026 (verano)
  label: string; // "Lun 20 jul"
  title: string; // título del día
  subtitle?: string; // resumen corto
  /** Hora prevista de vuelta a casa. */
  returnTime?: string;
  items: SeedItem[]; // checkboxes "qué ver"
  transport?: TransportLeg[];
  costs?: CostRow[];
  tips?: string[]; // notas prácticas
}

export const TRIP_TITLE = "Copenhague";
export const TRIP_DATES = "20–27 julio";

export const DAYS: TripDay[] = [
  {
    key: "20",
    date: "2026-07-20",
    label: "Lun 20 jul",
    title: "Llegada",
    subtitle: "Aeropuerto, casa y barrio",
    items: [
      {
        slug: "20-llegada-aeropuerto",
        title: "Llegada al aeropuerto de CPH",
        notes: "Vuelo aterriza 14:40. Salida del aeropuerto ~15:30, en casa ~16:30.",
      },
      {
        slug: "20-compra-netto",
        title: "Compra en Netto (Amerika Plads)",
        notes: "A 10 minutos andando de casa.",
      },
      { slug: "20-ver-barrio", title: "Pasear y ver el barrio" },
      {
        slug: "20-activar-copenhagen-card",
        title: "Preparar la Copenhagen Card",
        notes: "Activarla a la entrada del Tivoli, 12:00 del 21 de julio.",
      },
    ],
    transport: [
      {
        from: "Metro aeropuerto (M2)",
        freq: "cada 4–6 min",
        time: "10–12 min",
        cost: "Billete aeropuerto → Østerport 5 €/adulto (10 € total)",
      },
      { from: "Tren centro → Østerport", freq: "cada 5–10 min", time: "5 min" },
      { from: "Andar hasta casa", mode: "andando", time: "10 min" },
    ],
    tips: [
      "Copenhagen Card – City Guide (app): comparar precios dentro de la app antes de activarla.",
      "Activar la tarjeta a la entrada del Tivoli, 12:00 del 21 de julio.",
    ],
  },
  {
    key: "21",
    date: "2026-07-21",
    label: "Mar 21 jul",
    title: "Centro + Tivoli",
    subtitle: "Kastellet, Nyhavn, LEGO y Tivoli",
    returnTime: "En casa máx. 18:30",
    items: [
      {
        slug: "21-kastellet",
        title: "Kastellet",
        notes: "Parque amplio y relajado.",
      },
      {
        slug: "21-sirenita",
        title: "La Sirenita",
        notes: "De paso, muy cerca de casa.",
      },
      {
        slug: "21-amalienborg",
        title: "Palacio Real y Amalienborg",
        notes: "Cambio de guardia a las 12:00 (todos los días).",
      },
      {
        slug: "21-nyhavn",
        title: "Nyhavn",
        notes: "El puerto nuevo con las casas de colores. A 5 min de la guardia.",
      },
      {
        slug: "21-kongens-nytorv",
        title: "Kongens Nytorv (centro)",
        notes: "Plaza y Teatro Real.",
      },
      {
        slug: "21-lego-store",
        title: "Tienda LEGO",
        notes: "Vimmelskaftet 37 (zona Strøget). Experiencia clave para el peque, y la zona más bonita.",
      },
      {
        slug: "21-stroget",
        title: "Strøget",
        notes: "Una de las calles peatonales más largas de Europa, junto a la tienda LEGO.",
      },
      {
        slug: "21-tivoli",
        title: "Tivoli",
        notes:
          "Con ~2 horas sobra. Atracciones para el niño de 7 años. Pulsera ~23 € para montar en todo, o ~8 €/atracción suelta.",
      },
    ],
    transport: [
      { from: "Casa → Kastellet → Sirenita → Amalienborg", mode: "andando", time: "20–25 min" },
      { from: "Amalienborg → Nyhavn", mode: "andando", time: "5–7 min" },
      { from: "Nyhavn → Kongens Nytorv", mode: "andando", time: "2–3 min" },
      { from: "Kongens Nytorv → LEGO Store", mode: "andando", time: "5 min" },
      { from: "LEGO → Tivoli", mode: "andando", time: "10–15 min" },
      { from: "Tivoli → Østerport (vuelta)", mode: "tren", time: "5–7 min" },
      { from: "Østerport → Casa", mode: "andando", time: "10 min" },
    ],
    tips: ["Activar la Copenhagen Card justo antes de entrar al Tivoli."],
  },
  {
    key: "22",
    date: "2026-07-22",
    label: "Mié 22 jul",
    title: "Experimentarium + ciudad",
    subtitle: "Ciencia, Nyboder y Jardín Botánico",
    returnTime: "Vuelta a las 18:00",
    items: [
      {
        slug: "22-experimentarium",
        title: "Experimentarium",
        notes:
          "Interactivo, 2–3 horas. Zona de agua súper divertida, experimentos prácticos y juegos táctiles/de movimiento.",
      },
      {
        slug: "22-nyboder",
        title: "Nyboder (casas amarillas)",
        notes: "Calles tranquilas y auténticas, poco turismo.",
      },
      {
        slug: "22-jardin-botanico",
        title: "Jardín Botánico",
        notes: "Zona verde para descansar. Entrada gratis.",
      },
      {
        slug: "22-torvehallerne",
        title: "Mercado Torvehallerne",
        notes: "Mercado cercano al Jardín Botánico.",
      },
    ],
    transport: [
      { from: "Casa → Østerport", mode: "andando", time: "10 min" },
      { from: "Østerport → Hellerup", mode: "tren", time: "5 min" },
      { from: "Hellerup → Experimentarium", mode: "bus", time: "10 min" },
      { from: "Experimentarium → Hellerup estación", mode: "andando", time: "5–10 min" },
      { from: "Hellerup → Nørreport (centro)", mode: "tren", time: "10–15 min" },
      { from: "Nørreport → Nyboder", mode: "andando", time: "5–10 min" },
      { from: "Nyboder → Jardín Botánico", mode: "andando", time: "10 min" },
      { from: "Jardín Botánico → Østerport", mode: "andando", time: "10–15 min" },
      { from: "Østerport → casa", mode: "andando", time: "10 min" },
    ],
  },
  {
    key: "23",
    date: "2026-07-23",
    label: "Jue 23 jul",
    title: "Helsingør",
    subtitle: "Castillo de Hamlet",
    returnTime: "Vuelta a las 15:00",
    items: [
      {
        slug: "23-kronborg",
        title: "Castillo de Kronborg",
        notes: "El castillo de Hamlet. Incluido con la Copenhagen Card.",
      },
      {
        slug: "23-casamatas",
        title: "Casamatas (túnel subterráneo)",
        notes:
          "Lo más divertido. No aconsejable para el bebé: un adulto entra con Luca y otro espera fuera.",
      },
      {
        slug: "23-paseo-helsingor",
        title: "Paseo por el puerto y el centro",
        notes: "Calles y casas típicas.",
      },
    ],
    transport: [
      { from: "Østerport → Helsingør", mode: "tren directo", freq: "cada 20 min", time: "50 min" },
    ],
  },
  {
    key: "24",
    date: "2026-07-24",
    label: "Vie 24 jul",
    title: "Roskilde",
    subtitle: "Barcos vikingos y fiordo",
    returnTime: "Vuelta prevista ~17:00",
    items: [
      {
        slug: "24-museo-vikingo",
        title: "Museo Vikingo",
        notes: "Barcos vikingos reales y talleres.",
      },
      {
        slug: "24-fiordo",
        title: "Fiordo",
        notes: "Justo al lado del museo.",
      },
      {
        slug: "24-centro-roskilde",
        title: "Paseo relajado por el centro",
        notes: "Día tranquilo, sin entradas.",
      },
    ],
    transport: [
      { from: "Østerport → Roskilde", mode: "tren", freq: "cada 10–20 min", time: "30 min" },
    ],
    costs: [
      { concept: "Ida", price: "incluida en la tarjeta" },
      { concept: "Vuelta (2 adultos)", price: "20–30 €" },
      { concept: "Niño", price: "gratis" },
      { concept: "Total", price: "20–30 €", total: true },
    ],
  },
  {
    key: "25",
    date: "2026-07-25",
    label: "Sáb 25 jul",
    title: "Malmö",
    subtitle: "Escapada a Suecia",
    items: [
      {
        slug: "25-stortorget",
        title: "Stortorget (plaza principal)",
      },
      {
        slug: "25-lilla-torg",
        title: "Lilla Torg",
        notes: "Plaza pequeña y encantadora, con casitas de madera.",
      },
      {
        slug: "25-malmohus",
        title: "Malmöhus Slott",
        notes: "Castillo + acuario.",
      },
      {
        slug: "25-parques-malmo",
        title: "Parques de Malmö",
        notes: "Se puede ver todo andando.",
      },
    ],
    transport: [
      { from: "Casa → Østerport", mode: "andando", time: "10 min" },
      {
        from: "Østerport → Malmö C",
        mode: "tren directo",
        freq: "cada 20 min",
        time: "35–40 min",
      },
      { from: "Malmö → Østerport", mode: "tren directo", freq: "cada 20 min" },
    ],
    costs: [
      { concept: "Tren (ida/vuelta)", price: "50–80 €" },
      { concept: "Malmöhus Slott (castillo y acuario)", price: "~10 €/adulto (niños gratis o reducido)" },
      { concept: "Total", price: "60–90 €", total: true },
    ],
    tips: [
      "Trenes de ida recomendados: 09:53 o 10:13.",
      "Trenes de vuelta recomendados: 16:00 o 16:20.",
    ],
  },
  {
    key: "26",
    date: "2026-07-26",
    label: "Dom 26 jul",
    title: "Odense + Egeskov",
    subtitle: "Castillo y laberinto (Egeskov 3–4 h)",
    returnTime: "Vuelta aprox. 16:00",
    items: [
      {
        slug: "26-egeskov-laberinto",
        title: "Egeskov: Laberinto",
        notes: "El highlight. 30–45 min.",
      },
      {
        slug: "26-egeskov-juegos",
        title: "Egeskov: Parque de aventura y juegos",
        notes: "45–60 min.",
      },
      {
        slug: "26-egeskov-castillo",
        title: "Egeskov: Castillo",
        notes: "Exterior precioso. 20–30 min.",
      },
      { slug: "26-egeskov-coches", title: "Egeskov: Museo de coches" },
      {
        slug: "26-egeskov-jardines",
        title: "Egeskov: Jardines",
        notes: "20–30 min.",
      },
    ],
    transport: [
      { from: "Casa → Østerport", mode: "andando", time: "10 min" },
      { from: "Østerport → København H", mode: "tren", freq: "cada 5–10 min", time: "10 min" },
      { from: "København H → Odense", mode: "tren", freq: "cada 15–30 min", time: "1h15" },
      { from: "Odense ↔ Egeskov", mode: "taxi", time: "25–30 min" },
      { from: "Odense → København H", mode: "tren", freq: "cada 15–30 min", time: "1h15" },
      { from: "København H → Østerport", mode: "tren", freq: "cada 5–10 min", time: "10 min" },
    ],
    costs: [
      {
        concept: "Tren ida/vuelta",
        price: "100–120 € (más barato comprando con 4 semanas de antelación)",
      },
      { concept: "Taxi ida/vuelta", price: "70–90 €" },
      { concept: "Entradas Egeskov (incluye todo)", price: "75–80 €" },
      { concept: "Total", price: "245–290 €", total: true },
    ],
  },
  {
    key: "27",
    date: "2026-07-27",
    label: "Lun 27 jul",
    title: "Salida",
    subtitle: "Vuelta a casa",
    items: [{ slug: "27-salida", title: "Salida", notes: "Último día del viaje." }],
  },
];

/** Todos los ítems semilla aplanados, con su día asociado. */
export const ALL_SEED_ITEMS: { day: string; sort: number; item: SeedItem }[] = DAYS.flatMap(
  (d) => d.items.map((item, i) => ({ day: d.key, sort: i, item }))
);
