<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com https://github.com/EdwinBetanc0urt
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program. If not, see <https:www.gnu.org/licenses/>.
-->

<template>
  <el-tooltip
    v-model="isShowed"
    manual
    :content="valueToDisplay"
    placement="top"
    effect="light"
  >
    <el-input-number
      v-if="isFocus"
      :ref="metadata.columnName"
      key="number-input-focus"
      v-model="value"
      v-shortkey="shortcutKeys"
      v-bind="commonsProperties"
      type="number"
      :min="minValue"
      :max="maxValue"
      :precision="precision"
      :controls="isShowControls"
      :controls-position="controlsPosition"
      autofocus
      @change="preHandleChange"
      @focus="focusGained"
      @blur="customFocusLost"
      @keydown.native="keyPressed"
      @keyup.native="keyReleased"
      @shortkey.native="keyPressField"
      @keyup.native.enter="actionKeyEnter"
    />

    <el-input
      v-else
      key="number-displayed-blur"
      v-model="displayedValue"
      v-bind="commonsProperties"
      readonly
      autofocus
      @focus="customFocusGained"
    />
  </el-tooltip>
</template>

<script>
import store from '@/store'

// Components and Mixins
import fieldMixin from '@/components/ADempiere/FieldDefinition/mixin/mixinField.js'

// Constants
import { INPUT_NUMBER_PATTERN } from '@/utils/ADempiere/formatValue/numberFormat.js'
import { DISPLAY_COLUMN_PREFIX } from '@/utils/ADempiere/dictionaryUtils'

// Utils and Helper Methods
import { isDecimalField } from '@/utils/ADempiere/references.js'
import { formatNumber } from '@/utils/ADempiere/formatValue/numberFormat.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

