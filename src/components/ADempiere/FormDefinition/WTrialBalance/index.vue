<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
  Contributor(s): Elsio Sanchez Elsiosanches@gmail.com https://github.com/Elsiosanchez
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
    <el-card
      shadow="header"
      :body-style="{ padding: '10px 20px', margin: '0px' }"
    >
      <el-row :gutter="20">
        <el-form
          inline
          class="field-from-trial-balance"
          label-position="top"
        >
          <el-col :span="8">
            <el-form-item class="front-item-w-trial-balance">
              <template slot="label">
                {{ $t('form.WTrialBalance.organization') }}
                <b style="color: #f34b4b"> * </b>
              </template>
              <el-select
                v-model="organization"
                :placeholder="$t('form.WTrialBalance.organization')"
                style="width: 100%;"
                clearable
                filterable
                @visible-change="showListOrganization"
              >
                <el-option
                  v-for="item in organizationOptions"
                  :key="item.id"
                  :label="item.values.DisplayColumn"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item class="front-item-w-trial-balance">
              <template slot="label">
                {{ $t('form.WTrialBalance.budget') }}
              </template>
              <el-select
                v-model="budget"
                :placeholder="$t('form.WTrialBalance.budget')"
                style="width: 100%;"
                filterable
                clearable
                @visible-change="showListBudgets"
              >
                <el-option
                  v-for="item in budgetOptions"
                  :key="item.id"
                  :label="item.values.DisplayColumn"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item class="front-item-w-trial-balance">
              <template slot="label">
                {{ $t('form.WTrialBalance.untilPeriod') }}
                <b style="color: #f34b4b"> * </b>
              </template>
              <el-select
                v-model="untilPeriod"
                :placeholder="$t('form.WTrialBalance.untilPeriod')"
                style="width: 100%;"
                filterable
                clearable
                @visible-change="showListPeriods"
              >
                <el-option
                  v-for="item in untilPeriodOptions"
                  :key="item.id"
                  :label="item.values.DisplayColumn"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item class="front-item-w-trial-balance">
              <template slot="label">
                {{ $t('form.WTrialBalance.accountingAccount') }}
              </template>
              <el-card
                shadow="never"
                :body-style="{ padding: '0px', margin: '0px', display: 'flex' }"
              >
                <el-select
                  v-model="accountingAccount1"
                  style="width: 100%;"
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
                <b style="color: #c0c4cc;padding: 0px 5px;font-weight: bold;">
                  {{ '-' }}
                </b>
                <el-select
                  v-model="accountingAccount2"
                  style="width: 100%;"
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
              </el-card>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item class="front-item-w-trial-balance">
              <template slot="label">
                {{ $t('form.WTrialBalance.cubeReport') }}
                <b style="color: #f34b4b"> * </b>
              </template>
              <el-select
                v-model="cubeReport"
                :placeholder="$t('form.WTrialBalance.cubeReport')"
                style="width: 100%;"
                filterable
                clearable
                @visible-change="showListReportCubes"
              >
                <el-option
                  v-for="item in cubeReportOptions"
                  :key="item.id"
                  :label="item.values.DisplayColumn"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              style="margin-left: 20%;text-align:center"
            >
              <template slot="label">
                {{ $t('form.WTrialBalance.showPeriod') }}
              </template>
              <el-switch v-model="showPeriod" @change="visibleColumn" />
            </el-form-item>
            <el-form-item
              style="margin-left: 27%; text-align:center"
            >
              <template slot="label">
                {{ $t('form.WTrialBalance.showAccumulated') }}
              </template>
              <el-switch v-model="showAccumulated" @change="visibleColumn" />
            </el-form-item>
            <el-form-item
              class="front-item-w-trial-balance"
              style="text-align: center; margin-top: -5%;"
            >
              <template slot="label">
                <b style="color: transparent;">
                  {{ $t('form.WTrialBalance.cubeReport') }}
                </b>
              </template>
              <el-button
                plain
                type="success"
                :icon="isLoading ? 'el-icon-loading' : 'el-icon-refresh'"
                class="button-base-icon"
                :disabled="validateBeforeSearch"
                @click="refresh"
              />
              <el-button
                plain
                type="primary"
                icon="el-icon-download"
                class="button-base-icon"
                :disabled="isEmptyValue(selectedExport)"
                @click="exportRecords()"
              />
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </el-card>
    <div style="padding-top: 10px;">
      <el-table
        :data="listSummary"
        border
        :show-summary="true"
        style="width: 100%;"
        :summary-method="getSummaries"
        @selection-change="changeSelections"
      >
        <el-table-column
          type="selection"
          width="45"
        />
        <el-table-column
          v-for="(header, key) in viewList"
          :key="key"
          :align="header.align"
          :min-width="header.width"
          :label="header.label"
          :prop="header.columnName"
        />
      </el-table>
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  computed,
  ref
  // computed
} from '@vue/composition-api'
import lang from '@/lang'

