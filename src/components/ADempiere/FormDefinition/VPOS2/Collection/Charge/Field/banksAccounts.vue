<!--
ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A.
Contributor(s): Elsio Sanchez elsiosanchez15@outlook.com https://github.com/elsiosanchez
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
    :label="$t('pointOfSales.collection.customerAccount')"
    class="form-item-criteria"
    style="margin: 0px;width: 100%;"
  >
    <el-select
      v-model="bankAccount"
      filterable
      clearable
      @visible-change="findBankAccounts"
    >
      <el-option
        v-for="item in listBankAccounts"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      />
    </el-select>
  </el-form-item>
</template>

<script>
import { computed, defineComponent, watch } from '@vue/composition-api'

import store from '@/store'
import { isEmptyValue } from '@/utils/ADempiere'

export default defineComponent({
  name: 'banksAccounts',
  props: {
    isRefund: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const listBankAccounts = computed(() => {
      return store.getters.getAttributeField({
        field: 'bankAccounts',
        attribute: 'list'
      })
    })

    const bankAccount = computed({
      get() {
        const banck = store.getters.getAttributeField({
          field: 'bankAccounts',
          attribute: 'currentAccount'
        })
        if (banck) return banck.id
        return ''
      },
      // setter
      set(account) {
        let currentAccount
        if (!isEmptyValue(account)) {
          currentAccount = listBankAccounts.value.find(list => list.id === account)
        }
        store.commit('setAttributeField', {
          field: 'bankAccounts',
          attribute: 'currentAccount',
          value: currentAccount
        })
      }
    })

    function findBankAccounts(show) {
      if (!show) return
      store.dispatch('listAccounts')
    }

    function setDataAccount(account) {
      store.commit('setAttributeField', {
        field: 'field',
        attribute: 'phone',
        value: account.account_no
      })
      store.commit('setAttributeField', {
        field: 'field',
        attribute: 'value',
        value: account.driver_license
      })
      store.commit('setAttributeField', {
        field: 'banks',
        attribute: 'issuingBank',
        value: {
          ...account,
          id: account.bank_id
        }
      })
    }

    function clearDataAccount(value = undefined) {
      store.commit('setAttributeField', {
        field: 'field',
        attribute: 'phone',
        value
      })
      store.commit('setAttributeField', {
        field: 'field',
        attribute: 'value',
        value
      })
      store.commit('setAttributeField', {
        field: 'banks',
        attribute: 'issuingBank',
        value
      })
    }

    watch(bankAccount, (newValue, oldValue) => {
      if (newValue !== oldValue) {
        const account = listBankAccounts.value.find(list => list.id === newValue)
        if (isEmptyValue(account)) {
          clearDataAccount()
        } else {
          setDataAccount(account)
        }
      }
    })

    return {
      bankAccount,
      listBankAccounts,
      findBankAccounts,
      setDataAccount
    }
  }
})
</script>
