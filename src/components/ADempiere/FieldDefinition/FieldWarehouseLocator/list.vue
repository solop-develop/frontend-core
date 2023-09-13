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
    class="warehouse-locators-list-container"
    style="padding-top: 0px"
    @shortkey.native="keyAction"
  >
    <el-collapse v-model="activeAccordion" accordion class="warehouse-locators-query-criteria">
      <el-collapse-item name="query-criteria">
        <template slot="title">
          {{ title }}
        </template>

        <el-form
          v-shortkey="shortsKey"
          label-position="top"
          size="small"
          class="form-min-label"
          @submit.native.prevent="notSubmitForm"
          @shortkey.native="keyAction"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('field.warehouseLocator.warehouse')">
                <el-select
                  v-model="currentWarehouseId"
                  value-key="id"
                  clearable
                  filterable
                  remote
                  :remote-method="remoteSearchWarehouses"
                  :loading="isLoadingWarehouses"
                  :disabled="warehouseId > 0"
                  @visible-change="getWarehousesList"
                  @change="getListWarehouseLocator({})"
                  @clear="clearWarehouses()"
                >
                  <el-option
                    v-for="(warehouse, key) in warehousesList"
                    :key="key"
                    :value="warehouse.id"
                    :label="warehouse.name"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item :label="$t('field.warehouseLocator.searchValue')">
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
      </el-collapse-item>
    </el-collapse>

    <el-row :gutter="0">
      <el-col :span="24">
        <el-table
          v-loading="isLoadingRecords"
          :data="recordsList"
          height="300"
          stripe
          size="mini"
          fit
          style="width: 100%"
          @row-click="selectCurrentRow"
          @row-dblclick="selectValue"
        >
          <index-column
            :page-number="currentPageNumber"
            :page-size="currentPageSize"
          />

          <el-table-column
            prop="warehouse.name"
            :label="$t('field.warehouseLocator.warehouse')"
          />

          <el-table-column
            prop="value"
            :label="$t('field.warehouseLocator.value')"
          />

          <!-- <el-table-column
            prop="is_default"
            :label="$t('field.warehouseLocator.isDefault')"
          >
            <template slot-scope="scope">
              {{ convertBooleanToTranslationLang(scope.row.is_default) }}
            </template>
          </el-table-column> -->

          <el-table-column
            prop="aisle"
            :label="$t('field.warehouseLocator.aisle')"
          />

          <el-table-column
            prop="bin"
            :label="$t('field.warehouseLocator.bin')"
          />

          <el-table-column
            prop="level"
            :label="$t('field.warehouseLocator.level')"
          />
        </el-table>
      </el-col>
    </el-row>

    <el-row :gutter="0" class="warehouse-locators-list-footer">
      <el-col :span="16">
        <custom-pagination
          :total="recordCount"
          :current-page="currentPageNumber"
          :container-manager="containerManager"
          :handle-change-page="handleChangePageNumber"
          :records-page="recordsList.length"
          :handle-size-change="handleChangeSizePage"
        />
      </el-col>

      <el-col :span="8">
        <samp style="float: right; padding-top: 4px;">
          <el-button
            :loading="isLoadingRecords"
            type="success"
            class="button-base-icon"
            icon="el-icon-refresh-right"
            size="small"
            @click="getListWarehouseLocator({});"
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
            @click="setValues(currentRow); close()"
          />
        </samp>
      </el-col>
    </el-row>
  </el-main>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from '@vue/composition-api'

import store from '@/store'

// Components and Mixins
import useLocatorWarehouse from './useLocatorWarehouse.js'
import CustomPagination from '@/components/ADempiere/DataTable/Components/CustomPagination.vue'
import IndexColumn from '@/components/ADempiere/DataTable/Components/IndexColumn.vue'

// Constants
import { ROWS_OF_RECORDS_BY_PAGE } from '@/utils/ADempiere/tableUtils'

// Utils and Helper Methods
import { isEmptyValue, isSameValues } from '@/utils/ADempiere/valueUtils'
import { convertBooleanToTranslationLang } from '@/utils/ADempiere/formatValue/booleanFormat'

