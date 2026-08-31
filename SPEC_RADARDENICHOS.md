# SPEC — Radar de Nichos (herramienta interna PEV)

Versión final acordada — 30 agosto 2026
Fusiona la metodología PEV (Aceleradora) con el framework de Micro Apps (Andrea Cano) para la parte cualitativa/redes.

---

## Qué es

Herramienta interna de uso personal (Fercha, sin multiusuario) que **guía paso a paso** el proceso de espionaje → validación → modelado de nicho, en vez de intentar automatizar fuentes de datos que no se pueden automatizar de forma confiable (Meta Ads Library comercial, SimilarWeb, redes sociales — ver `docs/decisiones-tecnicas.md`).

La app no reemplaza el trabajo de buscar información: te dice exactamente qué buscar y dónde en cada paso, tú pegas lo que encuentras, y Claude hace el análisis/síntesis usando las reglas fijas de la metodología.

**Diseñada para ser reutilizable**: la lógica del wizard (`lib/wizard-engine.ts`) es genérica; el contenido de cada metodología vive en un `playbook` separado (`playbooks/`). Radar de Nichos es el primer playbook. Un proyecto futuro se agrega como playbook nuevo, sin tocar el motor.

---

## Arquitectura

```
/app
  page.tsx                  → elegir playbook + retomar sesión en curso
  sesion/[id]/page.tsx      → el wizard: paso actual, instrucciones, input
  reporte/[id]/page.tsx     → reporte final ensamblado, export a .md
  api/sesion/route.ts       → crear/leer/actualizar estado de sesión
  api/analizar/route.ts     → ejecuta el análisis de un paso llamando a Claude

/playbooks
  types.ts                  → forma genérica de un Playbook (Fase[], Paso[])
  radar-nichos-pev.ts       → contenido completo del playbook Radar de Nichos

/lib
  claude.ts                 → cliente Anthropic (server-side only)
  wizard-engine.ts          → lógica genérica: paso actual, avanzar, armar prompt
  store.ts                  → persistencia de sesión (Vercel KV en prod, archivo local en dev)

/types
  sesion.ts                 → estado de una sesión en curso
```

**Stack:** Next.js (App Router) + TypeScript + Vercel. Sin auth (uso personal). Persistencia mínima vía Vercel KV — solo para poder pausar/retomar una sesión, no es un historial completo de nichos comparados (eso sigue fuera del MVP).

---

## Fuentes de datos — decisión final

| Fuente | Automatizable | Cómo se usa en la app |
|---|---|---|
| Google Trends | Parcial (librería no oficial, frágil) | Fase 1, con fallback manual si falla |
| Meta Ads Library (ads comerciales) | No vía API oficial (solo devuelve ads políticos/issue) | Manual: tú buscas, la app organiza el "Archivo Blanco" |
| SimilarWeb | No (sin tier gratuito de API) | Fuera del filtro obligatorio — señal opcional si la tienes |
| Redes (TikTok/IG/Reddit/YouTube) | No | Manual: tú pegas lo que encuentras, Claude sintetiza |

Detalle de la evaluación de riesgo (scraping de Ad Library, ToS de Meta, por qué se descartó) queda documentado en el historial de la conversación de diseño — no se construyó ningún scraper.

---

## Fases, pasos y modelo por fase

Cada paso indica: qué instrucciones te da la app, qué le pegas, y qué modelo de Claude hace el análisis. **Antes de cualquier paso marcado Opus, la app muestra un aviso de confirmación ("Este análisis usa Opus, ¿procedes?") para que controles el gasto de API.**

### Fase 1 — Descubrimiento de nicho · Modelo: **Sonnet**
1.1 Input: palabra/idea semilla
1.2 Google Trends (automatizado con fallback manual) cruzado con categorías curadas (Dinero, Salud, Relaciones, Crianza, Espiritualidad, Productividad)
→ Output: 5-10 micro-nichos candidatos con nivel de tendencia

### Fase 2 — Espionaje de mercado ("Archivo Blanco") · Modelo: **Sonnet**
Reemplaza el filtro numérico rígido de PEV (que resultó demasiado restrictivo) por el criterio de Micro Apps: capturar señales, no aplicar un gate automático.

2.1 Instrucciones: buscar en Meta Ads Library (ES **e** inglés) por palabra clave del nicho
2.2 Por cada competidor, pegar: Perfil, Cantidad de Anuncios, Tiempo Activos, # Idiomas
2.3 Claude interpreta las señales y sugiere cuáles competidores son prometedores (sin booleano automático — es criterio, no fórmula)

### Fase 3 — Análisis de producto ganador · Modelo: **Opus** (con confirmación)
Incorpora el framework de Avatar de Micro Apps (más profundo que el usado antes en PEV).

3.1 Ficha del competidor: qué incluye, precio, formato
3.2 Avatar en 5 bloques (instrucciones de qué buscar en comentarios/reviews/redes, tú pegas, Claude sintetiza):
   - Lenguaje y vocabulario real
   - Creencias, excusas, a quién culpan
   - Enemigo común / polarización
   - Brecha de conocimiento / dudas frecuentes
   - Comportamiento, urgencia, deseos ocultos
3.3 Dolor Urgente + Deseo Ardiente (Primario/Secundario: Funcional/Dimensional/Emocional), derivado del Avatar

### Fase 4 — Modelado de la propuesta ("La Coalisión") · Modelo: **Opus** (con confirmación)
4.1 Mecanismo del Problema — causa raíz que le impide al avatar actuar (se busca la creencia común en redes)
4.2 Mecanismo de la Solución — qué resuelve esa causa raíz (patrón encontrado en redes)
4.3 La Coalisión — fusión de la oferta ganadora (Fase 2-3) + la microtendencia oculta (redes) = propuesta de producto diferenciada
   - Restricción fija: solo 10-20% mejor que el competidor, nunca "bonos wow"
   - Precio sugerido nunca menor a $12.97

### Fase 5 — Reporte final · Modelo: **Sonnet**
5.1 Ensambla todo lo generado en las fases anteriores en un reporte descargable en Markdown: nicho recomendado + justificación, Archivo Blanco de competidores, fichas de Avatar/dolor-deseo, Mecanismos, La Coalisión, precio sugerido.

---

## Fuera del MVP (explícito)
- Automatización de SimilarWeb y redes sociales
- Scraper de Meta Ads Library (descartado por riesgo de ToS/inestabilidad, ver conversación de diseño)
- Historial completo de nichos comparados entre sí
- UI para crear playbooks nuevos desde la app (se agregan como archivo cuando haya un segundo caso real)

---

## Regla de control
Approach acordado antes de construir; cambios de alcance se confirman antes de tocar código. Este documento refleja el estado acordado al momento del GO (30 agosto 2026).