// API Request Methods
import {
  listOrganizations,
  listBudgets,
  listPeriods,
  listAccoutingKeys,
  listReportCubes,
  listFactAcctSummary
} from '@/api/ADempiere/form/TrialBalanceDrillable.js'

// Utils and Helper Methods
import { formatQuantity } from '@/utils/ADempiere/formatValue/numberFormat'
import { exportFileFromJson } from '@/utils/ADempiere/exportUtil.js'
import { showMessage } from '@/utils/ADempiere/notification'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

export default defineComponent({
  name: 'WTrialBalance',

  props: {
    metadata: {
      type: Object,
      default: () => {}
    }
  },

  setup(props) {
    /**
     * Ref
     */

    const showPeriod = ref(false)
    const showAccumulated = ref(false)
    // Values

    const porcent = ref(null)
    const organization = ref(undefined)
    const budget = ref(undefined)
    const untilPeriod = ref(undefined)
    const accountingAccount1 = ref(undefined)
    const accountingAccount2 = ref(undefined)
    const cubeReport = ref(undefined)
    // Options List
    const organizationOptions = ref([])
    const budgetOptions = ref([])
    const untilPeriodOptions = ref([])
    const accountingAccountOptions = ref([])
    const cubeReportOptions = ref([])

    // Data Table
    const viewList = ref([])
    const listSummary = ref([])
    const headerList = ref([
      {
        label: lang.t('form.WTrialBalance.accountNo'),
        columnName: 'value',
        width: '100',
        align: 'center'
      },
      {
        label: lang.t('form.WTrialBalance.accounName'),
        columnName: 'name',
        width: '120px',
        align: 'center'
      },
      {
        label: lang.t('form.WTrialBalance.periodActual'),
        columnName: 'period_actual_amount',
        width: 'auto',
        align: 'center'
      },
      {
        label: lang.t('form.WTrialBalance.periodBudget'),
        columnName: 'period_budget_amount',
        width: '120px',
        align: 'center'
      },
      {
        label: lang.t('form.WTrialBalance.periodVariance'),
        columnName: 'period_variance_amount',
        width: '110px',
        align: 'center'
      },
      {
        label: lang.t('form.WTrialBalance.yTDActual'),
        columnName: 'ytd_actual_amount',
        width: '120px',
        align: 'center'
      },
      {
        label: lang.t('form.WTrialBalance.yTDBudget'),
        columnName: 'ytd_budget_amount',
        width: '140px',
        align: 'center'
      },
      {
        label: lang.t('form.WTrialBalance.variance'),
        columnName: 'variance_amount',
        width: '90px',
        align: 'center'
      },
      {
        label: lang.t('form.WTrialBalance.variancePorcent'),
        columnName: 'variance_percentage',
        width: '105px',
        align: 'center'
      }
    ])
    const isLoading = ref(false)
    const selectedExport = ref([])

    /**
     * Computed
     */

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

    const validateBeforeSearch = computed(() => {
      return isEmptyValue(organization.value) || isEmptyValue(untilPeriod.value) || isEmptyValue(cubeReport.value)
    })

    function visibleColumn() {
      viewList.value = headerList.value
      if (showPeriod.value === true && showAccumulated.value === true) {
        visibleAll()
        return
      } else if (showPeriod.value === true) {
        visiblePeriod()
        return
      } else if (showAccumulated.value === true) {
        visibleAccumulated()
        return
      }
    }

    const visiblePeriod = () => {
      const columnsPeriod = ['period_actual_amount', 'period_budget_amount', 'period_variance_amount']
      viewList.value = headerList.value.filter((header) => !columnsPeriod.includes(header.columnName))
    }

    const visibleAccumulated = () => {
      const columnsAccumulated = ['ytd_actual_amount', 'ytd_budget_amount', 'variance_amount', 'variance_percentage']
      viewList.value = headerList.value.filter((header) => !columnsAccumulated.includes(header.columnName))
    }

    const visibleAll = () => {
      const columAll = ['period_actual_amount', 'period_budget_amount', 'period_variance_amount', 'ytd_actual_amount', 'ytd_budget_amount', 'variance_amount', 'variance_percentage']
      viewList.value = headerList.value.filter((header) => !columAll.includes(header.columnName))
    }
    /**
     * Methods
     */
    function showListOrganization(show, search = '') {
      if (!show) return
      listOrganizations({
        searchValue: search
      })
        .then(response => {
          const { records } = response
          organizationOptions.value = records
        })
    }

    function showListBudgets(show, search = '') {
      if (!show) return
      listBudgets({
        searchValue: search
      })
        .then(response => {
          const { records } = response
          budgetOptions.value = records
        })
    }

    function showListPeriods(show, search = '') {
      if (!show) return
      listPeriods({
        searchValue: search
      })
        .then(response => {
          const { records } = response
          untilPeriodOptions.value = records
        })
    }

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

    function showListReportCubes(show, search = '') {
      if (!show) return
      listReportCubes({
        searchValue: search
      })
        .then(response => {
          const { records } = response
          cubeReportOptions.value = records
        })
    }

    function refresh() {
      isLoading.value = true
      listFactAcctSummary({
        organizationId: organization.value,
        budgetId: budget.value,
        periodId: untilPeriod.value,
        accoutingFromId: accountingAccount1.value,
        accoutingToId: accountingAccount2.value,
        reportCubeId: cubeReport.value
      })
        .then(response => {
          isLoading.value = false
          const { records } = response
          listSummary.value = records.map(list => {
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
        })
        .catch(error => {
          console.warn(`Error Search: ${error.message}. Code: ${error.code}.`)
          let message = error.message
          if (!isEmptyValue(error.response) && !isEmptyValue(error.response.data.message)) {
            message = error.response.data.message
          }

          isLoading.value = false

          showMessage({
            type: 'error',
            message,
            showClose: true
          })
        })
    }

    function exportRecords() {
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
        header: headerList.value.map(list => list.label),
        data,
        fileName: props.metadata.name,
        exportType: 'xls'
      })
    }

    function changeSelections(selection) {
      selectedExport.value = selection
    }

    function getSummaries(param) {
      const {
        columns
        // data
      } = param
      const sums = []
      columns.forEach((column, index) => {
        sums[index] = 'N/A'
        // if (index === 0) {
        //   sums[index] = 'Total'
        //   return
        // }
        // const values = data.map(item => Number(item[column.property]))
        // if (!values.every(value => isNaN(value))) {
        //   sums[index] = '$ ' + values.reduce((prev, curr) => {
        //     const value = Number(curr)
        //     if (!isNaN(value)) {
        //       return prev + curr
        //     } else {
        //       return prev
        //     }
        //   }, 0)
        // } else {
        //   sums[index] = 'N/A'
        // }
      })

      return sums
    }
    visibleColumn()
    return {
      //  Values
      showPeriod,
      showAccumulated,
      porcent,
      organization,
      budget,
      untilPeriod,
      accountingAccount1,
      accountingAccount2,
      cubeReport,
      // Options List
      organizationOptions,
      budgetOptions,
      untilPeriodOptions,
      accountingAccountOptions,
      cubeReportOptions,
      // Data Table
      listSummary,
      headerList,
      viewList,
      selectedExport,
      isLoading,
      // Computed
      calculate,
      validateBeforeSearch,
      // Methods
      changeSelections,
      showListOrganization,
      showListBudgets,
      showListPeriods,
      showListAccoutingKeys,
      showListReportCubes,
      exportFileFromJson,
      formatQuantity,
      exportRecords,
      getSummaries,
      refresh,
      visiblePeriod,
      visibleAccumulated,
      visibleColumn,
      visibleAll
    }
  }
})
</script>

<style lang="scss">
.field-from-trial-balance {
  .el-form-item {
    margin: 0px;
  }
  .el-form-item--medium .el-form-item__label {
    padding: 0px;
  }
  .front-item-w-trial-balance {
    width: 100%;
    .el-form--label-top .el-form-item__label {
      padding: 0px !important;
    }
    .el-form-item--medium .el-form-item__label {
      padding: 0px !important;
    }
    .el-form--inline .el-form-item {
      margin: 0px;
    }
  }
}
</style>
