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
    <el-col :span="12">
      <b>
        {{ $t('form.productInfo.code') }}
      </b>
    </el-col>
    <el-col :span="12" class="label-value">
      {{ product.value }}
    </el-col>
    <el-col :span="12">
      <b>
        {{ $t('field.product.upc') }}
      </b>
    </el-col>
    <el-col :span="12" class="label-value">
      <span v-if="isEmptyValue(product.upc)" class="class-empty-value"> {{ '-' }}</span>
      {{ product.upc }}
    </el-col>
    <el-col :span="12">
      <b>
        {{ $t('form.productInfo.quantityOnHand') }}
      </b>
    </el-col>
    <el-col :span="12" class="label-value">
      {{ product.quantity_on_hand }}
    </el-col>
    <el-col :span="12">
      <b>
        {{ $t('field.product.uom') }}
      </b>
    </el-col>
    <el-col :span="12" class="label-value">
      <span v-if="isEmptyValue(product.uom)" class="class-empty-value"> {{ '-' }}</span>
      {{ product.uom }}
    </el-col>
    <el-col :span="12">
      <b>
        {{ $t('field.product.stocked') }}
      </b>
    </el-col>
    <el-col :span="12" class="label-value">
      {{ convertBooleanToTranslationLang(product.is_stocked) }}
    </el-col>
    <el-col :span="12">
      <b>
        {{ $t('field.product.productCategory') }}
      </b>
    </el-col>
    <el-col :span="12" class="label-value">
      <span v-if="isEmptyValue(product.product_category)" class="class-empty-value"> {{ '-' }}</span>
      {{ product.product_category }}
    </el-col>
    <el-col :span="12">
      <b>
        {{ $t('field.product.productGroup') }}
      </b>
    </el-col>
    <el-col :span="12" class="label-value">
      <span v-if="isEmptyValue(product.product_group)" class="class-empty-value"> {{ '-' }}</span>
      {{ product.product_group }}
    </el-col>
    <el-col :span="12">
      <b>
        {{ $t('field.product.productClass') }}
      </b>
    </el-col>
    <el-col :span="12" class="label-value">
      <span v-if="isEmptyValue(product.product_class)" class="class-empty-value"> {{ '-' }}</span>
      {{ product.product_class }}
    </el-col>
    <el-col :span="12">
      <b>
        {{ $t('field.product.vendor') }}
      </b>
    </el-col>
    <el-col :span="12" class="label-value">
      <span v-if="isEmptyValue(product.vendor)" class="class-empty-value"> {{ '-' }}</span>
      {{ product.vendor }}
    </el-col>
  </el-row>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'
import store from '@/store'
// Utils and Helper Methods
import { convertBooleanToTranslationLang } from '@/utils/ADempiere/formatValue/booleanFormat'

export default defineComponent({
  name: 'InfoProduct',

  setup() {
    /**
     * Computed
     */

    const product = computed(() => {
      return store.getters.getCurrentProduct
    })

    return {
      product,
      convertBooleanToTranslationLang
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
