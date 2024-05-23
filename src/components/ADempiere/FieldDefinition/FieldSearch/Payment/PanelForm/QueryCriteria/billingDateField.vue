<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
  Contributor(s): Elsio Sanchez elsiosanches@gmail.com https://github.com/elsiosanchez
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
    :label="$t('field.payment.transactionDate')"
    style="align-items: center;"
  >
    <div class="date-picker-container">
      <el-date-picker
        v-model="billingDateFieldFrom"
        type="date"
        placeholder="Select date and time"
      />
      <b style="color: #c0c4cc;padding: 0px 5px;font-weight: bold;">
        —
      </b>
      <el-date-picker
        v-model="billingDateFieldTo"
        type="date"
        placeholder="Select date and time"
      />
    </div>
  </el-form-item>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

import store from '@/store'

export default defineComponent({
  name: 'BillingDateField',
  props: {
    uuidForm: {
      required: true,
      type: String
    }
  },
  setup(props) {
    const billingDateFieldFrom = computed({
      set(newValue) {
        store.commit('setPaymentFieldQueryFilterByAttribute', {
          containerUuid: props.uuidForm,
          attributeKey: 'invoiceDateFrom',
          value: newValue
        })
      },
      get() {
        return store.getters.getPaymentQueryFilterByAttribute({
          containerUuid: props.uuidForm,
          attributeKey: 'invoiceDateFrom'
        })
      }
    })

    const billingDateFieldTo = computed({
      set(newValue) {
        store.commit('setPaymentFieldQueryFilterByAttribute', {
          containerUuid: props.uuidForm,
          attributeKey: 'invoiceDateTo',
          value: newValue
        })
      },
      get() {
        return store.getters.getPaymentQueryFilterByAttribute({
          containerUuid: props.uuidForm,
          attributeKey: 'invoiceDateTo'
        })
      }
    })

    return {
      billingDateFieldFrom,
      billingDateFieldTo
    }
  }
})
</script>
  <style scoped>
  .date-picker-container {
    display: flex
  }
  </style>
