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
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https:www.gnu.org/licenses/>.
-->
<template>
  <el-row>
    <el-col :span="24" class="container-reverse">
      <p class="container-popover">
        <b class="container-popover">
          {{ $t('data.addDescription') }}
        </b>
      </p>
    </el-col>
    <el-col :span="24">
      <sales-discount-off
        ref="salesDiscountOff"
      />
      <br>
      <br>
    </el-col>
    <el-col :span="24">
      <samp class="spam-button" style="float: right;">
        <el-button
          type="primary"
          icon="el-icon-check"
          class="button-base-icon"
          style="float: right; margin: 10px;"
          @click="salesDiscount()"
        />
        <el-button
          type="danger"
          icon="el-icon-close"
          style="float: right;margin-top: 10px;"
          class="button-base-icon"
          @click="close()"
        />
        <el-button
          type="info"
          plain
          style="float: right; margin-top: 10px;"
          class="button-base-icon"
          @click="clear()"
        >
          <svg-icon icon-class="layers-clear" />
        </el-button>
      </samp>
    </el-col>
  </el-row>
</template>

<script>
import store from '@/store'
import { defineComponent, computed } from '@vue/composition-api'
// Component
import SalesDiscountOff from '../SalesDiscountOff/index.vue'
// Utils and Helper Methods
import { showMessage } from '@/utils/ADempiere/notification'

export default defineComponent({
  name: 'applyDiscount',
  components: { SalesDiscountOff },
  props: {
    metadata: {
      type: Object,
      default: () => {}
    }
  },
  setup() {
    /**
     * Component
     */
    const discountAmount = computed(() => {
      return store.getters.getValueOfField({
        containerUuid: 'Sales-Discount-Off',
        columnName: 'Discount'
      })
    })
    /**
     * Methods
     */
    function close() {
      store.commit('setDialogoComponent', false)
    }
    function clear() {
      store.commit('updateValueOfField', {
        containerUuid: 'Sales-Discount-Off',
        columnName: 'Discount',
        value: ''
      })
    }
    function salesDiscount() {
      const { currentOrder, uuid } = store.getters.posAttributes.currentPointOfSales
      store.dispatch('updateOrder', {
        orderUuid: currentOrder.uuid,
        posUuid: uuid,
        discountAmount: discountAmount.value,
        isDiscountOrder: true
      })
        .then(response => {
          showMessage({
            type: 'success',
            showClose: true,
            message: 'Ok'
          })
        })
        .catch(error => {
          showMessage({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
        .finally(() => {
          close()
        })
    }

    return {
      // Component
      discountAmount,
      // Methods
      salesDiscount,
      close,
      clear
    }
  }
})
</script>

<style lang="scss">
.dialogo-component{
  .el-dialog__body {
    max-height: 100%;
  }
}
</style>
