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
    :label="$t('field.invoice.saleTransaction')"
    style="align-items: center;"
  >
    <el-select
      v-model="saleTransactionField"
      @change="currentValue()"
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
import { defineComponent, ref, computed } from '@vue/composition-api'
import store from '@/store'

// Constants
import { YES_NO_OPTIONS_LIST } from '@/utils/ADempiere/dictionary/field/yesNo'
// Utils and Helper Methods
import { isSalesTransaction } from '@/utils/ADempiere/contextUtils'
// import { isEmptyValue } from '@/utils/ADempiere'

export default defineComponent({
  name: 'saleTransactionField',
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
      required: true,
      type: String
    }
  },

  setup(props) {
    const saleTransactionField = ref('')

    const currentValue = () => {
      store.dispatch('searchInvociesInfos', {
        is_sales_transaction: saleTransactionField.value
      })
    }

    const isSalesTransactionContext = computed(() => {
      return isSalesTransaction({
        parentUuid: props.parentUuid,
        containerUuid: props.containerUuid
      })
    })
    function changeValue() {
      const response = isSalesTransactionContext.value
      if (response === true) {
        saleTransactionField.value = 'Y'
        return
      } else if (response === false) {
        saleTransactionField.value = 'N'
        return
      } else {
        saleTransactionField.value = ''
      }
      currentValue()
      return
    }

    changeValue()

    return {
      saleTransactionField,
      YES_NO_OPTIONS_LIST,
      isSalesTransactionContext,
      //
      currentValue,
      changeValue
    }
  }
})
</script>
