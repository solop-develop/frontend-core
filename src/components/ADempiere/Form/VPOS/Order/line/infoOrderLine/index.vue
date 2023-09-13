<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com https://github.com/EdwinBetanc0urt
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
  <el-popover
    v-model="showOpenImage"
    v-shortkey="shortsKey"
    popper-class="el-popper-info"
    placement="right-start"
    trigger="click"
    width="300"
    @shortkey.native="keyAction"
  >
    {{ (isEmptyValue(recordRow.product.value) ? $t('form.productInfo.chargerInformation') : $t('form.productInfo.productInformation')) }}
    <el-form
      :ref="recordRow.id"
      label-position="top"
      style="float: right;display: contents;line-height: 30px;"
      @submit.native.prevent="notSubmitForm"
    >
      <el-row style="margin: 10px!important;">
        <el-col :span="6">
          <image-product
            style="margin-right: 13px;"
            :show="showOpenImage"
            :metadata-line="recordRow"
          />
        </el-col>

        <el-col :span="10">
          <span v-if="!isEmptyValue(recordRow.product.value)">{{ $t('form.productInfo.code') }}: <b>{{ recordRow.product.value }}</b><br> </span>
          {{ $t('form.productInfo.name') }}: <b>{{ (isEmptyValue(recordRow.product.name) ? recordRow.charge.name : recordRow.product.name) }}</b><br>
          {{ $t('form.productInfo.description') }}: <b>{{ (isEmptyValue(recordRow.product.description) ? recordRow.charge.description : recordRow.product.description) }}</b><br>
          {{ $t('form.productInfo.UM') }}: <b>{{ recordRow.uom.uom.name }}</b><br>
        </el-col>

        <el-col :span="8">
          <div style="float: right; text-align: end;">
            {{ $t('form.pos.tableProduct.basePrice') }}:
            <b>{{ formatPrice({ value: recordRow.priceBase, currency: pointOfSalesCurrency.iSOCode }) }}</b>
            <br>
            {{ $t('form.productInfo.price') }}:
            <b>{{ formatPrice({ value: recordRow.priceActual, currency: pointOfSalesCurrency.iSOCode }) }}</b>
            <br>
            <b>{{ recordRow.taxRate.name }}</b>
            <br>
            {{ $t('form.productInfo.grandTotal') }}:
            <b>{{ formatPrice({ value: recordRow.totalAmountWithTax, currency: pointOfSalesCurrency.iSOCode }) }}</b>
          </div>
        </el-col>
        <el-col :span="24">
          <el-divider>
            {{ '1 ' + recordRow.uom.uom.name + ' (' + recordRow.uom.uom.symbol + ') ' + ' ~ ' + formatQuantity({ value: (recordRow.uom.divide_rate >= recordRow.uom.multiply_rate) ? recordRow.uom.divide_rate : recordRow.uom.multiply_rate }) + ' ' + recordRow.uom.product_uom.name + ' (' + recordRow.uom.product_uom.symbol + ') ' }}
          </el-divider>
        </el-col>
        <el-col :span="8">
          {{ $t('form.pos.tableProduct.quantity') }}: <b>{{ formatQuantity({ value: recordRow.quantity }) }}</b>
        </el-col>
        <el-col :span="8">
          {{ $t('form.productInfo.UM') }}: <b>{{ recordRow.uom.uom.name }}</b>
        </el-col>
        <el-col :span="8">
          {{ $t('form.pos.tableProduct.baseQuantity') }}: <b>{{ formatQuantity({ value: recordRow.quantityOrderedLine }) }}</b>
        </el-col>
      </el-row>
    </el-form>

    <el-button
      slot="reference"
      type="primary"
      icon="el-icon-info"
      size="mini"
      style="margin-right: 3%;"
      @click="showInfoLine()"
    />
  </el-popover>
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'

import store from '@/store'

import ImageProduct from '@/components/ADempiere/Form/VPOS/Order/line/infoOrderLine/imageProduct.vue'

import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { formatPrice, formatQuantity } from '@/utils/ADempiere/formatValue/numberFormat'

export default defineComponent({
  name: 'InfoOrderLine',

  components: {
    ImageProduct
  },

  props: {
    recordRow: {
      type: Object,
      default: () => {}
    }
  },

  setup(props) {
    const showOpenImage = ref(false)
    const currentPointOfSales = computed(() => {
      return store.getters.posAttributes.currentPointOfSales
    })

    // Currency Point Of Sales
    const pointOfSalesCurrency = computed(() => {
      // const currency = this.currentPointOfSales
      if (!isEmptyValue(currentPointOfSales.value.priceList)) {
        return {
          ...currentPointOfSales.value.priceList.currency,
          amountConvertion: 1
        }
      }
      return {
        uuid: '',
        iSOCode: '',
        curSymbol: '',
        amountConvertion: 1
      }
    })

    const shortsKey = computed(() => {
      return {
        close: ['esc']
      }
    })

    function showInfoLine() {
      store.commit('setLine', props.recordRow)
    }

    function closeInfo() {
      showOpenImage.value = false
    }

    function keyAction(event) {
      switch (event.srcKey) {
        case 'close':
          closeInfo()
          break
      }
    }

    return {
      showOpenImage,
      shortsKey,
      pointOfSalesCurrency,
      formatPrice,
      formatQuantity,
      keyAction,
      showInfoLine
    }
  }
})
</script>
