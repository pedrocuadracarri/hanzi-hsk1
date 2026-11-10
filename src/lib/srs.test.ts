import { describe, expect, it } from 'vitest'
import { countDue, isDue, isLearned, newCard, review } from './srs'
import { touchStreak, visibleStreak, EMPTY_STREAK } from './streak'
import { addDays } from './dates'

const T = '2026-03-10'

describe('Leitner', () => {
  it('una tarjeta nueva está en la caja 1 y pendiente hoy', () => {
    const c = newCard('a', T)
    expect(c.box).toBe(1)
    expect(isDue(c, T)).toBe(true)
  })

  it('acertar sube de caja y espacia el repaso', () => {
    let c = newCard('a', T)
    c = review(c, true, T)
    expect(c).toMatchObject({ box: 2, due: '2026-03-11', correct: 1, lastSeen: T })
    c = review(c, true, '2026-03-11')
    expect(c).toMatchObject({ box: 3, due: '2026-03-14' })
    c = review(c, true, '2026-03-14')
    expect(c).toMatchObject({ box: 4, due: '2026-03-21' })
    c = review(c, true, '2026-03-21')
    expect(c).toMatchObject({ box: 5, due: '2026-04-04' })
  })

  it('no pasa de la caja 5', () => {
    const c = review({ ...newCard('a', T), box: 5 }, true, T)
    expect(c.box).toBe(5)
    expect(c.due).toBe(addDays(T, 14))
  })

  it('fallar devuelve a la caja 1 y queda pendiente hoy', () => {
    const c = review({ ...newCard('a', T), box: 4 }, false, T)
    expect(c).toMatchObject({ box: 1, due: T, wrong: 1 })
    expect(isDue(c, T)).toBe(true)
  })

  it('aprendida a partir de la caja 3', () => {
    expect(isLearned({ ...newCard('a', T), box: 2 })).toBe(false)
    expect(isLearned({ ...newCard('a', T), box: 3 })).toBe(true)
  })

  it('cuenta las pendientes', () => {
    const p = {
      a: newCard('a', T),
      b: { ...newCard('b', T), due: '2026-03-09' },
      c: { ...newCard('c', T), due: '2026-03-11' },
    }
    expect(countDue(p, T)).toBe(2)
  })

  it('addDays cruza meses y años', () => {
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01')
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28')
  })
})

describe('racha', () => {
  it('días consecutivos suman, un hueco reinicia', () => {
    let s = touchStreak(EMPTY_STREAK, T)
    s = touchStreak(s, T)
    expect(s.current).toBe(1)
    s = touchStreak(s, '2026-03-11')
    expect(s).toMatchObject({ current: 2, best: 2 })
    s = touchStreak(s, '2026-03-14')
    expect(s).toMatchObject({ current: 1, best: 2 })
  })

  it('la racha visible se rompe si ayer no hubo actividad', () => {
    const s = touchStreak(EMPTY_STREAK, T)
    expect(visibleStreak(s, '2026-03-11')).toBe(1)
    expect(visibleStreak(s, '2026-03-12')).toBe(0)
  })
})
