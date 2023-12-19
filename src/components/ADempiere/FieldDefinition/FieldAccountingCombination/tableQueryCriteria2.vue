<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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
  <el-main
    v-shortkey="shortsKey"
    v-loading="isLoadingFields"
    class="accouting-combintantions-list-container"
    style="padding-top: 0px"
    @shortkey.native="keyAction"
  >
    <el-collapse v-model="activeAccordion" accordion class="accouting-combintantions-query-criteria">
      <el-collapse-item name="query-criteria">
        <template slot="title">
          {{ title }}
        </template>

        <el-form
          label-position="top"
          size="small"
          @submit.native.prevent="notSubmitForm"
        >
          <el-row
            v-if="isLoadingPanel"
            :gutter="20"
          >
            <el-col
              v-for="field in metadataList"
              :key="field.sequece"
              :span="6"
            >
              <text-accounting
                v-if="field.displayType === 14"
                :metadata="{
                  ...field,
                  value: valuesCombinations(field)
                }"
              />
              <select-accounting
                v-else
                :metadata="{
                  ...field,
                  containerUuid: metadata.containerUuid
                }"
                :default-value="setValuesCombinations"
              />
            </el-col>
          </el-row>
          <el-skeleton
            v-else
            :count="2"
          />
        </el-form>

        <el-button
          type="primary"
          class="button-save"
          plain
          style="float: right;margin-top: 0.5%;margin-bottom: 0.5%;"
          @click="saveAccoutingCombination()"
        >
          <svg-icon icon-class="save-AD" />
        </el-button>
      </el-collapse-item>
    </el-collapse>

    <!-- <el-table
      ref="accountCombinationsTable"
      v-loading="isLoadingRecords"
      class="accouting-combintantions-table"
      :data="recordsList"
      highlight-current-row
      border
      fit
      :height="200"
      :max-height="400"
      size="mini"
      @current-change="handleCurrentChange"
      @row-dblclick="changeRecord"
    >
      <p slot="empty" style="width: 100%;">
        {{ $t('notifications.searchWithOutRecords') }}
      </p>

      <index-column
        :page-number="pageNumber"
      />

      <el-table-column
        v-for="(head, key) in labelTable"
        :key="key"
        :label="head.label"
        prop="value"
        header-align="center"
      >
        <template slot-scope="scope">
          formatted displayed value
          <cell-display-info
            :parent-uuid="metadata.parentUuid"
            :container-uuid="uuidForm"
            :field-attributes="head"
            :container-manager="containerManagerSearchList"
            :scope="scope"
            :data-row="scope.row"
          />
        </template>
      </el-table-column>
    </el-table> -->

    <el-row class="accouting-combintantions-footer">
      <!-- <el-col :span="20">
        <custom-pagination
          :total="recordData.recordCount"
          :current-page="pageNumber"
          :container-manager="containerManagerSearchList"
          :handle-change-page="setPage"
          :records-page="recordsList.length"
          :selection="selection"
        />
      </el-col> -->

      <el-col :span="4">
        <samp style="float: right; padding-top: 4px;">
          <el-button
            :loading="isLoadingRecords"
            type="success"
            class="button-base-icon"
            icon="el-icon-refresh-right"
            @click="searchRecordsList();"
          />

          <el-button
            type="danger"
            class="button-base-icon"
            icon="el-icon-close"
            @click="closeList(); clearValues();"
          />

          <el-button
            type="primary"
            class="button-base-icon"
            icon="el-icon-check"
            @click="changeRecord()"
          />
        </samp>
      </el-col>
    </el-row>
  </el-main>
</template>

