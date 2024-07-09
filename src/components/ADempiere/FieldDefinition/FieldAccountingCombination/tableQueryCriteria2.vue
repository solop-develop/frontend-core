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
          class="form-base"
          @submit.native.prevent="notSubmitForm"
        >
          <el-row
            v-if="!isLoadingPanel"
            :gutter="20"
          >
            <el-col
              v-for="field in fieldsListElements"
              :key="field.sequece"
              :span="6"
            >
              <text-accounting
                v-if="field.display_type === TEXT.id"
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
    <el-table
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
        :page-number="recordData.pageNumber"
      />

      <el-table-column
        v-for="(head, key) in labelTable"
        :key="key"
        :label="head.label"
        prop="value"
        header-align="center"
      >
        <template slot-scope="scope">
          <!-- formatted displayed value -->
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
    </el-table>

    <el-row class="accouting-combintantions-footer">
      <el-col :span="20">
        <custom-pagination
          :total="recordData.recordCount"
          :current-page="recordData.pageNumber"
          :container-manager="containerManagerSearchList"
          :handle-change-page-number="setPageNumber"
          :records-page="recordsList.length"
          :selection="selection"
        />
      </el-col>

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
  // onUpdated,
  watch,
  ref
} from '@vue/composition-api'

import store from '@/store'

// Api
import {
  getAccountingCombination
} from '@/api/ADempiere/field/generalGedger'

