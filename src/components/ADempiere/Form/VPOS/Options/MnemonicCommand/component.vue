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
  <el-dialog
    :title="isComponentTitle"
    :visible.sync="isDialogoComponent"
    close-on-press-escape
    append-to-body
    width="75%"
    top="5vh"
    center
    class="dialogo-component"
    style="max-height: 100%;"
  >
    <component
      :is="isComponentRender"
      :is-selectable="false"
      :is-visible="deliverAllProducts"
      :is-complete-products="isCompleteProducts"
      popover-name="isShowPopoverMenu"
      style="max-height: 100%;"
    />
  </el-dialog>
</template>

<script>
import store from '@/store'
import lang from '@/lang'
import { defineComponent, ref, computed } from '@vue/composition-api'
export default defineComponent({
  name: 'ComponentDialgo',
  props: {
    metadata: {
      type: Object,
      default: () => {}
    }
  },
  setup() {
    /**
     * Ref
     */
    const isCompleteProducts = ref(false)
    /**
     * Computed
     */
    const isDialogoComponent = computed({
      get() {
        return store.getters.getDialogoComponent
      },
      set(value) {
        store.commit('setDialogoComponent', value)
      }
    })
    const currentCommand = computed(() => {
      return store.getters.getCurrentCommand
    })

    const isComponentRender = computed(() => {
      let component
      switch (currentCommand.value.command) {
        case 'ordersHistory':
          component = () => import('@/components/ADempiere/Form/VPOS/OrderList/index')
          break
        case 'addResource':
          component = () => import('@/components/ADempiere/Form/TimeControl/table.vue')
          break
        case 'cancelSaleTransaction':
          component = () => import('@/components/ADempiere/Form/VPOS/Options/reverseSalesTransaction/index.vue')
          break
        case 'confirmDelivery':
          isCompleteProducts.value = false
          component = () => import('@/components/ADempiere/Form/VPOS/ConfirmDelivery')
          break
        case 'deliverAllProducts':
          isCompleteProducts.value = true
          component = () => import('@/components/ADempiere/Form/VPOS/ConfirmDelivery')
          break
        case 'applyDiscountOnOrder':
          isCompleteProducts.value = true
          component = () => import('@/components/ADempiere/Form/VPOS/Options/applyDiscount/index.vue')
          break
        case 'changePos':
          component = () => import('@/components/ADempiere/Form/VPOS/Options/listGeneralOptions/index.vue')
          break
        case 'listProducts':
          component = () => import('@/components/ADempiere/Form/VPOS/ProductInfo/productList')
          break
        case 'changeWarehouseList':
          component = () => import('@/components/ADempiere/Form/VPOS/Options/listGeneralOptions/index.vue')
          break
        case 'changePriceList':
          component = () => import('@/components/ADempiere/Form/VPOS/Options/listGeneralOptions/index.vue')
          break
      }
      return component
    })
    const isComponentTitle = computed(() => {
      let component
      switch (currentCommand.value.command) {
        case 'ordersHistory':
          component = lang.t('form.pos.optionsPoinSales.salesOrder.ordersHistory')
          break
        case 'addResource':
          component = lang.t('timeControl.addResource')
          break
        case 'cancelSaleTransaction':
          component = lang.t('form.pos.optionsPoinSales.salesOrder.cancelSaleTransaction')
          break
        case 'applyDiscountOnOrder':
          component = lang.t('form.pos.salesDiscountOff')
          break
        case 'changePos':
          component = lang.t('form.pos.optionsPoinSales.generalOptions.changePos')
          break
        case 'listProducts':
          component = lang.t('form.pos.optionsPoinSales.generalOptions.listProducts')
          break
        case 'changeWarehouseList':
          component = lang.t('form.pos.optionsPoinSales.generalOptions.changeWarehouseList')
          break
        case 'changePriceList':
          component = lang.t('form.pos.optionsPoinSales.generalOptions.changePriceList')
          break
      }
      return component
    })

    const deliverAllProducts = computed(() => {
      return store.getters.getDeliverAllProducts
    })

    return {
      // Ref
      isCompleteProducts,
      // Computed
      deliverAllProducts,
      isDialogoComponent,
      currentCommand,
      isComponentRender,
      isComponentTitle
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
