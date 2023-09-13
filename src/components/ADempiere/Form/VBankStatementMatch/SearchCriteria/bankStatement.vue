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
    :label="$t('form.VBankStatementMatch.field.bankStatement')"
    class="form-item-criteria"
    required
    style="width: 100%;"
  >
    <el-select
      v-model="storedBankStatement"
      value-key="id"
      filterable
      clearable
      :disabled="isDisabledBankStatement"
      style="width: 100%;"
      :remote-method="remoteSearch"
      @visible-change="getBankStatementsList"
      @clear="clearValues"
    >
      <el-option
        v-for="item in storedBankStatementsList"
        :key="item.id"
        :label="'#' + item.documentNo + ' - ' + formatDate({ value: item.statementDate}) + ' - ' + item.name"
        :value="item"
      />
    </el-select>
  </el-form-item>
</template>

<script>
import { defineComponent, computed, ref, onMounted } from '@vue/composition-api'

import store from '@/store'
import router from '@/router'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { formatDate } from '@/utils/ADempiere/formatValue/dateFormat'

export default defineComponent({
  name: 'BankStatement',

  props: {
    isDisabled: {
      type: Boolean,
      default: false
    }
  },

  setup(props) {
    const timeOut = ref(null)

    const storedBankStatement = computed({
      set(newValue) {
        if (isEmptyValue(newValue)) {
          // clear values
          store.commit('setBankAccountId', -1)
          store.commit('setCurrentBankStatement', {})
          return
        }
        const { bankAccount } = newValue
        if (!isEmptyValue(bankAccount) && bankAccount.id > 0) {
          store.commit('setBankAccountId', bankAccount.id)
        }
        store.commit('setCurrentBankStatement', newValue)
      },
      get() {
        const currentValue = store.getters.getCurrentBankStatement
        return currentValue
      }
    })

    const isDisabledBankStatement = computed(() => {
      const currentRoute = router.app.$route
      const { query } = currentRoute
      return !isEmptyValue(query.Record_ID) || props.isDisabled
    })

    const bankAccountId = computed(() => {
      return store.getters.getBankAccountValueStatementMatch
    })

    const storedBankStatementsList = computed(() => {
      return store.getters.getBankStatementsList
    })

    function getBankStatementsList(isExpand) {
      if (!isExpand || !isEmptyValue(storedBankStatementsList.value)) {
        return
      }
      store.dispatch('getBankStatementsListFromServer', {
        bankAccountId: bankAccountId.value
      })
    }

    function localSearch(searchQuery = '') {
      if (isEmptyValue(searchQuery)) {
        return storedBankStatementsList.value
      }
      return storedBankStatementsList.value.filter(option => {
        return option.displayedValue.toLowerCase().includes(searchQuery.toLowerCase())
      })
    }

    function remoteSearch(searchQuery = '') {
      const results = localSearch(searchQuery)
      if (isEmptyValue(searchQuery) ||
        (!isEmptyValue(searchQuery) && (isEmptyValue(results) || results.length < 3))) {
        clearTimeout(timeOut.value)
        timeOut.value = setTimeout(() => {
          store.dispatch('getBankStatementsListFromServer', {
            bankAccountId: bankAccountId.value,
            searchValue: searchQuery
          })
        }, 500)
        return
      }
    }

    function clearValues() {
      storedBankStatement.value = undefined
      store.commit('setBankStatementsList', [])
    }

    onMounted(() => {
      // to displayed value if is record id on query
      getBankStatementsList(true)
    })

    return {
      storedBankStatement,
      storedBankStatementsList,
      isDisabledBankStatement,
      //
      formatDate,
      getBankStatementsList,
      remoteSearch,
      clearValues
    }
  }
})
</script>
