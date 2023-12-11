<!--
ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
Contributor(s): Elsio Sanchez elsiosanchez15@outlook.com https://github.com/elsiosanchez
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
  <span>
    <el-input-number
      v-show="isFocus"
      ref="fieldNumber"
      v-model="totalAmount"
      controls-position="right"
      :precision="precision"
      autofocus
      :disabled="disabled"
      style="text-align-last: end !important;width: 100%;"
      @change="handleChange"
      @blur="customFocusLost"
    />
    <el-input
      v-show="!isFocus"
      v-model="displayValue"
      readonly
      autofocus
      :disabled="disabled"
      style="text-align-last: end !important;width: 100%;"
      @focus="customFocusGained"
    />
  </span>
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'
// import lang from '@/lang'
import store from '@/store'
// // Utils and Helper Methods
// import { formatPrice, formatQuantity } from '@/utils/ADempiere/formatValue/numberFormat'
// import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
// import { displayLineProductPriceValue } from '@/utils/ADempiere/dictionary/form/VPOS'
// import { copyToClipboard } from '@/utils/ADempiere/coreUtils.js'
import { formatPrice } from '@/utils/ADempiere/formatValue/numberFormat'

export default defineComponent({
  name: 'fieldAmount',
  props: {
    valueAmount: {
      type: Number,
      required: true
    },
    valueDisplay: {
      type: [String, Number],
      required: true
    },
    precision: {
      type: Number,
      default: 2
    },
    handleChange: {
      type: Function,
      default: (changeValue) => {
        console.info('Triggers when input value changes (value: string | number)', changeValue)
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    // Ref
    const isFocus = ref(false)
    const fieldNumber = ref(null)

    const amount = ref(props.valueAmount)

    const totalAmount = computed({
      get() {
        return props.valueAmount
      },
      // setter
      set(value) {
        store.commit('setPayAmount', value)
      }
    })
    // Methods
    const displayValue = computed(() => {
      const currency = store.getters.getAvailableCurrencies.currencie
      return formatPrice({ value: Number(totalAmount.value), currency: currency.iso_code })
    })
    function customFocusGained(event) {
      fieldNumber.value.select
      fieldNumber.value.select()
      isFocus.value = true
      amount.value = props.valueAmount
      setTimeout(() => {
        fieldNumber.value.select
        fieldNumber.value.select()
      }, 500)
    }

    function customFocusLost(event) {
      isFocus.value = false
    }
    return {
      // Ref
      amount,
      isFocus,
      fieldNumber,
      totalAmount,
      displayValue,
      // Methods
      customFocusLost,
      customFocusGained
    }
  }
})
</script>
