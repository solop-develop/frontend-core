<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 Contributor(s): Elsio Sanchez elsiosanches@gmail.com www.erpya.com https://github.com/elsiosanchez
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
  <el-container style="height: 100%;" class="tab-panel">
    <el-header :style="styleHeadPanel" class="tab-panel-header">
      <tab-options
        :parent-uuid="parentUuid"
        :container-manager="containerManager"
        :current-tab-uuid="currentTabUuid"
        :container-uuid="tabAttributes.uuid"
        :tab-attributes="tabAttributes"
        :is-child-tab="isChildTab"
        :change-previous-record="changePreviousRecord"
        :change-next-record="changeNextRecord"
        :is-change-record="!isShowedTableRecords"
      />

      <filter-fields
        v-if="isShowedTableRecords"
        v-bind="commonFilterFielsProperties"
        :parent-uuid="parentUuid"
        :container-uuid="tabAttributes.uuid"
        :fields-list="containerManager.getFieldsList({ parentUuid, containerUuid: tabAttributes.uuid })"
        :fields-to-hidden="containerManager.getFieldsToHidden"
        :is-filter-records="true"
        :in-table="isShowedTableRecords"
        :container-manager="containerManager"
      />
      <el-collapse
        v-show="!isEmptyValue(batchEntry) && isShowedTableRecords"
        v-model="activeNames"
        accordion
        style="margin-top: 5px;"
      >
        <el-collapse-item name="1">
          <template slot="title">
            {{ $t('table.dataTable.batchEntry') }}
            <i class="header-icon el-icon-information" />
          </template>
          <el-form
            label-position="top"
            size="small"
          >
            <batch-entry
              v-if="!isEmptyValue(batchEntry) && isShowedTableRecords && activeNames === '1'"
              :parent-uuid="parentUuid"
              :container-uuid="tabAttributes.uuid"
              :container-manager="containerManager"
              :field-list-batch-entry="batchEntry"
              :table-name="tabAttributes.tableName"
              :field-list-all="tableHeaders"
            />
          </el-form>
        </el-collapse-item>
      </el-collapse>
    </el-header>

    <el-main id="tab-panel-body" class="tab-panel-body">
      <div style="width: 100%;height: 100%;">
        <default-table
          v-if="isShowedTableRecords"
          id="default-table"
          key="default-table"
          :parent-uuid="parentUuid"
          :container-uuid="tabAttributes.uuid"
          :container-manager="containerManager"
          :header="tableHeaders"
          :data-table="recordsList"
          :panel-metadata="tabAttributes"
          :is-navigation="true"
        />
        <template v-else>
          <panel-definition
            key="panel-definition"
            :parent-uuid="parentUuid"
            :container-uuid="tabAttributes.uuid"
            :container-manager="containerManager"
            :group-tab="tabAttributes.tabGroup"
            :style="overflowHeightScrooll"
            :is-tab-panel="true"
            :is-filter-records="true"
          />
        </template>
      </div>
    </el-main>

    <el-footer :style="styleFooterPanel" class="tab-panel-footer">
      <!-- pagination table, set custom or use default change page method -->
      <custom-pagination
        :container-manager="containerManager"
        :parent-uuid="parentUuid"
        :container-uuid="tabAttributes.uuid"
        :total="recordsLength"
        :current-page="currentPage"
        :selection="selectionsLength"
        :records-page="recordsWithFilter.length"
        :handle-change-page="handleChangePage"
        :handle-size-change="handleChangeSizePage"
      />
    </el-footer>
  </el-container>
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'

import router from '@/router'
import store from '@/store'

// Components and Mixins
import BatchEntry from '@/components/ADempiere/DataTable/Components/BatchEntry.vue'
import CustomPagination from '@/components/ADempiere/DataTable/Components/CustomPagination.vue'
import DefaultTable from '@/components/ADempiere/DataTable/index.vue'
import FilterFields from '@/components/ADempiere/FilterFields/index.vue'
// import FullScreenContainer from '@/components/ADempiere/ContainerOptions/FullScreenContainer'
import PanelDefinition from '@/components/ADempiere/PanelDefinition/index.vue'
import TabOptions from './TabOptions.vue'

