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
        <el-descriptions-item :label="$t('field.product.standardPrice')">
          <span v-if="isEmptyValue(product.standardPrice)" class="class-empty-value"> {{ '-' }}</span>
          {{ formatQuantity({ value: product.standard_price }) }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('field.product.infoProduct.infoProductGroup')">
          <span v-if="isEmptyValue(product.product_group)" class="class-empty-value"> {{ '-' }}</span>
          {{ product.product_group }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('field.product.description')">
          <span v-if="isEmptyValue(product.description)" class="class-empty-value"> {{ '-' }}</span>
          {{ product.description }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('field.product.onHandQuantity')">
          {{ product.on_hand_quantity }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('field.product.listPrice')">
          <span v-if="isEmptyValue(product.listPrice)" class="class-empty-value"> {{ '-' }}</span>
          {{ formatQuantity({ value: product.list_price }) }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('field.product.infoProduct.infoProductCategory')">
          <span v-if="isEmptyValue(product.product_category)" class="class-empty-value"> {{ '-' }}</span>
          {{ product.product_category }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('field.product.uom')">
          <span v-if="isEmptyValue(product.uom)" class="class-empty-value"> {{ '-' }}</span>
          {{ product.uom }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('Disponible')">
          <span v-if="isEmptyValue(product.available_quantity)" class="class-empty-value"> {{ '-' }}</span>
          {{ formatQuantity({ value: product.available_quantity }) }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('field.product.limitPrice')">
          <span v-if="isEmptyValue(product.limit_price)" class="class-empty-value"> {{ '-' }}</span>
          {{ formatQuantity({ value: product.limit_price }) }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('field.product.infoProduct.infoProductClass')">
          <span v-if="isEmptyValue(product.product_class)" class="class-empty-value"> {{ '-' }}</span>
          {{ product.product_class }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('field.product.vendor')">
          <span v-if="isEmptyValue(product.vendor)" class="class-empty-value"> {{ '-' }}</span>
          {{ product.vendor }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('Reservado')">
          <span v-if="isEmptyValue(product.reserved_quantity)" class="class-empty-value"> {{ '-' }}</span>
          {{ formatQuantity ({ value: product.reserved_quantity }) }}
        </el-descriptions-item>
      </el-descriptions>
    </el-col>
    <el-col :span="6">
      <el-image
        style="width: 80px; height: 80px;margin: -5px auto 0; display: block "
        :src="url"
        :preview-src-list="srcList"
        fit="cover"
      >
        <div v-if="isEmptyValue(url)" slot="error" class="image-slot">
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
      url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      srcList: [
        'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
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
.class-empty-value {
  color: transparent;
}
.label-value{
  text-align: end;
}
.el-descriptions-item__label.has-colon::after {
  content: "";
}
.el-descriptions__body .el-descriptions__table{
  table-layout:'' !important
}

</style>
