import { createElement } from '../../../libs/dom'
import { getColorString } from '../../../libs/helper'
import { RGBA } from '../../../types'

export default class OperationsArea {
  currentColor: RGBA

  #hexInput: HTMLInputElement | null = null
  #RInput: HTMLInputElement | null = null
  #GInput: HTMLInputElement | null = null
  #BInput: HTMLInputElement | null = null
  #AInput: HTMLInputElement | null = null
  #preview: HTMLDivElement | null = null

  #confirmBtn: HTMLButtonElement | null = null
  #cancelBtn: HTMLButtonElement | null = null

  constructor (currentColor: RGBA) {
    this.currentColor = currentColor
  }

  render (parentElement: HTMLElement): void {
    const oHexInputWrapper = this.#createHexInput()
    const oBtnsWrapper = this.#createButtons()
    const oRgbaInputWrapper = this.#createRGBAInput()

    const oWrapper = createElement('div', {
      class: 'operations__area'
    }, [
      oRgbaInputWrapper,
      oHexInputWrapper,
      oBtnsWrapper
    ])

    parentElement.appendChild(oWrapper)

    this.#initEvent()
  }

  #initEvent (): void {
    this.#hexInput!.addEventListener('keydown', this.#handleHexInputKeydown, false)
    this.#hexInput!.addEventListener('blur', this.#handleHexInputBlur, false)

    ;([this.#RInput, this.#GInput, this.#BInput, this.#AInput] as HTMLInputElement[]).forEach(target => {
      target.addEventListener('keydown', this.#handleRGBAInputKeydown, false)
      target.addEventListener('blur', this.#handleRGBAInputBlur, false)
    })

    this.#confirmBtn!.addEventListener('click', this.#handleConfirm, false)
    this.#cancelBtn!.addEventListener('click', this.#handleCancel, false)
  }

  #createHexInput (): HTMLLabelElement {
    const oInput = createElement('input', {
      class: 'hex-input__input'
    })

    const oPreview = createElement('div', {
      class: 'hex-input__preview',
      style: `background-color: ${getColorString(this.currentColor, 'RGBA')}`
    })

    const oWrapper = createElement('label', {
      class: 'hex-input__wrapper'
    }, [
      oInput,
      oPreview
    ])

    this.#hexInput = oInput
    this.#preview = oPreview

    return oWrapper
  }

  #createRGBAInput (): HTMLDivElement {
    const oRInput = createElement('input', {
      class: 'rgba-input__input rgba-input__input-r'
    })

    const oGInput = createElement('input', {
      class: 'rgba-input__input rgba-input__input-g'
    })

    const oBInput = createElement('input', {
      class: 'rgba-input__input rgba-input__input-b'
    })

    const oAInput = createElement('input', {
      class: 'rgba-input__input rgba-input__input-a'
    })

    const oWrapper = createElement('div', {
      class: 'rgba-input__wrapper'
    }, [
      createElement('label', { class: 'rgba-input__item' }, ['R:', oRInput]),
      createElement('label', { class: 'rgba-input__item' }, ['G:', oGInput]),
      createElement('label', { class: 'rgba-input__item' }, ['B:', oBInput]),
      createElement('label', { class: 'rgba-input__item' }, ['A:', oAInput])
    ])

    this.#RInput = oRInput
    this.#GInput = oGInput
    this.#BInput = oBInput
    this.#AInput = oAInput

    return oWrapper
  }

  #createButtons (): HTMLDivElement {
    const oConfirmBtn = createElement('button', {
      class: 'btns__btn btns__btn-confirm'
    }, '确定')

    const oCancelBtn = createElement('button', {
      class: 'btns__btn btns__btn-cancel'
    }, '取消')

    const oWrapper = createElement('div', {
      class: 'btns__wrapper'
    }, [
      oConfirmBtn,
      oCancelBtn
    ])

    this.#confirmBtn = oConfirmBtn
    this.#cancelBtn = oCancelBtn

    return oWrapper
  }

  #handleHexInputKeydown = (e: KeyboardEvent): void => {
    if (!/^[0-9a-fA-F]+$/.test(e.key)) {
      e.preventDefault()
    }
  }

  #handleHexInputBlur = (e: Event): void => {
    const target = e.target as HTMLInputElement
    let value = target.value

    const len = value.length

    if (len > 8) {
      value = 'FFFFFF'
    }

    switch (len) {
      case 1:
      case 2:
      case 4:
      case 5:
        value = value.padStart(6, '0')
        break
      case 3:
        // abc => aabbcc
        value = value.split('').reduce((prev, item) => prev + item.repeat(2), '')
        break
      case 7:
        // abcdefa => abcdef0a
        // eslint-disable-next-line no-case-declarations
        const arr = value.split('')
        arr.splice(-1, 0, '0')
        value = arr.join('')
        break
      case 8:
        // abcdefff => abcdef
        if (/ff$/i.test(value)) {
          value = value.slice(0, -2)
        }
    }

    target.value = value
  }

  #handleRGBAInputKeydown = (e: KeyboardEvent): void => {
    if (!/^\d+$/.test(e.key)) {
      e.preventDefault()
    }
  }

  #handleRGBAInputBlur = (e: Event): void => {
    const target = e.target as HTMLInputElement
    let value = Number(target.value)

    if (isNaN(value)) {
      value = 0
    }

    value = Math.max(0, Math.min(255, value))

    target.value = `${value}`
  }

  #handleConfirm = (): void => {
    console.log('confirm')
  }

  #handleCancel = (): void => {
    console.log('cancel')
  }
}
