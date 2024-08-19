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
  <el-collapse
    v-model="activeAccordion"
    accordion
    class="products-query-criteria"
  >
    <el-collapse-item
      :name="ACCORDION_KEY"
      class="products-query-criteria-collapse"
    >
      <template slot="title">
        {{ title }}
      </template>

      <el-form
        label-position="top"
        size="mini"
        class="form-base"
        @submit.native.prevent="notSubmitForm"
      >
        <el-row :gutter="10">
          <el-col :span="8">
            <text-field
              :uuid-form="uuidForm"
              attribute-key="value"
              :label="$t('field.product.value')"
            />
          </el-col>
          <el-col :span="8">
            <text-field
              :uuid-form="uuidForm"
              attribute-key="name"
              :label="$t('field.product.name')"
            />
          </el-col>
          <!--
          <el-col :span="6">
            <text-field
              :uuid-form="uuidForm"
              attribute-key="upc"
              :label="$t('field.product.upc')"
            />
          </el-col>
          <el-col :span="6">
            <text-field
              :uuid-form="uuidForm"
              attribute-key="sku"
              :label="$t('field.product.sku')"
            />
          </el-col>
          -->
          <el-col :span="8">
            <warehouse-field
              :uuid-form="uuidForm"
              :parent-uuid="metadata.parentUuid"
              :container-uuid="metadata.containerUuid"
            />
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="8">
            <is-stocked-field
              :uuid-form="uuidForm"
              :parent-uuid="metadata.parentUuid"
              :container-uuid="metadata.containerUuid"
            />
          </el-col>
          <el-col :span="8">
            <price-list-version-field
              :uuid-form="uuidForm"
              :parent-uuid="metadata.parentUuid"
              :container-uuid="metadata.containerUuid"
            />
          </el-col>
          <el-col :span="8">
            <vendor-field
              :uuid-form="uuidForm"
              :parent-uuid="metadata.parentUuid"
              :container-uuid="metadata.containerUuid"
            />
          </el-col>
          <!--
          <el-col :span="6">
            <attribute-set-field
              :uuid-form="uuidForm"
              :parent-uuid="metadata.parentUuid"
              :container-uuid="metadata.containerUuid"
            />
          </el-col>
          <el-col :span="6">
            <attribute-set-instance-field
              :uuid-form="uuidForm"
              :parent-uuid="metadata.parentUuid"
              :container-uuid="metadata.containerUuid"
            />
          </el-col>
          -->
        </el-row>

        <el-row :gutter="10">
          <el-col :span="6">
            <product-category-field
              :uuid-form="uuidForm"
              :parent-uuid="metadata.parentUuid"
              :container-uuid="metadata.containerUuid"
            />
          </el-col>

          <el-col :span="6">
            <product-group-field
              :uuid-form="uuidForm"
              :parent-uuid="metadata.parentUuid"
              :container-uuid="metadata.containerUuid"
            />
          </el-col>

          <el-col :span="6">
            <product-class-field
              :uuid-form="uuidForm"
              :parent-uuid="metadata.parentUuid"
              :container-uuid="metadata.containerUuid"
            />
          </el-col>

          <el-col :span="6">
            <product-classification-field
              :uuid-form="uuidForm"
              :parent-uuid="metadata.parentUuid"
              :container-uuid="metadata.containerUuid"
            />
          </el-col>
        </el-row>
      </el-form>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
import { defineComponent, computed, onUnmounted } from '@vue/composition-api'

import lang from '@/lang'
import store from '@/store'

// Constants
import {
  PRODUCT_LIST_FORM,
  COLUMN_NAME
} from '@/utils/ADempiere/dictionary/field/search/product.ts'

// Components and Mixins
import AttributeSetField from './attributeSet.vue'
import AttributeSetInstanceField from './attributeSetInstance.vue'
import IsStockedField from './isStockedField.vue'
import PriceListVersionField from './priceListVersionField.vue'
import ProductCategoryField from './productCategoryField.vue'
import ProductClassField from './productClassField.vue'
import ProductClassificationField from './productClassificationField.vue'
import ProductGroupField from './productGroupField.vue'
import TextField from './textField.vue'
import VendorField from './vendorField.vue'
import WarehouseField from './warehouseField.vue'

// Utils and Helper Methods
import { isEmptyValue, isSameValues } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'QueryCriteria',

  components: {
    AttributeSetField,
    AttributeSetInstanceField,
    IsStockedField,
    PriceListVersionField,
    ProductCategoryField,
    ProductClassField,
    ProductClassificationField,
    ProductGroupField,
    TextField,
    VendorField,
    WarehouseField
  },

  props: {
    uuidForm: {
      required: true,
      type: String
    },
    metadata: {
      type: Object,
      default: () => {
        return {
          containerUuid: PRODUCT_LIST_FORM,
          columnName: COLUMN_NAME
        }
      }
    }
  },

  setup(props) {
    const ACCORDION_KEY = 'query-criteria'

    const title = computed(() => {
      let title = lang.t('field.product.title')
      if (!isEmptyValue(props.metadata.panelName) && !isSameValues(props.metadata.panelName, props.metadata.name)) {
        title += ` (${props.metadata.panelName})`
      }
      return title
    })

    const showQueryFields = computed({
      set(newValue) {
        store.commit('setProductSearchFieldShowQueryFields', {
          containerUuid: props.uuidForm,
          showQueryFields: newValue
        })
      },
      get() {
        return store.getters.getProductSearchFieldShowQueryFields({
          containerUuid: props.uuidForm
        })
      }
    })

    const activeAccordion = computed({
      set(newValue) {
        showQueryFields.value = !isEmptyValue(newValue)
      },
      get() {
        return showQueryFields.value ? ACCORDION_KEY : null
      }
    })
    function clearCriteriaValues() {
      store.commit('setProductSearchFieldQueryFilters', {
        containerUuid: props.uuidForm,
        queryFilters: {}
      })
    }
    onUnmounted(() => {
      clearCriteriaValues()
    })
    return {
      ACCORDION_KEY,
      //
      activeAccordion,
      title,
      clearCriteriaValues
    }
  }
})
</script>

<style lang="scss">
.products-query-criteria {
  .products-query-criteria-collapse {
    .el-form-item {
      &.el-form-item--mini {
        margin-bottom: 6px;

        .el-form-item__label {
          font-size: 11.3px;
          line-height: 20px;
        }
      }
    }
    .el-collapse-item__header {
      height: 40px;
      line-height: 40px;
    }

    .el-collapse-item__wrap {
      .el-collapse-item__content {
        padding-bottom: 5px;
      }
    }
  }
}
</style>
