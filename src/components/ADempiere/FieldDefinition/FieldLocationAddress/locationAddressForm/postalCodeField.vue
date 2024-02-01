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
    :label="$t('field.locationsAddress.postalCode')"
    class="field-standard"
    style="margin: 0px;width: 100%;"
    :required="isMandatory"
  >
    <el-input
      v-model="currentPostalCode"
      size="mini"
    />
  </el-form-item>
</template>

<script>
import { computed, defineComponent } from '@vue/composition-api'

import store from '@/store'

export default defineComponent({
  name: 'PostalCodeField',

  props: {
    locationAddress: {
      type: Object,
      default: () => {}
    },
    isMandatory: {
      type: Boolean,
      default: false
    }
  },

  setup() {
    const currentPostalCode = computed({
      get() {
        return store.getters.getAttributeFieldLocations({
          attribute: 'postal_code'
        })
      },
      // setter
      set(value) {
        store.commit('setAttributeFieldLocations', {
          attribute: 'postal_code',
          value
        })
      }
    })

    return {
      // Computed
      currentPostalCode
    }
  }
})
</script>
