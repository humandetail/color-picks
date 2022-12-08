import { OutputType, RGBA } from '../types'

export const number2hex = (num: number): string => {
  const str = '0123456789ABCDEF'
  let res = ''
  let count = 0

  while (num !== 0 && count++ < 8) {
    res += str[(num & 0xf)]
    num >>= 4
  }

  return res.slice(0, 2).padStart(2, '0')
}

export const toAlpha = (val: number): number => {
  const number = Math.min(100, Math.max(0, val))

  return Number((number / 100).toFixed(3))
}

export const getColorString = (rgba: RGBA, type: OutputType = 'HEX'): string => {
  switch (type) {
    case 'HEX':
      return `#${number2hex(rgba[0])}${number2hex(rgba[1])}${number2hex(rgba[2])}`
    case 'RGB':
      return `rgb(${rgba[0]},${rgba[1]},${rgba[2]})`
    case 'RGBA':
      return `rgba(${rgba[0]},${rgba[1]},${rgba[2]},${toAlpha(rgba[3] ?? 0)})`
  }
}
