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
    class="field-standard"
    style="margin: 0px;width: 100%;"
  >
    <template slot="label">
      <span class="field-title-name" style="color:#606266 !important">
        {{ $t('field.locationsAddress.city') }}
      </span>
      <span v-if="isMandatory" style="color: #f34b4b"> * </span>
    </template>
    <el-input
      v-model="currentCityName"
      size="mini"
    />
  </el-form-item>
</template>

<script>
import { computed, defineComponent } from '@vue/composition-api'

import store from '@/store'

export default defineComponent({
  name: 'CityNameField',

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
    const currentCityName = computed({
      get() {
        return store.getters.getAttributeFieldLocations({
          attribute: 'city'
        })
      },
      // setter
      set(value) {
        store.commit('setAttributeFieldLocations', {
          attribute: 'city',
          value
        })
      }
    })

    return {
      // Computed
      currentCityName
    }
  }
})
</script>

<style lang="scss">
.field-title-name {
  color: #909399 !important;
  &:hover {
    color: #303133 !important;
  }
}
</style>
