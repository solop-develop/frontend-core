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
    :label="$t('field.payment.bankAccount')"
  >
    <el-select
      v-model="currentValue"
      filterable
      clearable
      remote
      :remote-method="remoteMethod"
      @visible-change="showListBP"
    >
      <empty-option-select
        :current-value="currentValue"
        :is-allows-zero="false"
      />
      <el-option
        v-for="(item, key) in optionsList"
        :key="key"
        :value="item.id"
        :label="item.values.DisplayColumn"
      />
    </el-select>
  </el-form-item>
</template>

<script>
import { computed, defineComponent, ref } from '@vue/composition-api'

import store from '@/store'
// Components and Mixins
import EmptyOptionSelect from '@/components/ADempiere/FieldDefinition/FieldSelect/emptyOptionSelect.vue'
// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'BankAccount',

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
      required: true,
      type: String
    }
  },

  setup(props) {
    const ATTRIBUTE_KEY = 'bankAccountId'
    const timeOut = ref(null)
    const isLoading = ref(false)

    const currentValue = computed({
      set(newValue) {
        store.commit('setPaymentFieldQueryFilterByAttribute', {
          containerUuid: props.uuidForm,
          attributeKey: ATTRIBUTE_KEY,
          value: isEmptyValue(newValue) ? -1 : newValue
        })
      },
      get() {
        return store.getters.getPaymentQueryFilterByAttribute({
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
      return store.getters.getPaymentBankAccountList
    })

    // Methods

    function showListBP(show) {
      if (show && isEmptyValue(optionsList.value)) remoteMethod()
    }

    function remoteMethod(searchValue) {
      clearTimeout(timeOut.value)
      timeOut.value = setTimeout(() => {
        isLoading.value = true
        store.dispatch('paymentBankAccountList', searchValue)
          .finally(() => {
            isLoading.value = false
          })
      }, 500)
    }

    if (!isEmptyValue(BPartnerContext.value)) {
      store.dispatch('paymentBankAccountList')
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
