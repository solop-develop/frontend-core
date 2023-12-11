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
    <el-col :span="8" style="width: 100% !important;">
      <div @click="prodcutShow">
        <el-card
          shadow="never"
          class="custom-card-options"
          :body-style="{ padding: '10px' }"
        >
          <p
            class="card-options-buttons"
          >
            <svg-icon icon-class="product-search" />
            <br>
            {{ $t('form.pos.optionsPoinSales.generalOptions.productQuery') }}
          </p>
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
import ListProduct from '@/components/ADempiere/Form/ProductInfo/productList'
import store from '@/store'
import lang from '@/lang'
export default defineComponent({
  name: 'ListProductSearch',
  components: {
    ListProduct
  },
  setup() {
    function prodcutShow() {
      store.dispatch('setModalDialogVPOS', {
        title: lang.t('form.pos.optionsPoinSales.generalOptions.productQuery'),
        doneMethod: () => {
          store.commit('setShowedModalDialogVPOS', {
            isShowed: false
          })
        },
        // src/components/ADempiere/Form/VPOS2/Options/generalOptions/ProductListTable.vue
        componentPath: () => import('@/components/ADempiere/Form/VPOS2/Options/generalOptions/ProductListTable.vue'),
        isShowed: true
      })
    }
    return {
      prodcutShow
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
