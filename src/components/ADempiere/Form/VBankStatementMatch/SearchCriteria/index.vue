<!--
ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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
  <div>
    <el-card id="panel-top-search-criteria" class="panel-top-search-criteria">
      <el-form
        :inline="true"
        label-position="top"
        style="padding: 10px !important;"
      >
        <el-row :gutter="4">
          <el-col :span="8">
            <bank-statement />
          </el-col>
          <el-col :span="8">
            <bank-account />
          </el-col>

          <el-col :span="8">
            <business-partner />
          </el-col>

          <el-col :span="8">
            <el-form-item
              :label="$t('form.VBankStatementMatch.field.totalPayment')"
              class="form-item-criteria"
              style="margin: 0px;"
            >
              <span
                style="display: flex !important;border-radius: 4px;border: 1px solid rgb(235, 238, 245);padding: 2px 4px;"
              >
                <el-input-number
                  v-model="paymentAmountTo"
                  controls-position="right"
                  style="width: 50% !important;"
                />
                <b style="color: #80808078;margin-left: 5px;margin-right: 5px;font-weight: 999;">
                  {{ '─' }}
                </b>
                <el-input-number
                  v-model="paymentAmountFrom"
                  controls-position="right"
                  style="width: 50% !important;"
                />
              </span>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item
              :label="$t('form.VBankStatementMatch.field.transactionDate')"
              class="form-item-criteria"
              style="width: 100%;"
            >
              <el-date-picker
                v-model="transactionDate"
                type="daterange"
                range-separator="-"
                format="yyyy-MM-dd"
                value-format="timestamp"
                start-placeholder="Start date"
                end-placeholder="End date"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <!-- <el-card>
      <automatic-match />
    </el-card> -->
  </div>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

import store from '@/store'

// Components and Mixins
// import AutomaticMatch from '../AutomaticMatch.vue'
import BankAccount from '../SearchCriteria/bankAccount.vue'
import BusinessPartner from '../SearchCriteria/businessPartner.vue'
import SearchMode from '../SearchCriteria/searchMode.vue'
import BankStatement from '../SearchCriteria/bankStatement.vue'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere'

export default defineComponent({
  name: 'SearchCriteria',

  components: {
    BusinessPartner,
    // AutomaticMatch,
    BankStatement,
    BankAccount,
    SearchMode
  },

  setup() {
    const isEnableSearch = computed(() => {
      const bankAccount = store.getters.getBankAccountValueStatementMatch
      if (isEmptyValue(bankAccount) || bankAccount <= 0) {
        return false
      }
      return true
    })

    const isMatchModeValue = computed(() => {
      return store.getters.getMatchModeBankStatementMatch === 0
    })

    const paymentAmountTo = computed({
      // getter
      get() {
        const { paymentAmount } = store.getters.getCriteriaVBankStatement
        return paymentAmount.to
      },
      // setter
      set(value) {
        store.commit('updateAttributeCriteria', {
          attribute: 'to',
          criteria: 'paymentAmount',
          value
        })
      }
    })

    const paymentAmountFrom = computed({
      // getter
      get() {
        const { paymentAmount } = store.getters.getCriteriaVBankStatement
        return paymentAmount.from
      },
      // setter
      set(value) {
        store.commit('updateAttributeCriteria', {
          attribute: 'from',
          criteria: 'paymentAmount',
          value
        })
      }
    })

    const transactionDate = computed({
      // getter
      get() {
        const { transactionDate } = store.getters.getCriteriaVBankStatement
        if (isEmptyValue(transactionDate.to) && isEmptyValue(transactionDate.from)) {
          return ''
        }
        return [transactionDate.to, transactionDate.from]
      },
      // setter
      set(newValue) {
        let startValue, endValue
        if (Array.isArray(newValue)) {
          startValue = newValue.at(0)
          endValue = newValue.at(1)
        }

        store.commit('updateAttributeCriteria', {
          attribute: 'from',
          criteria: 'transactionDate',
          value: startValue
        })
        store.commit('updateAttributeCriteria', {
          attribute: 'to',
          criteria: 'transactionDate',
          value: endValue
        })
      }
    })

    function refreshSearch() {
      // store.dispatch('getPaymentsListFromServer', {})
      // store.dispatch('searchListImportedBankMovements', {})
      store.dispatch('getMatchingMovementsListFromServer', {})
    }

    return {
      isEnableSearch,
      isMatchModeValue,
      paymentAmountTo,
      paymentAmountFrom,
      transactionDate,
      refreshSearch
    }
  }
})
</script>

<style lang="scss">
.form-item-criteria {
  margin-top: 0px;
  margin-left: 0px;
  margin-bottom: 0px;
  margin-right: 0px;
  padding-bottom: 0px;
  .el-form-item__label {
    padding-bottom: 0px;
  }
  .el-form-item--medium .el-form-item__label {
    padding-bottom: 0px;
  }
  .el-form--inline .el-form-item {
    margin: 0px;
  }
}
</style>
