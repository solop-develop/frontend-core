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
    :body-style="{ padding: '5px' }"
  >
    <div slot="header" class="clearfix">
      <span style="float: right;text-align: end">
        <b>
          {{ $t('form.pos.collect.overdrawnInvoice.customerLimit') }}: {{ formatPrice({ value: currentPos.write_off_amount_tolerance.value, currency: currentPos.price_list.currency.iso_code }) }}
        </b>
      </span>
    </div>
    <el-form label-width="120px">
      <el-form-item>
        <p>
          <b> {{ $t('form.pos.collect.orderTotal') }} </b> {{ formatPrice({ value: currentOrder.grand_total.value, currency: currentOrder.price_list.currency.iso_code }) }}
          <el-divider direction="vertical" />
          <b> {{ $t('form.pos.collect.totalInvoiced') }} </b> {{ formatPrice({ value: currentOrder.payment_amount.value, currency: currentOrder.price_list.currency.iso_code }) }}
          <el-divider direction="vertical" />
          <b> {{ $t('form.pos.collect.pending') }} </b> {{ formatPrice({ value: currentOrder.open_amount.value, currency: currentOrder.price_list.currency.iso_code }) }}
        </p>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import {
  defineComponent,
  computed
} from '@vue/composition-api'

import store from '@/store'
// Utils and Helper Methods
import { formatPrice } from '@/utils/ADempiere/formatValue/numberFormat'

export default defineComponent({
  name: 'OpenBalance',
  setup() {
    const currentPos = computed(() => {
      return store.getters.getVPOS
    })

    const currentOrder = computed(() => {
      return store.getters.getCurrentOrder
    })

    return {
      currentPos,
      currentOrder,
      formatPrice
    }
  }
})
</script>

<style lang="scss" scoped>
.border-info {
  border: 1px solid rgb(54, 163, 247);
  border-radius: 5px;
  margin: 0px;
  padding: 0px 5px;
}
.line-info {
  width: 100%;
  display: flow-root;
  margin: 10px 0px;
}
</style>
