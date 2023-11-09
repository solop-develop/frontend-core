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
      <span v-if="!isEmptyValue(regionName)" class="field-title-name">
        {{ regionName }}
      </span>
      <span v-else class="field-title-name">
        {{ $t('field.locationsAddress.region') }}
      </span>
    </template>
    <el-select
      v-model="region"
      style="width: 100%;"
      filterable
      clearable
      size="mini"
      :default-first-option="true"
      @visible-change="showRegions"
    >
      <el-option
        v-for="(item, key) in listRegions"
        :key="key"
        :label="item.name"
        :value="item.id"
      />
    </el-select>
  </el-form-item>
</template>

<script>
import { computed, defineComponent } from '@vue/composition-api'

import store from '@/store'

export default defineComponent({
  name: 'Regions',
  setup(props) {
    const listRegions = computed(() => {
      return store.getters.getListRegions
    })

    const regionName = computed(() => {
      const { region_name } = store.getters.getCountries
      return region_name
    })

    const region = computed({
      get() {
        return store.getters.getAttributeFieldLocations({
          attribute: 'regionId'
        })
      },
      // setter
      set(value) {
        store.commit('setAttributeFieldLocations', {
          attribute: 'regionId',
          value
        })
      }
    })

    function showRegions(show) {
      if (!show) return
      store.dispatch('listofRegions')
    }

    return {
      // Computed
      region,
      regionName,
      listRegions,
      // Methods
      showRegions
    }
  }
})
</script>
