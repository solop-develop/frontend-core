
import { INPUT_NUMBER_PATTERN } from '@/utils/ADempiere/formatValue/numberFormat.js'

import { calculationValue } from '@/utils/ADempiere/formatValue/numberFormat.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

export function changeValue() {
  if (!isEmptyValue(this.valueToDisplay) && this.valueToDisplay !== '...') {
    const result = this.parseValue(this.valueToDisplay)
    this.preHandleChange(result)
  }

  this.isShowed = false
}

export function calculateDisplayedValue(event) {
  const isAllowed = event.key.match(INPUT_NUMBER_PATTERN)
  if (isAllowed) {
    const result = calculationValue(this.value, event)
    if (!isEmptyValue(result)) {
      this.valueToDisplay = result
      this.isShowed = true
    } else {
      this.valueToDisplay = '...'
      this.isShowed = true
    }
  } else if (!isAllowed && event.key === 'Backspace') {
    if (String(this.value).slice(0, -1) > 0) {
      event.preventDefault()
      const newValue = String(this.value).slice(0, -1)
      const result = calculationValue(newValue, event)
      if (!isEmptyValue(result)) {
        this.value = this.parseValue(result)
        this.valueToDisplay = result
        this.isShowed = true
      } else {
        this.valueToDisplay = '...'
        this.isShowed = true
      }
    }
  } else if (!isAllowed && event.key === 'Delete') {
    if (String(this.value).slice(-1) > 0) {
      event.preventDefault()
      const newValue = String(this.value).slice(-1)
      const result = calculationValue(newValue, event)
      if (!isEmptyValue(result)) {
        this.value = this.parseValue(result)
        this.valueToDisplay = result
        this.isShowed = true
      } else {
        this.valueToDisplay = '...'
        this.isShowed = true
      }
    }
  } else {
    event.preventDefault()
  }
}

export function calculateValue(event) {
  const result = calculationValue(this.value, event)
  if (!isEmptyValue(result)) {
    this.valueToDisplay = result
  } else {
    this.valueToDisplay = '...'
  }
  this.isShowed = true

  /**
  const isAllowed = event.key.match(oeprationPattern)
  if (isAllowed) {
    const result = this.calculationValue(this.value, event)
    if (!isEmptyValue(result)) {
      this.valueToDisplay = result
    } else {
      this.valueToDisplay = '...'
    }
    this.isShowed = true
  } else {
    const { selectionStart, selectionEnd } = event.target
    if (event.key === 'Backspace') {
      const newValue = this.deleteChar({ value: this.value, selectionStart, selectionEnd })
      if (newValue > 0) {
        event.preventDefault()
        const result = this.calculationValue(newValue, event)
        if (!isEmptyValue(result)) {
          this.value = this.validateValue(result)
          this.valueToDisplay = result
        } else {
          this.valueToDisplay = '...'
        }
        this.isShowed = true
      }
    } else if (event.key === 'Delete') {
      const newValue = this.deleteChar({ value: this.value, selectionStart, selectionEnd, isReverse: false })
      if (String(this.value).slice(-1) > 0) {
        event.preventDefault()
        const newValue = String(this.value).slice(-1)
        const result = this.calculationValue(newValue, event)
        if (!isEmptyValue(result)) {
          this.value = this.validateValue(result)
          this.valueToDisplay = result
        } else {
          this.valueToDisplay = '...'
        }
        this.isShowed = true
      }
    } else {
      event.preventDefault()
    }
  }
  */
}
