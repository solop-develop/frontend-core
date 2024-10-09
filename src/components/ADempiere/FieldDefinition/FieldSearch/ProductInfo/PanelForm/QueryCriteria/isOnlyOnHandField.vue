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
    :label="$t('field.product.onlyOnHand')"
  >
    <el-select
      v-model="currentValue"
      :disabled="!isStockQuantities"
      clearable
    >
      <!--
      <empty-option-select
        :current-value="currentValue"
        :is-allows-zero="false"
      />
      -->
      <!-- :disabled="isDisabled" -->
      <el-option
        v-for="(option, key) in YES_NO_OPTIONS_LIST"
        :key="key"
        :value="option.booleanValue"
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

// Components and Mixins
import EmptyOptionSelect from '@/components/ADempiere/FieldDefinition/FieldSelect/emptyOptionSelect.vue'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'IsOnlyOnHandField',

  components: {
    EmptyOptionSelect
  },

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
    const ATTRIBUTE_KEY = 'is_only_stock_available'

    const currentValue = computed({
      set(newValue) {
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

    const getWarehouseId = computed(() => {
      return store.getters.getProductSearchFieldQueryFilterByAttribute({
        containerUuid: props.uuidForm,
        attributeKey: 'warehouse_id'
      })
    })
    const isStockQuantities = computed(() => {
      return !isEmptyValue(getWarehouseId.value) && getWarehouseId.value > 0
    })

    return {
      YES_NO_OPTIONS_LIST,
      //
      currentValue,
      isStockQuantities
      // isDisabled
    }
  }
})
</script>
