<!--
ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A.
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
  <el-table
    id="listInvocesTable"
    ref="listInvocesTable"
    v-loading="isLoadingInvoces"
    :data="listInvoces"
    border
    style="width: 100%;height: 100%;overflow: auto"
    :element-loading-text="$t('notifications.loading')"
    element-loading-background="rgba(255, 255, 255, 0.8)"
    @select="selectionInvoces"
    @select-all="selectionInvocesAll"
  >
    <el-table-column
      type="selection"
      fixed
      width="40"
    />
    <el-table-column
      v-for="(header, key) in headersInvoice"
      :key="key"
      prop="id"
      :align="header.align"
      :min-width="header.width"
      :label="header.label"
    >
      <template slot-scope="scope">
        <span v-if="(header.columnName === 'organization' || header.columnName === 'transaction_type')">
          {{ scope.row[header.columnName].name }}
        </span>
        <span v-else-if="isCellInput(header)">
          <el-input-number
            v-model="scope.row[header.columnName]"
            controls-position="right"
          />
        </span>
        <span v-else>
          <p
            v-if="scope.row[header.columnName].length < 13 || (typeof scope.row[header.columnName] === 'number')"
            style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;line-height: 12px;margin: 0px;"
          >
            {{ scope.row[header.columnName] }}
          </p>
          <p
            v-else
            style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;line-height: 12px;margin: 0px;"
          >
            <el-popover
              placement="top-start"
              trigger="hover"
              width="300"
            >
              {{ scope.row[header.columnName] }}
              <p
                slot="reference"
                type="text"
                style="color: #606266;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;line-height: 12px;margin: 0px;"
              >
                {{ scope.row[header.columnName] }}
              </p>
            </el-popover>
          </p>
        </span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { defineComponent, ref, computed, watch } from '@vue/composition-api'

import store from '@/store'
// import router from '@/router'

// Components and Mixins
import headersInvoice from './headersInvoice.js'
// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'InvocesTable',

  props: {
    metadata: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },

  setup(props, { root }) {
    const diference = ref(0)
    const sumApplied = computed(() => {
      const sumInvoce = selectListAll.value.map(list => {
        if (list.type === 'isInvoce') return list.amountApplied
        return list.applied
      })
      const initialValue = 0
      return sumInvoce.reduce((accumulator, currentValue) => accumulator + currentValue, initialValue)
    })
    const isLoadingInvoces = computed(() => {
      const { isLoadingInvoces } = store.getters.getisLoadTables
      return isLoadingInvoces
    })
    /**
     * Refs
     */
    const listInvocesTable = ref(null)
    const panelInvoce = ref(300)
    /**
     * computed
     */

    const selectListAll = computed(() => {
      return store.getters.getListSelectInvoceandPayment
    })

    const listInvoces = computed(() => {
      return store.getters.getListVAllocation.invoce
    })

    /**
     * Methods
     */

    function isCellInput(cell) {
      const { columnName } = cell
      let isInput = false
      switch (columnName) {
        case 'writeOff':
          isInput = true
          break
        case 'applied':
          isInput = true
          break
      }
      return isInput
    }

    function selectionInvoces(selection, row) {
      const { isSelect } = row
      if (isSelect) {
        row.applied = 0
        row.isSelect = !isSelect
        row.amountApplied = 0
        removeRowSelect(row)
        return
      }
      row.isSelect = !isSelect
      row.applied = appliedPay(row)
      row.amountApplied = num(appliedPay(row))
      addRowSelect(row)
    }

    function selectionInvocesAll(selection) {
      if (!isEmptyValue(selection)) {
        selection.forEach(row => {
          if (selection.length === listInvoces.value.length) {
            row.isSelect = true
            row.applied = appliedPay(row)
            row.amountApplied = num(appliedPay(row))
            addRowSelect(row)
          }
        })
        return
      }
      listInvoces.value.forEach(row => {
        row.isSelect = false
        row.applied = 0
        row.amountApplied = 0
        removeRowSelect(row)
      })
    }

    function appliedPay(currentInvoce) {
      const { open_amount, discount_amount } = currentInvoce
      if (selectListAll.value.length < 1) {
        return open_amount - discount_amount
      }
      if (num(sumApplied.value) <= num(open_amount - discount_amount) && Math.sign(sumApplied.value) < 0) {
        if (num(sumApplied.value) === 0) {
          if (Math.sign(sumApplied.value) < 0) {
            return open_amount - discount_amount
          }
        }
        return sumApplied.value
      }
      return open_amount - discount_amount
    }

    function setToggleSelection() {
      const isSelectInvoces = listInvoces.value.filter(list => list.isSelect)
      setTimeout(() => {
        if (!isEmptyValue(listInvoces.value) && !isEmptyValue(isSelectInvoces)) {
          toggleSelection(isSelectInvoces)
        }
      }, 500)
    }

    function toggleSelection(list) {
      if (list) {
        list.forEach(row => {
          listInvocesTable.value.toggleRowSelection(row)
        })
      } else {
        listInvocesTable.value.clearSelection()
      }
    }

    function addRowSelect(row) {
      const list = isEmptyValue(selectListAll.value) ? [] : selectListAll.value
      list.push(row)
      store.commit('setListSelectInvoceandPayment', list)
    }

    function removeRowSelect(row) {
      const index = selectListAll.value.findIndex(list => list.id === row.id)
      const list = selectListAll.value
      const listRemove = list.splice(index, 1)
      console.log({ listRemove, list })
    }

    function num(amount) {
      const math = Math.sign(amount)
      if (math >= 0) return amount
      return -(amount)
    }

    watch(selectListAll, (newValue) => {
      if (newValue) {
        const index = newValue.length
        if (index > 0) {
          diference.value = newValue[index - 1].applied
        } else {
          diference.value = 0
        }
      }
    })

    setToggleSelection()

    return {
      //
      diference,
      sumApplied,
      // Import
      headersInvoice,
      // Refs
      panelInvoce,
      listInvocesTable,
      // Computed
      isLoadingInvoces,
      selectListAll,
      listInvoces,
      // Methods
      isCellInput,
      selectionInvoces,
      selectionInvocesAll
    }
  }
})
</script>

<style lang="scss">
  .from-wf-panel {
    padding-top: 10px;
    padding-left: 20px;
    padding-right: 20px;
  }
  .el-input-number {
    .el-input--medium .el-input__inner {
      text-align: end;
    }
  }
  .panel-top-search-criteria {
    display: flex;
    .el-card__body {
      display: contents;
      padding-top: 0px !important;
      padding-right: 0px !important;
      padding-bottom: 2px !important;
      padding-left: 0px !important;
      height: 100%!important;
    }
  }
  .el-table .cell {
    word-break: break-all;
    padding-left: 10px;
    padding-right: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 12px;
  }
</style>
<style>
.el-table--scrollable-x .el-table__body-wrapper {
  height: 90%;
  overflow: auto;
}
/* .el-card__header {
  padding-top: 5px;
  padding-bottom: 0px;
} */
</style>
