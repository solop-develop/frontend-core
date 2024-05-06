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
  <el-tabs
    v-model="activeName"
    type="border-card"
    @tab-click="selectTabs"
  >
    <el-tab-pane :label="$t('field.product.warehouseStocks')" name="warehouseStocks">
      <warehouse-stocks />
    </el-tab-pane>
    <el-tab-pane :label="$t('field.product.substitute')" name="substitute">
      <substitute />
    </el-tab-pane>
    <el-tab-pane :label="$t('field.product.relateds')" name="relateds">
      <relateds />
    </el-tab-pane>
    <el-tab-pane :label="$t('field.product.availableToPromises')" name="availableToPromises">
      <availableToPromises />
    </el-tab-pane>
    <el-tab-pane :label="$t('field.product.vendorPurchases')" name="vendorPurchases">
      <vendorPurchases />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { defineComponent, ref } from '@vue/composition-api'
import store from '@/store'
// Components and Mixins
import warehouseStocks from '@/components/ADempiere//Form/ProductSearch/dialogo/tabPanel/warehouseStocks.vue'
import substitute from '@/components/ADempiere//Form/ProductSearch/dialogo/tabPanel/substitute.vue'
import relateds from '@/components/ADempiere//Form/ProductSearch/dialogo/tabPanel/relateds.vue'
import availableToPromises from '@/components/ADempiere//Form/ProductSearch/dialogo/tabPanel/availableToPromises.vue'
import vendorPurchases from '@/components/ADempiere//Form/ProductSearch/dialogo/tabPanel/vendorPurchases.vue'
// import store from '@/store'
// // Utils and Helper Methods
// import { convertBooleanToTranslationLang } from '@/utils/ADempiere/formatValue/booleanFormat'
// import { isEmptyValue } from '@/utils/ADempiere'

export default defineComponent({
  name: 'TabPanel',

  components: {
    availableToPromises,
    vendorPurchases,
    warehouseStocks,
    substitute,
    relateds
  },

  setup() {
    /**
     * Ref
     */

    const activeName = ref('warehouseStocks')

    selectTabs(activeName.value)

    function selectTabs(currentTab) {
      const { name } = currentTab
      switch (name) {
        case 'warehouseStocks':
          store.dispatch('requestListWarehouseStocks')
          break
        case 'substitute':
          store.dispatch('requestListSubstitute')
          break
        case 'relateds':
          store.dispatch('requestListRelateds')
          break
        case 'availableToPromises':
          store.dispatch('requestListAvailable')
          break
        case 'vendorPurchases':
          store.dispatch('requestListVendorPurchases')
          break
      }
    }

    return {
      activeName,
      selectTabs
    }
  }
})
</script>

<style lang="scss" scoped>
.class-empty-value {
  color: transparent;
}
.label-value{
  text-align: end;
}
</style>
