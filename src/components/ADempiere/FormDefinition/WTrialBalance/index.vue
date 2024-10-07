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
    <options-wtrial-balance
      :header-list="headerList"
      :metadata="metadata"
    />
    <div>
      <el-table
        v-loading="isLoading"
        :cell-class-name="classChecker"
        :data="listSummary"
        border
        height="calc(100vh - 205px)"
        style="width: 100%; font-size: 12px"
        :summary-method="getSummaries"
        :cell-style="getColumnStyle"
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
          header-align="center"
        >
          <!-- Add a template column for the popover -->
          <template slot-scope="scope">
            <el-dropdown
              trigger="click"
              @command="zoomInWindow(scope.row)"
            >
              <span>{{ scope.row[header.columnName] }}</span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <i class="el-icon-zoom-in" style="font-weight: bolder;" />
                  <b>
                    {{ $t('page.processActivity.zoomIn') }} {{ ' - ' }} {{ $t('form.WTrialBalance.accountNo') }}
                  </b>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  computed,
  ref,
  watch
  // computed
} from '@vue/composition-api'
import lang from '@/lang'
import store from '@/store'
// API Request Methods

// Utils and Helper Methods
import optionsWtrialBalance from './options'
import { zoomIn } from '@/utils/ADempiere/coreUtils.js'

export default defineComponent({
  name: 'WTrialBalance',
  components: {
    optionsWtrialBalance
  },
  data() {
    return {
      activeName: 'top'
    }
  },
  props: {
    metadata: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    classChecker({ row, column }) {
      const numberRegex = /[^\d.,-]+/g
      const numberColumns = ['period_actual_amount', 'period_budget_amount', 'ytd_actual_amount', 'ytd_budget_amount', 'variance_amount', 'period_variance_amount', 'variance_percentage']
      if (numberColumns.includes(column.property)) {
        const val = parseFloat(row[column.property].replace(numberRegex, ''))
        if (val > 0) {
          return 'greenClass'
        } else if (val < 0) {
          return 'redClass'
        }
      }
    },
    filterMethod(query) {
      this.showListAccoutingKeys(true, query)
    }
  },
  setup() {
    /**
     * Ref
     */
    const isVisible = ref(true)
    const showPeriod = computed(() => {
      return store.getters.getShowPeriod
    })
    const showAccumulated = computed(() => {
      return store.getters.getShowAccumulated
    })
    // Data Table
    const headerList = ref([
      {
        label: lang.t('form.WTrialBalance.accountNo'),
        columnName: 'value',
        width: '35',
        align: 'right'
      },
      {
        label: lang.t('form.WTrialBalance.accounName'),
        columnName: 'name',
        width: '40px',
        align: 'left'
      },
      {
        label: lang.t('form.WTrialBalance.periodActual'),
        columnName: 'period_actual_amount',
        width: '40',
        align: 'right'
      },
      {
        label: lang.t('form.WTrialBalance.periodBudget'),
        columnName: 'period_budget_amount',
        width: '40px',
        align: 'right'
      },
      {
        label: lang.t('form.WTrialBalance.periodVariance'),
        columnName: 'period_variance_amount',
        width: '50px',
        align: 'right'
      },
      {
        label: lang.t('form.WTrialBalance.yTDActual'),
        columnName: 'ytd_actual_amount',
        width: '50px',
        align: 'right'
      },
      {
        label: lang.t('form.WTrialBalance.yTDBudget'),
        columnName: 'ytd_budget_amount',
        width: '60px',
        align: 'right'
      },
      {
        label: lang.t('form.WTrialBalance.variance'),
        columnName: 'variance_amount',
        width: '30px',
        align: 'right'
      },
      {
        label: lang.t('form.WTrialBalance.variancePorcent'),
        columnName: 'variance_percentage',
        width: '30px',
        align: 'right'
      }
    ])
    const viewList = ref(headerList.value)
    const isLoading = computed(() => {
      return store.getters.getIsLoading
    })
    const selectedExport = ref([])

    /**
     * Methods
     */
    function getColumnStyle() {
      return 'padding: 0; height: 30px; border: none; font-size: 10px '
    }

    function changeSelections(selection) {
      store.commit('setSelectedExport', selection)
    }

    function getSummaries(param) {
      const {
        columns
        // data
      } = param
      const sums = []
      columns.forEach((column, index) => {
        sums[index] = ''
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
    const COLUMNS_PERIOD = ['period_actual_amount', 'period_budget_amount', 'period_variance_amount']
    const COLUMNS_ACCUMULATED = ['ytd_actual_amount', 'ytd_budget_amount', 'variance_amount', 'variance_percentage']

    watch(
      () => [showPeriod.value, showAccumulated.value],
      (newValue) => {
        let columnsToExclude = []
        if (newValue[0] && newValue[1]) {
          columnsToExclude = [...COLUMNS_PERIOD, ...COLUMNS_ACCUMULATED]
        } else if (newValue[0]) {
          columnsToExclude = COLUMNS_PERIOD
        } else if (newValue[1]) {
          columnsToExclude = COLUMNS_ACCUMULATED
        }
        if (columnsToExclude.length === 0 && newValue[0] && newValue[1]) {
          columnsToExclude = [...COLUMNS_PERIOD, ...COLUMNS_ACCUMULATED]
        }
        viewList.value = headerList.value.filter((header) => !columnsToExclude.includes(header.columnName))
      }
    )
    function changeView(data) {
      isVisible.value = data
    }
    const listSummary = computed(() => {
      return store.getters.getListSummary
    })
    function zoomInWindow(scope) {
      const id = 118
      const columnName = 'Value'
      zoomIn({
        attributeValue: `window_${id}`,
        attributeName: 'containerKey',
        query: {
          [columnName]: scope.value
        },
        params: {
          [columnName]: scope.value
        }
      })
    }
    return {
      //  Values
      isVisible,
      showPeriod,
      showAccumulated,
      // Data Table
      listSummary,
      headerList,
      viewList,
      selectedExport,
      isLoading,
      // Methods
      changeSelections,
      getSummaries,
      changeView,
      getColumnStyle,
      zoomInWindow
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

.redClass {
  color: red;
}
.el-table {
  overflow: scroll
}
.el-table__body-wrapper {
  height: calc(100vh - 205px) !important
}
</style>
