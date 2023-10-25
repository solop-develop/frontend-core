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
  <el-form-item
    :label="$t('pointOfSales.collection.field.paymentMethods')"
    class="form-item-criteria"
    style="margin: 0px;width: 100%;"
  >
    <el-select
      v-model="currentPaymentMethod"
      style="width: 100% !important;"
      @change="handleChange"
    >
      <el-option
        v-for="item in listPaymentMethods"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      />
    </el-select>
  </el-form-item>
</template>

<script>
import { computed, defineComponent } from '@vue/composition-api'

import store from '@/store'
// Utils and Helper Methods
import { getMainPaymentMethods } from '@/utils/ADempiere/dictionary/form/VPOS'
// import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
export default defineComponent({
  name: 'FieldPaymentMethods',
  props: {
    handleChange: {
      type: Function,
      default: (changeValue) => {
        console.info('Triggers when input value changes (value: string | number)', changeValue)
      }
    }
  },
  setup(props) {
    // store.dispatch('availablePaymentMethods')
    // getMainPaymentMethods({ listPaymentMethods: payment_methods })
    const listPaymentMethods = computed(() => {
      let listPaymentMethods
      if (typeOptions.value === '2') {
        listPaymentMethods = store.getters.getListPaymentMethods.filter(list => list.is_allowed_to_refund_open)
        store.commit('setAttributeField', {
          field: 'fieldsRefunds',
          attribute: 'paymentMethods',
          value: listPaymentMethods[0]
        })
        return listPaymentMethods
      }
      listPaymentMethods = store.getters.getListPaymentMethods.filter(list => list.is_allowed_to_refund)
      store.commit('setAttributeField', {
        field: 'fieldsRefunds',
        attribute: 'paymentMethods',
        value: getMainPaymentMethods({ listPaymentMethods })
      })
      return listPaymentMethods
    })

    const typeOptions = computed(() => {
      return store.getters.getAttributeField({
        field: 'fieldsRefunds',
        attribute: 'typeOptions'
      })
    })

    const currentPaymentMethod = computed({
      get() {
        const paymentMethods = store.getters.getAttributeField({
          field: 'fieldsRefunds',
          attribute: 'paymentMethods'
        })
        if (paymentMethods) return paymentMethods.id
        return ''
      },
      // setter
      set(paymentMethods) {
        if (paymentMethods) {
          paymentMethods = listPaymentMethods.value.find(list => list.id === paymentMethods)
        }
        store.commit('setAttributeField', {
          field: 'fieldsRefunds',
          attribute: 'paymentMethods',
          value: paymentMethods
        })
      }
    })
    return {
      currentPaymentMethod,
      listPaymentMethods,
      typeOptions
    }
  }
})
</script>
