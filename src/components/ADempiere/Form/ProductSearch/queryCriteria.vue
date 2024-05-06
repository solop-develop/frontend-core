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
  <el-form
    label-position="top"
    label-width="10px"
    size="mini"
    class="form-base"
    @submit.native.prevent="notSubmitForm"
  >
    <el-form-item :label="$t('form.productInfo.codeProduct')">
      <el-input
        v-model="searchValue"
        :placeholder="$t('quickAccess.searchWithEnter')"
        clearable
        @input="hangleChange"
      />
      <el-row :gutter="10">
        <el-col :span="6">
          <warehouse-field
            :uuid-form="uuidForm"
          />
        </el-col>
        <el-col :span="6">
          <vendor-field
            :uuid-form="uuidForm"
          />
        </el-col>
        <el-col :span="6">
          <is-stocked-field
            :uuid-form="uuidForm"
          />
        </el-col>
        <el-col :span="6">
          <price-list-version-field
            :uuid-form="uuidForm"
          />
        </el-col>
        <el-col :span="6">
          <product-category-field
            :uuid-form="uuidForm"
          />
        </el-col>

        <el-col :span="6">
          <product-group-field
            :uuid-form="uuidForm"
          />
        </el-col>

        <el-col :span="6">
          <product-class-field
            :uuid-form="uuidForm"
          />
        </el-col>

        <el-col :span="6">
          <product-classification-field
            :uuid-form="uuidForm"
          />
        </el-col>
      </el-row>
    </el-form-item>
  </el-form>
</template>

<script>
import { defineComponent, ref } from '@vue/composition-api'

// Components and Mixins
import VendorField from '@/components/ADempiere/FieldDefinition/FieldSearch/ProductInfo/PanelForm/QueryCriteria/vendorField.vue'
import WarehouseField from '@/components/ADempiere/FieldDefinition/FieldSearch/ProductInfo/PanelForm/QueryCriteria/warehouseField.vue'
import IsStockedField from '@/components/ADempiere/FieldDefinition/FieldSearch/ProductInfo/PanelForm/QueryCriteria/isStockedField.vue'
import PriceListVersionField from '@/components/ADempiere/FieldDefinition/FieldSearch/ProductInfo/PanelForm/QueryCriteria/priceListVersionField.vue'
import ProductCategoryField from '@/components/ADempiere/FieldDefinition/FieldSearch/ProductInfo/PanelForm/QueryCriteria/productCategoryField.vue'
import ProductClassField from '@/components/ADempiere/FieldDefinition/FieldSearch/ProductInfo/PanelForm/QueryCriteria/productClassField.vue'
import ProductClassificationField from '@/components/ADempiere/FieldDefinition/FieldSearch/ProductInfo/PanelForm/QueryCriteria/productClassificationField.vue'
import ProductGroupField from '@/components/ADempiere/FieldDefinition/FieldSearch/ProductInfo/PanelForm/QueryCriteria/productGroupField.vue'

export default defineComponent({
  name: 'QueryCriteria',

  components: {
    VendorField,
    WarehouseField,
    IsStockedField,
    ProductClassField,
    ProductGroupField,
    ProductCategoryField,
    PriceListVersionField,
    ProductClassificationField
  },

  props: {
    uuidForm: {
      type: String,
      required: true
    },
    hangleChange: {
      type: Function,
      required: true,
      default: () => {
        console.info('Implement Hangle Change Value Method')
      }
    }
  },

  setup() {
    /**
     * Ref
     */
    const searchValue = ref('')

    return {
      searchValue
    }
  }
})
</script>
