<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A.www.erpya.com
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
    :label="$t('form.VBankStatementMatch.field.bankAccount')"
    class="form-item-criteria"
    style="width: 100%;"
    required
  >
    <el-select
      v-model="bankAccountValue"
      :remote-method="remoteSearch"
      style="width: 100%;"
      filterable
      clearable
      disabled
      @visible-change="getBanksAccountsList"
      @clear="clearValues"
    >
      <el-option
        v-for="item in bankAccountsList"
        :key="item.id"
        :label="item.displayedValue"
        :value="item.id"
      />
    </el-select>
  </el-form-item>
</template>

<script>
import { defineComponent, computed, ref, onMounted } from '@vue/composition-api'

import store from '@/store'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere'

export default defineComponent({
  name: 'BankAccount',

  setup() {
    const timeOut = ref(null)

    const bankAccountFromBankStatement = computed(() => {
      const bankStatement = store.getters.getCurrentBankStatement
      if (isEmptyValue(bankStatement)) {
        return undefined
      }
      return bankStatement.bankAccountId
    })

    const bankAccountValue = computed({
      get() {
        return store.getters.getBankAccountValueStatementMatch
      },
      set(newValue) {
        store.commit('setBankAccountId', newValue)
      }
    })

    const bankAccountsList = computed(() => {
      return store.getters.getBanksAccountsListStatementMatch
    })

    function getBanksAccountsList(isExpand) {
      if (!isExpand || !isEmptyValue(bankAccountsList.value)) {
        return
      }
      store.dispatch('listBankAccount', {})
    }

    function localSearch(searchQuery = '') {
      if (isEmptyValue(searchQuery)) {
        return bankAccountsList.value
      }
      return bankAccountsList.value.filter(option => {
        return option.displayedValue.toLowerCase().includes(searchQuery.toLowerCase())
      })
    }

    function remoteSearch(searchQuery = '') {
      const results = localSearch(searchQuery)
      if (isEmptyValue(searchQuery) ||
        (!isEmptyValue(searchQuery) && (isEmptyValue(results) || results.length < 3))) {
        clearTimeout(timeOut.value)
        timeOut.value = setTimeout(() => {
          store.dispatch('listBankAccount', {
            searchValue: searchQuery
          })
        }, 500)
        return
      }
    }

    function clearValues() {
      bankAccountValue.value = undefined
      store.commit('setBankAccountsList', [])
    }

    onMounted(() => {
      getBanksAccountsList(true)
      if (!isEmptyValue(bankAccountFromBankStatement.value)) {
        bankAccountValue.value = bankAccountFromBankStatement.value
      }
    })

    return {
      bankAccountValue,
      bankAccountsList,
      //
      getBanksAccountsList,
      remoteSearch,
      clearValues
    }
  }
})
</script>