export default defineComponent({
  name: 'ListWarehouseLocations',

  components: {
    CustomPagination,
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
      uuidForm,
      contextAttributesList,
      warehouseId,
      clearValues,
      setValues,
      close
    } = useLocatorWarehouse({
      parentUuid: props.parentUuid,
      containerUuid: props.containerUuid,
      containerManager: props.containerManager,
      fieldAttributes: props.metadata
    })

    const isLoadingRecords = ref(false)
    const isLoadingWarehouses = ref(false)
    const currentRow = ref({})
    const activeAccordion = ref('query-criteria')
    const timeOutSearch = ref(null)
    const timeOutSearchWarehouses = ref(null)

    const warehousesList = computed(() => {
      return store.getters.getListAvailableWarehouses({
        containerUuid: uuidForm.value
      })
    })

    const recordData = computed(() => {
      return store.getters.getWarehouseLocatorData({
        containerUuid: uuidForm.value
      })
    })

    const recordsList = computed(() => {
      return recordData.value.recordsList
    })

    const recordCount = computed(() => {
      return recordData.value.recordCount
    })

    const currentPageNumber = computed(() => {
      return recordData.value.pageNumber
    })

    const currentPageSize = computed(() => {
      return recordData.value.pageSize
    })

    const searchValue = computed({
      get() {
        return recordData.value.searchValue
      },
      set(newValue) {
        store.commit('setWarehouseLocatorSearchValue', {
          containerUuid: uuidForm.value,
          searchValue: newValue
        })
      }
    })

    const currentWarehouseId = computed({
      get() {
        return recordData.value.warehouseId
      },
      set(newValue) {
        store.commit('setWarehouseLocatorWarehouseId', {
          containerUuid: uuidForm.value,
          warehouseId: newValue
        })
      }
    })

    const title = computed(() => {
      let title = props.metadata.name
      if (!isEmptyValue(props.metadata.panelName) && !isSameValues(props.metadata.panelName, props.metadata.name)) {
        title += ` (${props.metadata.panelName})`
      }
      return title
    })

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
          getListWarehouseLocator({})
          break

        case 'close':
          close()
          break
      }
    }

    function selectCurrentRow(row, column, event) {
      currentRow.value = row
    }

    function selectValue(row) {
      setValues(row)
      close()
    }

    function getListWarehouseLocator({
      pageNumber = 1,
      pageSize = ROWS_OF_RECORDS_BY_PAGE
    }) {
      isLoadingRecords.value = true

      props.containerManager.warehouseLocatorSearch({
        containerUuid: uuidForm.value,
        contextAttributesList: contextAttributesList.value,
        warehouseId: currentWarehouseId.value,
        uuid: props.metadata.uuid,
        searchValue: searchValue.value,
        pageNumber,
        pageSize
      })
        .catch(error => {
          console.warn(error)
        })
        .finally(() => {
          isLoadingRecords.value = false
        })
    }

    function handleChangeSizePage(pageSize) {
      getListWarehouseLocator({
        pageNumber: 1,
        pageSize
      })
    }

    function handleChangePageNumber(pageNumber) {
      getListWarehouseLocator({
        pageNumber,
        pageSize: currentPageSize.value
      })
    }

    function listWithSearchValue() {
      clearTimeout(timeOutSearch.value)
      timeOutSearch.value = setTimeout(() => {
        getListWarehouseLocator({
          pageNumber: currentPageNumber.value,
          pageSize: currentPageSize.value
        })
      }, 500)
    }

    function listAvailableWarehouses(searchValue = '') {
      isLoadingWarehouses.value = true
      store.dispatch('listAvailableWarehouses', {
        containerUuid: uuidForm.value,
        warehouseId: warehouseId.value,
        searchValue
      })
        .finally(() => {
          isLoadingWarehouses.value = false
        })
    }
    function getWarehousesList(isShowList) {
      if (isShowList) {
        if (isEmptyValue(warehousesList.value)) {
          listAvailableWarehouses()
        }
      }
    }
    function localSearch(searchQuery = '') {
      if (isEmptyValue(searchQuery)) {
        return warehousesList.value
      }
      searchQuery = searchQuery.toLocaleLowerCase()
      return warehousesList.value.filter(option => {
        return option.name.toLowerCase().includes(searchQuery) ||
          option.description.toLowerCase().includes(searchQuery)
      })
    }
    function remoteSearchWarehouses(searchQuery) {
      const results = localSearch(searchQuery)
      if (isEmptyValue(searchQuery) ||
        (!isEmptyValue(searchQuery) && (isEmptyValue(results) || results.length < 3))) {
        clearTimeout(timeOutSearchWarehouses.value)
        timeOutSearchWarehouses.value = setTimeout(() => {
          listAvailableWarehouses(searchQuery)
        }, 1000)
        return
      }
    }
    function clearWarehouses() {
      // store.commit('setWarehousesList', {
      //   containerUuid: uuidForm.value,
      //   recordsList: []
      // })
      setTimeout(() => {
        currentWarehouseId.value = warehouseId.value
      }, 100)
      listAvailableWarehouses()
    }

    onMounted(() => {
      const parentWarehouseId = warehouseId.value
      if (!isEmptyValue(parentWarehouseId) && parentWarehouseId > 0) {
        currentWarehouseId.value = parentWarehouseId
      }

      listAvailableWarehouses()

      getListWarehouseLocator({
        pageNumber: currentPageNumber.value,
        pageSize: currentPageSize.value
      })
    })

    return {
      // Refs
      activeAccordion,
      currentRow,
      isLoadingRecords,
      // Computeds
      currentPageNumber,
      currentPageSize,
      recordCount,
      recordsList,
      title,
      searchValue,
      isLoadingWarehouses,
      currentWarehouseId,
      warehouseId,
      warehousesList,
      shortsKey,
      // Methods
      convertBooleanToTranslationLang,
      clearValues,
      keyAction,
      setValues,
      selectValue,
      selectCurrentRow,
      listAvailableWarehouses,
      getWarehousesList,
      listWithSearchValue,
      clearWarehouses,
      getListWarehouseLocator,
      remoteSearchWarehouses,
      handleChangeSizePage,
      handleChangePageNumber,
      close
    }
  }

})
</script>

<style lang="scss">
.warehouse-locators-list-container {
  .warehouse-locators-query-criteria {
    // remove space bottom collapse
    .el-collapse-item__content {
      padding-bottom: 0px;
    }
  }
  .warehouse-locators-list-footer {
    // add space bottom footer
    // padding-bottom: 10px;
    margin-bottom: 10px;
  }
}
</style>
