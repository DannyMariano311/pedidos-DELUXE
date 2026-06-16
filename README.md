# DELUXE BURGER — Menú Digital

Menú web para **DELUXE BURGER**. Los clientes arman su pedido y lo envían por WhatsApp a cocina.

## Desarrollo local

```bash
npm install
npm run dev
```

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
   - **Framework preset:** None (o Vite)
3. Deploy

El archivo `public/_redirects` ya incluye la regla SPA para que el enrutamiento funcione correctamente.

## API

Los productos y categorías se obtienen de:

```
GET https://hook.us2.make.com/mou1z52pn4lq8pqwjtslfdaf6b3dpvta
Header: x-make-apikey: DELUXEburger
```

## WhatsApp

Los pedidos se envían a: `+57 320 714 6368`
