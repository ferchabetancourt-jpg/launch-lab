# launch-lab

Herramientas internas — investigación de mercado y validación de producto.

## Radar de Nichos (PEV)

Wizard guiado paso a paso para espionaje/validación de nichos. Ver `SPEC_RADARDENICHOS.md` para el detalle completo de fases, reglas y decisiones de arquitectura.

### Setup local

```bash
npm install
cp .env.example .env.local
# completa ANTHROPIC_API_KEY en .env.local
npm run dev
```

Sin `KV_REST_API_URL`/`KV_REST_API_TOKEN` configuradas, las sesiones se guardan en `./.data/` (local, no versionado). En Vercel, conecta un KV Store desde el dashboard del proyecto y esas variables se completan solas.

### Deploy

Proyecto pensado para Vercel (hosting gratuito). Variables de entorno necesarias en el dashboard de Vercel:
- `ANTHROPIC_API_KEY`
- `KV_REST_API_URL` / `KV_REST_API_TOKEN` (al conectar un KV Store)

Estado: PR #1 abierto con el MVP en la rama `claude/radar-nichos-mvp-approach-n5rmkv`, en revisión antes de mergear a `main`.
