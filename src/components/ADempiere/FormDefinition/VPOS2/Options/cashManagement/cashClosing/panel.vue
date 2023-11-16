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
  <el-table
    v-loading="isLoading"
    :data="listCashSummary"
    style="width: 100%"
    height="250"
    border
  >
    <el-table-column
      v-if="isDetails"
      prop="document_no"
      :label="$t('form.expressMovement.field.documentNo')"
    />
    <el-table-column
      v-if="isDetails"
      prop="invoice_document_no"
      :label="$t('form.pos.collect.invoceNr')"
    />
    <el-table-column
      v-if="isDetails"
      prop="order_document_no"
      :label="$t('form.pos.collect.orderNr')"
    />
    <el-table-column
      v-if="isDetails"
      prop="customer.name"
      :label="$t('form.pos.collect.customer')"
    />
    <el-table-column
      v-if="isDetails"
      prop="charge.name"
      width="150"
      :label="$t('pointOfSales.collection.chargeAmount')"
    />
    <el-table-column
      v-if="isDetails"
      prop="collecting_agent.name"
      :label="$t('form.pos.collect.seller')"
    />
    <el-table-column
      prop="payment_method.name"
      width="150"
      :label="$t('form.pos.collect.paymentMethod')"
    />
    <el-table-column
      prop="currency.iso_code"
      :label="$t('form.pos.collect.Currency')"
    />
    <el-table-column
      label="Monto"
      align="right"
    >
      <template slot-scope="scope">
        {{ formatPrice({ value: scope.row.amount.value, currency: scope.row.currency.iso_code}) }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'
import { formatPrice } from '@/utils/ADempiere/formatValue/numberFormat'
import store from '@/store'

export default defineComponent({
  name: 'cashClosingPanel',
  setup() {
    const listCashSummary = computed(() => {
      return store.getters.getAttributeCashClosings({
        attribute: 'listSummary'
      })
    })

    const isLoading = computed(() => {
      return store.getters.getAttributeCashClosings({
        attribute: 'isLoading'
      })
    })

    const isDetails = computed(() => {
      return store.getters.getAttributeCashClosings({
        attribute: 'isDetails'
      })
    })

    return {
      isLoading,
      isDetails,
      listCashSummary,
      // Methods
      formatPrice
    }
  }
})
</script>

<style lang="scss" scoped>
.card-options-buttons {
  cursor: pointer;
  text-align: center !important;
  color: black;
  min-height: 50px;
}
.custom-card-options {
  margin: 1px;
  cursor: pointer;
}
.custom-card-options:hover {
  background-color: #eaf5fe;
  border: 1px solid #36a3f7;
}
</style>
