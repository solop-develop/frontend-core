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
    :label="$t('pointOfSales.collection.field.phone')"
    class="form-item-criteria"
    style="margin: 0px;width: 100%;"
  >
    <el-input
      v-model="phone"
      :disabled="!isEmptyValue(currentAccount)"
      style="width: 100%;"
    />
  </el-form-item>
</template>

<script>
import { computed, defineComponent } from '@vue/composition-api'

import store from '@/store'
// import { isEmptyValue } from '@/utils/ADempiere'

export default defineComponent({
  name: 'Phone',
  props: {
    isRefund: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const phone = computed({
      get() {
        return store.getters.getAttributeField({
          field: 'fieldsRefunds',
          attribute: 'phone'
        })
      },
      // setter
      set(value) {
        store.commit('setAttributeField', {
          field: 'fieldsRefunds',
          attribute: 'phone',
          value
        })
      }
    })

    const currentAccount = computed(() => {
      return store.getters.getAttributeField({
        field: 'fieldsRefunds',
        attribute: 'currentAccount'
      })
    })

    return {
      phone,
      currentAccount
    }
  }
})
</script>
