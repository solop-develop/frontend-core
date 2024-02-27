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
    :label="title"
  >
    <el-select
      v-model="value"
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
import { computed, defineComponent, ref } from '@vue/composition-api'

import lang from '@/lang'

// Constants
import { YES_NO_OPTIONS_LIST } from '@/utils/ADempiere/dictionary/field/yesNo'

// Utils and Helper Methods
import { isSalesTransaction } from '@/utils/ADempiere/contextUtils'

export default defineComponent({
  name: 'OnlyCustomerVendorField',

  props: {
    uuidForm: {
      required: true,
      type: String
    },
    containerUuid: {
      required: true,
      type: String
    }
  },

  setup(props) {
    const value = ref(null)

    const isSalesTransactionContext = computed(() => {
      return isSalesTransaction({
        containerUuid: props.containerUuid
      })
    })

    const title = computed(() => {
      if (isSalesTransactionContext.value) {
        return lang.t('field.businessPartner.customer')
      }
      return lang.t('field.businessPartner.vendor')
    })

    return {
      YES_NO_OPTIONS_LIST,
      //
      isSalesTransactionContext,
      value,
      title
    }
  }
})
</script>
