<!--
ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
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
  <span>
    <el-form
      label-position="top"
      class="form-min-label"
      inline
      @submit.native.prevent="notSubmitForm"
    >
      <el-form-item
        style="width: 100% !important;display: contents;"
      >
        <b slot="label" style="color: transparent !important;">
          {{ $t('form.pos.optionsPoinSales.salesOrder.newOrder') }}
        </b>
        <el-dropdown split-button type="primary">
          {{ $t('form.pos.optionsPoinSales.salesOrder.newOrder') }}
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>Action 1</el-dropdown-item>
            <el-dropdown-item>Action 2</el-dropdown-item>
            <el-dropdown-item>Action 3</el-dropdown-item>
            <el-dropdown-item>Action 4</el-dropdown-item>
            <el-dropdown-item>Action 5</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-form-item>
    </el-form>
    <!-- <el-table
      v-loading="isLoading"
      :data="dataList"
      style="width: 100%"
      height="50vh"
      :border="true"
      :empty-text="$t('form.byInvoice.emptyList')"
      highlight-current-row
    >
      <index-column
        :page-number="pageNumber"
      />

      <el-table-column
        prop="documentNo"
        width="155"
        :label="$t('form.byInvoice.documentNo')"
      />

      <el-table-column
        width="155"
        :label="$t('pointOfSales.order.dateOfOrder')"
      >
        <template slot-scope="scope">
          {{ formatDate({ value: scope.row.dateOrdered }) }}
        </template>
      </el-table-column>

      <el-table-column
        prop="businessPartner.name"
        min-width="160"
        :label="$t('form.byInvoice.businessPartner')"
      />

      <el-table-column
        prop="salesRepresentative.name"
        min-width="170"
        :label="$t('form.byInvoice.salesRepresentative')"
      />

      <el-table-column
        width="100"
        :label="$t('page.processActivity.status')"
      >
        <template slot-scope="scope">
          <document-status-tag
            :value="scope.row.documentStatus.value"
            :displayed-value="scope.row.documentStatus.name"
          />
        </template>
      </el-table-column>

      <el-table-column
        align="right"
        width="150"
        :label="$t('form.productInfo.grandTotal')"
      >
        <template slot-scope="scope">
          {{ formatPrice({ value: scope.row.grandTotal, currency: scope.row.priceList.currency.iso_code }) }}
        </template>
      </el-table-column>
    </el-table> -->
  </span>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
// import store from '@/store'
// Components and Mixins
import DocumentStatusTag from '@/components/ADempiere/ContainerOptions/DocumentStatusTag/index.vue'
import IndexColumn from '@/components/ADempiere/DataTable/Components/IndexColumn.vue'
// Utils and Helper Methods
import { formatDate } from '@/utils/ADempiere/formatValue/dateFormat'
import { formatPrice } from '@/utils/ADempiere/formatValue/numberFormat'

export default defineComponent({
  name: 'tableList',
  components: {
    DocumentStatusTag,
    IndexColumn
  },
  props: {
    dataList: {
      type: Array,
      default: () => {
        return []
      }
    },
    pageNumber: {
      type: Number,
      default: 1
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    return {
      formatDate,
      formatPrice
    }
  }
})
</script>

<style lang="scss" scoped>
.order-info {
  float: right;
}
.total {
  border: 1px solid rgb(54, 163, 247);
  border-radius: 5px;
  margin: 0px;
}
</style>
