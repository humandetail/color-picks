import { OutputType, RGBA } from '../types'

export const number2hex = (num: number): string => Math.min(255, Math.max(0, num)).toString(16).padStart(2, '0')

export const hex2number = (hex: string): number => Math.min(255, Math.max(0, parseInt(hex, 16)))

export const toAlpha = (val: number): number => Number((Math.min(255, Math.max(0, val)) / 255).toFixed(3))

export const getColorString = (rgba: RGBA, type: OutputType = 'HEX'): string => {
  switch (type) {
    case 'HEX':
      return `#${number2hex(rgba[0])}${number2hex(rgba[1])}${number2hex(rgba[2])}${rgba[3] !== 255 ? number2hex(rgba[3] ?? 0) : ''}`
    case 'RGB':
      return `rgb(${rgba[0]},${rgba[1]},${rgba[2]})`
    case 'RGBA':
      return `rgba(${rgba[0]},${rgba[1]},${rgba[2]},${toAlpha(rgba[3] ?? 0)})`
  }
}
