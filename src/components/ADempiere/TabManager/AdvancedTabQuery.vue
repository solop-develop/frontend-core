<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 Contributor(s): Elsio Sanchez elsiosanches@gmail.com https://github.com/elsiosanchez
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
  <span class="advanced-query-container" :style="styleIconSvg">
    <el-input
      v-model="valueToSearch"
      clearable
      :placeholder="$t('components.searchRecord')"
      size="small"
      class="input-search"
      style="padding-right: 6px;"
      @input="handleChangeSearch"
    >
      <el-button
        v-if="isMobile"
        slot="append"
        class="button-search-record"
        @click="openDrawer"
      >
        <svg-icon icon-class="manageSearch" />
      </el-button>
      <el-popover
        v-else
        slot="append"
        v-model="isShowedAdvancedQuery"
        placement="bottom"
        :width="isMobile ? 'auto' : '950'"
        trigger="click"
        class="advanced-query-popover"
      >
        <title-and-help
          class="advanced-query-title"
          style="margin: 0 !important;"
          :name="$t('window.advancedQuery.title')"
          :help="$t('window.advancedQuery.help')"
        />
        <el-row :gutter="0">
          <el-col :span="24">
            <el-row style="padding-bottom: 0px; padding-top: 0px;">
              <panel-definition
                class="advanced-query-panel-definition"
                :parent-uuid="parentUuid + IS_ADVANCED_QUERY"
                :container-uuid="containerUuid + IS_ADVANCED_QUERY"
                :container-manager="containerManagerAdvancedQuery"
                :is-filter-records="false"
                :is-advanced-query="true"
                :is-tab-panel="true"
              />
            </el-row>
          </el-col>

          <el-col :span="24" class="advanced-query-footer">
            <samp style="float: right; padding-top: 4px;">
              <el-button
                type="info"
                class="button-base-icon"
                plain
                @click="clearValues();"
              >
                <svg-icon icon-class="layers-clear" />
              </el-button>

              <el-button
                type="danger"
                class="button-base-icon"
                icon="el-icon-close"
                @click="isShowedAdvancedQuery = false"
              />

              <el-button
                type="primary"
                class="button-base-icon"
                icon="el-icon-check"
                :loading="isLoadingSearch"
                @click="searchRecords"
              />
            </samp>
          </el-col>
        </el-row>

        <el-button
          slot="reference"
          class="button-search-record"
        >
          <svg-icon icon-class="manageSearch" />
        </el-button>
      </el-popover>
    </el-input>
    <el-drawer
      v-if="isMobile"
      :visible.sync="isShowedAdvancedQuery"
      :with-header="true"
      :before-close="handleCloseDrawer"
      size="100%"
    >
      <span slot="title">
        <title-and-help
          class="advanced-query-title"
          style="margin: 0 !important;"
          :name="$t('window.advancedQuery.title')"
          :help="$t('window.advancedQuery.help')"
        />
      </span>
      <el-row :gutter="0">
        <el-col :span="24">
          <el-row style="padding-bottom: 0px; padding-top: 0px;">
            <panel-definition
              class="advanced-query-panel-definition"
              :parent-uuid="parentUuid + IS_ADVANCED_QUERY"
              :container-uuid="containerUuid + IS_ADVANCED_QUERY"
              :container-manager="containerManagerAdvancedQuery"
              :is-filter-records="false"
              :is-advanced-query="true"
              :is-tab-panel="true"
            />
          </el-row>
        </el-col>

        <el-col :span="24" class="advanced-query-footer">
          <samp style="float: right; padding-top: 4px;">
            <el-button
              type="info"
              class="button-base-icon"
              plain
              @click="clearValues();"
            >
              <svg-icon icon-class="layers-clear" />
            </el-button>

            <el-button
              type="danger"
              class="button-base-icon"
              icon="el-icon-close"
              @click="isShowedAdvancedQuery = false"
            />

            <el-button
              type="primary"
              class="button-base-icon"
              icon="el-icon-check"
              :loading="isLoadingSearch"
              @click="searchRecords"
            />
          </samp>
        </el-col>
      </el-row>
    </el-drawer>
  </span>
</template>

<script>
import { defineComponent, ref, computed, watch } from '@vue/composition-api'

import router from '@/router'
import store from '@/store'

// Components and Mixins
import PanelDefinition from '@/components/ADempiere/PanelDefinition/index.vue'
import TitleAndHelp from '@/components/ADempiere/TitleAndHelp/index.vue'

// Constants
import {
  IS_ADVANCED_QUERY
} from '@/utils/ADempiere/dictionaryUtils'
import {
  IGNORE_VALUE_OPERATORS_LIST
} from '@/utils/ADempiere/dataUtils'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

