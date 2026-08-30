import type { Playbook } from "./types";

const REGLAS_FIJAS_PEV = `
Reglas fijas de PEV que debes respetar siempre en tu análisis (no inventes filtros nuevos):
- Regla de modelado: la propuesta final debe ser SOLO 10-20% mejor que el competidor. Nunca sugieras "bonos wow" ni features no validadas por la investigación.
- Precio mínimo PEV: nunca sugieras un precio menor a $12.97.
- Si hay muchos competidores fuertes, no significa evitar el nicho — significa que la oferta ya es sofisticada y hace falta un ángulo de diferenciación real, no una oferta genérica.
`.trim();

export const radarNichosPev: Playbook = {
  id: "radar-nichos-pev",
  nombre: "Radar de Nichos (PEV)",
  descripcion:
    "Guía paso a paso de descubrimiento, espionaje y modelado de nicho, siguiendo la metodología PEV + el framework de Avatar/Mecanismos de Micro Apps.",
  fases: [
    {
      id: "fase-1",
      numero: 1,
      nombre: "Descubrimiento de nicho",
      descripcion: "Partir de una idea semilla y encontrar micro-nichos candidatos.",
      modelo: "sonnet",
    },
    {
      id: "fase-2",
      numero: 2,
      nombre: "Espionaje de mercado (Archivo Blanco)",
      descripcion: "Capturar señales de competidores activos en Meta Ads Library.",
      modelo: "sonnet",
    },
    {
      id: "fase-3",
      numero: 3,
      nombre: "Análisis de producto ganador",
      descripcion: "Ficha de competidores + Avatar en 5 bloques + Dolor/Deseo.",
      modelo: "opus",
    },
    {
      id: "fase-4",
      numero: 4,
      nombre: "Modelado de la propuesta (La Coalisión)",
      descripcion: "Mecanismo del problema/solución y síntesis de la propuesta diferenciada.",
      modelo: "opus",
    },
    {
      id: "fase-5",
      numero: 5,
      nombre: "Reporte final",
      descripcion: "Ensamblar todo en un reporte descargable.",
      modelo: "sonnet",
    },
  ],
  pasos: [
    // ---------- FASE 1 ----------
    {
      id: "1.1",
      faseId: "fase-1",
      titulo: "Idea semilla",
      instrucciones:
        "Escribe la palabra o idea semilla de la que quieres partir (ej: 'caída del pelo', 'ansiedad', 'ganar dinero extra'). No tiene que ser perfecta, solo un punto de partida.",
      tipoInput: "texto",
      placeholder: "ej: dormir mejor",
      requiereAnalisis: false,
      modelo: "sonnet",
    },
    {
      id: "1.2",
      faseId: "fase-1",
      titulo: "Tendencia e ideas relacionadas",
      instrucciones:
        "Ve a Google Trends (trends.google.com) y busca tu idea semilla. Anota: (1) si la tendencia está estable, subiendo o bajando en los últimos 12 meses, y (2) 5-10 búsquedas relacionadas que te sugiera Google Trends. Pega aquí lo que encontraste.",
      tipoInput: "texto-largo",
      placeholder: "ej: Tendencia estable. Relacionadas: dormir rápido, insomnio remedio, melatonina natural...",
      requiereAnalisis: true,
      modelo: "sonnet",
      promptAnalisis: `Eres un estratega de infoproductos digitales low-ticket para el mercado hispanohablante (LATAM), especializado en las categorías que más convierten en Hotmart/plataformas similares: Dinero, Salud, Relaciones, Crianza, Espiritualidad, Productividad.

Idea semilla y datos de Google Trends que trajo el usuario:
{input}

Tarea: a partir de esto, propone 5 a 10 micro-nichos candidatos (más específicos que la idea semilla). Para cada uno indica: nombre del micro-nicho, por qué encaja con alguna de las categorías que convierten, y una hipótesis de por qué podría funcionar ahora. Sé concreto, no genérico.`,
    },

    // ---------- FASE 2 ----------
    {
      id: "2.1",
      faseId: "fase-2",
      titulo: "Micro-nicho a espiar",
      instrucciones:
        "De la lista anterior, elige el micro-nicho que quieres espiar (o escribe uno directo si ya lo tienes, saltando la Fase 1).",
      tipoInput: "texto",
      placeholder: "ej: insomnio en mujeres 30-55",
      requiereAnalisis: false,
      modelo: "sonnet",
    },
    {
      id: "2.2",
      faseId: "fase-2",
      titulo: "Archivo Blanco — competidores en Meta Ads Library",
      instrucciones:
        "Ve a facebook.com/ads/library (no necesitas cuenta). Busca tu micro-nicho en ESPAÑOL y en INGLÉS. Por cada competidor real que encuentres, anota: nombre del perfil, cuántos anuncios activos tiene, hace cuánto tiempo corren (aprox.), y en cuántos idiomas está anunciando. Pega la lista completa aquí, uno por línea.",
      tipoInput: "texto-largo",
      placeholder:
        "ej: Dra. Esmeralda Ramos — 120 ads activos — 3 meses 20 días — 2 idiomas\nCocina Activa — 200 ads activos — 1 mes 10 días — 1 idioma",
      requiereAnalisis: true,
      modelo: "sonnet",
      promptAnalisis: `Eres un analista de espionaje de mercado para infoproductos digitales LATAM.

${REGLAS_FIJAS_PEV}

Nota importante: NO apliques un filtro numérico rígido tipo "necesita 50+ ads para contar". La cantidad de ads y el tiempo activo son SEÑALES a interpretar, no un examen de pasa/no pasa. Un competidor con pocos ads pero mucho tiempo activo puede ser tan válido como uno con muchos ads.

Datos de competidores que encontró el usuario en Meta Ads Library:
{input}

Tarea: organiza estos datos en una tabla (Competidor | Ads activos | Tiempo activo | Idiomas | Lectura). En "Lectura" da tu interpretación de qué tan prometedora es esa señal (sobrevivencia, escala, etc.), sin aplicar un booleano automático. Cierra con: ¿cuáles 2-3 competidores recomendarías profundizar en la Fase 3, y por qué?`,
    },

    // ---------- FASE 3 ----------
    {
      id: "3.1",
      faseId: "fase-3",
      titulo: "Ficha de producto de los competidores elegidos",
      instrucciones:
        "Para los 2-3 competidores que eligieron en el paso anterior, entra a su landing/producto y anota: qué incluye el producto, precio, formato (app/ebook/curso), y cualquier oferta/bono que usen. Pega lo que encuentres de cada uno.",
      tipoInput: "texto-largo",
      placeholder: "ej: Dra. Esmeralda Ramos — Ebook 'Kit Visual' — $19.97 — incluye PDF + 3 bonos...",
      requiereAnalisis: true,
      modelo: "opus",
      promptAnalisis: `Eres un analista de producto para infoproductos digitales LATAM.

${REGLAS_FIJAS_PEV}

Fichas de producto que recopiló el usuario:
{input}

Contexto de la investigación hasta ahora:
{contexto}

Tarea: para cada competidor, resume en una ficha: Fortalezas | Debilidades | Precio | Formato. Sé específico sobre las debilidades — son las que más importan para las fases siguientes.`,
    },
    {
      id: "3.2",
      faseId: "fase-3",
      titulo: "Avatar en 5 bloques",
      instrucciones:
        "Busca comentarios, reviews y publicaciones en redes (TikTok, Instagram, Reddit, foros, App Store/reviews) relacionados con este dolor/nicho. Pega frases y observaciones reales que encuentres — mientras más textual, mejor. No hace falta que las organices, solo pega todo lo que vayas encontrando.",
      tipoInput: "texto-largo",
      placeholder: "ej: comentario en Reddit: 'siento que ya probé de todo y nada funciona'...",
      requiereAnalisis: true,
      modelo: "opus",
      promptAnalisis: `Eres un investigador de psicología del consumidor especializado en el avatar LATAM 30-55 años.

Material real (comentarios, reviews, posts) que recopiló el usuario:
{input}

Contexto de la investigación hasta ahora:
{contexto}

Tarea: organiza este material en el framework de Avatar de 5 bloques. Usa SOLO lo que aparece en el material pegado — no inventes citas. Si un bloque no tiene suficiente evidencia, dilo explícitamente en vez de rellenar.

1. Lenguaje y Vocabulario (Identidad Verbal): palabras/jerga exacta, analogías, nivel de sofisticación, cómo se autodefinen
2. Creencias, Excusas y Transferencia de Culpa: a quién culpan, por qué creen que soluciones previas fallaron, excusas repetidas
3. El Enemigo Común y la Polarización: a quién atacan, qué genera indignación colectiva, de qué se sienten víctimas
4. Brecha de Conocimiento y Dudas Frecuentes: preguntas básicas que se repiten, qué no entienden del problema
5. Comportamiento, Urgencia y Deseos Ocultos: qué detona que pidan ayuda, qué comprarían si resolvieran el problema mañana`,
    },
    {
      id: "3.3",
      faseId: "fase-3",
      titulo: "Dolor Urgente y Deseo Ardiente",
      instrucciones:
        "Este paso no necesita que pegues nada nuevo — Claude lo deriva del Avatar que acabas de construir. Solo confirma para continuar (o agrega algo si quieres afinar).",
      tipoInput: "texto",
      placeholder: "(opcional) algo que quieras agregar o afinar",
      requiereAnalisis: true,
      entradaOpcional: true,
      modelo: "opus",
      promptAnalisis: `Eres un estratega de ofertas de infoproductos LATAM.

Contexto de la investigación hasta ahora (incluye el Avatar de 5 bloques):
{contexto}

Nota adicional del usuario (puede estar vacía):
{input}

Tarea: a partir del Avatar, define:
- Dolor Urgente: Primario, y Secundario dividido en Funcional (externo) / Dimensional (a dónde lo lleva en su vida) / Emocional (autoestima, sensibilidad)
- Deseo Ardiente: Primario, y Secundario dividido en Funcional / Dimensional / Emocional — lo que soluciona el dolor

Sé concreto y basado en la evidencia del Avatar, no genérico.`,
    },

    // ---------- FASE 4 ----------
    {
      id: "4.1",
      faseId: "fase-4",
      titulo: "Mecanismo del Problema",
      instrucciones:
        "Vuelve a revisar el material de redes que pegaste. Busca específicamente: ¿cuál es la creencia común en los comentarios sobre POR QUÉ tienen este problema? (la causa raíz que ellos mismos mencionan, no la que tú supones). Pega las frases/patrones que encuentres sobre el origen del problema.",
      tipoInput: "texto-largo",
      placeholder: "ej: varios comentarios dicen que es por estrés acumulado, no por falta de esfuerzo...",
      requiereAnalisis: true,
      modelo: "opus",
      promptAnalisis: `Eres un estratega de ofertas de infoproductos LATAM, especializado en mecanismos de venta.

Contexto de la investigación hasta ahora:
{contexto}

Patrones sobre el origen del problema que encontró el usuario:
{input}

Tarea: define el Mecanismo del Problema — la causa raíz específica (según la evidencia, no una genérica) que le impide al avatar resolver su problema por su cuenta. Explica en 1 párrafo por qué esta es la causa raíz y no solo un síntoma.`,
    },
    {
      id: "4.2",
      faseId: "fase-4",
      titulo: "Mecanismo de la Solución",
      instrucciones:
        "Con el mecanismo del problema en mente, busca en redes qué patrón de solución mencionan las personas que sí lograron mejorar. ¿Qué dicen que les funcionó, aunque sea parcialmente? Pega esas menciones.",
      tipoInput: "texto-largo",
      placeholder: "ej: quienes mejoraron mencionan haber cambiado de rutina, no solo tomar algo puntual...",
      requiereAnalisis: true,
      modelo: "opus",
      promptAnalisis: `Eres un estratega de ofertas de infoproductos LATAM.

Contexto de la investigación hasta ahora (incluye el Mecanismo del Problema):
{contexto}

Patrones de solución que encontró el usuario:
{input}

Tarea: define el Mecanismo de la Solución — qué resuelve específicamente la causa raíz identificada en el paso anterior (no el síntoma). Debe conectar directo con el Mecanismo del Problema.`,
    },
    {
      id: "4.3",
      faseId: "fase-4",
      titulo: "La Coalisión — propuesta de producto",
      instrucciones:
        "Último paso de síntesis. No necesitas pegar nada nuevo salvo que quieras agregar algo — Claude va a fusionar todo lo construido (la oferta ganadora del espionaje + los mecanismos + el avatar) en una propuesta de producto concreta.",
      tipoInput: "texto",
      placeholder: "(opcional) algo que quieras agregar o restringir",
      requiereAnalisis: true,
      entradaOpcional: true,
      modelo: "opus",
      promptAnalisis: `Eres un estratega de producto para infoproductos digitales LATAM.

${REGLAS_FIJAS_PEV}

Contexto completo de la investigación (Archivo Blanco, fichas de competidores, Avatar, Dolor/Deseo, Mecanismos):
{contexto}

Nota adicional del usuario (puede estar vacía):
{input}

Tarea: propón "La Coalisión" — la fusión de la oferta que ya está vendiendo (identificada en el espionaje) con la microtendencia/mecanismo encontrado en redes, en una propuesta de producto diferenciada. Entrega:
- Qué es el producto (1 párrafo)
- Qué incluye (lista corta)
- En qué se diferencia del competidor (10-20% mejor, nunca más — sé explícito en por qué no te excediste)
- Precio sugerido (nunca menor a $12.97, justificado por lo que cobra el mercado)`,
    },

    // ---------- FASE 5 ----------
    {
      id: "5.1",
      faseId: "fase-5",
      titulo: "Reporte final",
      instrucciones:
        "Último paso: Claude ensambla todo el análisis de las fases anteriores en un reporte consolidado. No necesitas pegar nada nuevo.",
      tipoInput: "texto",
      placeholder: "(opcional) algo que quieras que el reporte destaque especialmente",
      requiereAnalisis: true,
      entradaOpcional: true,
      modelo: "sonnet",
      promptAnalisis: `Eres un redactor de reportes de investigación de mercado.

Contexto completo de la investigación:
{contexto}

Nota adicional del usuario (puede estar vacía):
{input}

Tarea: ensambla un reporte final en Markdown con esta estructura exacta:
# Reporte de Nicho — [nombre del micro-nicho]
## Nicho recomendado y justificación
## Archivo Blanco (competidores espiados)
## Fichas de producto (fortalezas/debilidades)
## Avatar y Dolor/Deseo
## Mecanismos del Problema y la Solución
## La Coalisión — propuesta de producto
## Precio sugerido

Usa la información ya generada en las fases anteriores, no inventes datos nuevos.`,
    },
  ],
};

export const playbooks = {
  [radarNichosPev.id]: radarNichosPev,
};