export default {
  name: 'FieldNumber',

  mixins: [
    fieldMixin
  ],

  data() {
    return {
      isFocus: false,
      valueToDisplay: '',
      isShowed: false
    }
  },

  computed: {
    cssClassCustomField() {
      return ' custom-field-number '
    },
    maxValue() {
      if (isEmptyValue(this.metadata.valueMax)) {
        // Number.POSITIVE_INFINITY
        return Infinity
      }
      return Number(this.metadata.valueMax)
    },
    minValue() {
      if (isEmptyValue(this.metadata.valueMin)) {
        // Number.NEGATIVE_INFINITY
        return -Infinity
      }
      return Number(this.metadata.valueMin)
    },
    precision() {
      // Amount, Costs+Prices, Number, Quantity
      if (!isEmptyValue(this.metadata.precision)) {
        return this.metadata.precision
      }
      if (isDecimalField(this.metadata.displayType)) {
        return store.getters.getStandardPrecision
      }
      return undefined
    },
    isShowControls() {
      if (!isEmptyValue(this.metadata.showControl)) {
        if (this.metadata.showControl === 0) {
          return false
        }
      }
      return true
    },
    controlsPosition() {
      if (!isEmptyValue(this.metadata.showControl)) {
        // show side controls
        if (this.metadata.showControl === 1) {
          return undefined
        }
      }
      // show right controls
      return 'right'
    },
    displayedValue: {
      set(newValue) {
      },
      get() {
        return formatNumber({
          value: this.value,
          displayType: this.metadata.displayType,
          currency: this.currencyCode,
          precision: this.metadata.precision
        })
      }
    },
    currencyDocument() {
      const columnName = DISPLAY_COLUMN_PREFIX + 'C_Currency_ID'
      // table records values
      if (this.metadata.inTable) {
        // implement container manager row
        if (this.metadata.containerManager && this.metadata.containerManager.getCell) {
          const currentValue = this.metadata.containerManager.getCell({
            containerUuid: this.metadata.containerUuid,
            rowIndex: this.metadata.rowIndex,
            columnName
          })
          if (!isEmptyValue(currentValue)) {
            return currentValue
          }
        }
      }

      return store.getters.getValueOfField({
        parentUuid: this.metadata.parentUuid,
        containerUuid: this.metadata.containerUuid,
        columnName
      })
    },
    currencyCode() {
      if (!isEmptyValue(this.metadata.labelCurrency)) {
        return this.metadata.labelCurrency
      }
      const documentCurrency = this.currencyDocument
      if (!isEmptyValue(documentCurrency)) {
        return documentCurrency
      }
      // const currencyIsoCode = store.getters.getCurrencyCode
      // if (!isEmptyValue(currencyIsoCode)) {
      //   return currencyIsoCode
      // }
      return undefined
    },
    shortcutKeys() {
      const alphabet = {
        a: ['a'], A: ['A'], b: ['b'], B: ['B'], c: ['c'], C: ['C'], d: ['d'], D: ['D'],
        e: ['e'], E: ['E'], f: ['f'], F: ['F'], g: ['g'], G: ['G'], h: ['h'], H: ['H'],
        i: ['i'], I: ['I'], j: ['j'], J: ['J'], k: ['k'], K: ['K'], l: ['l'], L: ['L'], m: ['m'], M: ['M'], n: ['n'], N: ['N'],
        o: ['o'], O: ['O'], p: ['p'], P: ['P'], q: ['q'], Q: ['Q'], r: ['r'], R: ['R'], s: ['s'], S: ['S'], t: ['t'], T: ['T'],
        u: ['u'], U: ['U'], v: ['v'], V: ['V'], w: ['w'], W: ['W'], x: ['x'], X: ['X'], y: ['y'], Y: ['Y'], z: ['z'], Z: ['Z']
      }

      // generate new object
      const alphabetWithShift = Object.keys(alphabet).reduce((acc, item, index) => {
        acc[index] = [
          'shift',
          item.at()
        ]
        return acc
      }, {})

      return {
        ...alphabet,
        ...alphabetWithShift,
        close: ['esc']
      }
    }
  },

  methods: {
    keyPressField(event) {
      switch (event.srcKey) {
        case 'close':
          this.customFocusLost(event)
          break
      }

      // if (!isEmptyValue(this.$refs[this.metadata.columnName])) {
      //   this.$refs[this.metadata.columnName].handleBlur()
      //   this.preHandleChange(this.$refs[this.metadata.columnName].currentValue)
      // }
    },
    parseValue(value) {
      if (isEmptyValue(value)) {
        return undefined
      }
      return Number(value)
    },
    customFocusGained(event) {
      if (this.metadata.readonly) {
        this.isFocus = false
        return
      }
      this.isFocus = true
      // this.focusGained(event)
      this.$nextTick(() => {
        // this.$refs[this.metadata.columnName].focus()
        if (!isEmptyValue(this.$refs) && !isEmptyValue(this.$refs[this.metadata.columnName])) {
          this.$refs[this.metadata.columnName].select()
        }
      })
    },
    actionKeyEnter(event) {
      // this.$nextTick(() => {
      //   if (!isEmptyValue(this.$refs) && !isEmptyValue(this.$refs[this.metadata.columnName])) {
      //     this.$refs[this.metaedata.columnName].select()
      //   }
      // })
      this.actionKeyPerformed(event)
    },
    customFocusLost(event) {
      this.focusLost(event)

      // to change value first
      setTimeout(() => {
        this.isFocus = false
      }, 100)
    },
    validateInput(event) {
      const value = String(event.target.value)
        .replace(INPUT_NUMBER_PATTERN, '')
      this.value = value
    }
  }
}
</script>

<style lang="scss" scoped>
  /* Show input width 100% in container */
  .el-input-number, .el-input {
    width: 100% !important; /* ADempiere Custom */
  }
</style>
<style lang="scss">
.custom-field-number {
  &.el-input-number, &.el-input {
    .el-input__inner {
      text-align-last: end !important;
    }
  }
}
</style>
