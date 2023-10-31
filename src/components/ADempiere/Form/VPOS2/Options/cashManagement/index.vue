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
  <el-row :gutter="10">
    <el-col v-if="isAllowsCashOpening" :span="8">
      <cash-opening />
    </el-col>
    <el-col v-if="isAllowsCashWithdrawal" :span="8">
      <cash-withdrawal />
    </el-col>
    <el-col v-if="isAllowsCashClosing" :span="8">
      <cash-closing />
    </el-col>
    <el-col v-if="isAllowsDetailCashClosing" :span="8">
      <cash-detail-closing />
    </el-col>
    <el-col v-if="isAllowsAllocateSeller" :span="8">
      <seller />
    </el-col>
    <el-col v-if="isAllowsAllocateSeller" :span="8">
      <unassign-seller />
    </el-col>
  </el-row>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'
import store from '@/store'
// Components and Mixins
import cashOpening from './cashOpening/index.vue'
import cashWithdrawal from './cashWithdrawal'
import cashClosing from './cashClosing/index.vue'
import cashDetailClosing from './cashDetailClosing'
import seller from '@/components/ADempiere/Form/VPOS2/Options/cashManagement/seller/index.vue'
import unassignSeller from './unassignSeller'

export default defineComponent({
  name: 'cashManagement',
  components: {
    seller,
    cashOpening,
    cashClosing,
    cashWithdrawal,
    unassignSeller,
    cashDetailClosing
  },
  setup() {
    const currentPointOfSales = computed(() => {
      return store.getters.getVPOS
    })

    const isAllowsCashOpening = computed(() => {
      const { is_allows_cash_opening } = currentPointOfSales.value
      return is_allows_cash_opening
    })

    const isAllowsCashWithdrawal = computed(() => {
      const { is_allows_cash_withdrawal } = currentPointOfSales.value
      return is_allows_cash_withdrawal
    })

    const isAllowsCashClosing = computed(() => {
      const { is_allows_cash_closing } = currentPointOfSales.value
      return is_allows_cash_closing
    })

    const isAllowsDetailCashClosing = computed(() => {
      const { is_allows_detail_cash_closing } = currentPointOfSales.value
      return is_allows_detail_cash_closing
    })

    const isAllowsAllocateSeller = computed(() => {
      const { is_allows_allocate_seller } = currentPointOfSales.value
      return is_allows_allocate_seller
    })

    return {
      isAllowsCashOpening,
      isAllowsCashClosing,
      isAllowsCashWithdrawal,
      isAllowsAllocateSeller,
      isAllowsDetailCashClosing
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
  min-height: 125px;
  max-height: 125px;
  cursor: pointer;
}
.custom-card-options:hover {
  background-color: #eaf5fe;
  border: 1px solid #36a3f7;
}
</style>