// Utils and Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'TabPanel',

  components: {
    CustomPagination,
    DefaultTable,
    FilterFields,
    // FullScreenContainer,
    PanelDefinition,
    TabOptions,
    BatchEntry
  },

  props: {
    parentUuid: {
      type: String,
      required: false
    },
    containerManager: {
      type: Object,
      required: true
    },
    currentTabUuid: {
      type: String,
      default: ''
    },
    tabAttributes: {
      type: Object,
      default: () => ({})
    },
    // used only window
    isChildTab: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { root }) {
    const activeNames = ref(['0'])

    const overflowHeightScrooll = computed(() => {
      return ''
      // if (props.tabAttributes.isParentTab) {
      //   if (store.getters.getStoredWindow(props.parentUuid).isFullScreenTabsParent) {
      //     return ''
      //   }
      //   return 'max-height: 300px;'
      // }
      // if (store.getters.getStoredWindow(props.parentUuid).isFullScreenTabsChildren) {
      //   return ''
      // }
      // return 'max-height: 300px !important;'
    })

    const isShowedTableRecords = computed(() => {
      return currentTab.value.isShowedTableRecords
    })

    const currentTab = computed(() => {
      return store.getters.getStoredTab(
        props.parentUuid,
        props.tabAttributes.uuid
      )
    })

    const storedWindow = computed(() => {
      return store.getters.getStoredWindow(props.parentUuid)
    })

    const styleHeadPanel = computed(() => {
      if (isShowedTableRecords.value) {
        if (!isEmptyValue(batchEntry.value)) {
          // batch entry expand
          if (activeNames.value === '1') {
            return 'height: 200px'
          }
          // batch entry collapse
          return 'height: 130px'
        }
        // multi record
        return 'height: 78px'
      }
      // mono record
      return 'height: 39px'
    })

    const styleFooterPanel = computed(() => {
      if (props.isChildTab) {
        // if (storedWindow.value.isFullScreenTabsChildren) {
        return 'height: 100px !important'
        // }
        // return 'height: 20% !important'
      }
      return 'height: 36px'
    })

    const recordUuid = computed(() => {
      return store.getters.getUuidOfContainer(props.tabAttributes.uuid)
    })

    const list = store.getters.getTabRecordsList({
      containerUuid: currentTab.value.containerUuid
    })
    const currentRecord = list.find(row => {
      return row.UUID === recordUuid.value
    })

    if (currentTab.value.isParentTab) {
      store.dispatch('panelInfo', {
        currentTab: currentTab.value,
        currentRecord
      })
    }

    if (props.tabAttributes.isParentTab) {
      store.dispatch('changeTabAttribute', {
        parentUuid: currentTab.value.parentUuid,
        containerUuid: currentTab.value.containerUuid,
        attributeName: 'isSelected',
        attributeValue: !currentTab.value.isSelected
      })
    }

    const tableHeaders = computed(() => {
      const panel = currentTab.value
      if (panel && panel.fieldsList) {
        return panel.fieldsList
      }
      return []
    })

    // get records list
    const recordsList = computed(() => {
      return props.containerManager.getRecordsList({
        containerUuid: props.tabAttributes.uuid
      })
    })

    const currentPage = computed(() => {
      if (props.containerManager.getRecordCount) {
        return parseInt(props.containerManager.getPageNumber({
          containerUuid: props.tabAttributes.uuid
        }), 10)
      }
      return 1
    })

    const recordsLength = computed(() => {
      if (props.containerManager.getRecordCount) {
        return props.containerManager.getRecordCount({
          containerUuid: props.tabAttributes.uuid
        })
      }
      return 0
    })

    const recordsWithFilter = computed(() => {
      if (props.containerManager && props.containerManager.getRecordsList) {
        return props.containerManager.getRecordsList({
          containerUuid: props.tabAttributes.uuid
        })
      }
      return []
    })

    const selectionsLength = computed(() => {
      const selection = props.containerManager.getSelection({
        containerUuid: props.tabAttributes.uuid
      })
      if (isEmptyValue(selection)) {
        return 0
      }
      return selection.length
    })

    const commonFilterFielsProperties = computed(() => {
      if (isShowedTableRecords.value) {
        return {
          filterManager: props.containerManager.changeColumnShowedFromUser,
          showedManager: props.containerManager.isDisplayedColumn
        }
      }
      return {
        filterManager: props.containerManager.changeFieldShowedFromUser,
        showedManager: props.containerManager.isDisplayedField
      }
    })

    const batchEntry = computed(() => {
      return tableHeaders.value.filter(fieldItem => fieldItem.isQuickEntry)
    })

    function handleChangePage(pageNumber) {
      props.containerManager.setPage({
        parentUuid: props.parentUuid,
        containerUuid: props.tabAttributes.uuid,
        pageSize: store.getters.getTabPageSize({ containerUuid: props.tabAttributes.uuid }),
        pageNumber
      })
      router.push({
        name: root.$route.name,
        query: {
          ...root.$route.query,
          page: currentTab.value.isParentTab ? pageNumber : root.$route.query.page,
          pageChild: !currentTab.value.isParentTab ? pageNumber : root.$route.query.pageChild
        }
      }, () => {})
    }

    /**
     * custom method to handle change size page
     */
    function handleChangeSizePage(pageSize) {
      props.containerManager.setSizePage({
        parentUuid: props.parentUuid,
        containerUuid: props.tabAttributes.uuid,
        pageSize,
        pageNumber: 1
      })
    }

    /**
     * changePreviousRecord
     */
    function changePreviousRecord(recordPrevious) {
      const posicionIndex = recordsWithFilter.value.findIndex(record => record.UUID === recordUuid.value)
      const previosRecord = recordsWithFilter.value[posicionIndex - 1]
      const recordId = previosRecord[props.tabAttributes.tableName + '_ID']
      store.dispatch('changeTabAttribute', {
        attributeName: 'isShowedTableRecords',
        attributeNameControl: undefined,
        attributeValue: false,
        parentUuid: props.parentUuid,
        containerUuid: props.currentTabUuid
      })
      store.dispatch('changeTabAttribute', {
        attributeName: 'currentRowSelect',
        attributeNameControl: undefined,
        parentUuid: props.parentUuid,
        containerUuid: props.currentTabUuid,
        row: previosRecord
      })

      props.containerManager.seekRecord({
        parentUuid: props.parentUuid,
        containerUuid: props.currentTabUuid,
        row: previosRecord
      })
      setRecordPath(recordId)
    }

    /**
     * changePreviousRecord
     */
    function changeNextRecord(recordNext) {
      const posicionIndex = recordsWithFilter.value.findIndex(record => record.UUID === recordUuid.value)
      const nextRecord = recordsWithFilter.value[posicionIndex + 1]
      const recordId = nextRecord[props.tabAttributes.tableName + '_ID']
      store.dispatch('changeTabAttribute', {
        attributeName: 'isShowedTableRecords',
        attributeNameControl: undefined,
        attributeValue: false,
        parentUuid: props.parentUuid,
        containerUuid: props.currentTabUuid
      })
      store.dispatch('changeTabAttribute', {
        attributeName: 'currentRowSelect',
        attributeNameControl: undefined,
        parentUuid: props.parentUuid,
        containerUuid: props.currentTabUuid,
        row: nextRecord
      })

      props.containerManager.seekRecord({
        parentUuid: props.parentUuid,
        containerUuid: props.currentTabUuid,
        row: nextRecord
      })

      setRecordPath(recordId)
    }

    function setRecordPath(recordId) {
      router.push({
        query: {
          ...root.$route.query,
          recordId
        },
        params: {
          ...root.$route.params,
          recordId
        }
      }, () => {})
    }

    return {
      // computeds
      commonFilterFielsProperties,
      recordsList,
      isShowedTableRecords,
      tableHeaders,
      currentTab,
      overflowHeightScrooll,
      recordUuid,
      // pagination
      styleHeadPanel,
      styleFooterPanel,
      currentPage,
      recordsLength,
      selectionsLength,
      recordsWithFilter,
      storedWindow,
      batchEntry,
      activeNames,
      // methods
      handleChangePage,
      handleChangeSizePage,
      changePreviousRecord,
      changeNextRecord,
      setRecordPath
    }
  }

})
</script>

<style lang="scss" scoped>
.scroll-tab-panel {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;
  ::v-deep {
    .el-scrollbar__bar {
      bottom: 0px;
    }
    // .el-scrollbar__wrap {
    //   height: 49px;
    // }
  }
}
</style>
