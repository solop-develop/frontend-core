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
  <el-form-item
    :label="$t('field.invoice.grandTotal')"
    style="align-items: center;"
  >
    <div style="display: flex;">
      <el-input-number
        v-model="grandTotalFieldFrom"
        controls-position="right"
        :precision="2"
        clearable
      />
      <b style="color: #c0c4cc;padding: 0px 5px;font-weight: bold;">
        —
      </b>
      <el-input-number
        v-model="grandTotalFieldTo"
        controls-position="right"
        :precision="2"
        clearable
      />
    </div>
  </el-form-item>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

import store from '@/store'

export default defineComponent({
  name: 'GrandTotalField',
  props: {
    uuidForm: {
      required: true,
      type: String
    }
  },
  setup(props) {
    const grandTotalFieldFrom = computed({
      set(newValue) {
        store.commit('setInvoiceFieldQueryFilterByAttribute', {
          containerUuid: props.uuidForm,
          attributeKey: 'grandTotalFrom',
          value: newValue
        })
      },
      get() {
        return store.getters.getInvoicesQueryFilterByAttribute({
          containerUuid: props.uuidForm,
          attributeKey: 'grandTotalFrom'
        })
      }
    })

    const grandTotalFieldTo = computed({
      set(newValue) {
        store.commit('setInvoiceFieldQueryFilterByAttribute', {
          containerUuid: props.uuidForm,
          attributeKey: 'grandTotalTo',
          value: newValue
        })
      },
      get() {
        return store.getters.getInvoicesQueryFilterByAttribute({
          containerUuid: props.uuidForm,
          attributeKey: 'grandTotalTo'
        })
      }
    })

    return {
      grandTotalFieldFrom,
      grandTotalFieldTo
    }
  }
})
</script>
