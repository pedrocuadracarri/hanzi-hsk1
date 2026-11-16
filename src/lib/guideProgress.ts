/** Lecciones de la guía ya abiertas en este dispositivo */
const KEY = 'hanzi-guide-read'

export function readSet(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]'))
  } catch {
    return new Set()
  }
}

export function markRead(id: string) {
  try {
    localStorage.setItem(KEY, JSON.stringify([...readSet().add(id)]))
  } catch {
    /* sin almacenamiento */
  }
}
