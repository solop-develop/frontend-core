<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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
  <div style="display: contents;height: 100% !important;">
    <div style="height: 90% !important;">
      <div style="height: 49%;margin-bottom: 5px;border: solid 1px lightgrey;border-radius: 10px;padding: 10px;">
        <p style="text-align: center;font-size: 20px;margin: 0px 0px 7px 0px;">
          <b> {{ $t('form.VAllocation.payment.title') }} </b>
        </p>
        <payments-table />
      </div>
      <div style="height: 50%;margin-bottom: 5px;border: solid 1px lightgrey;border-radius: 10px;padding: 10px;">
        <p style="text-align: center;font-size: 20px;margin: 0px 0px 7px 0px;">
          <b> {{ $t('form.VAllocation.invoice.title') }} </b>
        </p>
        <invoce-table />
      </div>
    </div>
    <div style="height: 10%;margin-top: 5px;border: solid 1px lightgrey;border-radius: 10px;padding: 0px;">
      <div id="description-payment" class="description-payment">
        <div>
          <el-form
            :inline="true"
            label-position="top"
            class="field-payments"
          >
            <el-row :gutter="20">
              <el-col
                :span="2"
                style="text-align: center;"
              >
                <el-form-item
                  :label="$t('form.VAllocation.description.difference')"
                  label-width="120px"
                  style="margin: 0px;padding: 0px;"
                >
                  <el-tag>
                    <b style="text-align: right; font-size: 19px">
                      {{ sumApplied }}
                    </b>
                  </el-tag>
                </el-form-item>
              </el-col>
              <el-col
                :span="4"
                style="text-align: center;"
              >
                <el-form-item
                  :label="$t('form.VAllocation.searchCriteria.date')"
                  label-width="120px"
                  style="margin: 0px;padding: 0px;"
                >
                  <el-date-picker
                    v-model="currentDateProcess"
                    type="date"
                    format="yyyy-MM-dd"
                    style="width: 100%;"
                  />
                </el-form-item>
              </el-col>
              <el-col
                :span="5"
                style="text-align: center;"
              >
                <el-form-item
                  :label="$t('form.VAllocation.description.charge')"
                  label-width="120px"
                  style="margin: 0px;padding: 0px;"
                >
                  <el-select
                    v-model="charges"
                    style="width: 100%;"
                    filterable
                    clearable
                    :filter-method="remoteSearchCharges"
                    @visible-change="findCharges"
                  >
                    <el-option
                      v-for="item in optionsCharges"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col
                :span="5"
                style="text-align: center;"
              >
                <el-form-item
                  :label="$t('form.VAllocation.description.organization')"
                  label-width="120px"
                  style="margin: 0px;padding: 0px;"
                >
                  <el-select
                    v-model="transactionOrganizationId"
                    style="width: 100%;"
                    filterable
                    clearable
                    :filter-method="remoteSearchOrganizations"
                    @visible-change="findOrganizations"
                  >
                    <el-option
                      v-for="item in optionsOrganizations"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col
                :span="5"
                style="padding-left: 0px;padding-right: 0px;text-align: center;"
              >
                <el-form-item
                  :label="$t('form.VAllocation.description.description')"
                  label-width="120px"
                  style="margin: 0px;padding: 0px;"
                >
                  <el-input
                    v-model="description"
                    type="textarea"
                    :autosize="{ minRows: 1, maxRows: 2}"
                  />
                </el-form-item>
              </el-col>
              <el-col
                :span="3"
                style="padding-left: 0px;padding-right: 0px;text-align: center;"
              >
                <el-form-item
                  label-width="120px"
                  style="margin: 0px;padding: 0px;"
                >
                  <template slot="label">
                    <i style="color: transparent !important;"> {{ 'Buttons Actions' }}</i>
                  </template>
                  <slot name="footer" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, watch } from '@vue/composition-api'

import store from '@/store'
import router from '@/router'

