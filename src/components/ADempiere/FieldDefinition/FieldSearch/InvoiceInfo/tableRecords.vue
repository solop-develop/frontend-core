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
        v-for="(header, key) in headerList"
        :key="key"
        :align="header.align"
        :width="header.width"
        :label="header.label"
        :prop="header.columnName"
        header-align="center"
      />
    </el-table>
  </div>
</template>

<script>
import store from '@/store'
import lang from '@/lang'

import { computed, defineComponent, ref } from '@vue/composition-api'

// Constants
import { INVOICE_LIST_FORM, COLUMN_NAME } from '@/utils/ADempiere/dictionary/field/search/invoice.ts'

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
    const headerList = ref([
      {
        label: lang.t('field.invoice.businessParnet'),
        columnName: 'business_partner',
        width: '150',
        align: 'center'
      },
      {
        label: lang.t('field.invoice.invoiceDate'),
        columnName: 'date_invoiced',
        width: '145',
        align: 'right'
      },
      {
        label: lang.t('field.invoice.documentNo'),
        columnName: 'document_no',
        width: '120',
        align: 'right'
      },
      {
        label: lang.t('field.invoice.currency'),
        columnName: 'currency',
        width: '70',
        align: 'center'
      },
      {
        label: lang.t('field.invoice.grandTotal'),
        columnName: 'grand_total',
        width: '90',
        align: 'right'
      },
      {
        label: lang.t('field.invoice.converted'),
        columnName: 'converted_amount',
        width: '90',
        align: 'right'
      },
      {
        label: lang.t('field.invoice.open'),
        columnName: 'open_amount',
        width: '90',
        align: 'right'
      },
      {
        label: lang.t('field.invoice.payment'),
        columnName: 'payment_term',
        width: '120',
        align: 'center'
      },
      {
        label: lang.t('field.invoice.paid'),
        columnName: 'is_paid',
        width: '70',
        align: 'right'
      },
      {
        label: lang.t('field.invoice.saleTransaction'),
        columnName: 'is_sales_transaction',
        width: '155',
        align: 'right'
      },
      {
        label: lang.t('field.invoice.description'),
        columnName: 'description',
        width: '100',
        align: 'center'
      },
      {
        label: lang.t('field.invoice.reference'),
        columnName: 'po_reference',
        width: '265',
        align: 'center'
      }
    ])

    const SearchList = computed(() => {
      const invoiceList = store.getters.getInvoicesSearchFieldRecordsList
      setTime()
      if (isEmptyValue(invoiceList)) return []
      return invoiceList.map((list) => {
        return {
          ...list,
          business_partner: list.business_partner,
          date_invoiced: formatDate({ value: list.date_invoiced }),
          document_no: list.document_no,
          currency: list.currency,
          grand_total: formatQuantity({ value: list.grand_total }),
          converted_amount: formatQuantity({ value: list.converted_amount }),
          open_amount: formatQuantity({ value: list.open_amount }),
          payment_term: list.payment_term,
          is_paid: convertBooleanToTranslationLang(list.is_paid),
          is_sales_transaction: convertBooleanToTranslationLang(list.is_sales_transaction),
          description: list.description,
          po_reference: list.po_reference
        }
      })
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
      SearchList,
      headerList,
      listSummary,
      //
      searchRecordsList,
      changeRecord
    }
  }
})
</script>
