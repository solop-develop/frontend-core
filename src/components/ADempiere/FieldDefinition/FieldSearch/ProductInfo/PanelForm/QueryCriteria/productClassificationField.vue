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
    :label="$t('field.product.productClassification')"
  >
    <el-select
      v-model="currentValue"
      filterable
      remote
      clearable
      :remote-method="remoteSearch"
      @visible-change="loadProductClassifications"
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
import { requestListProductClassifications } from '@/api/ADempiere/fields/search/product.ts'

// Components and Mixins
import EmptyOptionSelect from '@/components/ADempiere/FieldDefinition/FieldSelect/emptyOptionSelect.vue'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'ProductClassificationField',

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
    const ATTRIBUTE_KEY = 'product_classification_id'

    const optionsList = ref([])

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

    function loadProductClassifications(isShowList) {
      if (!isShowList) {
        return
      }
      requestListProductClassifications({
        pageSize: 100
      })
        .then(response => {
          optionsList.value = response.records
        })
    }

    function remoteSearch(searchValue) {
      requestListProductClassifications({
        searchValue,
        pageSize: 100
      })
        .then(response => {
          optionsList.value = response.records
        })
    }

    return {
      optionsList,
      //
      currentValue,
      //
      loadProductClassifications,
      remoteSearch
    }
  }
})
</script>
