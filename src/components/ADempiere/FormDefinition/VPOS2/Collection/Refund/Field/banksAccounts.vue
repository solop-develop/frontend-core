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
      style="width: 100%;"
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
        return store.getters.getAttributeField({
          field: 'fieldsRefunds',
          attribute: 'currentAccount'
        })
      },
      // setter
      set(value) {
        store.commit('setAttributeField', {
          field: 'fieldsRefunds',
          attribute: 'currentAccount',
          value: value
        })
      }
    })

    function findBankAccounts(show) {
      if (!show) return
      store.dispatch('listAccounts')
    }

    function setDataAccount(account) {
      store.commit('setAttributeField', {
        field: 'fieldsRefunds',
        attribute: 'phone',
        value: account.account_no
      })
      store.commit('setAttributeField', {
        field: 'fieldsRefunds',
        attribute: 'value',
        value: account.driver_license
      })
      store.commit('setAttributeField', {
        field: 'fieldsRefunds',
        attribute: 'issuingBank',
        value: {
          ...account,
          id: account.bank_id
        }
      })
      store.commit('setAttributeField', {
        field: 'fieldsRefunds',
        attribute: 'bank',
        value: {
          ...account,
          id: account.bank_id
        }
      })
      store.commit('setAttributeField', {
        field: 'fieldsRefunds',
        attribute: 'bankAccountType',
        value: account.bank_account_type
      })
      store.commit('setAttributeField', {
        field: 'fieldsRefunds',
        attribute: 'accountNo',
        value: account.account_no
      })
    }

    function clearDataAccount(value = undefined) {
      store.commit('setAttributeField', {
        field: 'fieldsRefunds',
        attribute: 'phone',
        value
      })
      store.commit('setAttributeField', {
        field: 'fieldsRefunds',
        attribute: 'value',
        value
      })
      store.commit('setAttributeField', {
        field: 'fieldsRefunds',
        attribute: 'issuingBank',
        value
      })
      store.commit('setAttributeField', {
        field: 'fieldsRefunds',
        attribute: 'bankAccountType',
        value
      })
      store.commit('setAttributeField', {
        field: 'fieldsRefunds',
        attribute: 'bank',
        value
      })
      store.commit('setAttributeField', {
        field: 'fieldsRefunds',
        attribute: 'accountNo',
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