// Components and Mixins
import headersInvoice from './headersInvoice.js'
import headersPayments from './headersPayments.js'
import InvoceTable from './InvoceTable.vue'
import PaymentsTable from './PaymentsTable.vue'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

// API Request Methods
import {
  requestListCharges,
  requestListTransactionOrganizations
} from '@/api/ADempiere/form/VAllocation.ts'

export default defineComponent({
  name: 'Payments',

  components: {
    InvoceTable,
    PaymentsTable
  },

  setup() {
    /**
     * Refs
     */
    // const optionsOrganizations = ref([])
    const listPaymentsTable = ref(null)
    const listInvocesTable = ref(null)
    const optionsCharges = ref([])
    const tableData = ref([])
    const panelInvoce = ref(250)

    /**
     * computed
     */
    const selectListPayments = computed(() => {
      return store.getters.getSelectListPayments
    })

    const selectListInvoces = computed(() => {
      return store.getters.getSelectListInvoces
    })

    const difference = computed({
      // getter
      get() {
        if (!isEmptyValue(selectListPayments.value) && !isEmptyValue(selectListInvoces.value)) {
          const sumPaymentsApplied = selectListPayments.value.map(list => list.applied)
          const sumPayments = sumPaymentsApplied.reduce((valorAnterior, valorActual, indice, vector) => {
            return valorAnterior + valorActual
          })
          const sumInvocesApplied = selectListInvoces.value.map(list => list.applied)
          const sumInvoces = sumInvocesApplied.reduce((valorAnterior, valorActual, indice, vector) => {
            return valorAnterior + valorActual
          })
          const array3 = [sumInvoces, sumPayments]
          const result = array3.reduce((valorAnterior, valorActual, indice, vector) => {
            return valorAnterior + valorActual
          })
          return result
        } else if (!isEmptyValue(selectListPayments.value)) {
          const sumPayments = selectListPayments.value.map(list => {
            return {
              transactionType: list.transaction_type,
              amount: list.applied
            }
          })
          return sumPayments.reduce((valorAnterior, valorActual, indice, vector) => {
            return valorAnterior.amount + valorActual.amount
          })
        } else if (!isEmptyValue(selectListInvoces.value)) {
          const sumPayments = selectListInvoces.value.map(list => list.applied)
          return sumPayments.reduce((valorAnterior, valorActual, indice, vector) => {
            return valorAnterior + valorActual
          })
        }
        return 0
      },
      // setter
      set(value) {
        return value
      }
    })

    const listPayments = computed(() => {
      return store.getters.getListVAllocation.payments
    })

    const listInvoces = computed(() => {
      return store.getters.getListVAllocation.invoce
    })

    const listDifference = computed(() => {
      const list = store.getters.getListDifference
      if (isEmptyValue(list)) {
        return 0
      }
      const result = list.reduce((valorAnterior, valorActual, indice, vector) => {
        if (valorAnterior.transactionType === 'P' && valorActual.transactionType === 'P') {
          const amount = valorAnterior.amount - valorActual.amount
          return {
            transactionType: valorAnterior.transactionType,
            amount
          }
        }
        if (valorAnterior.transactionType === 'P' && valorActual.transactionType === 'R') {
          const amount = +(valorAnterior.amount - valorActual.amount)
          return {
            transactionType: valorAnterior.transactionType,
            amount
          }
        }
        if (valorAnterior.transactionType === 'R' && valorActual.transactionType === 'P') {
          const amount = +(valorAnterior.amount - valorActual.amount)
          return {
            transactionType: valorAnterior.transactionType,
            amount
          }
        }
        if (valorAnterior.transactionType === 'R' && valorActual.transactionType === 'R') {
          const amount = valorAnterior.amount - valorActual.amount
          return {
            transactionType: valorActual.transactionType,
            amount
          }
        }
      })
      if (isEmptyValue(result)) return 0
      store.commit('setProcess', {
        attribute: 'totalDifference',
        value: result.amount
      })
      return result.amount
    })

    const currentDateProcess = computed({
      // getter
      get() {
        let date = store.getters.getProcess.date
        if (isEmptyValue(date)) {
          date = store.getters.getSearchFilter.date
        }
        // return date
        return date
      },
      // setter
      set(value) {
        store.commit('setProcess', {
          attribute: 'date',
          value
        })
      }
    })

    const charges = computed({
      // getter
      get() {
        const { chargeId } = store.getters.getProcess
        // return date
        return chargeId
      },
      // setter
      set(value) {
        store.commit('setProcess', {
          attribute: 'chargeId',
          value
        })
      }
    })

    const description = computed({
      // getter
      get() {
        const { description } = store.getters.getProcess
        // return date
        return description
      },
      // setter
      set(value) {
        store.commit('setProcess', value)
      }
    })

    const transactionOrganizationId = computed({
      // getter
      get() {
        const { transactionOrganizationId } = store.getters.getProcess
        // return date
        return transactionOrganizationId
      },
      // setter
      set(value) {
        store.commit('setProcess', {
          attribute: 'transactionOrganizationId',
          value
        })
      }
    })

    const paymentAssignment = computed(() => {
      return store.getters.getPaymentAssignment
    })

    const resultDiference = computed(() => {
      return store.getters.getAllDiference.map(list => list.document_no)
    })

    const summaryDiference = computed(() => {
      const { difference } = paymentAssignment.value
      const listDifference = difference.map(list => {
        const { applied, transaction_type, document_no } = list
        return {
          applied,
          transactionType: transaction_type.name,
          transactionTypeValue: transaction_type.value,
          documentNo: document_no
        }
      })
      let summary
      listDifference.forEach((currentValue, index, array) => {
        if (index <= 0) {
          summary = currentValue
        } else {
          summary = {
            ...currentValue,
            applied: (summary.applied) + (currentValue.applied)
          }
        }
      })
      if (!isEmptyValue(summary)) {
        return summary.applied
      }
      return 0
    })

    const currentSetp = computed(() => {
      return store.getters.getSteps
    })

    const isActiveTag = computed(() => {
      const listViews = store.getters.visitedViews
      const currentRoute = router.app.$route
      const currentViews = listViews.find(list => list.name === currentRoute.name)
      setToggleSelection()
      return currentViews
    })

    const optionsOrganizations = computed({
      // getter
      get() {
        const { listOrganization } = store.getters.getSearchFilter
        return listOrganization
      },
      // setter
      set(list) {
        store.commit('updateAttributeCriteriaVallocation', {
          attribute: 'listOrganization',
          criteria: 'searchCriteria',
          value: list
        })
      }
    })

    const maximumDefiniteDate = computed(() => {
      if (isEmptyValue(selectListAll.value)) {
        return new Date()
      }
      const date = selectListAll.value.map(date => {
        if (date.type === 'isPayment') {
          return date.transaction_date
        }
        return date.date_invoiced
      })
      return date.sort((a, b) => {
        return new Date(b) - new Date(a)
      })
    })

    const selectListAll = computed(() => {
      return store.getters.getListSelectInvoceandPayment
    })

    const sumApplied = computed(() => {
      const sumInvoce = selectListAll.value.filter(list => {
        return list.type === 'isInvoce'
      }).map(list => {
        const { transaction_type } = list
        if (list.type === 'isInvoce') {
          if (transaction_type.value === 'R') {
            return -(list.amountApplied)
          }
          return list.amountApplied
        }
        return list.applied
      })
      const sumPayment = selectListAll.value.filter(list => {
        return list.type !== 'isInvoce'
      }).map(list => {
        return list.applied
      })
      const initialValue = 0
      const initialValuePayment = 0
      const initialValueAll = 0
      const sumAllInvoce = sumInvoce.reduce((accumulator, currentValue) => accumulator + currentValue, initialValue)
      const sumAllPayments = sumPayment.reduce((accumulator, currentValue) => accumulator + currentValue, initialValuePayment)
      const alo = [sumAllPayments, sumAllInvoce].reduce((accumulator, currentValue) => accumulator + currentValue, initialValueAll)
      if (isEmptyValue(sumAllPayments) && !isEmptyValue(sumAllInvoce)) {
        return sumAllInvoce
      } else if (!isEmptyValue(sumPayment) && isEmptyValue(sumAllInvoce)) {
        return sumAllPayments
      }
      return alo
    })

    /**
     * Methods
     */
    function findCharges(isFind, searchValue) {
      if (!isFind) {
        return
      }
      requestListCharges({
        searchValue
      })
        .then(response => {
          const { records } = response
          optionsCharges.value = records.map(currency => {
            const { id, uuid, values } = currency
            return {
              id,
              uuid,
              label: values.DisplayColumn
            }
          })
        })
    }

    function remoteSearchCharges(query) {
      if (!isEmptyValue(query) && query.length > 2) {
        const result = optionsCharges.value.filter(findFilter(query))
        if (isEmptyValue(result)) {
          findCharges(true, query)
        }
      }
    }

    function findFilter(queryString) {
      return (query) => {
        const search = queryString.toLowerCase()
        return query.label.toLowerCase().includes(search)
      }
    }

    function remoteSearchOrganizations(query) {
      if (!isEmptyValue(query) && query.length > 2) {
        const result = optionsOrganizations.value.filter(findFilter(query))
        if (isEmptyValue(result)) {
          findOrganizations(true, query)
        }
      }
    }

    function findOrganizations(isFind, searchValue) {
      if (!isFind) {
        return
      }
      requestListTransactionOrganizations({
        searchValue
      })
        .then(response => {
          const { records } = response
          optionsOrganizations.value = records.map(organizations => {
            const { id, uuid, values } = organizations
            return {
              id,
              uuid,
              label: values.DisplayColumn
            }
          })
        })
    }

    function handleSelectionPayments(selection, row) {
      const { isSelect, applied, open_amount } = row
      const totalApplied = (applied === 0) ? open_amount : applied
      row.isSelect = !isSelect
      row.applied = totalApplied
      if (row.isSelect) {
        store.commit('setAddDiference', row)
      } else {
        store.dispatch('changeDiference', { row })
      }
      store.commit('setListPayments', listPayments.value)
      store.commit('setSelectListPayments', selection)
      store.commit('setAddListPayments', selection)
      store.commit('setListSelectPayments', selection)
      toggleSelectionPayments(row)
    }

    function handleSelectionInvoces(selection, row) {
      const { isSelect } = row
      toggleSelectionInvoce(row)
      const all = appliedAmount(row)
      row.isSelect = !isSelect
      row.applied = all
      if (row.isSelect) {
        store.commit('setAddDiference', row)
      } else {
        store.dispatch('changeDiference', { row })
      }
      store.commit('setDiference', { row })
      store.commit('setListSelectInvoices', selection)
      store.commit('setAddListInvoces', selection)
      store.commit('setListInvoces', listInvoces.value)
    }

    function handleSelectionInvocesAll(selection, row) {
      const data = selection.map(list => {
        const result = (list.applied === 0) ? list.open_amount : list.applied
        return {
          ...list,
          applied: result
        }
      })
      if (!isEmptyValue(selection)) {
        selection.forEach(element => {
          const row = {
            ...element,
            applied: (element.applied === 0) ? element.open_amount - element.discount_amount : element.applied,
            isSelect: true
          }
          store.commit('setAddDiference', row)
        })
        listInvoces.value.forEach(row => {
          const { applied, open_amount, discount_amount } = row
          row.isSelect = true
          row.applied = (applied === 0) ? open_amount - discount_amount : applied
        })
      } else {
        listInvoces.value.forEach(element => {
          element.applied = 0
          element.isSelect = false
          store.dispatch('changeDiference', { row: element })
        })
      }
      store.commit('setListSelectInvoices', data)
    }

    function handleSelectionPaymentsAll(selection) {
      if (!isEmptyValue(selection)) {
        selection.forEach(element => {
          listPayments.value.forEach(row => {
            const { applied, open_amount } = row
            row.isSelect = true
            row.applied = (applied === 0) ? open_amount : applied
            store.commit('setAddDiference', row)
          })
        })
      } else {
        listPayments.value.forEach(element => {
          element.applied = 0
          element.isSelect = false
          store.dispatch('changeDiference', { row: element })
        })
      }
      store.commit('setListSelectPayments', selection)
    }

    function toggleSelectionInvoce(invoce) {
      let sumPayments
      const paymentsTypetransaction = selectListPayments.value.filter(payment => payment.transaction_type.value === invoce.transaction_type.value)
      const appliedPayments = paymentsTypetransaction.map(payment => payment.applied)
      if (!isEmptyValue(sumPayments)) {
        sumPayments = appliedPayments.reduce((valorAnterior, valorActual, indice, vector) => {
          return valorAnterior + valorActual
        })
      }
      const appliedPay = sumPayments - invoce.open_amount
      return appliedPay
    }

    function toggleSelectionPayments(payment) {
      let sumPayments
      const invocesTypetransaction = selectListInvoces.value.filter(list => list.transaction_type.value === payment.transaction_type.value)
      const appliedPayments = invocesTypetransaction.map(payment => payment.applied)
      if (!isEmptyValue(sumPayments)) {
        sumPayments = appliedPayments.reduce((valorAnterior, valorActual, indice, vector) => {
          return valorAnterior + valorActual
        })
      }
      const appliedPay = sumPayments - payment.open_amount
      return appliedPay
    }

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

    function toggleSelectionInvoces(rows) {
      if (isEmptyValue(listInvocesTable.value)) return
      if (rows) {
        rows.forEach(row => {
          listInvocesTable.value.toggleRowSelection(row)
        })
      } else {
        listInvocesTable.value.clearSelection()
      }
    }

    function toggleSelectionPayment(rows) {
      if (isEmptyValue(listInvocesTable.value)) return
      if (rows) {
        rows.forEach(row => {
          listPaymentsTable.value.toggleRowSelection(row)
        })
      } else {
        listPaymentsTable.value.clearSelection()
      }
    }

    function setToggleSelection() {
      const {
        invoces,
        payments
      } = paymentAssignment.value
      const indexPayments = isEmptyValue(payments) ? [] : payments.map(list => listPayments.value.findIndex(listIndex => listIndex.id === list.id))
      const indexInvoces = isEmptyValue(invoces) ? [] : invoces.map(list => listInvoces.value.findIndex(listIndex => listIndex.id === list.id))
      setTimeout(() => {
        if (!isEmptyValue(listInvoces.value) && !isEmptyValue(indexInvoces)) {
          indexInvoces.forEach(index => {
            toggleSelectionInvoces([listInvoces.value[index]])
          })
        }
        if (!isEmptyValue(listPayments.value) && !isEmptyValue(indexPayments)) {
          indexInvoces.forEach(index => {
            toggleSelectionPayment([listPayments.value[index]])
          })
        }
      }, 500)
    }

    function appliedAmount(row) {
      const { transaction_type, open_amount, discount_amount } = row
      const { difference } = paymentAssignment.value
      const listAmount = difference.filter(list => list.transaction_type.value !== transaction_type.value).map(list => list.applied)
      const differenceAmount = 0
      const sumWithInitial = listAmount.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        differenceAmount
      )
      const sumInvoce = selectListAll.value.filter(list => list.type === 'isInvoce').map(list => list.amountApplied)
      const sumPayment = selectListAll.value.filter(list => list.type !== 'isInvoce')
      if (sumPayment.length > 1 && sumInvoce.length <= 0) {
        const initialValue = 0
        const sumAllInvoce = sumPayment.reduce((accumulator, currentValue) => accumulator + currentValue, initialValue)
        if (sumAllInvoce <= row.open_amount) {
          if (Math.sign(row.open_amount) < 0) return -(sumAllInvoce)
          return sumAllInvoce
        }
      }
      const total = Math.abs(open_amount - discount_amount)
      if (
        (total) > (Math.abs(sumWithInitial)) &&
        (Math.abs(sumWithInitial) !== 0)
      ) {
        return -(sumWithInitial)
      }
      return (open_amount - discount_amount)
    }

    function loadHeight(height) {
      setTimeout(() => {
        panelInvoce.value = height.clientHeight - 100
      }, 1000)
    }

    setTimeout(() => {
      const height = document.getElementById('panelInvoce')
      loadHeight(height)
    }, 1000)

    /**
     * Watch
     * Declare watch callbacks to be invoked on data change
     * (NewValue - OldValue)
     */

    watch(currentSetp, (newValue) => {
      if (newValue && !isEmptyValue(listInvoces.value)) {
        setToggleSelection()
        setTimeout(() => {
          const height = document.getElementById('panelInvoce')
          loadHeight(height)
        }, 1000)
      }
    })

    watch(isActiveTag, (newValue) => {
      if (newValue && !isEmptyValue(listInvoces.value)) {
        setToggleSelection()
        setTimeout(() => {
          const height = document.getElementById('panelInvoce')
          loadHeight(height)
        }, 1000)
      }
    })

    watch(maximumDefiniteDate, (newValue, oldValue) => {
      if (!isEmptyValue(newValue) && !isEmptyValue(newValue[0])) {
        const dateParse = newValue[0] + 'T00:00:00'
        currentDateProcess.value = dateParse
      }
    })

    return {
      // Refs
      sumApplied,
      tableData,
      headersPayments,
      headersInvoice,
      optionsCharges,
      charges,
      transactionOrganizationId,
      optionsOrganizations,
      listInvocesTable,
      listPaymentsTable,
      description,
      // Computed
      difference,
      listInvoces,
      listPayments,
      listDifference,
      selectListInvoces,
      selectListPayments,
      currentDateProcess,
      maximumDefiniteDate,
      // Methods
      handleSelectionPaymentsAll,
      handleSelectionInvocesAll,
      remoteSearchOrganizations,
      handleSelectionPayments,
      handleSelectionInvoces,
      toggleSelectionPayments,
      toggleSelectionInvoce,
      remoteSearchCharges,
      findOrganizations,
      // toggleSelection,
      isCellInput,
      findCharges,
      findFilter,
      //
      summaryDiference,
      paymentAssignment,
      resultDiference,
      currentSetp,
      isActiveTag,
      panelInvoce,
      toggleSelectionInvoces,
      toggleSelectionPayment,
      setToggleSelection
    }
  }
})
</script>

<style lang="scss">
  .panel-card-payments {
    .el-card {
      display: contents;
      .el-card__header {
        padding: 8px 20px;
      }
      .el-card__body {
        padding: 10px;
      }
    }
  }
  .panel-footer-option {
    .el-card__body{
      padding: 10px;
    }
  }
  .el-form-item__label {
    padding: 0px !important;
  }
  .field-payments {
    padding: 0px !important;
    .el-form {
      padding: 0px !important;
      .el-form--label-top .el-form-item__label{
        padding: 0px !important;
      }
    }
  }
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
  .el-table .el-table__cell {
    padding: 2px 0px !important;
    min-width: 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    text-overflow: ellipsis;
    vertical-align: middle;
    position: relative;
    text-align: left;
  }
</style>
<style>
.el-table--scrollable-x .el-table__body-wrapper {
  height: 90%;
  overflow-x: auto;
}
/* .el-card__header {
  padding-top: 5px;
  padding-bottom: 0px;
} */
</style>
