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
    <el-table
      :data="tableData"
      show-summary
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        label="ID"
        width="180"
      />
    </el-table>
  </div>
</template>

<script>
import { defineComponent, ref } from '@vue/composition-api'
// import lang from '@/lang'
// components and mixins
import Carousel from '@/components/ADempiere/Carousel'
// import formMixin from '@/components/ADempiere/Form/formMixin.js'
// import fieldsList from './fieldList.js'
// import SearchCriteria from './components/SearchCriteria/'
// import Invoices from './components/Invoices/index'
// import Receipt from './components/Receipt/index'

// Utils and Helper Methods
// import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
// import { showMessage } from '@/utils/ADempiere/notification'

// API Request Methods
// import {
//   listPaymentSelection,
//   paymentSelection
// } from '@/api/ADempiere/form/VPayPrint.js'

export default defineComponent({
  name: 'Summary',

  components: {
    Carousel
  },

  setup() {
    /**
     * Refs
     */
    const headers = ref([
      {
        name: 'Selección de Criterio',
        columnName: ''
      }
    ])

    const tableData = ref([])

    return {
      // Const
      // Refs
      tableData,
      headers
      // Methods
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
</style>
