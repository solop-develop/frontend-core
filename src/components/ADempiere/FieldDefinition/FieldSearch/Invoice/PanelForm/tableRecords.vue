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
      ref="businessPartnerTable"
      v-loading="isLoadingRecords"
      class="business-partners-table"
      highlight-current-row
      :border="true"
      fit
      :data="recordsList"
      :max-height="300"
      size="mini"
      @current-change="handleCurrentChange"
      @row-dblclick="changeBusinessPartner"
    >
      <p slot="empty" style="width: 100%;">
        {{ 'Utilice los filtros para realizar la Búsqueda' }}
      </p>

      <index-column />

      <el-table-column
        prop="business_partner"
        label="Socio de Negocio"
        header-align="center"
        width="200"
      />
      <el-table-column
        prop="date_invoiced"
        label="Fecha de Facturación"
        header-align="center"
        width="160"
      >
        <span slot-scope="scope" class="cell-align-center">
          {{ formatDate({ value: scope.row.date_invoiced }) }}
        </span>
      </el-table-column>
      <el-table-column
        prop="document_no"
        label="Documento No"
        header-align="center"
        width="170"
      />

      <el-table-column
        prop="currency"
        label="Moneda"
        header-align="center"
        width="110"
      />

      <el-table-column
        label="Gran Total"
        header-align="center"
        width="130"
      >
        <span slot-scope="scope" class="cell-align-right">
          {{ formatQuantity({ value: scope.row.grand_total }) }}
        </span>
      </el-table-column>

      <el-table-column
        label="Convertido"
        header-align="center"
        width="130"
      >
        <span slot-scope="scope" class="cell-align-right">
          {{ formatQuantity({ value: scope.row.converted_amount }) }}
        </span>
      </el-table-column>

      <el-table-column
        label="Abierto"
        header-align="center"
        width="130"
      >
        <span slot-scope="scope" class="cell-align-right">
          {{ formatQuantity({ value: scope.row.open_amount }) }}
        </span>
      </el-table-column>

      <el-table-column
        prop="payment_term"
        label="Término de Pago"
        header-align="center"
        width="130"
      />

      <el-table-column
        prop="is_paid"
        label="Pagado"
        header-align="center"
        width="130"
      >
        <span slot-scope="scope" class="cell-align-right">
          {{ convertBooleanToTranslationLang(scope.row.is_paid) }}
        </span>
      </el-table-column>

      <el-table-column
        prop="is_sales_transaction"
        label="Transacción de Ventas"
        header-align="center"
        width="160"
      >
        <span slot-scope="scope" class="cell-align-right">
          {{ convertBooleanToTranslationLang(scope.row.is_sales_transaction) }}
        </span>
      </el-table-column>

      <el-table-column
        prop="description"
        label="Descripción"
        header-align="center"
        width="180"
      />

      <el-table-column
        prop="po_reference"
        label="Referencia de Orden de Socio del Negocio"
        header-align="center"
        width="270"
      />

      <el-table-column
        prop="document_status"
        label="Estado del Documento"
        header-align="center"
        width="220"
      />

    </el-table>
  </div>
</template>

<script>
import {
  defineComponent, computed, nextTick, onMounted, ref, watch
} from '@vue/composition-api'

import store from '@/store'

// Constants
import {
  BUSINESS_PARTNERS_LIST_FORM,
  COLUMN_NAME
} from '@/utils/ADempiere/dictionary/field/search/businessPartner.ts'

// Components and Mixins
import IndexColumn from '@/components/ADempiere/DataTable/Components/IndexColumn.vue'
import useBusinessPartner from './useBusinessPartner'

// Utils and Helper Methods
import { formatQuantity } from '@/utils/ADempiere/formatValue/numberFormat'
import { convertBooleanToTranslationLang } from '@/utils/ADempiere/formatValue/booleanFormat'
import { formatDate } from '@/utils/ADempiere/formatValue/dateFormat'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'TableRecords',

  components: {
    IndexColumn
  },

  props: {
    uuidForm: {
      required: true,
      type: String
    },
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
          containerUuid: BUSINESS_PARTNERS_LIST_FORM,
          columnName: COLUMN_NAME
        }
      }
    }
  },

  setup(props) {
    const businessPartnerTable = ref(null)

    const {
      currentRow,
      isLoadingRecords,
      closeList,
      setValues
    } = useBusinessPartner({
      uuidForm: props.uuidForm,
      parentUuid: props.metadata.parentUuid,
      containerUuid: props.metadata.containerUuid,
      containerManager: props.containerManager,
      fieldAttributes: props.metadata
    })

    const recordsList = computed(() => {
      return store.getters.getInvoiceRecordsList({
        containerUuid: props.uuidForm
      })
    })

    function handleCurrentChange(recordRow) {
      currentRow.value = recordRow
    }

    function changeBusinessPartner() {
      const recordRow = currentRow.value
      if (!isEmptyValue(recordRow)) {
        setValues(recordRow)
        closeList()
      }
    }

    watch(currentRow, (newValue, oldValue) => {
      if (businessPartnerTable.value) {
        businessPartnerTable.value.setCurrentRow(
          newValue
        )
      }
    })

    onMounted(() => {
      nextTick(() => {
        if (businessPartnerTable.value) {
          businessPartnerTable.value.setCurrentRow(
            currentRow.value
          )
        }
      })
    })

    return {
      businessPartnerTable,
      //
      currentRow,
      isLoadingRecords,
      recordsList,
      //
      handleCurrentChange,
      changeBusinessPartner,
      formatDate,
      formatQuantity,
      convertBooleanToTranslationLang
    }
  }
})
</script>

<style lang="scss">
.business-partners-table {
  &.el-table {
    .el-table__body {
      .el-table__row {
        .el-table__cell {
          padding-top: 5px;
          padding-bottom: 3px;
          .cell {
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: normal;
            word-break: break-all;
            line-height: 15px;
            padding-left: 10px;
            padding-right: 10px;
          }
        }
      }
    }
  }
}
</style>
