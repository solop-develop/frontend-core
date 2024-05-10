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
        {{ regionTitle }}
      </span>
      <span v-if="isMandatory" style="color: #f34b4b"> * </span>
    </template>

    <el-select
      v-model="currentRegionId"
      style="width: 100%;"
      filterable
      clearable
      size="mini"
      :default-first-option="true"
      @visible-change="showRegions"
      @change="changeRegion()"
    >
      <empty-option-select
        :current-value="currentRegionId"
        :is-allows-zero="false"
      />
      <el-option
        v-for="(item, key) in regionsList"
        :key="key"
        :label="item.name"
        :value="item.id"
      />
    </el-select>
  </el-form-item>
</template>

<script>
import { computed, defineComponent } from '@vue/composition-api'

import lang from '@/lang'
import store from '@/store'

// Components and Mixins
import EmptyOptionSelect from '@/components/ADempiere/FieldDefinition/FieldSelect/emptyOptionSelect.vue'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere'

export default defineComponent({
  name: 'RegionsListField',

  components: {
    EmptyOptionSelect
  },

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

  setup(props) {
    const currentCountryId = computed(() => {
      return store.getters.getAttributeFieldLocations({
        attribute: 'country_id'
      })
    })

    const regionTitle = computed(() => {
      const countryDefinition = store.getters.getStoredCountryDefinition(
        currentCountryId.value
      )
      if (!isEmptyValue(countryDefinition)) {
        const { region_name } = countryDefinition
        if (!isEmptyValue(region_name)) {
          return region_name
        }
      }
      return lang.t('field.locationsAddress.region')
    })
    const storedRegionsList = computed(() => {
      return store.getters.getListRegions
    })

    const regionsList = computed(() => {
      const list = storedRegionsList.value
      if (!isEmptyValue(list)) {
        return list
      }
      // fill list with current address values
      const storedLocation = props.locationAddress
      if (!isEmptyValue(storedLocation) && storedLocation.id > 0) {
        return [{
          id: storedLocation.region_id,
          name: storedLocation.region_name
        }]
      }
      return []
    })

    const currentRegionId = computed({
      get() {
        return store.getters.getAttributeFieldLocations({
          attribute: 'region_id'
        })
      },
      // setter
      set(value) {
        store.commit('setAttributeFieldLocations', {
          attribute: 'region_id',
          value
        })
      }
    })

    function changeRegion() {
      const region = regionsList.value.find(item => item.id === currentRegionId.value)
      if (!isEmptyValue(region)) {
        const regionName = region.name
        store.commit('setAttributeFieldLocations', {
          attribute: 'region_name',
          value: regionName
        })
      } else {
        return
      }
    }

    function showRegions(show) {
      if (!show) {
        return
      }
      store.dispatch('getRegionsListFromServer')
    }

    return {
      // Computed
      currentRegionId,
      regionTitle,
      regionsList,
      changeRegion,
      // Methods
      showRegions
    }
  }
})
</script>
