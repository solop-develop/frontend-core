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
  <div class="operator-comparison">
    <span class="custom-tittle-popover">
      {{ $t('operators.compareSearch') }}:
    </span>
    <br>
    <el-select
      v-model="currentOperator"
      :disabled="fieldAttributes.readonly"
    >
      <el-option
        v-for="(itemOperator, key) in operatorsList"
        :key="key"
        :value="itemOperator"
        :label="$t('operators.' + itemOperator)"
      />
    </el-select>
  </div>
</template>

<script>
import { computed, defineComponent, ref } from '@vue/composition-api'

import store from '@/store'

export default defineComponent({
  name: 'OperatorComparisonField',

  props: {
    fieldAttributes: {
      type: Object,
      required: true
    },
    containerManager: {
      type: Object,
      default: () => ({})
    }
  },

  setup(props) {
    const { containerUuid, columnName } = props.fieldAttributes

    const operatorsList = ref(props.fieldAttributes.operatorsList)
    const currentOperator = computed({
      get() {
        return props.fieldAttributes.operator
      },
      set(newValue) {
        store.commit('updateValueOfField', {
          containerUuid,
          columnName,
          value: newValue
        })
        store.dispatch('changeFieldAttribure', {
          containerUuid,
          columnName,
          attributeName: 'operator',
          attributeValue: newValue,
          field: props.fieldAttributes
        })
      }
    })

    return {
      currentOperator,
      operatorsList
    }
  }
})
</script>

<style scoped lang="scss">
.custom-tittle-popover {
  font-size: 14px;
  font-weight: bold;
  float: left;
}

.operator-comparison {
  margin: 10px;
  padding: 10px;
}
</style>
