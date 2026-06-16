# DELUXE BURGER — Menú Digital

Menú web para **DELUXE BURGER**. Los clientes arman su pedido y lo envían por WhatsApp a cocina.

## Desarrollo local

```bash
npm install
npm run dev
```

En desarrollo y producción, la app intenta cargar el menú en este orden:

1. `/api/menu` — proxy del Worker (mismo dominio)
2. `/menu.json` — respaldo generado en build desde el API de menú

El script `prebuild` descarga el menú durante `npm run build`, así producción funciona aunque el proxy falle.

**Deploy command en Cloudflare:** `npx wrangler deploy` (después de `npm run build`)

## Build

```bash
npm run build
```

El output queda en `dist/`, listo para Cloudflare Pages.

## Despliegue en Cloudflare Pages

1. Conecta este repositorio en [Cloudflare Pages](https://pages.cloudflare.com)
2. Configuración de build:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Deploy command:** `npx wrangler deploy`
   - **Framework preset:** None (o Vite)
3. Deploy

La configuración de Wrangler está en `wrangler.jsonc` (no uses `wrangler.toml` en JSON).

El archivo `public/_redirects` ya incluye la regla SPA para que el enrutamiento funcione correctamente.

## API

Los productos y categorías se obtienen de:

```
GET https://round-voice-068e.dannymariano869.workers.dev/
```

Respuesta JSON:

```json
{
  "categorias": { "productCategories": [...] },
  "productos": { "products": [...] }
}
```

## WhatsApp

Los pedidos se envían a: `+57 320 714 6368`
