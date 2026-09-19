# PENDIENTES — Radar de Nichos (PEV)

Última actualización: 19 septiembre 2026
Estado: 🔸 **EN PAUSA** (no cancelado — se retoma cuando Fercha diga)

---

## Qué está listo (no hay que rehacer nada de esto)

- **Código del MVP completo** en la rama `claude/radar-nichos-mvp-approach-n5rmkv`: wizard funcional de 5 fases, motor genérico separado del playbook, API de análisis con Claude, persistencia de sesión.
- **`SPEC_RADARDENICHOS.md`** — spec final acordado, con las 5 fases, modelo por fase (Sonnet/Opus), y la regla de confirmación antes de cualquier llamada a Opus.
- **`npm run build` verificado localmente** — compila sin errores. Probado en local: creación de sesión, avance de pasos, gate de confirmación de Opus.
- **PR #1 abierto**: https://github.com/ferchabetancourt-jpg/launch-lab/pull/1 — con la descripción completa del alcance.
- **Proyecto creado en Vercel** (`launch-lab`, cuenta de Fercha), conectado al repo de GitHub.
- **Variables de entorno ya cargadas en Vercel**: `ANTHROPIC_API_KEY`, y las de Upstash Redis (`KV_REST_API_URL`, `KV_REST_API_TOKEN`, `KV_URL`, `REDIS_URL`) — ya conectadas al proyecto.
- **Framework Preset corregido** en Vercel (estaba mal detectado como "Other", se cambió a "Next.js").

## Dónde quedó trabado exactamente

El único pendiente real es probar el deploy funcionando de punta a punta. Se llegó hasta:
- Deploy de Preview exitoso (`Ready`) una vez arreglado el Framework Preset.
- Al intentar corregir el scope de `ANTHROPIC_API_KEY` (estaba solo en "Production", falta agregarle "Preview"), **Vercel empezó a trabarse en un loop infinito al guardar cambios** — le pasaba lo mismo en otros proyectos de Fercha no relacionados, así que parece un problema de la plataforma/sesión de Vercel en ese momento, no de este proyecto.
- Nunca se llegó a probar el wizard completo con una llamada real a Claude (Sonnet ni Opus) en producción/preview.

## Próximos pasos para retomar (en este orden)

1. Verificar si el bug de Vercel (loop infinito al guardar) ya se resolvió — probar guardando cualquier cambio chico primero.
2. Editar `ANTHROPIC_API_KEY` en Vercel para que incluya los 3 entornos: Production, Preview y Development (no se puede editar el scope de un secreto ya guardado — hay que borrarla y crearla de nuevo).
3. Disparar un nuevo deploy (push cualquier commit chico a la rama, o buscar "Create Deployment" en el proyecto).
4. Abrir el link de Preview y probar el wizard completo con un nicho real — incluyendo al menos un paso con Sonnet y uno con Opus, para confirmar que la llamada a la API de Anthropic funciona en producción.
5. Revisar el PR #1 con calma (leer el código, no solo probar la app).
6. Dar el GO para mergear a `main` cuando esté conforme.

## Pendiente suelto (no urgente)

- Rotar el token de Upstash (`KV_REST_API_TOKEN` y relacionados) — quedó pegado en texto plano en el historial de un chat en algún momento de la construcción. No es grave (esa base solo guarda progreso de sesiones, nada sensible), pero es buena práctica regenerarlo desde el dashboard de Upstash antes de confiar en el proyecto a largo plazo.

## Decisiones ya tomadas (para no re-litigar al retomar)

- No se automatiza Meta Ads Library ni SimilarWeb (sin API viable / sin tier gratuito) — el flujo es manual con análisis asistido por Claude. Detalle completo en `SPEC_RADARDENICHOS.md`.
- El filtro numérico rígido original de PEV (50+ ads, SimilarWeb obligatorio) se reemplazó por el criterio más flexible de Micro Apps (Andrea Cano): capturar señales, no aplicar un gate automático.
- Se incorporó el framework de Avatar (5 bloques) + Mecanismo del Problema/Solución + "La Coalisión" de Micro Apps en las Fases 3 y 4.
- Arquitectura pensada para reutilizarse: el motor del wizard es genérico, el contenido de la metodología vive aparte en `playbooks/`.
