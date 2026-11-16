/** Aciertos por tono en el ejercicio de Tonos (solo este dispositivo) */
export type ToneStats = Record<1 | 2 | 3 | 4, { ok: number; total: number }>

const KEY = 'hanzi-tone-stats'
const EMPTY = (): ToneStats => ({ 1: { ok: 0, total: 0 }, 2: { ok: 0, total: 0 }, 3: { ok: 0, total: 0 }, 4: { ok: 0, total: 0 } })

export function getToneStats(): ToneStats {
  try {
    return { ...EMPTY(), ...JSON.parse(localStorage.getItem(KEY) ?? '{}') }
  } catch {
    return EMPTY()
  }
}

export function recordTone(tone: number, ok: boolean): void {
  if (tone < 1 || tone > 4) return
  const s = getToneStats()
  const t = s[tone as 1 | 2 | 3 | 4]
  t.total++
  if (ok) t.ok++
  try {
    localStorage.setItem(KEY, JSON.stringify(s))
  } catch {
    /* sin almacenamiento */
  }
}
