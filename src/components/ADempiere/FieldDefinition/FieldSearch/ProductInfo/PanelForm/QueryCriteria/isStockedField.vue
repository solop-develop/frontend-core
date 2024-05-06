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
  <el-form-item
    :label="$t('field.product.stocked')"
  >
    <el-select
      v-model="currentValue"
      clearable
    >
      <!-- :disabled="isDisabled" -->
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
import { computed, defineComponent } from '@vue/composition-api'

import store from '@/store'

// Constants
import { YES_NO_OPTIONS_LIST } from '@/utils/ADempiere/dictionary/field/yesNo'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'IsStokedField',

  props: {
    uuidForm: {
      required: true,
      type: String
    },
    parentUuid: {
      type: String,
      default: undefined
    },
    containerUuid: {
      required: false,
      type: String
    }
  },

  setup(props) {
    const ATTRIBUTE_KEY = 'is_stocked'

    const currentValue = computed({
      set(newValue) {
        if (isEmptyValue(newValue)) newValue = -1
        store.commit('setProductSearchFieldQueryFilterByAttribute', {
          containerUuid: props.uuidForm,
          attributeKey: ATTRIBUTE_KEY,
          value: newValue
        })
      },
      get() {
        return store.getters.getProductSearchFieldQueryFilterByAttribute({
          containerUuid: props.uuidForm,
          attributeKey: ATTRIBUTE_KEY
        })
      }
    })

    // const isDisabled = computed(() => {
    //   const warehouseId = store.getters.getProductSearchFieldQueryFilterByAttribute({
    //     containerUuid: props.uuidForm,
    //     attributeKey: 'warehouse_id'
    //   })
    //   return isEmptyValue(warehouseId) || warehouseId <= 0
    // })

    return {
      YES_NO_OPTIONS_LIST,
      //
      currentValue
      // isDisabled
    }
  }
})
</script>
