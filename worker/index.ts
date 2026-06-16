interface Env {
  ASSETS: Fetcher
}

const MENU_API = 'https://round-voice-068e.dannymariano869.workers.dev/'

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    const path = url.pathname.replace(/\/$/, '') || '/'

    if (path === '/api/menu') {
      const upstream = await fetch(MENU_API, {
        headers: { Accept: 'application/json' },
      })

      return new Response(upstream.body, {
        status: upstream.status,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=120',
        },
      })
    }

    return env.ASSETS.fetch(request)
  },
} satisfies ExportedHandler<Env>
