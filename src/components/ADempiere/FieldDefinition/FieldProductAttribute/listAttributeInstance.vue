<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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
  <el-main
    v-shortkey="shortsKey"
    class="product-attributes-list-container"
    style="padding-top: 0px"
    @shortkey.native="keyAction"
  >

    <el-form
      v-shortkey="shortsKey"
      label-position="top"
      size="small"
      class="form-min-label"
      @submit.native.prevent="notSubmitForm"
      @shortkey.native="keyAction"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item :label="$t('field.productAttribute.searchValue')">
            <el-input
              v-model="searchValue"
              style="width: 100%;"
              clearable
              @input="listWithSearchValue"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-row :gutter="0">
      <el-col :span="24">
        <el-table
          :data="listDataAttribute"
          height="250"
          stripe
          fit
          size="mini"
          style="width: 100%"
          @row-click="selectAttribute"
          @row-dblclick="selectValue"
        >
          <index-column
            :page-number="1"
            :page-size="ROWS_OF_RECORDS_BY_PAGE"
          />

          <el-table-column
            prop="description"
            :label="$t('field.productAttribute.description')"
            width="300"
          >
            <template slot-scope="scope">
              {{ scope.row.description }}
            </template>
          </el-table-column>
          <el-table-column
            prop="lot"
            :label="$t('field.productAttribute.lot')"
          >
            <template slot-scope="scope">
              {{ scope.row.lot }}
            </template>
          </el-table-column>
          <el-table-column
            prop="serial"
            :label="$t('field.productAttribute.serial')"
          >
            <template slot-scope="scope">
              {{ scope.row.serial }}
            </template>
          </el-table-column>
        </el-table>
      </el-col>

      <el-col :span="24" class="product-attributes-list-footer">
        <samp style="float: right; padding-top: 4px;">
          <el-button
            :loading="isLoadingRecords"
            type="success"
            class="button-base-icon"
            icon="el-icon-refresh-right"
            size="small"
            @click="listProductAttributesSetInstances();"
          />
          <el-button
            type="danger"
            class="button-base-icon"
            icon="el-icon-close"
            @click="clearValues(); close()"
          />
          <el-button
            type="primary"
            class="button-base-icon"
            icon="el-icon-check"
            @click="setValues(currentSelectAttributes); close()"
          />
        </samp>
      </el-col>
    </el-row>
  <!-- </el-form> -->
  </el-main>
</template>

<script>
import { defineComponent, computed, ref, onMounted } from '@vue/composition-api'

import store from '@/store'

// Components and Mixins
import IndexColumn from '@/components/ADempiere/DataTable/Components/IndexColumn.vue'

// Constants
import { ROWS_OF_RECORDS_BY_PAGE } from '@/utils/ADempiere/tableUtils'

// API Request Methods
import {
  requestListProductAttributesSetInstances
} from '@/api/ADempiere/field/productAttribute'

import useProductAttribute from './useProductAttribute.js'

export default defineComponent({
  name: 'ListAttributeInstance',

  components: {
    IndexColumn
  },

  props: {
    parentUuid: {
      type: String,
      default: undefined
    },
    containerUuid: {
      type: String,
      required: true
    },
    containerManager: {
      type: Object,
      required: true
    },
    metadata: {
      type: Object,
      required: true
    }
  },

  setup(props) {
    const {
      productId,
      clearValues,
      setValues,
      close
    } = useProductAttribute({
      parentUuid: props.parentUuid,
      containerUuid: props.containerUuid,
      containerManager: props.containerManager,
      fieldAttributes: props.metadata
    })

    const listDataAttribute = ref([])
    const timeOutSearch = ref(null)
    const isLoadingRecords = ref(false)
    const currentSelectAttributes = ref({})

    const searchValue = ref('')

    const shortsKey = computed(() => {
      return {
        close: ['esc'],
        refreshList: ['f5']
      }
    })

    function keyAction(event) {
      switch (event.srcKey) {
        case 'refreshList':
          /**
           * TODO: When refreshing you are making 2 list requests, you can be the
           * observer that activates the second request
          */
          listProductAttributesSetInstances()
          break

        case 'close':
          close()
          break
      }
    }

    function selectAttribute(row, column, event) {
      store.commit('setCurrentProductAttribute', row)
      currentSelectAttributes.value = row
    }

    function selectValue(row) {
      setValues(row)
      close()
    }

    function listProductAttributesSetInstances() {
      isLoadingRecords.value = true
      requestListProductAttributesSetInstances({
        productId: productId.value,
        searchValue: searchValue.value
      })
        .then(response => {
          const { records } = response
          listDataAttribute.value = records
        })
        .catch(error => {
          console.warn(error)
        })
        .finally(() => {
          isLoadingRecords.value = false
        })
    }

    function listWithSearchValue() {
      clearTimeout(timeOutSearch.value)
      timeOutSearch.value = setTimeout(() => {
        listProductAttributesSetInstances()
      }, 500)
    }

    onMounted(() => {
      listProductAttributesSetInstances()
    })

    return {
      ROWS_OF_RECORDS_BY_PAGE,
      // Refs
      currentSelectAttributes,
      listDataAttribute,
      isLoadingRecords,
      searchValue,
      // Computeds
      shortsKey,
      // Methods
      clearValues,
      keyAction,
      setValues,
      selectValue,
      listProductAttributesSetInstances,
      listWithSearchValue,
      close,
      selectAttribute
    }
  }

})
</script>

<style lang="scss">
.product-attributes-list {
  .product-attributes-list-footer {
    padding-bottom: 10px;
  }
}
</style>
