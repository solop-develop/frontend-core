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
  <el-dialog
    :visible.sync="isShowDialog"
    :center="true"
    :modal="false"
    :custom-class="'product-search-details'"
    width="90%"
    top="10vh"
    :title="title"
  >
    <span v-if="!isEmptyValue(product)">
      <info-product />
      <el-divider />
      <tab-panel />
    </span>
    <loading-view
      v-else
      key="browser-loading"
    />
  </el-dialog>
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'
import store from '@/store'
// Components and Mixins
import IndexColumn from '@/components/ADempiere/DataTable/Components/IndexColumn.vue'
import LoadingView from '@/components/ADempiere/LoadingView/index.vue'
import infoProduct from '@/components/ADempiere/Form/ProductSearch/dialogo/infoProduct.vue'
import TabPanel from '@/components/ADempiere/Form/ProductSearch/dialogo/tabPanel'
// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere'

export default defineComponent({
  name: 'ShowInfoProduct',

  components: {
    LoadingView,
    IndexColumn,
    infoProduct,
    TabPanel
  },

  props: {
    isShow: {
      type: Boolean,
      required: true
    }
    // currentLine: {
    //   type: Object,
    //   required: true
    // }
    // hangleChange: {
    //   type: Function,
    //   required: true,
    //   default: () => {
    //     console.info('Implement Hangle Change Value Method')
    //   }
    // }
  },

  setup() {
    /**
     * Ref
     */
    const searchValue = ref('')
    /**
     * Computed
     */

    const product = computed(() => {
      return store.getters.getCurrentProduct
    })
    const title = computed(() => {
      return isEmptyValue(product.value) ? '' : product.value.name
    })

    const isShowDialog = computed({
      set(newValue) {
        store.dispatch('changeShowDialog', newValue)
      },
      get() {
        return store.getters.getShowProductDetailDialog
      }
    })

    return {
      searchValue,
      product,
      title,
      isShowDialog
    }
  }
})
</script>
