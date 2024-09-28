<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
  Contributor(s): Ricardo Fenomeno ricardofenomeno13@gmail.com https://github.com/ricargame
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
  <div>
    <el-form-item style="margin-top: 0; margin-bottom: 0 !important;">
      <template slot="label">
        {{ $t('form.WTrialBalance.accountingAccount') }}
      </template>
    </el-form-item>
    <div style="display: flex; align-items: center;">
      <el-select
        v-model="accountingAccount1"
        :placeholder="$t('form.WTrialBalance.accountingAccount')"
        :filter-method="filterMethod"
        style="width: 49%; margin-right: 10px;"
        clearable
        filterable
        @visible-change="showListAccoutingKeys"
      >
        <el-option
          v-for="item in accountingAccountOptions"
          :key="item.id"
          :label="item.values.DisplayColumn"
          :value="item.id"
        />
      </el-select>
      <b style="color: #c0c4cc; padding: 0px 5px; font-weight: bold;">
        {{ '-' }}
      </b>
      <el-select
        v-model="accountingAccount2"
        :filter-method="filterMethod"
        style="width: 49%;"
        filterable
        clearable
        @visible-change="showListAccoutingKeys"
      >
        <el-option
          v-for="item in accountingAccountOptions"
          :key="item.id"
          :label="item.values.DisplayColumn"
          :value="item.id"
        />
      </el-select>
    </div>
  </div>
</template>
<script>
import store from '@/store'
import {
  defineComponent,
  ref,
  computed
} from '@vue/composition-api'
import { listAccoutingKeys } from '@/api/ADempiere/form/TrialBalanceDrillable.js'
export default defineComponent({
  name: 'accountingWtrialBalance',
  methods: {
    filterMethod(query) {
      this.showListAccoutingKeys(true, query)
    }
  },
  setup() {
    const accountingAccount1 = computed({
      get() {
        return store.getters.getAccounting1
      },
      set(value) {
        store.commit('setAccounting1', value)
      }
    })
    const accountingAccount2 = computed({
      get() {
        return store.getters.getAccounting2
      },
      set(value) {
        store.commit('setAccounting2', value)
      }
    })
    const accountingAccountOptions = ref([])

    function showListAccoutingKeys(show, search = '') {
      if (!show) return
      listAccoutingKeys({
        searchValue: search
      })
        .then(response => {
          const { records } = response
          accountingAccountOptions.value = records
        })
    }
    return {
      accountingAccount1,
      accountingAccount2,
      accountingAccountOptions,
      showListAccoutingKeys
    }
  }
})
</script>
