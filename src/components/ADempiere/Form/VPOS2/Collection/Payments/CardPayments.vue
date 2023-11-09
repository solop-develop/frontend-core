<!--
	ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
	Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A.
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
  <el-card shadow="never" :body-style="{ padding: '5px' }">
    <el-row v-if="!isEmptyValue(payment)">
      <el-col :span="7">
        <el-image
          :src="imageCard(payment)"
          fit="contain"
          style="width: 85px; height: 90px"
        />
      </el-col>
      <el-col
        :span="17"
        style="display: grid;"
      >
        <p style="margin: 5px 0px;">
          <el-button
            v-if="!readonly"
            type="text"
            icon="el-icon-close"
            style="float: right;color: red;padding: 0px;font-size: 18px;"
            :disabled="isLoading"
            :loading="isLoading"
            @click="remove(payment)"
          />
        </p>
        <p style="margin: 1px 0px;">
          <b>
            <span style="float: left;">
              {{ payment.payment_method.name }}
            </span>
            <span style="font-size: 14px;float: right;padding-right: 5px;">
              {{ payment.document_no }}
            </span>
          </b>
        </p>
        <p style="margin: 1px 0px;font-size: 14px;">
          {{ formatDate(payment.payment_date) }}
        </p>
        <p style="margin: 1px 0px;font-size: 16px;text-align: end;padding-right: 5px;">
          <b>
            {{ formatPrice({ value: payment.amount.value, currency: displayCurrency({}) }) }}
          </b>
          <br>
          <b>
            {{ formatPrice({ value: payment.converted_amount.value, currency: displayCurrency({isConver: true, currencyConvert: payment.currency }) }) }}
          </b>
        </p>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import {
  defineComponent,
  computed,
  ref
} from '@vue/composition-api'

import store from '@/store'
// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { formatDate } from '@/utils/ADempiere/valueFormat.js'
import { formatPrice } from '@/utils/ADempiere/formatValue/numberFormat'

export default defineComponent({
  name: 'CardPayments',
  props: {
    payment: {
      type: Object,
      default: {}
    },
    readonly: {
      type: Boolean,
      default: false
    },
    deletePayment: {
      type: Function,
      default: (payment) => {
        console.info('delete Payments', payment)
      }
    }
  },
  setup(props) {
    const isLoading = ref(false)
    const currentOrder = computed(() => {
      return store.getters.getCurrentOrder
    })

    function displayCurrency({
      isConver = false,
      currencyConvert
    }) {
      if (!isConver) {
        const { price_list } = currentOrder.value
        if (isEmptyValue(price_list)) return ''
        return price_list.currency.iso_code
      }
      return currencyConvert.iso_code
    }

    function remove(payment) {
      if (props.deletePayment) {
        isLoading.value = true
        props.deletePayment(payment)
        setTimeout(() => {
          isLoading.value = false
        }, 1000)
        return payment
      }
      const { id } = payment
      isLoading.value = true
      store.dispatch('removePayment', {
        payment_id: id
      })
        .finally(() => {
          isLoading.value = false
        })
      return payment
    }

    function imageCard(payment) {
      const {
        tender_type_code
      } = payment
      let image
      switch (tender_type_code) {
        case 'D':
          image = 'MobilePayment.jpg'
          break
        case 'P':
          image = 'Mobile.jpg'
          break
        case 'X':
          image = 'Cash.jpg'
          break
        case 'A':
          image = 'ACH.jpg'
          break
        case 'M':
          image = 'GiftCard.jpg'
          break
        case 'Z':
          image = 'Zelle.jpg'
          break
        default:
          image = 'Default.jpg'
          break
      }
      return require('@/image/ADempiere/pos/typePayment/' + image)
    }

    return {
      isLoading,
      currentOrder,
      remove,
      imageCard,
      formatDate,
      formatPrice,
      displayCurrency
    }
  }
})
</script>

<style lang="scss" scoped></style>
