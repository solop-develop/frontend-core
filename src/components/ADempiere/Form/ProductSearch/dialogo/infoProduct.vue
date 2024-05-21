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
  <el-row :gutter="20">
    <el-col :span="18">
      <el-descriptions :column="4" :label-style="{'font-weight': 'bold'}">
        <el-descriptions-item :label="$t('form.productInfo.code')">
          {{ product.value }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('field.product.stocked')">
          {{ convertBooleanToTranslationLang(product.is_stocked) }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('field.product.vendor')">
          <span v-if="isEmptyValue(product.vendor)" class="class-empty-value"> {{ '-' }}</span>
          {{ product.vendor }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('field.product.infoProduct.infoProductoclassification')">
          <span v-if="isEmptyValue(product.product_classification)" class="class-empty-value"> {{ '-' }}</span>
          {{ product_classification }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('field.product.description')">
          <span v-if="isEmptyValue(product.description)" class="class-empty-value"> {{ '-' }}</span>
          {{ product.description }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('field.product.onHandQuantity')" :content-style="{'justify-content': 'center !important'}">
          {{ formatQuantity(product.on_hand_quantity) }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('field.product.standardPrice')" :content-style="{'justify-content': 'center !important', 'margin-left': '-20px'}">
          <span v-if="isEmptyValue(product.standard_price)" class="class-empty-value">{{ '-' }}</span>
          {{ formatQuantity({ value: product.standard_price }) }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('field.product.infoProduct.infoProductGroup')">
          <span v-if="isEmptyValue(product.product_group)" class="class-empty-value"> {{ '-' }}</span>
          {{ product.product_group }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('field.product.uom')">
          <span v-if="isEmptyValue(product.uom)" class="class-empty-value"> {{ '-' }}</span>
          {{ product.uom }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('field.product.available')" :content-style="{'justify-content': 'center !important'}">
          <span v-if="isEmptyValue(product.available_quantity)" class="class-empty-value"> {{ '-' }}</span>
          {{ formatQuantity({ value: product.available_quantity }) }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('field.product.listPrice')" :content-style="{'justify-content': 'center !important'}">
          <span v-if="isEmptyValue(product.listPrice)" class="class-empty-value"> {{ '-' }}</span>
          {{ formatQuantity({ value: product.list_price }) }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('field.product.infoProduct.infoProductCategory')">
          <span v-if="isEmptyValue(product.product_category)" class="class-empty-value"> {{ '-' }}</span>
          {{ product.product_category }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('field.product.sku')" :content-style="{'justify-content': 'center !important'}">
          <span v-if="isEmptyValue(product.sku)" class="class-empty-value"> {{ '-' }}</span>
          {{ product.sku }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('field.product.reservedQuantity')" :content-style="{'justify-content': 'center !important'}">
          <span v-if="isEmptyValue(product.reserved_quantity)" class="class-empty-value"> {{ '-' }}</span>
          {{ formatQuantity ({ value: product.reserved_quantity }) }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('field.product.limitPrice')" :content-style="{'justify-content': 'center !important'}">
          <span v-if="isEmptyValue(product.limit_price)" class="class-empty-value"> {{ '-' }}</span>
          {{ formatQuantity({ value: product.limit_price }) }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('field.product.infoProduct.infoProductClass')">
          <span v-if="isEmptyValue(product.product_class)" class="class-empty-value"> {{ '-' }}</span>
          {{ product.product_class }}
        </el-descriptions-item>
      </el-descriptions>
    </el-col>
    <el-col :span="4">
      <el-image
        style="width: 80px; height: 80px;margin: 0 auto 0; display: flex; justify-content:center; align-items:center; background: #f5f7fa"
        :src="url"
        :preview-src-list="srcList"
        fit="cover"
        class="image-conten"
      >
        <div slot="error" class="image-slot">
          <i class="el-icon-picture-outline" />
        </div>
      </el-image>
    </el-col>
  </el-row>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

import store from '@/store'

// Utils and Helper Methods
import { convertBooleanToTranslationLang } from '@/utils/ADempiere/formatValue/booleanFormat'
import { formatQuantity } from '@/utils/ADempiere/formatValue/numberFormat'

export default defineComponent({
  name: 'InfoProduct',

  data() {
    return {
      url: '',
      srcList: [
        ''
      ]
    }
  },

  setup() {
    /**
     * Computed
     */

    const product = computed(() => {
      return store.getters.getCurrentProduct
    })

    return {
      product,
      convertBooleanToTranslationLang,
      formatQuantity
    }
  }
})
</script>

<style lang="scss" scoped>
.el-descriptions-item__content {
  margin-left: auto !important;
  margin-right: auto !important;
}
.class-empty-value {
  color: transparent;
}
.label-value{
  text-align: end;
}

.image-conten{
  .image-slot{
    .el-icon-picture-outline{
      font-size:30px !important
    }
  }
}
</style>
