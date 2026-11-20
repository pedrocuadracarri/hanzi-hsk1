import { getSettings } from './settings'
import { getDaily } from './storage'
import { toDay } from './dates'

/** Recordatorio diario. Sin servidor no hay notificaciones push fiables, así que:
 *  1) un evento diario en tu calendario (.ics) con alarma: funciona en cualquier móvil;
 *  2) una notificación local si la app sigue abierta (o en segundo plano) a esa hora. */

export function reminderIcs(time: string): string {
  const [h, m] = time.split(':')
  const d = toDay().replace(/-/g, '')
  const url = location.href.split('#')[0]
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Hanzi HSK1//ES',
    'BEGIN:VEVENT',
    `UID:hanzi-reminder-${d}@hanzi`,
    `DTSTAMP:${d}T000000Z`,
    `DTSTART:${d}T${h}${m}00`,
    'DURATION:PT15M',
    'RRULE:FREQ=DAILY',
    'SUMMARY:🀄 15 minutos de chino',
    `DESCRIPTION:Repasa tus palabras en Hanzi HSK 1: ${url}`,
    `URL:${url}`,
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'DESCRIPTION:Toca practicar chino',
    'TRIGGER:PT0M',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

export function downloadReminderIcs(time: string) {
  const blob = new Blob([reminderIcs(time)], { type: 'text/calendar' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'recordatorio-chino.ics'
  a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 1000)
}

export const notificationsSupported = () => typeof window !== 'undefined' && 'Notification' in window

export async function askNotificationPermission(): Promise<boolean> {
  if (!notificationsSupported()) return false
  if (Notification.permission === 'granted') return true
  return (await Notification.requestPermission()) === 'granted'
}

async function notifyIfGoalPending() {
  const s = getSettings()
  if (!s.reminder || !notificationsSupported() || Notification.permission !== 'granted') return
  const done = (await getDaily())[toDay()] ?? 0
  if (done >= s.dailyGoal) return
  const body = `Llevas ${done}/${s.dailyGoal} respuestas hoy. ¡5 minutos bastan para no perder la racha! 🔥`
  const reg = await navigator.serviceWorker?.getRegistration()
  if (reg) await reg.showNotification('Hora de practicar chino 🀄', { body, icon: 'icon-192.png', tag: 'hanzi-reminder' })
  else new Notification('Hora de practicar chino 🀄', { body, icon: 'icon-192.png' })
}

let timer: ReturnType<typeof setTimeout> | undefined

/** Programa la notificación local de hoy (o de mañana si la hora ya pasó) */
export function scheduleReminder() {
  clearTimeout(timer)
  const time = getSettings().reminder
  if (!time) return
  const [h, m] = time.split(':').map(Number)
  const now = new Date()
  const at = new Date(now)
  at.setHours(h, m, 0, 0)
  if (at <= now) at.setDate(at.getDate() + 1)
  timer = setTimeout(() => {
    void notifyIfGoalPending()
    scheduleReminder()
  }, at.getTime() - now.getTime())
}
