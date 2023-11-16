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
  <el-popover
    placement="right-start"
    :title="$t('form.productInfo.productInformation')"
    width="850"
    trigger="click"
  >
    <el-card
      shadow="never"
      :body-style="{ padding: '5px' }"
    >
      <el-row>
        <el-col :span="6">
          <el-skeleton style="width: 240px" :loading="true" animated>
            <template slot="template">
              <el-skeleton-item
                variant="image"
                style="width: 180px; height: 150px;"
              />
            </template>
          </el-skeleton>
        </el-col>
        <el-col :span="18">
          <el-row>
            <el-col :span="14">
              <p style="text-align: left;">
                {{ $t('form.productInfo.code') }}:
                <b>
                  {{ infoLine.product.value }}
                </b>
              </p>
              <p style="text-align: left;">
                {{ $t('form.productInfo.name') }}:
                <b>
                  {{ infoLine.product.name }}
                </b>
              </p><p style="text-align: left;">
                {{ $t('form.productInfo.description') }}:
                <b>
                  {{ infoLine.product.description }}
                </b>
              </p><p style="text-align: left;">
                {{ $t('form.productInfo.UM') }}:
                <b>
                  {{ infoLine.uom.uom.name }}
                </b>
              </p>
            </el-col>
            <el-col :span="10">
              <p style="text-align: right;">
                {{ $t('form.pos.tableProduct.basePrice') }}:
                <b class="info-value-right">
                  {{ formatPrice({ value: infoLine.price_base.value, currency }) }}
                </b>
              </p>
              <p style="text-align: right;">
                {{ $t('form.productInfo.price') }}:
                <b class="info-value-right">
                  {{ formatPrice({ value: infoLine.price.value, currency }) }}
                </b>
              </p>
              <p style="text-align: right;">
                {{ $t('form.pos.tableProduct.taxAmount') }}:
                <b class="info-value-right">
                  {{ infoLine.tax_rate.name }}
                </b>
              </p>
              <p style="text-align: right;">
                {{ $t('form.productInfo.grandTotal') }}:
                <b class="info-value-right">
                  {{ formatPrice({ value: infoLine.total_amount_with_tax.value, currency }) }}
                </b>
              </p>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24">
          <el-divider>
            {{ '1 ' + infoLine.uom.uom.name + ' (' + infoLine.uom.uom.symbol + ') ' + ' ~ ' + displayQuantity(infoLine) + ' ' + infoLine.uom.product_uom.name + ' (' + infoLine.uom.product_uom.symbol + ') ' }}
          </el-divider>
        </el-col>
      </el-row>
    </el-card>
    <el-button
      slot="reference"
      icon="el-icon-info"
      type="primary"
      size="mini"
    />
  </el-popover>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'
// import lang from '@/lang'
import store from '@/store'
// Utils and Helper Methods
import { formatPrice, formatQuantity } from '@/utils/ADempiere/formatValue/numberFormat'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
// import { copyToClipboard } from '@/utils/ADempiere/coreUtils.js'

export default defineComponent({
  name: 'infoLine',
  props: {
    infoLine: {
      type: Object,
      default: () => {}
    }
  },
  setup() {
    const currency = computed(() => {
      const { price_list } = store.getters.getCurrentOrder
      if (!isEmptyValue(price_list)) return price_list.currency.iso_code
      return ''
    })

    function displayQuantity(line) {
      const { uom } = line
      const {
        divide_rate,
        multiply_rate
      } = uom
      if (Number(divide_rate.value) >= Number(multiply_rate.value)) return formatQuantity({ value: divide_rate.value })
      return formatQuantity({ value: multiply_rate.value })
    }
    return {
      currency,
      formatPrice,
      formatQuantity,
      displayQuantity
    }
  }
})
</script>

<style lang="scss" scoped>
.info-value-right {
  float: right;
  margin-left: 15px;
}
</style>
