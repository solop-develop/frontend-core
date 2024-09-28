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
  <div style="display: flex; justify-content: center;">
    <el-form-item style="margin-right: 20px;">
      <template slot="label">
        {{ $t('form.WTrialBalance.showPeriod') }}
      </template>
      <el-switch
        v-model="showPeriod"
        :active-value="false"
        :inactive-value="true"
      />
    </el-form-item>
    <el-form-item>
      <template slot="label">
        {{ $t('form.WTrialBalance.showAccumulated') }}
      </template>
      <el-switch
        v-model="showAccumulated"
        :active-value="false"
        :inactive-value="true"
      />
    </el-form-item>
    <el-form-item
      style="text-align: center; margin-top:7%; margin-right:10%; float:right"
    >
      <el-button
        :loading="isLoading"
        plain
        type="success"
        :icon="isLoading ? 'el-icon-loading' : 'el-icon-refresh'"
        class="button-base-icon"
        @click="refresh()"
      />
      <el-button
        plain
        type="primary"
        icon="el-icon-download"
        class="button-base-icon"
        @click="exportRecords()"
      />
    </el-form-item>
  </div>
</template>
<script>
import store from '@/store'
import {
  defineComponent,
  computed,
  watch,
  ref
} from '@vue/composition-api'
import { exportFileFromJson } from '@/utils/ADempiere/exportUtil.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { showMessage } from '@/utils/ADempiere/notification'
import { formatQuantity } from '@/utils/ADempiere/formatValue/numberFormat'
import {
  listFactAcctSummary
} from '@/api/ADempiere/form/TrialBalanceDrillable.js'
export default defineComponent({
  name: 'showButtomWtrialBalance',
  props: {
    headerList: {
      type: Array,
      required: false
    },
    metadata: {
      type: Object,
      default: () => {}
    }
  },
  setup(props) {
    const porcent = ref(null)

    const organization = computed(() => {
      return store.getters.getOrganization
    })
    const budget = computed(() => {
      const budget = store.getters.getBudget
      if (!isEmptyValue(budget)) {
        return budget
      }
      return undefined
    })
    const untilPeriod = computed(() => {
      return store.getters.getPeriod
    })
    const accountingAccount1 = computed(() => {
      const accounting = store.getters.getAccounting1
      if (!isEmptyValue(accounting)) {
        return accounting
      }
      return undefined
    })
    const accountingAccount2 = computed(() => {
      const accounting = store.getters.getAccounting2
      if (!isEmptyValue(accounting)) {
        return accounting
      }
      return undefined
    })
    const cubeReport = computed(() => {
      return store.getters.getCube
    })
    const showPeriod = computed({
      get() {
        return store.getters.getShowPeriod
      },
      set(value) {
        store.commit('setShowPeriod', value)
      }
    })
    const showAccumulated = computed({
      get() {
        return store.getters.getShowAccumulated
      },
      set(value) {
        store.commit('setShowAccumulated', value)
      }
    })
    const isLoading = computed(() => {
      return store.getters.getIsLoading
    })

    const selectedExport = computed(() => {
      return store.getters.getSelectedExport
    })
    function refresh() {
      store.commit('setIsLoading', true)
      listFactAcctSummary({
        organizationId: organization.value,
        budgetId: budget.value,
        periodId: untilPeriod.value,
        accoutingFromId: accountingAccount1.value,
        accoutingToId: accountingAccount2.value,
        reportCubeId: cubeReport.value
      })
        .then(response => {
          const { records } = response
          const valueMap = records.map(list => {
            const priod_variance = formatQuantity({ value: list.period_variance_amount })
            const period_budget = formatQuantity({ value: list.period_budget_amount })
            calculate(priod_variance, period_budget)
            return {
              ...list,
              period_actual_amount: formatQuantity({ value: list.period_actual_amount }),
              period_budget_amount: period_budget,
              period_variance_amount: priod_variance,
              ytd_actual_amount: formatQuantity({ value: list.ytd_actual_amount }),
              ytd_budget_amount: formatQuantity({ value: list.ytd_budget_amount }),
              variance_amount: formatQuantity({ value: list.variance_amount }),
              variance_percentage: '% ' + porcent.value
            }
          })
          store.commit('setListSummary', valueMap)
        })
        .catch(error => {
          console.warn(`Error Search: ${error.message}. Code: ${error.code}.`)
          let message = error.message
          if (!isEmptyValue(error.response) && !isEmptyValue(error.response.data.message)) {
            message = error.response.data.message
          }
          showMessage({
            type: 'error',
            message,
            showClose: true
          })
        })
        .finally(() => {
          store.commit('setIsLoading', false)
        })
    }
    function calculate(period_variation, period_budget) {
      const period_variation_number = changeFloat(period_variation)
      const period_budget_number = changeFloat(period_budget)
      if (period_variation_number !== 0 && period_budget_number !== 0) {
        porcent.value = (period_variation_number / period_budget_number * 100).toFixed(2)
        return
      }
      porcent.value = 0
    }

    const changeFloat = (num) => {
      return parseFloat(num.replace(/[^\d.-]/g, ''))
    }
    watch(
      () => [organization.value, untilPeriod.value, cubeReport.value],
      (newValue) => {
        if (
          !isEmptyValue(newValue[0]) &&
          !isEmptyValue(newValue[1]) &&
          !isEmptyValue(newValue[2])
        ) {
          refresh()
        }
      }
    )
    function exportRecords() {
      if (!isEmptyValue(selectedExport.value)) {
        const data = selectedExport.value.map(list => {
          const {
            value,
            name,
            user_list_name,
            period_actual_amount,
            period_budget_amount,
            period_variance_amount,
            ytd_actual_amount,
            ytd_budget_amount,
            variance_amount
          } = list
          return {
            value,
            name,
            user_list_name,
            period_actual_amount,
            period_budget_amount,
            period_variance_amount,
            ytd_actual_amount,
            ytd_budget_amount,
            variance_amount
          }
        })
        exportFileFromJson({
          header: props.headerList.map(list => list.label),
          data,
          fileName: props.metadata.name,
          exportType: 'xls'
        })
      }
    }
    return {
      showPeriod,
      showAccumulated,
      isLoading,
      selectedExport,
      formatQuantity,

      //
      calculate,
      exportFileFromJson,
      exportRecords,
      refresh
    }
  }
})
</script>