<script>
import {
  defineComponent,
  computed,
  ref
} from '@vue/composition-api'
import store from '@/store'
// Api
import {
  getAccountingCombination
} from '@/api/ADempiere/field/generalGedger'
// Constants
import { ACCOUTING_COMBINATIONS_LIST_FORM, COLUMN_NAME } from '@/utils/ADempiere/dictionary/field/accoutingCombination.js'
// Components and Mixins
import CellDisplayInfo from '@/components/ADempiere/DataTable/Components/CellDisplayInfo.vue'
import CustomPagination from '@/components/ADempiere/DataTable/Components/CustomPagination.vue'
import IndexColumn from '@/components/ADempiere/DataTable/Components/IndexColumn.vue'
import SelectAccounting from '@/components/ADempiere/FieldDefinition/FieldAccountingCombination/Fields/SelectAccounting'
import TextAccounting from '@/components/ADempiere/FieldDefinition/FieldAccountingCombination/Fields/TextAccounting'
import { ORGANIZATION } from '@/utils/ADempiere/constants/systemColumns'
// Utils and Helper Methods
import { isEmptyValue, isSameValues } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'TableQueryCriteria',
  components: {
    CellDisplayInfo,
    CustomPagination,
    SelectAccounting,
    TextAccounting,
    IndexColumn
  },
  props: {
    containerManager: {
      type: Object,
      default: () => ({
        actionPerformed: () => {},
        getFieldsLit: () => {},
        setDefaultValues: () => {}
      })
    },
    metadata: {
      type: Object,
      default: () => {
        return {
          containerUuid: ACCOUTING_COMBINATIONS_LIST_FORM,
          columnName: COLUMN_NAME
        }
      }
    },
    showPopover: {
      type: Boolean,
      default: () => false
    }
  },
  setup(props) {
    // Ref
    const isLoadingPanel = ref(false)
    const activeAccordion = ref('query-criteria')
    const isLoadingFields = ref(false)
    const isLoadingRecords = ref(false)
    const timeOutRecords = ref(null)
    const combinations = ref('')
    const setValuesCombinations = ref({})
    // Computed

    const title = computed(() => {
      let title = props.metadata.panelName
      if (!isEmptyValue(props.metadata.panelName) && !isSameValues(props.metadata.panelName, props.metadata.name)) title += ` (${props.metadata.name})`
      return title
    })

    const shortsKey = computed(() => {
      return {
        close: ['esc'],
        refreshList: ['f5']
      }
    })

    const uuidForm = computed(() => {
      if (!isEmptyValue(props.metadata.containerUuid)) {
        return props.metadata.columnName + '_' + props.metadata.containerUuid
      }
      return ACCOUTING_COMBINATIONS_LIST_FORM
    })

    const metadataList = computed(() => {
      return store.getters.getFieldsListAccount
    })

    const acctSchemaId = computed(() => {
      return store.getters.getValueOfField({
        containerUuid: uuidForm.value,
        columnName: 'C_AcctSchema_ID'
      })
    })

    const organizationId = computed(() => {
      return store.getters.getValueOfField({
        containerUuid: uuidForm.value,
        columnName: ORGANIZATION
      })
    })

    const accoutId = computed(() => {
      return store.getters.getValueOfField({
        containerUuid: uuidForm.value,
        columnName: 'Account_ID'
      })
    })

    const contextAttributesList = computed(() => {
      return [
        { columnName: 'C_AcctSchema_ID', value: acctSchemaId.value },
        { columnName: ORGANIZATION, value: organizationId.value },
        { columnName: 'Account_ID', value: accoutId.value }
      ]
    })

    // Methods

    function keyAction(event) {
      switch (event.srcKey) {
        case 'refreshList':
          /**
           * TODO: When refreshing you are making 2 list requests, you can be the
           * observer that activates the second request
          */
          searchRecordsList()
          break

        case 'close':
          closeList()
          break
      }
    }

    function saveAccoutingCombination() {
      const attributes = store.getters.getValuesView({
        containerUuid: uuidForm.value,
        format: 'array'
      }).filter(item => {
        return item.columnName !== 'Combination' &&
          metadataList.value.find(itemDefinition => itemDefinition.columnName === item.columnName)
      }).map(item => {
        return {
          value: item.value,
          key: item.columnName
        }
      })

      store.dispatch('saveAccountCombinations', {
        parentUuid: props.metadata.parentUuid,
        containerUuid: uuidForm.value,
        attributes,
        contextAttributesList: contextAttributesList.value
      })
      searchRecordsList()
    }

    function searchRecordsList(pageNumber = 0, isConvert = true) {
      let parentUuid = props.metadata.parentUuid
      if (isEmptyValue(parentUuid)) {
        parentUuid = props.metadata.containerUuid
      }
      const filters = store.getters.getValuesView({
        containerUuid: uuidForm.value,
        format: 'array'
      }).filter(item => {
        return !isEmptyValue(item.value) &&
          item.columnName !== 'Combination' &&
          item.columnName !== 'Alias' &&
          props.metadataList.find(itemDefinition => itemDefinition.columnName === item.columnName)
      })
      clearTimeout(timeOutRecords.value)
      timeOutRecords.value = setTimeout(() => {
        isLoadingRecords.value = true
        store.dispatch('listAccountCombinations', {
          parentUuid: props.metadata.parentUuid,
          containerUuid: uuidForm.value,
          contextAttributesList: contextAttributesList.value,
          filters,
          pageNumber
        })
          .then(response => {
            if (isEmptyValue(response)) {
              this.$message({
                type: 'warning',
                showClose: true,
                message: this.$t('notifications.searchWithOutRecords')
              })
            }
          })
          .finally(() => {
            isLoadingRecords.value = false
          })
      }, 500)
    }

    function clearValues() {
      metadataList.value.map(element => {
        return {
          ...element,
          value: ''
        }
      })
    }

    function closeList() {
      store.commit('setAccountCombinationsShow', {
        containerUuid: uuidForm.value,
        show: false
      })
    }

    function changeRecord() {
      console.log('changeRecord')
    }

    function getAccoutingElements() {
      const accoutingElements = store.getters.getFieldsListAccount
      if (isEmptyValue(accoutingElements)) {
        store.dispatch('listAccoutingElementsFromServer')
      }
    }

    function loadCombinations() {
      isLoadingPanel.value = true
      getAccountingCombination({
        id: store.getters.getValueOfField({
          containerUuid: props.metadata.containerUuid,
          columnName: props.metadata.columnName
        })
      })
        .then(response => {
          const { values } = response
          setValuesCombinations.value = values
          // combinations.value = values.Combination
          metadataList.value.map(list => {
            return {
              ...list,
              value: values[list.columnName]
            }
          })
          setTimeout(() => {
            isLoadingPanel.value = false
          }, 500)
        })
    }

    function valuesCombinations(field) {
      if (isEmptyValue(setValuesCombinations.value)) return ''
      return setValuesCombinations.value[field.columnName]
      // return setValuesCombinations.value['DisplayColumn_' + field.columnName]
    }

    getAccoutingElements()
    loadCombinations()

    return {
      // Ref
      setValuesCombinations,
      isLoadingRecords,
      isLoadingFields,
      activeAccordion,
      isLoadingPanel,
      timeOutRecords,
      combinations,
      // Computed
      title,
      uuidForm,
      accoutId,
      shortsKey,
      metadataList,
      acctSchemaId,
      organizationId,
      contextAttributesList,
      // Methods
      keyAction,
      closeList,
      clearValues,
      changeRecord,
      loadCombinations,
      searchRecordsList,
      valuesCombinations,
      saveAccoutingCombination
    }
  }

})
</script>

<style lang="scss">
.accouting-combintantions-list-container {
  .accouting-combintantions-query-criteria {
    // space between quey criteria and table
    .el-collapse-item__content {
      padding-bottom: 0px !important;
    }

    .button-save {
      padding: 2px 6px;
      svg {
        font-size: 30px !important;
      }
    }
  }
}
</style>
