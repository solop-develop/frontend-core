<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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
  <div>
    <el-table
      v-loading="isLoadingRecords"
      highlight-current-row
      :border="true"
      fit
      :data="SearchList"
      height="300"
      style="width: 100%"
      size="mini"
      @row-dblclick="changeRecord"
    >
      <index-column />

      <el-table-column
        prop="business_partner"
        :label="$t('field.invoice.businessPartner')"
        sortable
        header-align="center"
        width="220"
      />

      <el-table-column
        prop="date_invoiced"
        :label="$t('field.invoice.invoiceDate')"
        sortable
        header-align="center"
        width="170"
      >
        <span slot-scope="scope" class="cell-align-right">
          {{ formatDate({ value: scope.row.date_invoiced }) }}
        </span>
      </el-table-column>

      <el-table-column
        prop="document_no"
        :label="$t('field.invoice.documentNo')"
        sortable
        header-align="center"
        width="135"
      />

      <el-table-column
        prop="currency"
        :label="$t('field.invoice.currency')"
        sortable
        header-align="center"
        width="95"
      />

      <el-table-column
        prop="grand_total"
        :label="$t('field.invoice.grandTotal')"
        sortable
        header-align="center"
        width="120"
      >
        <span slot-scope="scope" class="cell-align-right">
          {{ formatQuantity({ value: scope.row.grand_total }) }}
        </span>
      </el-table-column>

      <el-table-column
        prop="converted_amount"
        :label="$t('field.invoice.convertedAmount')"
        sortable
        header-align="center"
        width="120"
      >
        <span slot-scope="scope" class="cell-align-right">
          {{ formatQuantity({ value: scope.row.converted_amount }) }}
        </span>
      </el-table-column>

      <el-table-column
        prop="open_amount"
        :label="$t('field.invoice.openAmount')"
        sortable
        header-align="center"
        width="120"
      >
        <span slot-scope="scope" class="cell-align-right">
          {{ formatQuantity({ value: scope.row.open_amount }) }}
        </span>
      </el-table-column>

      <el-table-column
        prop="payment_term"
        :label="$t('field.invoice.paymentTerm')"
        sortable
        header-align="center"
        width="150"
      />

      <el-table-column
        prop="is_paid"
        :label="$t('field.invoice.paid')"
        sortable
        header-align="center"
        width="120"
      >
        <span slot-scope="scope" class="cell-align-right">
          {{ convertBooleanToTranslationLang(scope.row.is_paid) }}
        </span>
      </el-table-column>

      <el-table-column
        prop="is_sales_transaction"
        :label="$t('field.invoice.salesTransaction')"
        sortable
        header-align="center"
        width="170"
      >
        <span slot-scope="scope" class="cell-align-right">
          {{ convertBooleanToTranslationLang(scope.row.is_sales_transaction) }}
        </span>
      </el-table-column>

      <el-table-column
        prop="description"
        :label="$t('field.invoice.description')"
        header-align="center"
        width="200"
      />

      <el-table-column
        prop="po_reference"
        :label="$t('field.invoice.reference')"
        header-align="center"
        width="265"
      />
    </el-table>
  </div>
</template>

<script>
import store from '@/store'

import { computed, defineComponent, ref } from '@vue/composition-api'

// Constants
import { INVOICE_LIST_FORM, COLUMN_NAME } from '@/utils/ADempiere/dictionary/field/search/invoice.js'

// Components and Mixins
import IndexColumn from '@/components/ADempiere/DataTable/Components/IndexColumn.vue'
import invoicesMixin from './mixinInvoice.js'
import fieldSearchMixin from '../mixinFieldSearch.js'

// Utils and Helper Methods
import { formatQuantity } from '@/utils/ADempiere/formatValue/numberFormat'
import { formatDate } from '@/utils/ADempiere/formatValue/dateFormat'
import { convertBooleanToTranslationLang } from '@/utils/ADempiere/formatValue/booleanFormat.js'
import { isEmptyValue } from '@/utils/ADempiere'
import useInvoice from './PanelForm/useInvoice'

export default defineComponent({
  name: 'TableRecords',

  components: {
    IndexColumn
  },

  mixins: [
    invoicesMixin,
    fieldSearchMixin
  ],
  props: {
    // uuidForm: {
    //   required: true
    // },
    containerManager: {
      type: Object,
      default: () => ({
        actionPerformed: () => {},
        getFieldsLit: () => {},
        setDefaultValues: () => {}
      })
    },
    metadata: {
      type: Object,
      default: () => {
        return {
          containerUuid: INVOICE_LIST_FORM,
          columnName: COLUMN_NAME
        }
      }
    }
  },

  methods: {
    closeList() {
      store.commit('setGeneralInfoShow', {
        containerUuid: this.uuidForm,
        show: false
      })
    }
  },
  computed: {
    uuidForm() {
      if (!isEmptyValue(this.metadata.containerUuid)) {
        return this.metadata.columnName + '_' + this.metadata.containerUuid
      }
      return INVOICE_LIST_FORM
    }
  },
  setup(props) {
    const listSummary = []
    const isLoadingRecords = ref(false)
    const timeOutRecords = ref(null)
    const {
      setValues
    } = useInvoice({
      uuidForm: props.uuidForm,
      parentUuid: props.metadata.parentUuid,
      containerUuid: props.metadata.containerUuid,
      containerManager: props.containerManager,
      fieldAttributes: props.metadata
    })

    const SearchList = computed(() => {
      const invoiceList = store.getters.getInvoicesSearchFieldRecordsList
      setTime()
      if (isEmptyValue(invoiceList)) {
        return []
      }
      // return invoiceList.map((list) => {
      //   return {
      //     ...list,
      //     business_partner: list.business_partner,
      //     date_invoiced: formatDate({ value: list.date_invoiced }),
      //     document_no: list.document_no,
      //     currency: list.currency,
      //     grandTotal: formatQuantity({ value: list.grand_total }),
      //     converted_amount: formatQuantity({ value: list.converted_amount }),
      //     openAmount: formatQuantity({ value: list.open_amount }),
      //     payment_term: list.payment_term,
      //     isPaid: convertBooleanToTranslationLang(list.is_paid),
      //     isSalesTransaction: convertBooleanToTranslationLang(list.is_sales_transaction),
      //     description: list.description,
      //     po_reference: list.po_reference
      //   }
      // })
      return invoiceList
    })

    function setTime() {
      clearTimeout(timeOutRecords.value)
      isLoadingRecords.value = true
      timeOutRecords.value = setTimeout(() => {
        isLoadingRecords.value = false
      }, 1000)
    }

    function searchRecordsList() {
      store.dispatch('searchInvociesInfos', {})
    }

    const currentRow = computed({
      get() {
        return store.getters.getAccountCombinationsCurrentRow({
          containerUuid: props.uuidForm
        })
      },
      // setter
      set(rowSelected) {
        store.commit('setAccountCombinationsSelectedRow', {
          containerUuid: props.uuidForm,
          currentRow: rowSelected
        })
      }
    })

    function changeRecord(row) {
      if (!isEmptyValue(row)) {
        setValues(row)
        store.commit('setGeneralInfoShow', {
          containerUuid: this.uuidForm,
          show: false
        })
      }
    }

    searchRecordsList()
    return {
      //
      isLoadingRecords,
      currentRow,
      //
      convertBooleanToTranslationLang,
      formatDate,
      formatQuantity,
      SearchList,
      listSummary,
      //
      searchRecordsList,
      changeRecord
    }
  }
})
</script>
