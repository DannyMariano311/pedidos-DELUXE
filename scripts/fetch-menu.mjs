import { writeFile } from 'node:fs/promises'

const MENU_API = 'https://round-voice-068e.dannymariano869.workers.dev/'

const response = await fetch(MENU_API)

if (!response.ok) {
  console.error(`No se pudo obtener el menú (${response.status})`)
  process.exit(1)
}

const data = await response.json()
await writeFile('public/menu.json', JSON.stringify(data))

console.log('menu.json generado correctamente')
