interface Env {
  ASSETS: Fetcher
  MENU_API: Fetcher
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const path = new URL(request.url).pathname.replace(/\/$/, '') || '/'

    if (path === '/api/menu') {
      const upstream = await env.MENU_API.fetch(
        new Request('https://menu/', {
          headers: { Accept: 'application/json' },
        }),
      )

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
}