// Constants
import { TEXT } from '@/utils/ADempiere/references'
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
import { containerManager as containerManagerForm } from '@/utils/ADempiere/dictionary/form'
import { showMessage } from '@/utils/ADempiere/notification'
import language from '@/lang'

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
    const tableNameAccounting = ref('')

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

    const fieldsListElements = computed(() => {
      return store.getters.getFieldsListAccount
    })

    const acctSchemaId = computed(() => {
      return store.getters.getValueOfField({
        containerUuid: uuidForm.value,
        columnName: 'C_AcctSchema_ID'
      })
    })

    const organizationId = computed(() => {
      if (isEmptyValue(fieldsListElements.value)) return setValuesCombinations.value['AD_Org_ID']
      return store.getters.getFieldsValue(ORGANIZATION)
    })

    const attributesQuery = computed(() => {
      return store.getters.getAttributeValueAccount
    })

    const recordData = computed(() => {
      return store.getters.getAccountCombinationsData({
        containerUuid: uuidForm.value
      })
    })

    const filtersAccount = computed(() => {
      if (isEmptyValue(store.getters.getFiltersAccount)) return null
      return JSON.stringify(store.getters.getFiltersAccount)
    })

    const accoutId = computed(() => {
      return store.getters.getValueOfField({
        containerUuid: props.metadata.containerUuid,
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

    const recordsList = computed(() => {
      return store.getters.getAccountCombinationsRecordsList({
        containerUuid: uuidForm.value
      })
    })

    const labelTable = computed(() => {
      return fieldsListElements.value.map(field => {
        const { column_name, name } = field
        if (column_name === 'AD_Client_ID') {
          return {
            label: name,
            column_name: 'DisplayColumn_AD_Client_ID'
          }
        } else if (column_name === 'AD_Org_ID') {
          return {
            label: name,
            column_name: 'DisplayColumn_AD_Org_ID'
          }
        } else if (column_name === 'Account_ID') {
          return {
            label: name,
            column_name: 'DisplayColumn_Account_ID'
          }
        } else if (column_name === 'M_Product_ID') {
          return {
            label: name,
            column_name: 'DisplayColumn_M_Product_ID'
          }
        } else if (column_name === 'C_BPartner_ID') {
          return {
            label: name,
            column_name: 'DisplayColumn_C_BPartner_ID'
          }
        } else if (column_name === 'C_Project_ID') {
          return {
            label: name,
            column_name: 'DisplayColumn_C_Project_ID'
          }
        } else if (column_name === 'C_Campaign_ID') {
          return {
            label: name,
            column_name: 'DisplayColumn_C_Campaign_ID'
          }
        }
        return {
          label: name,
          column_name: column_name
        }
      })
    })

    const containerManagerSearchList = computed(() => {
      return {
        ...props.containerManager,
        ...containerManagerForm,
        setPageNumber: setPageNumber()
      }
    })

    const selection = computed(() => {
      if (isEmptyValue(currentRow.value)) {
        return 0
      }
      return 1
    })

    const isLoadingTable = computed(() => {
      return store.getters.getIsLoadeTables
    })

    const currentRow = computed({
      get() {
        return store.getters.getAccountCombinationsCurrentRow({
          containerUuid: uuidForm.value
        })
      },
      // setter
      set(rowSelected) {
        store.commit('setAccountCombinationsSelectedRow', {
          containerUuid: uuidForm.value,
          currentRow: rowSelected
        })
      }
    })

    // Methods
    function keyAction(event) {
      switch (event.srcKey) {
        // case 'refreshList':
        //   /**
        //    * TODO: When refreshing you are making 2 list requests, you can be the
        //    * observer that activates the second request
        //   */
        //   searchRecordsList()
        //   break

        case 'close':
          closeList()
          break
      }
    }

    function saveAccoutingCombination() {
      store.dispatch('saveAccountCombinations', {
        id: store.getters.getValueOfField({
          containerUuid: props.metadata.containerUuid,
          columnName: props.metadata.columnName
        }),
        organizationId: store.getters.getFieldsValue(ORGANIZATION),
        accountId: store.getters.getFieldsValue('Account_ID'),
        parentUuid: props.metadata.parentUuid,
        accountingSchemaId: setValuesCombinations.value['C_AcctSchema_ID'],
        containerUuid: uuidForm.value,
        attributes: attributesQuery.value
      })
        .then(response => {
          const { values } = response
          fieldsListElements.value[0].value = values.Combination
        })
      searchRecordsList()
    }

    function searchRecordsList(pageNumber = 0, isConvert = true) {
      if (isEmptyValue(store.getters.getFieldsValue(ORGANIZATION))) {
        showMessage({
          type: 'warning',
          showClose: true,
          message: language.t('notifications.fieldMandatory') + ': ' + language.t('form.accountingViewer.organization')
        })
        return
      }
      if (isEmptyValue(store.getters.getFieldsValue('Account_ID'))) {
        showMessage({
          type: 'warning',
          showClose: true,
          message: language.t('notifications.fieldMandatory') + ': ' + language.t('form.accountingViewer.account')
        })
        return
      }
      let parentUuid = props.metadata.parentUuid
      if (isEmptyValue(parentUuid)) {
        parentUuid = props.metadata.containerUuid
      }
      // const filters = store.getters.getValuesView({
      //   containerUuid: uuidForm.value,
      //   format: 'array'
      // }).filter(item => {
      //   return !isEmptyValue(item.value) &&
      //     item.columnName !== 'Combination' &&
      //     item.columnName !== 'Alias' &&
      //     props.fieldsListElements.find(itemDefinition => itemDefinition.columnName === item.columnName)
      // })
      clearTimeout(timeOutRecords.value)
      timeOutRecords.value = setTimeout(() => {
        isLoadingRecords.value = true
        store.dispatch('listAccountCombinations', {
          contextAttributesList: contextAttributesList.value,
          organizationId: store.getters.getFieldsValue(ORGANIZATION),
          parentUuid: props.metadata.parentUuid,
          accountId: store.getters.getFieldsValue('Account_ID'),
          containerUuid: uuidForm.value,
          pageNumber,
          filters: filtersAccount.value
        })
          .then(response => {
            if (isEmptyValue(response)) {
              showMessage({
                type: 'warning',
                showClose: true,
                message: language.t('notifications.searchWithOutRecords')
              })
            }
          })
          .finally(() => {
            isLoadingRecords.value = false
          })
      }, 500)
    }

    function clearValues() {
      fieldsListElements.value.map(element => {
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
      store.commit('cleanAccountData')
    }

    function changeRecord() {
      // if (!isEmptyValue(currentRow.value)) {
      //   store.dispatch('notifyFieldChange', {
      //     containerUuid: this.metadata.containerUuid,
      //     containerManager: this.containerManager,
      //     field: this.metadata,
      //     columnName: this.metadata.column_name,
      //     newValue: value
      //   })
      // }
      store.dispatch('notifyFieldChange', {
        containerUuid: props.metadata.containerUuid,
        containerManager: props.containerManager,
        field: props.metadata,
        columnName: props.metadata.columnName,
        newValue: currentRow.value[tableNameAccounting.value + '_ID']
      })
      closeList()
    }

    function getAccoutingElements() {
      // const accoutingElements = store.getters.getFieldsListAccount
      // if (isEmptyValue(accoutingElements)) {
      store.dispatch('listAccoutingElementsFromServer')
        .finally(() => {
          setTimeout(() => {
            loadCombinations()
          }, 500)
        })
      // }
    }

    function handleCurrentChange(row) {
      currentRow.value = row
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
          const { values, table_name } = response
          tableNameAccounting.value = table_name
          setValuesCombinations.value = values
          fieldsListElements.value.forEach(element => {
            store.commit('setFieldsValue', {
              columnName: element.column_name,
              value: values[element.column_name]
            })
          })
          // isLoadingPanel.value = false
          setTimeout(() => {
            isLoadingPanel.value = false
          }, 500)
        })
        .catch(() => {
          setTimeout(() => {
            isLoadingPanel.value = false
          }, 500)
        })
        .finally(() => {
          setTimeout(() => {
            isLoadingPanel.value = false
            searchRecordsList()
          }, 500)
        })
    }

    function valuesCombinations(field) {
      if (isEmptyValue(setValuesCombinations.value)) return ''
      return setValuesCombinations.value[field.columnName]
      // return setValuesCombinations.value['DisplayColumn_' + field.columnName]
    }

    function setPageNumber(pageNumber) {
      if (isEmptyValue(pageNumber)) return
      searchRecordsList(pageNumber)
    }

    watch(isLoadingTable, (newValue, oldValue) => {
      if (newValue && newValue !== oldValue) searchRecordsList()
    })

    getAccoutingElements()

    return {
      TEXT,
      // Ref
      setValuesCombinations,
      tableNameAccounting,
      isLoadingRecords,
      isLoadingFields,
      activeAccordion,
      isLoadingPanel,
      timeOutRecords,
      combinations,
      // Computed
      title,
      selection,
      isLoadingTable,
      uuidForm,
      accoutId,
      shortsKey,
      labelTable,
      currentRow,
      recordsList,
      fieldsListElements,
      recordData,
      acctSchemaId,
      organizationId,
      filtersAccount,
      attributesQuery,
      contextAttributesList,
      containerManagerSearchList,
      // Methods
      keyAction,
      closeList,
      clearValues,
      changeRecord,
      setPageNumber,
      loadCombinations,
      searchRecordsList,
      valuesCombinations,
      handleCurrentChange,
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
