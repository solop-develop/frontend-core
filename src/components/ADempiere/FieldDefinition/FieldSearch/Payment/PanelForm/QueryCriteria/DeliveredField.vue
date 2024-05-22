<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
  Contributor(s): Elsio Sanchez elsiosanches@gmail.com https://github.com/elsiosanchez
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
  <el-form-item
    :label="$t('field.order.delivered')"
    style="align-items: center;"
  >
    <el-select
      v-model="currentValue"
    >
      <el-option
        v-for="(option, key) in YES_NO_OPTIONS_LIST"
        :key="key"
        :value="option.stringValue"
        :label="option.displayValue"
      />
    </el-select>
  </el-form-item>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

import store from '@/store'

// Constants
import { YES_NO_OPTIONS_LIST } from '@/utils/ADempiere/dictionary/field/yesNo'

// Utils and Helper Methods
import { isSalesTransaction } from '@/utils/ADempiere/contextUtils'
import { convertBooleanToString } from '@/utils/ADempiere/formatValue/booleanFormat'
// import { isEmptyValue } from '@/utils/ADempiere'

export default defineComponent({
  name: 'DeliveredField',

  props: {
    uuidForm: {
      required: true,
      type: String
    },
    parentUuid: {
      type: String,
      default: undefined
    }
  },

  setup(props) {
    const ATTRIBUTE_KEY = 'isDelivered'

    const isSalesTransactionContext = computed(() => {
      const booleanValue = isSalesTransaction({
        parentUuid: props.parentUuid,
        containerUuid: ''
      })
      return convertBooleanToString(booleanValue)
    })

    const currentValue = computed({
      set(newValue) {
        store.commit('setPaymentFieldQueryFilterByAttribute', {
          containerUuid: props.uuidForm,
          attributeKey: ATTRIBUTE_KEY,
          value: newValue
        })
      },
      get() {
        return store.getters.getPaymentQueryFilterByAttribute({
          containerUuid: props.uuidForm,
          attributeKey: ATTRIBUTE_KEY
        })
      }
    })
    // currentValue.value = isSalesTransactionContext.value

    return {
      // saleTransactionField,
      YES_NO_OPTIONS_LIST,
      //
      isSalesTransactionContext,
      //
      currentValue
    }
  }
})
</script>
