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
    :label="$t('field.invoice.businessPartner')"
  >
    <el-select
      v-model="currentValue"
      filterable
      clearable
      remote
      :remote-method="remoteMethod"
      @visible-change="showListBP"
    >
      <el-option
        v-for="(option, key) in optionsList"
        :key="key"
        :value="option.id"
        :label="option.displayColumn"
      />
    </el-select>
  </el-form-item>
</template>

<script>
import { computed, defineComponent, ref } from '@vue/composition-api'

import store from '@/store'
// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'BusinessPartner',

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
    const ATTRIBUTE_KEY = 'businessPartnerId'
    const timeOut = ref(null)
    const isLoading = ref(false)

    const currentValue = computed({
      set(newValue) {
        store.commit('setInvoiceFieldQueryFilterByAttribute', {
          containerUuid: props.uuidForm,
          attributeKey: ATTRIBUTE_KEY,
          value: newValue
        })
      },
      get() {
        return store.getters.getInvoicesQueryFilterByAttribute({
          containerUuid: props.uuidForm,
          attributeKey: ATTRIBUTE_KEY
        })
      }
    })

    const BPartnerContext = computed(() => {
      return store.getters.getValueOfField({
        parentUuid: props.parentUuid,
        containerUuid: props.containerUuid,
        columnName: 'C_BPartner_ID'
      })
    })

    const optionsList = computed(() => {
      return store.getters.getInvoiceBusinessPartnerList
    })

    // Methods

    function showListBP(show) {
      if (show && isEmptyValue(optionsList.value)) remoteMethod()
    }

    function remoteMethod(searchValue) {
      clearTimeout(timeOut.value)
      timeOut.value = setTimeout(() => {
        isLoading.value = true
        store.dispatch('invoiceBusinessPartnerList', searchValue)
          .finally(() => {
            isLoading.value = false
          })
      }, 500)
    }

    if (!isEmptyValue(BPartnerContext.value)) {
      store.dispatch('invoiceBusinessPartnerList')
        .finally(() => {
          currentValue.value = BPartnerContext.value
        })
    }

    return {
      // Ref
      isLoading,
      timeOut,
      // Computed
      currentValue,
      optionsList,
      BPartnerContext,
      // Methods
      showListBP,
      remoteMethod
    }
  }
})
</script>
