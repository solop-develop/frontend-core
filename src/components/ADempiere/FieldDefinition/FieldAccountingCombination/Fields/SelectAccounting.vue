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
    :label="titleField"
    class="form-item-criteria"
    style="margin: 0px;width: 100%;"
  >
    <el-select
      v-model="displayValue"
      clearable
      filterable
      :placeholder="titleField"
      :filter-method="filterSearch"
      style="margin: 0px;width: 100%;"
    >
      <el-option
        v-for="item in optionsList"
        :key="item.id"
        :label="item.displayColumn"
        :value="item.id"
      />
    </el-select>
  </el-form-item>
</template>

<script>
import {
  defineComponent,
  computed,
  ref
} from '@vue/composition-api'

import store from '@/store'
// Api
import { listAccoutingElementValues } from '@/api/ADempiere/field/generalGedger'
import { isEmptyValue } from '@/utils/ADempiere'

export default defineComponent({
  name: 'SelectAccounting',
  props: {
    metadata: {
      type: Object,
      default: {}
    },
    defaultValue: {
      type: Object,
      default: () => {}
    }
  },
  setup(props) {
    // Ref
    const isLoading = ref(false)
    const timeOut = ref(null)
    const optionsList = ref([])
    const displayValue = ref(props.metadata.value)
    // Computed
    const titleField = computed(() => {
      return props.metadata.name
    })

    const accoutingSchemaId = computed(() => {
      const sessionContext = store.getters.getAllSessionContext
      return sessionContext['$C_AcctSchema_ID']
    })

    const value = computed(() => {
      return props.metadata.value
    })

    // Methods

    /**
     * Load Display
     */

    /**
     * Filters Remote Search
     * @param {String} searchQuery
     */

    function filterSearch(searchQuery) {
      clearTimeout(timeOut.value)
      timeOut.value = setTimeout(() => {
        let attributes
        if (!isEmptyValue(props.metadata.contextColumnNames)) {
          attributes = props.metadata.contextColumnNames.map(list => {
            return JSON.stringify({
              [list]: store.getters.getValueOfField({
                containerUuid: props.metadata.containerUuid,
                columnName: list
              })
            })
          }).toString()
        }
        listAccoutingElementValues({
          accoutingSchemaId: accoutingSchemaId.value,
          elementType: props.metadata.elementType,
          searchValue: searchQuery,
          contextAttributes: attributes
        })
          .then(response => {
            const { records } = response
            if (isEmptyValue(records)) return
            optionsList.value = records.map(list => {
              return {
                ...list,
                displayColumn: list.values.DisplayColumn
              }
            })
            if (!isEmptyValue(optionsList.value) && optionsList.value.length <= 1) {
              displayValue.value = optionsList.value[0].id
            }
          })
      }, 500)
      return
    }

    function loadSearch(searchQuery) {
      clearTimeout(timeOut.value)
      timeOut.value = setTimeout(() => {
        let attributes
        if (!isEmptyValue(props.metadata.contextColumnNames)) {
          attributes = props.metadata.contextColumnNames.map(list => {
            return JSON.stringify({
              [list]: store.getters.getValueOfField({
                containerUuid: props.metadata.containerUuid,
                columnName: list
              })
            })
          }).toString()
        }
        listAccoutingElementValues({
          accoutingSchemaId: accoutingSchemaId.value,
          elementType: props.metadata.elementType,
          searchValue: searchQuery,
          contextAttributes: attributes
        })
          .then(response => {
            const { records } = response
            if (isEmptyValue(records)) return
            optionsList.value = records.map(list => {
              return {
                ...list,
                displayColumn: list.values.DisplayColumn
              }
            })
            if (!isEmptyValue(optionsList.value) && optionsList.value.length <= 1) {
              displayValue.value = optionsList.value[0].id
            }
          })
      }, 500)
      return
    }

    if (!isEmptyValue(props.defaultValue['DisplayColumn_' + props.metadata.columnName])) {
      loadSearch(props.defaultValue['DisplayColumn_' + props.metadata.columnName])
    }

    return {
      // Ref
      isLoading,
      optionsList,
      displayValue,
      // Computed
      value,
      titleField,
      accoutingSchemaId,
      // Methods
      filterSearch
    }
  }
})
</script>
