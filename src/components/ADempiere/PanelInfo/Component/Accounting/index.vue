<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Elsio Sanchez elsiosanches@gmail.com https://github.com/elsiosanchez
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <https:www.gnu.org/licenses/>.
-->

<template>
  <!-- <el-container> -->
  <div style="height: 98% !important;overflow: auto;">
    <div style="height: 15% !important;padding: 0px;">
      <el-card class="box-card">
        <el-divider content-position="left">
          {{ $t('window.containerInfo.accountingInformation.selection') }}
        </el-divider>
        <el-form
          ref="form-express-receipt"
          label-position="top"
          class="field-from"
          size="small"
          inline
        >
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item
                :label="$t('Esquema Contable')"
                class="front-item-receipt"
              >
                <el-select
                  v-model="accoutingSchemas"
                  style="width: 100%;"
                  filterable
                  @visible-change="listAccoutingSchemas"
                >
                  <el-option
                    v-for="item in listAccouting"
                    :key="item.KeyColumn"
                    :label="item.DisplayColumn"
                    :value="item.KeyColumn"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                :label="$t('Tipo de Aplicación')"
                class="front-item-receipt"
              >
                <el-select
                  v-model="postingType"
                  style="width: 100%;"
                  filterable
                  @visible-change="listPostingTypes"
                >
                  <el-option
                    v-for="item in listPosting"
                    :key="item.KeyColumn"
                    :label="item.DisplayColumn"
                    :value="item.KeyColumn"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>
    <div style="padding: 0px;height: 75% !important;">
      <div
        style="padding: 10px;height: -webkit-fill-available;"
      >
        <el-dropdown
          trigger="click"
          class="fields-display-accounting"
          @command="handleDisplayColumn"
        >
          <span class="el-dropdown-link">
            <svg-icon icon-class="list" />
          </span>

          <el-dropdown-menu slot="dropdown" style="max-width: 300px;">
            <el-dropdown-item
              command="showMinimalistView"
            >
              <svg-icon :icon-class="showMinimalistView ? 'eye-open' : 'eye'" />
              {{ $t('table.dataTable.showMinimalistView') }} {{ showMinimalistView }}
            </el-dropdown-item>
            <el-dropdown-item
              command="displayDocumentInformation"
            >
              <svg-icon :icon-class="displayDocumentInformation ? 'eye-open' : 'eye'" />
              {{ 'Mostrar Información de Documento' }}
            </el-dropdown-item>
            <el-dropdown-item
              command="displaySourceInformation"
            >
              <svg-icon :icon-class="displaySourceInformation ? 'eye-open' : 'eye'" />
              {{ 'Mostrar Información Fuente' }}
            </el-dropdown-item>
            <el-dropdown-item
              command="displayQuantity"
            >
              <svg-icon :icon-class="displayQuantity ? 'eye-open' : 'eye'" />
              {{ 'Mostrar Cantidad' }}
            </el-dropdown-item>
            <el-dropdown-item
              command="displayAll"
            >
              <svg-icon :icon-class="showAllColumns ? 'eye-open' : 'eye'" />
              {{ $t('table.dataTable.showAllColumns') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-table
          v-loading="isLoadingDataTable"
          :data="tableData"
          :element-loading-text="$t('notifications.loading')"
          element-loading-background="rgba(255, 255, 255, 0.8)"
          border
          style="height: 98%;"
        >
          <el-table-column
            type="index"
            label="#"
            width="35"
            header-align="left"
          />
          <el-table-column
            v-for="(head, key) in headerAccounting"
            :key="key"
            :label="head.label"
            :align="head.align"
            :min-width="head.width"
            header-align="center"
          >
            <template slot-scope="scope">
              {{ scope.row[head.columnName] }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div style="height: 6% !important;">
      <div style="margin-top: 10px;">
        <el-button
          :loading="isLoadingDataTable"
          type="success"
          class="button-base-icon"
          icon="el-icon-refresh-right"
          style="margin-top: 10px;float: right;"
          @click="refreshAccount"
        />
        <el-button
          plain
          type="primary"
          class="button-base-icon"
          icon="el-icon-download"
          style="margin-top: 10px;margin-right: 10px;float: right;"
          @click="exportAccounting"
        />
        <el-button
          type="primary"
          plain
          style="margin-right: 10px; !important"
          :loading="isLoadingRePost"
          :disabled="isLoadingRePost"
          @click="rePost"
        >
          {{ $t('accounting.rePosAccounting') }}
        </el-button>
        <el-checkbox
          v-model="force"
        >
          {{ $t('accounting.force') }}
        </el-checkbox>
      </div>
    </div>
  </div>
  <!-- </el-container> -->
</template>

<script>
import { defineComponent, ref, computed, watch } from '@vue/composition-api'

import store from '@/store'

// components and mixins
import fieldsList from './fieldsList'
import heardList from './heardList'
import FieldDefinition from '@theme/components/ADempiere/FieldDefinition/index.vue'
import { containerManager as containerManagerForm } from '@/utils/ADempiere/dictionary/form/index.js'
import { containerManager as containerManagerWindow } from '@/utils/ADempiere/dictionary/window'
import {
  createFieldFromDictionary
} from '@/utils/ADempiere/lookupFactory'

import {
  requestAccountingFacts,
  requestStartRePost,
  // List Select
  listAccoutingSchemasRequest,
  // listOrganizationsRequest,
  listPostingTypesRequest
} from '@/api/ADempiere/form/accouting.js'

// utils and helper methods
import { DISPLAY_COLUMN_PREFIX, UNIVERSALLY_UNIQUE_IDENTIFIER_COLUMN_SUFFIX } from '@/utils/ADempiere/dictionaryUtils'
import { formatDate } from '@/utils/ADempiere/formatValue/dateFormat'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { showMessage } from '@/utils/ADempiere/notification'
import { parseTime } from '@/utils'
import { exportFileFromJson } from '@/utils/ADempiere/exportUtil.js'
export default defineComponent({
  name: 'AccountingFact',

  components: {
    FieldDefinition
  },

  props: {
    allTabsList: {
      type: Array,
      default: () => []
    },
    containerUuid: {
      type: String,
      default: () => ''
    },
    tableName: {
      type: String,
      default: () => ''
    },
    recordId: {
      type: Number,
      default: () => 0
    },
    recordUuid: {
      type: String,
      default: () => ''
    }
  },

  setup(props) {
    const ACCOUTING_FACT_FORM = 'Accouting-Fact-Form'
    // Refs
    const tableData = ref([])
    const metadataList = ref([])
    const isLoadingDataTable = ref(false)
    const isLoadingFields = ref(false)
    const isLoadingRePost = ref(false)
    const force = ref(false)

    const displayDocumentInformation = ref(false)
    const displaySourceInformation = ref(false)
    const displayQuantity = ref(false)
    const showAllColumns = ref(false)
    const showMinimalistView = ref(true)
    const isLoadingTable = ref(false)

    const accoutingSchemas = ref('')
    const listAccouting = ref('')

    const postingType = ref('')
    const listPosting = ref([])

    // Computed
    const uuidForm = computed(() => {
      return ACCOUTING_FACT_FORM + '_' + props.containerUuid
    })

    const accoutingFilters = computed(() => {
      return store.getters.getValuesView({
        containerUuid: uuidForm.value,
        format: 'array'
      }).filter(attribute => {
        return !isEmptyValue(attribute.value) &&
          !(attribute.columnName.startsWith(DISPLAY_COLUMN_PREFIX) ||
          attribute.columnName.endsWith(UNIVERSALLY_UNIQUE_IDENTIFIER_COLUMN_SUFFIX))
      })
    })

    const showContainerInfo = computed(() => {
      return store.getters.getShowLogs
    })

    const headerAccounting = computed(() => {
      let header = []
      if (showAllColumns.value) return heardList
      if (showMinimalistView.value) return heardList.filter(list => list.default)
      switch (true) {
        case (displayDocumentInformation.value && displaySourceInformation.value && !displayQuantity.value):
          header = heardList.filter(list => list.default || list.displayDocumentInformation || list.displaySourceInformation)
          break
        case (displayDocumentInformation.value && displayQuantity.value && !displaySourceInformation.value):
          header = heardList.filter(list => list.default || list.displayDocumentInformation || list.displayQuantity)
          break
        case (displaySourceInformation.value && displayQuantity.value && !displayDocumentInformation.value):
          header = heardList.filter(list => list.default || list.displaySourceInformation || list.displayQuantity)
          break
        case (displaySourceInformation.value && displayQuantity.value && displayDocumentInformation.value):
          header = heardList.filter(list => list.default || list.displaySourceInformation || list.displayQuantity)
          break
        case (!displayDocumentInformation.value && !displayQuantity.value && !displaySourceInformation.value):
          header = heardList.filter(list => list.default || list.displayDocumentInformation)
          break
        case (displayDocumentInformation.value && !displayQuantity.value && !displaySourceInformation.value):
          header = heardList.filter(list => list.default || list.displayDocumentInformation)
          break
        case (displaySourceInformation.value && !displayDocumentInformation.value && !displayQuantity.value):
          header = heardList.filter(list => list.default || list.displaySourceInformation)
          break
        case (displayQuantity.value && !displaySourceInformation.value && !displayDocumentInformation.value):
          header = heardList.filter(list => list.default || list.displayQuantity)
          break
        case (!displaySourceInformation.value && !displayQuantity.value && !displayDocumentInformation.value):
          header = heardList.filter(list => list.default)
          break
      }
      return header
    })

    // Function

    function listAccoutingSchemas(isFind) {
      if (!isFind) return
      listAccoutingSchemasRequest({
        searchValue: accoutingSchemas.value
      })
        .then(response => {
          const { records } = response
          // let list = records
          listAccouting.value = records
          listAccouting.value = records.map(list => {
            const { KeyColumn, UUID, DisplayColumn } = list.values
            return {
              UUID,
              KeyColumn,
              DisplayColumn
            }
          })
        })
    }

    function listPostingTypes(isFind) {
      if (!isFind) return
      listPostingTypesRequest({
        searchValue: postingType.value
      })
        .then(response => {
          const { records } = response
          // let list = records
          listPosting.value = records.map(list => {
            const { KeyColumn, UUID, DisplayColumn } = list.values
            return {
              UUID,
              KeyColumn,
              DisplayColumn
            }
          })
        })
    }

    function setFieldsList() {
      const list = []
      fieldsList.forEach(element => {
        createFieldFromDictionary(element)
          .then(responseField => {
            list.push({
              ...responseField,
              isReadOnly: false,
              containerUuid: uuidForm.value
            })
          }).catch(error => {
            console.warn(`LookupFactory: Get Field From Server (State) - Error ${error.code}: ${error.message}.`)
          })
          .finally(() => {
            metadataList.value = list
            isLoadingFields.value = true
          })
      })
    }

    function findAccountingFacts() {
      if (isEmptyValue(accoutingSchemas.value)) {
        // showMessage({
        //   message: lang.t('notifications.mandatoryFieldMissing') + 'C_AcctSchema_ID',
        //   type: 'info'
        // })
        return
      }

      const accoutingSchemaUuid = store.getters.getValueOfField({
        containerUuid: uuidForm.value,
        columnName: 'C_AcctSchema_ID_UUID'
      })

      isLoadingDataTable.value = true
      requestAccountingFacts({
        accoutingSchemaId: accoutingSchemas.value,
        postingType: postingType.value,
        accoutingSchemaUuid,
        tableName: props.tableName,
        recordId: props.recordId,
        recordUuid: props.recordUuid,
        filters: []
      })
        .then(response => {
          const recordsList = response.recordsList.map(record => {
            const { id, uuid, tableName, attributes } = record
            return {
              ...attributes,
              DateAcct: formatDate({ value: attributes.DateAcct }),
              id,
              uuid,
              tableName
            }
          })
          tableData.value = recordsList
        })
        .catch(error => {
          console.warn(`LookupFactory: Get Accounting Facts From Server (State) - Error ${error.code}: ${error.message}.`)
        })
        .finally(() => {
          isLoadingDataTable.value = false
        })
    }

    function clearData() {
      tableData.value = []
      store.commit('updateValuesOfContainer', {
        containerUuid: uuidForm.value,
        attributes: [
          {
            columnName: 'C_AcctSchema_ID',
            value: undefined
          },
          {
            columnName: 'C_AcctSchema_ID_UUID',
            value: undefined
          },
          {
            columnName: 'DisplayColumn_C_AcctSchema_ID',
            value: undefined
          },
          {
            columnName: 'PostingType',
            value: undefined
          },
          {
            columnName: 'PostingType_UUID',
            value: undefined
          },
          {
            columnName: 'DisplayColumn_PostingType',
            value: undefined
          }
        ]
      })
    }

    function rePost() {
      isLoadingRePost.value = true
      requestStartRePost({
        tableName: props.tableName,
        recordId: props.recordId,
        recordUuid: props.recordUuid,
        isForce: force.value
      })
        .then(response => {
          if (!isEmptyValue(response.errorMsg)) {
            showMessage({
              message: response.errorMsg,
              type: 'error'
            })
          }
        })
        .catch(error => {
          console.warn(`LookupFactory: Get Start Re-Post Facts From Server (State) - Error ${error.code}: ${error.message}.`)
        })
        .finally(() => {
          isLoadingRePost.value = false
          findAccountingFacts(accoutingFilters.value)
        })
    }

    function handleDisplayColumn(displayColumn) {
      isLoadingDataTable.value = true
      setTimeout(() => {
        isLoadingDataTable.value = false
      }, 1000)
      if (displayColumn === 'displayAll') {
        showAllColumns.value = true
        displayDocumentInformation.value = false
        displaySourceInformation.value = false
        displayQuantity.value = false
        showMinimalistView.value = false
        return
      }
      if (displayColumn === 'showMinimalistView') {
        displayDocumentInformation.value = false
        displaySourceInformation.value = false
        displayQuantity.value = false
        showAllColumns.value = false
        showMinimalistView.value = true
        return
      }
      switch (displayColumn) {
        case 'displayDocumentInformation':
          // displaySourceInformation.value = false
          // displayQuantity.value = false
          showAllColumns.value = false
          showMinimalistView.value = false
          displayDocumentInformation.value = !displayDocumentInformation.value
          break
        case 'displaySourceInformation':
          displaySourceInformation.value = !displaySourceInformation.value
          // displayDocumentInformation.value = false
          // displayQuantity.value = false
          showAllColumns.value = false
          showMinimalistView.value = false
          break
        case 'displayQuantity':
          // displayDocumentInformation.value = false
          // displaySourceInformation.value = false
          showAllColumns.value = false
          showMinimalistView.value = false
          displayQuantity.value = !displayQuantity.value
          break
      }
    }

    function exportAccounting() {
      const fileName = listAccouting.value.find(list => list.KeyColumn === accoutingSchemas.value).DisplayColumn
      exportFileFromJson({
        header: headerAccounting.value.map(a => a.label),
        data: formatJson(headerAccounting.value.map(a => a.columnName), tableData.value),
        fileName,
        bookType: 'xlsx'
      })
    }

    function formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }

    if (isEmptyValue(accoutingSchemas.value)) {
      const globalAccoutingSchemaId = computed(() => {
        return store.getters.getSessionContext({
          columnName: '$C_AcctSchema_ID'
        })
      })
      listAccoutingSchemas(true)
      accoutingSchemas.value = globalAccoutingSchemaId.value
    }

    // Watch
    watch(accoutingSchemas, (newValue) => {
      findAccountingFacts(newValue)
    })
    watch(postingType, (newValue) => {
      findAccountingFacts(newValue)
    })
    watch(showContainerInfo, (newValue) => {
      clearData()
    })

    if (!isLoadingFields.value) {
      setFieldsList({})
    }

    function refreshAccount() {
      findAccountingFacts(accoutingFilters.value)
    }
    findAccountingFacts(accoutingFilters.value)

    return {
      // ref
      tableData,
      isLoadingFields,
      isLoadingDataTable,
      isLoadingRePost,
      metadataList,
      isLoadingTable,
      force,
      accoutingSchemas,
      listAccouting,
      postingType,
      listPosting,
      //
      displayDocumentInformation,
      displaySourceInformation,
      displayQuantity,
      showMinimalistView,
      showAllColumns,
      //
      containerManager: {
        ...containerManagerForm,
        getDefaultValue: containerManagerWindow.getDefaultValue
      },
      heardList,
      headerAccounting,
      // computed
      uuidForm,
      showContainerInfo,
      // methods
      setFieldsList,
      clearData,
      findAccountingFacts,
      refreshAccount,
      rePost,
      handleDisplayColumn,
      listAccoutingSchemas,
      listPostingTypes,
      exportAccounting
    }
  }

})
</script>

<style scoped lang="scss">
.fields-display-accounting {
  float: right  ;
  position: relative;
  color: #606266;
  font-size: 16px;
  /* float: right; */
  padding-left: 5px;
}
</style>