export default defineComponent({
  name: 'AdvancedTabQuerySearch',

  components: {
    TitleAndHelp,
    PanelDefinition
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
    fieldsList: {
      type: Array,
      default: () => []
    },
    containerManager: {
      type: Object,
      required: false
    }
  },

  setup(props, { root }) {
    /**
    * Refs
    */
    const isLoadingSearch = ref(false)
    const timeOutSearch = ref(null)
    const isShowedAdvancedQuery = ref(false)

    /**
    * Computed
    */
    // value of search
    const valueToSearch = computed({
      get() {
        return store.getters.getSearchValueTabRecordsList({
          containerUuid: props.containerUuid
        }) || ''
      },
      set(searchValue) {
        store.commit('setSearchValueTabRecordsList', {
          containerUuid: props.containerUuid,
          searchValue
        })
      }
    })

    const isShowedTableRecords = computed(() => {
      return store.getters.getStoredTab(
        props.parentUuid,
        props.containerUuid
      ).isShowedTableRecords
    })

    const styleIconSvg = computed(() => {
      if (isMobile.value) {
        return ''
      }
      if (isShowedTableRecords.value) {
        return 'position: absolute;right: 66px;display: inline-block;padding-right: 5px;float: right;width: 293px;'
      }
      return 'position: absolute;right: 70px;display: inline-block;padding-right: 0px;float: right;width: 289px;margin-top: -1px;'
    })

    const containerManagerAdvancedQuery = computed(() => {
      return {
        ...props.containerManager,
        isDisplayedField({ isDisplayed }) {
          return true
        },
        isDisplayedDefault({ isSelectionColumn }) {
          // add is showed from user
          return false
        },
        isMandatoryField({ isMandatory }) {
          return false
        },
        isReadOnlyField({ isReadOnly, operator }) {
          return IGNORE_VALUE_OPERATORS_LIST.includes(operator)
        },
        getFieldsToHidden({ parentUuid, containerUuid }) {
          const fieldsListTab = store.getters.getStoredFieldsFromTab(parentUuid, containerUuid)
          return fieldsListTab || []
        }
      }
    })

    const isMobile = computed(() => {
      return store.state.app.device === 'mobile'
    })

    const panelAdvancedQuery = computed(() => {
      return store.getters.getStoredTab(
        props.parentUuid + IS_ADVANCED_QUERY,
        props.containerUuid + IS_ADVANCED_QUERY
      )
    })

    /**
    * Methods
    */
    function handleChangeSearch(value) {
      clearTimeout(timeOutSearch.value)
      timeOutSearch.value = setTimeout(() => {
        // get records
        filterRecord(value)
      }, 1000)
    }

    function filterRecord(searchText) {
      isLoadingSearch.value = true

      store.dispatch('getEntities', {
        parentUuid: props.parentUuid,
        containerUuid: props.containerUuid,
        searchValue: searchText
      })
        .finally(() => {
          isLoadingSearch.value = false
        })
    }

    function searchRecords(params) {
      const filters = store.getters.getTabDataFilters({
        parentUuid: props.parentUuid,
        containerUuid: props.containerUuid
      })

      const query = Object.assign({}, root.$route.query)
      if (!isEmptyValue(query) && !isEmptyValue(query.filters)) {
        delete query.filters
        router.replace({ query })
      }

      isLoadingSearch.value = true
      store.dispatch('getEntities', {
        parentUuid: props.parentUuid,
        containerUuid: props.containerUuid,
        filters
      })
        .finally(() => {
          isLoadingSearch.value = false
        })
      isShowedAdvancedQuery.value = false
    }

    function clearValues() {
      store.dispatch('clearValuesOnContainer', {
        containerUuid: props.containerUuid + IS_ADVANCED_QUERY
      })
    }

    function handleCloseDrawer() {
      isShowedAdvancedQuery.value = false
    }

    function openDrawer() {
      isShowedAdvancedQuery.value = true
    }

    watch(isShowedAdvancedQuery, (newValue, oldValue) => {
      if (newValue && newValue !== oldValue) {
        if (isEmptyValue(panelAdvancedQuery.value)) {
          store.dispatch('setTabAdvancedQuery', {
            parentUuid: props.parentUuid,
            containerUuid: props.containerUuid
          })
        }
      }
    })

    return {
      // Refs
      isLoadingSearch,
      timeOutSearch,
      isShowedAdvancedQuery,
      // Const
      IS_ADVANCED_QUERY,
      // Computeds
      containerManagerAdvancedQuery,
      valueToSearch,
      isMobile,
      panelAdvancedQuery,
      styleIconSvg,
      // Methods
      openDrawer,
      clearValues,
      searchRecords,
      handleCloseDrawer,
      handleChangeSearch
    }
  }
})
</script>

<style lang="scss">
.input-search {
  line-height: 28px;
  // display: contents;

  .el-input-group__append {
    height: 32px !important;
    // line-height: 27 !important;
  }

  .button-search-record {
    padding-left: 6px !important;
    padding-right: 0px !important;
    padding-top: 9px !important;

    svg {
      font-size: 25px !important;
    }
  }
}

.advanced-query-title {
  button, button.container-title {
    padding: 0px !important;
  }
}
</style>
