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
    v-if="!isEmptyValue(bPartnerField)"
    style="width: 100%;"
  >
    <template slot="label">
      {{ bPartnerField.name }}
      <span style="color: #f34b4b"> * </span>
    </template>

    <el-select
      v-model="currentBPartner"
      remote
      clearable
      filterable
      reserve-keyword
      style="width: 100%;"
      :loading="loadingBPartner"
      :placeholder="bPartnerField.name"
      :remote-method="remoteMethodBPartner"
      @visible-change="findBusinessPartners"
    >
      <el-option
        v-for="item in optionsBPartner"
        :key="item.id"
        :label="item.label"
        :value="item.id"
      />
    </el-select>
  </el-form-item>
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'

import store from '@/store'

// API Request Methods
import {
  listBusinessPartners
} from '@/api/ADempiere/form/VAllocation.ts'

// Utils and Helper Methods
import { createFieldFromDictionary } from '@/utils/ADempiere/lookupFactory'

export default defineComponent({
  name: 'BusinessPartner',

  props: {
    metadata: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },

  setup(props) {
    const timeOut = ref(null)

    const bPartnerField = ref({})
    const optionsBPartner = ref([])
    const loadingBPartner = ref(false)

    const currentBPartner = computed({
      // getter
      get() {
        const { businessPartnerId } = store.getters.getSearchFilter
        return businessPartnerId
      },
      // setter
      set(id) {
        store.commit('updateAttributeCriteriaVallocation', {
          attribute: 'businessPartnerId',
          criteria: 'searchCriteria',
          value: id
        })
        // store.commit('setBusinessPartner', id)
      }
    })

    function remoteMethodBPartner(searchValue) {
      if (searchValue !== '') {
        clearTimeout(timeOut.value)
        timeOut.value = setTimeout(() => {
          loadingBPartner.value = true
          listBusinessPartners({
            searchValue
          })
            .then(response => {
              const { records } = response
              optionsBPartner.value = records.map(business => {
                return {
                  ...business,
                  label: business.values.DisplayColumn
                }
              })
            })
            .finally(() => {
              loadingBPartner.value = false
            })
        }, 200)
      }
    }

    function findBusinessPartners(isFind, searchValue) {
      if (!isFind) {
        return
      }
      loadingBPartner.value = true
      listBusinessPartners({
        searchValue
      })
        .then(response => {
          const { records } = response
          optionsBPartner.value = records.map(business => {
            return {
              ...business,
              label: business.values.DisplayColumn
            }
          })
        })
        .finally(() => {
          loadingBPartner.value = false
        })
    }

    function createField() {
      createFieldFromDictionary({
        containerUuid: props.metadata.containerUuid,
        // elementColumnName: 'C_BPartner_ID',
        columnId: 3499, // C_Invoice.C_BPartner_ID
        overwriteDefinition: {
          containerUuid: props.metadata.containerUuid
        }
      })
        .then(response => {
          bPartnerField.value = response
        }).catch(error => {
          console.warn(`LookupFactory: Get Field From Server (State) - Error ${error.code}: ${error.message}.`)
        })
    }

    createField()

    return {
      // refs
      bPartnerField,
      loadingBPartner,
      optionsBPartner,
      // computeds
      currentBPartner,
      // methods
      remoteMethodBPartner,
      findBusinessPartners
    }
  }
})
</script>

