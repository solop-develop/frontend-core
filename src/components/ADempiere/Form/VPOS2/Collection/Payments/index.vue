<!--
ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A.
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
  <el-card
    shadow="never"
    :body-style="{ padding: '2px' }"
  >
    <el-row :gutter="10">
      <el-col
        v-for="(payment, key) in listPayments"
        :key="key"
        :span="12"
        style="margin: 10px 0px;"
      >
        <card-payments
          :payment="payment"
        />
      </el-col>
    </el-row>
    <el-divider v-if="!isEmptyValue(listPaymentsRefund)" content-position="center" style="padding: 10px;">
      <h2> {{ $t('form.pos.collect.refund') }} / {{ $t('pointOfSales.collection.others') }} </h2>
    </el-divider>
    <el-row :gutter="10">
      <el-col
        v-for="(payment, key) in listPaymentsRefund"
        :key="key"
        :span="12"
        style="margin: 10px 0px;"
      >
        <card-payments
          :payment="payment"
        />
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

// import lang from '@/lang'
import store from '@/store'
// import router from '@/router'
// Component and Mixins
import CardPayments from './CardPayments'
// import MainOrder from './MainOrder'
// import FooterOrder from './FooterOrder'
// Utils and Helper Methods
// import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'Payments',
  components: {
    CardPayments
  },
  setup() {
    const listPayments = computed(() => {
      return store.getters.getListPayments.filter(list => !list.is_refund)
    })
    const listPaymentsRefund = computed(() => {
      return store.getters.getListPayments.filter(list => list.is_refund)
    })
    return {
      listPayments,
      listPaymentsRefund
    }
  }
})
</script>

<style lang="scss" scoped></style>
