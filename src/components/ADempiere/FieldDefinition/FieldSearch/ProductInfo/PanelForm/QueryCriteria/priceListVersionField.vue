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
    :label="$t('field.product.priceListVersion')"
  >
    <el-select
      v-model="currentValue"
      filterable
      clearable
      remote
      :remote-method="remoteSearch"
      @visible-change="loadPriceListVersions"
    >
      <empty-option-select
        :current-value="currentValue"
        :is-allows-zero="false"
      />
      <el-option
        v-for="(option, key) in optionsList"
        :key="key"
        :value="option.values.KeyColumn"
        :label="option.values.DisplayColumn"
      />
    </el-select>
  </el-form-item>
</template>

<script>
import { computed, defineComponent, ref } from '@vue/composition-api'

import store from '@/store'

// API Request Methods
import {
  requestGetPriceListVersion,
  requestListPricesListVersions
} from '@/api/ADempiere/field/search/product.ts'

// Components and Mixins
import EmptyOptionSelect from '@/components/ADempiere/FieldDefinition/FieldSelect/emptyOptionSelect.vue'

// Utils and Helper Methods
import { isEmptyValue, getTypeOfValue } from '@/utils/ADempiere/valueUtils'
import { getValidDate } from '@/utils/ADempiere/formatValue/dateFormat'

export default defineComponent({
  name: 'PriceListVersionField',

  components: {
    EmptyOptionSelect
  },

  props: {
    uuidForm: {
      required: true,
      type: String
    },
    parentUuid: {
      type: String,
      default: undefined
    },
    containerUuid: {
      required: false,
      type: String
    }
  },

  setup(props) {
    const ATTRIBUTE_KEY = 'price_list_version_id'

    const lastPriceListVersion = ref({})

    const optionsList = ref([])

    const priceListId = computed(() => {
      const value = store.getters.getValueOfField({
        parentUuid: props.parentUuid,
        // containerUuid: props.containerUuid,
        columnName: 'M_PriceList_ID'
      })
      return value
    })

    const dateOrdered = computed(() => {
      let dateValue = store.getters.getValueOfFieldOnParent({
        parentUuid: props.parentUuid,
        // containerUuid: props.containerUuid,
        columnName: 'DateOrdered'
      })
      // types `decimal` and `date` is a object struct
      if ((getTypeOfValue(dateValue) === 'OBJECT') && !isEmptyValue(dateValue.type)) {
        dateValue = dateValue.value
      }
      if (isEmptyValue(dateValue)) {
        return undefined
      }
      return getValidDate(dateValue)
    })

    const dateInvoiced = computed(() => {
      let dateValue = store.getters.getValueOfFieldOnParent({
        parentUuid: props.parentUuid,
        // containerUuid: props.containerUuid,
        columnName: 'DateInvoiced'
      })
      // types `decimal` and `date` is a object struct
      if ((getTypeOfValue(dateValue) === 'OBJECT') && !isEmptyValue(dateValue.type)) {
        dateValue = dateValue.value
      }
      if (isEmptyValue(dateValue)) {
        return undefined
      }
      return getValidDate(dateValue)
    })

    const currentValue = computed({
      set(newValue) {
        if (isEmptyValue(newValue)) newValue = -1
        store.commit('setProductSearchFieldQueryFilterByAttribute', {
          containerUuid: props.uuidForm,
          attributeKey: ATTRIBUTE_KEY,
          value: newValue
        })
      },
      get() {
        return store.getters.getProductSearchFieldQueryFilterByAttribute({
          containerUuid: props.uuidForm,
          attributeKey: ATTRIBUTE_KEY
        })
      }
    })

    function getLastPriceListVersion() {
      requestGetPriceListVersion({
        priceListId: priceListId.value,
        dateOrdered: dateOrdered.value,
        dateInvoiced: dateInvoiced.value
      })
        .then(response => {
          if (isEmptyValue(response) || response.id <= 0) {
            lastPriceListVersion.value = {}
            currentValue.value = -1
          } else {
            lastPriceListVersion.value = response
            if (isEmptyValue(optionsList.value)) {
              optionsList.value.push(
                response
              )
            } else {
              const isExists = optionsList.value.some(optionItem => {
                return optionItem.id === response.id
              })
              if (!isExists) {
                optionsList.value.push(
                  response
                )
              }
            }
            currentValue.value = response.id
          }
        })
    }

    function setList(response) {
      const list = response.records

      // Add current last price list
      if (!isEmptyValue(lastPriceListVersion.value)) {
        const isExists = list.some(optionItem => {
          return optionItem.id === lastPriceListVersion.value.id
        })
        if (!isExists) {
          list.push(
            lastPriceListVersion.value
          )
        }
      }

      optionsList.value = list
    }

    function loadPriceListVersions(isShowList) {
      if (!isShowList) {
        return
      }
      requestListPricesListVersions({
      })
        .then(setList)
    }

    function remoteSearch(searchValue) {
      requestListPricesListVersions({
        searchValue
      })
        .then(setList)
    }

    if (!isEmptyValue(priceListId.value) && priceListId.value > 0) {
      getLastPriceListVersion()
    }

    return {
      lastPriceListVersion,
      optionsList,
      //
      currentValue,
      priceListId,
      //
      loadPriceListVersions,
      remoteSearch
    }
  }
})
</script>
