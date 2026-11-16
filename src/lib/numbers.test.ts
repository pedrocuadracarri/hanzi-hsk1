import { describe, expect, it } from 'vitest'
import { dateToHanzi, numberPinyin, numberToHanzi, timeToHanzi } from './numbers'

describe('números en chino', () => {
  it('convierte 0–99', () => {
    expect(numberToHanzi(0)).toBe('零')
    expect(numberToHanzi(7)).toBe('七')
    expect(numberToHanzi(10)).toBe('十')
    expect(numberToHanzi(15)).toBe('十五')
    expect(numberToHanzi(20)).toBe('二十')
    expect(numberToHanzi(99)).toBe('九十九')
  })
  it('fecha y hora', () => {
    const d = new Date(2026, 10, 16, 18, 52)
    expect(dateToHanzi(d)).toBe('二零二六年十一月十六号 星期一')
    expect(timeToHanzi(d)).toBe('下午六点五十二分')
    expect(timeToHanzi(new Date(2026, 0, 4, 9, 0))).toBe('上午九点')
    expect(dateToHanzi(new Date(2026, 0, 4))).toContain('星期天')
  })
  it('pinyin', () => {
    expect(numberPinyin('二十三')).toBe('èr shí sān')
    expect(numberPinyin('下午六点')).toBe('xiàwǔ liù diǎn')
  })
})
