<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Elsio Sanchez esanchez@erpya.com www.erpya.com
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
  <el-card
    shadow="never"
    class="product-info-list-panel"
    :body-style="{ padding: '10px', height: '90% !important', overflow: 'auto' }"
  >
    <product-info-list
      :height="'80%'"
    />
  </el-card>
</template>

<script>
import ProductInfoList from '@/components/ADempiere/Form/VPOS2/Options/generalOptions/ProductListTable'

import { defineComponent } from '@vue/composition-api'

import store from '@/store'

export default defineComponent({
  name: 'ProductInfo',
  components: {
    ProductInfoList
  },
  props: {
    containerManager: {
      type: Object,
      default: () => ({
        actionPerformed: () => {},
        getFieldsLit: () => {},
        setDefaultValues: () => {}
      })
    }
  },
  setup(props) {
    store.dispatch('searchPointOfSaleData')

    return {}
  }
})
</script>

<style lang="scss" scope>
  .product-info-list-panel {
    height: 90% !important;
  }
</style>
