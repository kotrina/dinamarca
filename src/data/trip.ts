// Datos del viaje a Copenhague (20–27 julio).
// Extraídos de la guía diaria. Cada día tiene una lista de paradas/actividades
// que se pueden marcar como "visto". El estado real (marcado/no marcado) vive en
// Supabase; aquí solo está el contenido base con el que se siembra la base de datos.

export interface SeedItem {
  /** Identificador estable del ítem (slug). Se usa como clave en la base de datos. */
  slug: string;
  title: string;
  notes?: string;
}

export interface TripDay {
  /** Clave estable del día, p.ej. "20". */
  key: string;
  date: string; // ISO date, 2026 (verano)
  label: string; // "Dom 20 jul"
  title: string; // título del día
  subtitle?: string; // resumen corto
  items: SeedItem[];
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
        slug: "20-transporte-casa",
        title: "Transporte a casa",
        notes:
          "Metro M2 (cada 4–6 min) hasta el centro y tren a Østerport (cada 5–10 min), luego 10 min andando. Billete aeropuerto→Østerport ~5 €/adulto (10 € total).",
      },
      {
        slug: "20-compra-netto",
        title: "Compra en Netto (Amerika Plads)",
        notes: "A 10 minutos andando de casa.",
      },
      {
        slug: "20-ver-barrio",
        title: "Pasear y ver el barrio",
      },
      {
        slug: "20-activar-copenhagen-card",
        title: "Preparar la Copenhagen Card",
        notes:
          "App 'Copenhagen Card – City Guide': comparar precios dentro de la app. Activar a la entrada del Tivoli, 12:00 del 21 de julio.",
      },
    ],
  },
  {
    key: "21",
    date: "2026-07-21",
    label: "Mar 21 jul",
    title: "Centro + Tivoli",
    subtitle: "Kastellet, Nyhavn, LEGO y Tivoli",
    items: [
      {
        slug: "21-kastellet",
        title: "Kastellet",
        notes: "Parque amplio y relajado. 20–25 min andando desde casa.",
      },
      {
        slug: "21-sirenita",
        title: "La Sirenita",
        notes: "Muy cerca de casa / de paso desde Kastellet.",
      },
      {
        slug: "21-amalienborg",
        title: "Palacio Real y Amalienborg",
        notes: "Cambio de guardia a las 12:00 (todos los días).",
      },
      {
        slug: "21-nyhavn",
        title: "Nyhavn",
        notes: "El puerto nuevo con las casas de colores. A 5–7 min de la guardia.",
      },
      {
        slug: "21-kongens-nytorv",
        title: "Kongens Nytorv (centro)",
        notes: "Plaza y Teatro Real. A 2–3 min de Nyhavn.",
      },
      {
        slug: "21-lego-store",
        title: "LEGO Store",
        notes: "Vimmelskaftet 37 (zona Strøget). La experiencia clave para el peque.",
      },
      {
        slug: "21-stroget",
        title: "Strøget",
        notes: "Una de las calles peatonales más largas de Europa.",
      },
      {
        slug: "21-tivoli",
        title: "Tivoli",
        notes:
          "Con ~2 horas sobra. Pulsera ~23 € para montar en todo (cada atracción suelta ~8 €). Volver a casa a las 18:30 máx.",
      },
    ],
  },
  {
    key: "22",
    date: "2026-07-22",
    label: "Mié 22 jul",
    title: "Experimentarium + ciudad",
    subtitle: "Ciencia, Nyboder y Jardín Botánico",
    items: [
      {
        slug: "22-experimentarium",
        title: "Experimentarium",
        notes:
          "2–3 horas. Zona de agua súper divertida, experimentos prácticos y juegos de movimiento. Tren a Hellerup + bus.",
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
  },
  {
    key: "23",
    date: "2026-07-23",
    label: "Jue 23 jul",
    title: "Helsingør",
    subtitle: "Castillo de Hamlet",
    items: [
      {
        slug: "23-kronborg",
        title: "Castillo de Kronborg",
        notes: "El castillo de Hamlet. Incluido con la Copenhagen Card. Tren directo ~50 min.",
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
  },
  {
    key: "24",
    date: "2026-07-24",
    label: "Vie 24 jul",
    title: "Roskilde",
    subtitle: "Barcos vikingos y fiordo",
    items: [
      {
        slug: "24-museo-vikingo",
        title: "Museo Vikingo",
        notes: "Barcos vikingos reales y talleres. Tren ~30 min. Ida incluida en la tarjeta.",
      },
      {
        slug: "24-fiordo",
        title: "Fiordo",
        notes: "Justo al lado del museo.",
      },
      {
        slug: "24-centro-roskilde",
        title: "Paseo por el centro",
        notes: "Día tranquilo, sin entradas. Vuelta prevista ~17:00.",
      },
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
        notes: "Tren directo desde Østerport ~35–40 min (cada 20 min). Recomendados 09:53 o 10:13.",
      },
      {
        slug: "25-lilla-torg",
        title: "Lilla Torg",
        notes: "Plaza pequeña y encantadora, con casitas de madera.",
      },
      {
        slug: "25-malmohus",
        title: "Malmöhus Slott",
        notes: "Castillo + acuario. ~10 €/adulto (niños gratis o reducido).",
      },
      {
        slug: "25-parques-malmo",
        title: "Parques de Malmö",
        notes: "Se puede ver todo andando. Trenes de vuelta recomendados 16:00 o 16:20.",
      },
    ],
  },
  {
    key: "26",
    date: "2026-07-26",
    label: "Dom 26 jul",
    title: "Odense + Egeskov",
    subtitle: "Castillo y laberinto",
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
      {
        slug: "26-egeskov-coches",
        title: "Egeskov: Museo de coches",
      },
      {
        slug: "26-egeskov-jardines",
        title: "Egeskov: Jardines",
        notes: "20–30 min. En total Egeskov son 3–4 h.",
      },
    ],
  },
  {
    key: "27",
    date: "2026-07-27",
    label: "Lun 27 jul",
    title: "Salida",
    subtitle: "Vuelta a casa",
    items: [
      {
        slug: "27-salida",
        title: "Salida",
        notes: "Último día del viaje.",
      },
    ],
  },
];

/** Todos los ítems semilla aplanados, con su día asociado. */
export const ALL_SEED_ITEMS: { day: string; sort: number; item: SeedItem }[] = DAYS.flatMap(
  (d) => d.items.map((item, i) => ({ day: d.key, sort: i, item }))
);
