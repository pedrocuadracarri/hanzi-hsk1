const DIGITS = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
const PY: Record<string, string> = {
  零: 'líng', 一: 'yī', 二: 'èr', 三: 'sān', 四: 'sì', 五: 'wǔ', 六: 'liù', 七: 'qī', 八: 'bā', 九: 'jiǔ', 十: 'shí',
  年: 'nián', 月: 'yuè', 号: 'hào', 星期: 'xīngqī', 天: 'tiān', 点: 'diǎn', 分: 'fēn', 上午: 'shàngwǔ', 中午: 'zhōngwǔ', 下午: 'xiàwǔ',
}

/** 0–99 en caracteres: 十一, 二十, 二十三… */
export function numberToHanzi(n: number): string {
  if (n < 10) return DIGITS[n]
  const tens = Math.floor(n / 10)
  const units = n % 10
  return (tens === 1 ? '' : DIGITS[tens]) + '十' + (units ? DIGITS[units] : '')
}

/** Pinyin de un texto formado por números y las palabras de fecha/hora de arriba */
export function numberPinyin(text: string): string {
  const out: string[] = []
  for (let i = 0; i < text.length; i++) {
    const two = text.slice(i, i + 2)
    if (PY[two]) {
      out.push(PY[two])
      i++
    } else if (PY[text[i]]) out.push(PY[text[i]])
  }
  return out.join(' ')
}

/** Año cifra a cifra: 2026 → 二零二六年 */
export const yearToHanzi = (y: number) => [...String(y)].map((d) => DIGITS[Number(d)]).join('') + '年'

/** Fecha completa: 二零二六年十一月十六号 星期一 */
export function dateToHanzi(d: Date): string {
  const wd = d.getDay()
  return `${yearToHanzi(d.getFullYear())}${numberToHanzi(d.getMonth() + 1)}月${numberToHanzi(d.getDate())}号 星期${wd === 0 ? '天' : DIGITS[wd]}`
}

/** Hora: 下午六点五十二分 (12 horas, con parte del día) */
export function timeToHanzi(d: Date): string {
  const h = d.getHours()
  const m = d.getMinutes()
  const part = h < 12 ? '上午' : h < 13 ? '中午' : '下午'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${part}${numberToHanzi(h12)}点${m ? numberToHanzi(m) + '分' : ''}`
}
