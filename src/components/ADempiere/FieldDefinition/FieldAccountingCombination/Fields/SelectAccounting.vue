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
    class="form-item-criteria"
    style="margin: 0px;width: 100%;"
  >
    <template slot="label">.
      <!-- <span class="field-title-name">
        {{ titleField }}
      </span> -->
      {{ titleField }}
      <span v-if="metadata.is_mandatory" style="color: #f34b4b"> * </span>
    </template>
    <el-select
      v-model="displayValue"
      clearable
      filterable
      size="mini"
      :placeholder="titleField"
      :filter-method="filterSearch"
      style="margin: 0px;width: 100%;"
      :loading="isLoading"
      @change="changeSelect"
      @visible-change="showList"
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

// API Request Methods
import { listAccoutingElementValues } from '@/api/ADempiere/fields/generalGedger'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

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
    },
    handleChange: {
      type: Function,
      default: () => {
        console.info('implement change size page number method')
      }
    }
  },

  setup(props) {
    // Ref
    const isLoading = ref(false)
    const timeOut = ref(null)
    const optionsList = ref([])
    const displayValue = ref(props.metadata.value)
    const filters = ref({})
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

    // const displayValue = computed({
    //   get() {
    //     return store.getters.getFieldsValue(props.metadata.column_name)
    //   },
    //   // setter
    //   set(value) {
    //     store.commit('setFieldsValue', {
    //       columnName: props.metadata.column_name,
    //       value
    //     })
    //   }
    // })

    // Methods

    /**
     * Load Display
     */

    function showList(isShow) {
      if (isShow && isEmptyValue(optionsList.value)) filterSearch(displayValue.value)
    }

    /**
     * Filters Remote Search
     * @param {String} searchQuery
     */

    function filterSearch(searchQuery) {
      clearTimeout(timeOut.value)
      timeOut.value = setTimeout(() => {
        let attributes
        if (!isEmptyValue(props.metadata.context_column_names)) {
          attributes = props.metadata.context_column_names.map(list => {
            return JSON.stringify({
              [list]: store.getters.getValueOfField({
                containerUuid: props.metadata.containerUuid,
                columnName: list
              })
            })
          }).toString()
        }
        isLoading.value = true
        listAccoutingElementValues({
          accoutingSchemaId: accoutingSchemaId.value,
          elementType: props.metadata.element_type,
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
            isLoading.value = false
            // if (!isEmptyValue(optionsList.value) && optionsList.value.length <= 1) {
            //   displayValue.value = optionsList.value[0].id
            // }
          })
          .catch(() => {
            isLoading.value = false
          })
      }, 500)
      return
    }

    function loadSearch(searchQuery) {
      clearTimeout(timeOut.value)
      timeOut.value = setTimeout(() => {
        let attributes
        if (!isEmptyValue(props.metadata.context_column_names)) {
          attributes = props.metadata.context_column_names.map(list => {
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
          elementType: props.metadata.element_type,
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

    function changeSelect(value) {
      store.dispatch('changeIsloaded', true)
      store.commit('setFieldsValue', {
        columnName: props.metadata.column_name,
        value
      })
      store.dispatch('changeAttributes', {
        columnName: props.metadata.column_name,
        value
      })
      if (props.metadata.column_name !== 'AD_Org_ID' && props.metadata.column_name !== 'Account_ID') {
        if (isEmptyValue(value)) {
          delete filters.value[props.metadata.column_name]
        } else {
          filters.value[props.metadata.column_name] = value
        }
        store.commit('setFiltersAccount', filters.value)
      }
      setTimeout(() => {
        store.dispatch('changeIsloaded', false)
      }, 500)
    }

    if (!isEmptyValue(props.defaultValue['DisplayColumn_' + props.metadata.column_name])) {
      loadSearch(props.defaultValue['DisplayColumn_' + props.metadata.column_name])
    }

    return {
      // Ref
      filters,
      isLoading,
      optionsList,
      displayValue,
      // Computed
      value,
      titleField,
      accoutingSchemaId,
      // Methods
      showList,
      changeSelect,
      filterSearch
    }
  }
})
</script>
