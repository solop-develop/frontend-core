<template>
  <el-container
    key="child-income-loaded"
    class="view-base child-income-view"
  >
    <el-main class="form-time-control" :style="isMobile ? 'overflow: auto;' : ''">
      <el-card class="box-card" style="padding-bottom: 20px;">
        <el-form
          label-position="top"
        >
          <el-row style="padding-bottom: 10px;">
            <el-col
              :span="sizeColumn"
            >
              <span v-for="(field) in metadataList" :key="field.columnName">
                <field-definition
                  v-if="field.columnName === 'S_ResourceType_ID'"
                  :metadata-field="{
                    ...field,
                    size: 24
                  }"
                  :container-uuid="'ChildIncome'"
                  :container-manager="containerManager"
                />
              </span>
            </el-col>
            <el-col :span="sizeColumn">
              <el-form-item
                :label="$t('timeControl.name')"
                :rules="{
                  required: true
                }"
                :style="cssStyleFrontName"
              >
                <el-input v-model="name" type="text" />
              </el-form-item>
            </el-col>
            <el-col :span="sizeColumn">
              <el-form-item
                :label="$t('timeControl.description')"
                :style="cssStyleFront"
              >
                <el-input v-model="description" type="textarea" autosize />
              </el-form-item>
            </el-col>
            <el-col :span="isMobile ? 24 : 3">
              <el-form-item
                :style="cssStyleButton"
              >
                <el-button
                  type="primary"
                  :loading="isLoadingCreate"
                  :disabled="isValidateAdd"
                  @click="addNewRecord()"
                >
                  {{ $t('timeControl.addChild') }}
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <el-collapse v-model="activeCollapse" accordion>
          <el-collapse-item :title="$t('timeControl.searchRecords')" name="query-criteria">
            <el-form
              label-position="top"
            >
              <el-row style="padding-bottom: 10px;">
                <el-col
                  :span="isMobile ? 24 : 7"
                >
                  <span v-for="(field) in metadataList" :key="field.columnName">
                    <field-definition
                      v-if="field.columnName === 'RecurringTypeSearch'"
                      :metadata-field="{
                        ...field,
                        size: 24
                      }"
                      :container-uuid="'ChildIncome'"
                      :container-manager="containerManager"
                    />
                  </span>
                </el-col>

                <el-col :span="isMobile ? 24 : 7">
                  <el-form-item
                    :label="$t('timeControl.name')"
                    :style="cssStyleFrontName"
                  >
                    <el-input v-model="nameFind" type="text" />
                  </el-form-item>
                </el-col>
                <el-col :span="isMobile ? 24 : 6">
                  <el-form-item
                    :label="$t('timeControl.description')"
                    :style="cssStyleFront"
                  >
                    <el-input v-model="descriptionFind" type="textarea" autosize />
                  </el-form-item>
                </el-col>

                <el-col :span="isMobile ? 24 : 3">
                  <el-form-item
                    :label="$t('timeControl.confirmed')"
                    :style="cssStyleFront"
                  >
                    <el-select
                      v-model="confirmedFind"
                      style="display: block;"
                    >
                      <el-option
                        v-for="item in confirmedOptionsList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="isMobile ? 24 : 1">
                  <el-form-item
                    :style="cssStyleButton"
                  >
                    <el-button
                      type="primary"
                      :loading="isLoadingRecords"
                      icon="el-icon-search"
                      @click="listResource"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
        </el-collapse>

        <el-table
          v-loading="isLoadingRecords"
          :data="tableData"
          stripe
          height="540"
          highlight-current-row
          border
          style="width: 100%;padding-right: 20px !important;"
          @row-click="handleRowClick"
        >
          <el-table-column
            v-for="(head, key) in heardList"
            :key="key"
            :label="head.label"
            :align="head.align"
            :width="isMobile ? '180px' : head.size"
            header-align="center"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.isEditRow && (head.columnName === 'name')">
                <el-input ref="namePanelEdit" v-model="scope.row[head.columnName]" :autofocus="true" type="text" />
              </span>
              <span v-else-if="scope.row.isEditRow && (head.columnName === 'description')">
                <el-input v-model="scope.row[head.columnName]" :autofocus="true" type="text" />
              </span>
              <span v-else>
                {{ scope.row[head.columnName] }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('form.pos.tableProduct.options')"
            width="195px"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                :disabled="scope.row.isConfirmed"
                type="success"
                :icon="scope.row.isEditRow ? 'el-icon-check' : 'el-icon-edit'"
                size="mini"
                @click="editChild(scope.row)"
              />
              <el-button
                :disabled="scope.row.isConfirmed"
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteChild(scope.row)"
              />

              <el-popover
                :ref="scope.row.id"
                placement="top"
                width="200"
              >
                <p style="white-space: break-spaces; word-break: break-word;">
                  {{ $t('timeControl.confirmProcessRecord') }}
                </p>
                <div style="text-align: right;margin: 0px;">
                  <el-button
                    type="danger"
                    icon="el-icon-close"
                    size="small"
                    @click="closeList(scope.row.id)"
                  />
                  <el-button type="primary" size="mini" icon="el-icon-check" @click="confirmResiurce(scope.row)" />
                </div>
                <el-button
                  slot="reference"
                  :disabled="scope.row.isConfirmed"
                  type="primary"
                  icon="el-icon-check"
                  size="mini"
                  style="margin-left: 10px;"
                />
              </el-popover>
            </template>
          </el-table-column>
        </el-table>

        <el-row :gutter="24">
          <el-col :span="24">
            <custom-pagination
              :total="recordCount"
              :records-page="tableData.length"
              :selection="selection"
              :handle-change-page="setPage"
            />
          </el-col>
        </el-row>
      </el-card>
    </el-main>
  </el-container>
</template>

<script>
import { defineComponent, ref, computed } from '@vue/composition-api'

import lang from '@/lang'
import store from '@/store'

// componets and mixins
import TitleAndHelp from '@/components/ADempiere/TitleAndHelp'
import FieldDefinition from '@/components/ADempiere/FieldDefinition/index.vue'
import heardList from './headerTable'
import fieldsList from './fieldsList'
import CustomPagination from '@/components/ADempiere/DataTable/Components/CustomPagination.vue'

// api request methods
import {
  requestCreateResource,
  requestUpdateResource,
  requestDeleteResource,
  requestListResource,
  requestConfirmResourceAssignnment
} from '@/api/ADempiere/form/timeControl.js'

// utils and helper methods
import { generatePageToken } from '@/utils/ADempiere/dataUtils'
import { createFieldFromDictionary } from '@/utils/ADempiere/lookupFactory'
import { ROW_ATTRIBUTES } from '@/utils/ADempiere/tableUtils'
import { showMessage } from '@/utils/ADempiere/notification'
import { containerManager as containerManagerForm } from '@/utils/ADempiere/dictionary/form/index.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { timeFormat } from '@/utils/ADempiere/formatValue/dateFormat'
import { convertBooleanToTranslationLang } from '@/utils/ADempiere/formatValue/booleanFormat.js'

export default defineComponent({
  name: 'TimeControl',

  // Components Used on the Panel

  components: {
    FieldDefinition,
    TitleAndHelp,
    CustomPagination
  },

  // Components Used on the Panel

  props: {
    metadata: {
      type: Object,
      required: true
    }
  },

  setup() {
    /**
     * Ref
     * @param {string} name - Header Name Field Value
     * @param {string} nameEdit - Temporary value of the selected column name to validate before saving
     * @param {number} timeOutFocus - Timeout for activating focus when editing a column
     * @param {string} descriptionEdit -Temporary value of the selected column description to validate before saving
     * @param {string} description - Header Description Field Value
     * @param {array} tableData - Records to be shown in the Template table
     * @param {boolean} isLoadingFields - Bandera de Carga de Campos
     * @param {boolean} isLoadingCreate - Button Load Flag when adding a new record to the timekeeping table
     * @param {array} metadataList - List of field metadata created with createFieldFromDictionary
     */
    const activeCollapse = ref(['query-criteria'])
    const name = ref('')
    const nameFind = ref('')
    const nameEdit = ref('')
    const timeOutFocus = ref(null)
    const descriptionEdit = ref('')
    const descriptionFind = ref('')
    const description = ref('')
    const tableData = ref([])
    const isLoadingFields = ref(false)
    const isLoadingCreate = ref(false)
    const metadataList = ref([])
    const confirmedFind = ref('N')
    const confirmedOptionsList = ref([
      {
        value: undefined,
        label: ' '
      },
      {
        value: 'Y',
        label: lang.t('components.switchActiveText')
      },
      {
        value: 'N',
        label: lang.t('components.switchInactiveText')
      }
    ])
    const isLoadingRecords = ref(false)
    // Pagination
    const recordCount = ref(0)
    const pageNumber = ref(0)
    const currentResource = ref({})
    const visible = ref(false)

    /**
     * Computed
     * isValidateAdd - Validate required fields before sending save
     * recurringType - Get ID of the resource value
     * recurringTypeUuid - Get UUID of the resource value
     * isMobile - Detect a mobile device
     * sizeColumn - Column size if it is a mobile device
     * cssStyleFront - Customized style for the Form
     * cssStyleFrontName -Customized style for the Form Name
     * cssStyleButton Customized style for the Button
     */

    const isValidateAdd = computed(() => {
      if (isEmptyValue(recurringType.value) || isEmptyValue(name.value)) {
        return true
      }
      return false
    })

    const recurringType = computed(() => {
      return store.getters.getValueOfField({
        containerUuid: 'ChildIncome',
        columnName: 'S_ResourceType_ID'
      })
    })
    const recurringTypeUuid = computed(() => {
      return store.getters.getValueOfField({
        containerUuid: 'ChildIncome',
        columnName: 'S_ResourceType_ID_UUID'
      })
    })

    const isMobile = computed(() => {
      return store.state.app.device === 'mobile'
    })

    const sizeColumn = computed(() => {
      if (isMobile.value) {
        return 24
      }
      return 7
    })

    const cssStyleFront = computed(() => {
      if (isMobile.value) {
        return 'margin: 10px 10px 0px;'
      }
      return 'margin-right: 10px;margin-left: 10px;'
    })

    const cssStyleFrontName = computed(() => {
      if (isMobile.value) {
        return 'margin-top: 20px;margin-right: 10px;margin-bottom: 0px;margin-left: 10px;'
      }
      return 'margin-right: 10px;margin-left: 10px;'
    })

    const cssStyleButton = computed(() => {
      if (isMobile.value) {
        return 'padding-top: 20px;padding-bottom: 10px;text-align: center;margin-bottom: 0px !important;'
      }
      return 'padding-top: 35px;'
    })

    const selection = computed(() => {
      if (isEmptyValue(currentResource.value)) {
        return 0
      }
      return 1
    })

    /**
     * Methods
     * addNewRecord - Add new record in time control table
     * @param {object} updateCurrentRow - Update record in time control table
     * @param {object} deleteChild - Delete record in time control table
     * @param {object} editChild - Update record in time control table
     * setFieldsList - Load field list with createFieldFromDictionary
     * listResource - List Control Table
     * @param {object} confirmResiurce - Change status of a record in the time control table
     */

    function addNewRecord() {
      isLoadingCreate.value = true
      requestCreateResource({
        resourceTypeUuid: recurringTypeUuid.value,
        resourceTypeId: recurringType.value,
        name: name.value,
        description: description.value
      })
        .then(response => {
          store.commit('updateValuesOfContainer', {
            containerUuid: 'ChildIncome',
            attributes: [
              {
                columnName: 'S_ResourceType_ID',
                value: undefined
              },
              {
                columnName: 'S_ResourceType_ID_UUID',
                value: undefined
              },
              {
                columnName: 'DisplayColumn_S_ResourceType_ID',
                value: undefined
              }
            ]
          })
          showMessage({
            message: lang.t('data.createRecordSuccessful'),
            type: 'success'
          })
          name.value = ''
          description.value = ''
        })
        .catch(error => {
          showMessage({
            message: error,
            type: 'error'
          })
          console.warn(`requestCreateResource: Add Resource Server (State) - Error ${error.code}: ${error.message}.`)
        })
        .finally(() => {
          listResource()
          isLoadingCreate.value = false
        })
    }

    function updateCurrentRow(row) {
      const { id, uuid, name, description } = row

      requestUpdateResource({
        id,
        uuid,
        name,
        description
      })
        .then(() => {
          showMessage({
            message: lang.t('recordManager.updatedRecord'),
            type: 'success'
          })
        })
        .catch(error => {
          showMessage({
            message: error,
            type: 'error'
          })
          console.warn(`requestUpdateResource: Update Resource Server (State) - Error ${error.code}: ${error.message}.`)
        })
        .finally(() => {
          listResource()
        })
    }

    function deleteChild(row) {
      const { id, uuid } = row

      requestDeleteResource({
        id,
        uuid
      })
        .then(response => {
          showMessage({
            message: lang.t('recordManager.deleteRecordSuccessful'),
            type: 'success'
          })
        })
        .catch(error => {
          showMessage({
            message: error,
            type: 'error'
          })
          console.warn(`requestDeleteResource: Delete Resource Server (State) - Error ${error.code}: ${error.message}.`)
        })
        .finally(() => {
          listResource()
        })
    }

    function editChild(row) {
      clearTimeout(timeOutFocus.value)
      timeOutFocus.value = setTimeout(() => {
        // search on server
        this.$refs.namePanelEdit[0].focus()
      }, 500)
      if (row.isEditRow && (nameEdit.value !== row.name || descriptionEdit.value !== row.description)) {
        updateCurrentRow(row)
      } else {
        nameEdit.value = row.name
        descriptionEdit.value = row.description
      }
      row.isEditRow = !row.isEditRow
    }

    function setFieldsList() {
      const list = []
      fieldsList.forEach(element => {
        createFieldFromDictionary(element)
          .then(responseField => {
            list.push({
              ...responseField,
              isReadOnly: false,
              containerUuid: 'ChildIncome'
            })
          }).catch(error => {
            showMessage({
              message: error,
              type: 'error'
            })
            console.warn(`createFieldFromDictionary: Get Field From Server (State) - Error ${error.code}: ${error.message}.`)
          })
          .finally(() => {
            metadataList.value = list
            isLoadingFields.value = true
          })
      })
    }

    function confirmResiurce(row) {
      const { id, uuid } = row
      requestConfirmResourceAssignnment({
        id,
        uuid
      })
        .then(() => {
          showMessage({
            message: lang.t('timeControl.recordConfirmed'),
            type: 'success'
          })
        })
        .catch(error => {
          showMessage({
            message: error,
            type: 'error'
          })
          console.warn(`requestConfirmResourceAssignnment: Confirme Resource Server (State) - Error ${error.code}: ${error.message}.`)
        })
        .finally(() => {
          listResource()
          this.$refs[id].doClose()
          this.$refs[id ].doShow()
          this.$refs[id].showPopper = false
        })
    }

    function listResource(pageNumber) {
      const resourceTypeId = store.getters.getValueOfField({
        containerUuid: 'ChildIncome',
        columnName: 'RecurringTypeSearch'
      })
      const pageToken = generatePageToken({ pageNumber })

      isLoadingRecords.value = true
      requestListResource({
        resourceTypeId,
        name: nameFind.value,
        description: descriptionFind.value,
        confirmed: confirmedFind.value,
        pageToken
      })
        .then(response => {
          recordCount.value = response.recordCount
          const { records } = response
          // if (!isEmptyValue(nextPageToken)) {
          //   pageNumber.value = nextPageToken.split('')[nextPageToken.length - 1]
          // }
          // pageNumber.value = isEmptyValue(response.nextPageToken) ? '' : response.nextPageToken.split('')[response.nextPageToken.length - 1]
          const recordsList = records.map(row => {
            let dateTo = null
            if (String(row.assign_date_to).length >= 10) {
              dateTo = timeFormat({
                value: row.assign_date_to
              })
            }
            return {
              ...row,
              resourceNameType: row.resource.resource_type.name,
              dateFrom: timeFormat({
                value: row.assign_date_from
              }),
              dateTo,
              is_confirmed: convertBooleanToTranslationLang(row.is_confirmed),
              isConfirmed: row.is_confirmed,
              ...ROW_ATTRIBUTES
            }
          })
          tableData.value = recordsList
          isLoadingRecords.value = false
        }).catch(error => {
          showMessage({
            message: error,
            type: 'error'
          })
          isLoadingRecords.value = false
          console.warn(`requestListResource: List Resource Server (State) - Error ${error.code}: ${error.message}.`)
        })
    }

    function handleRowClick(row) {
      currentResource.value = row
    }

    if (!isLoadingFields.value) {
      setFieldsList({})
    }

    // Get Record Control Table
    function setPage(pageNumber) {
      listResource(pageNumber)
    }

    function closeList(params) {
      this.$refs[params].doClose()
      this.$refs[params].doShow()
      this.$refs[params].showPopper = false
    }

    listResource()

    return {
      // Ref
      activeCollapse,
      name,
      nameEdit,
      descriptionEdit,
      description,
      tableData,
      isLoadingFields,
      isLoadingCreate,
      metadataList,
      timeOutFocus,
      confirmedFind,
      confirmedOptionsList,
      nameFind,
      descriptionFind,
      isLoadingRecords,
      recordCount,
      pageNumber,
      currentResource,
      visible,
      // Computeds
      recurringType,
      recurringTypeUuid,
      isValidateAdd,
      isMobile,
      // Css - Computeds
      sizeColumn,
      cssStyleFront,
      cssStyleFrontName,
      cssStyleButton,
      selection,
      // import
      heardList,
      containerManager: {
        ...containerManagerForm
      },
      // Methods
      addNewRecord,
      deleteChild,
      editChild,
      listResource,
      confirmResiurce,
      setPage,
      handleRowClick,
      closeList
    }
  }
})
</script>

<style lang="scss">
.el-card__body {
  padding-right: 20px !important;
  padding-left: 20px !important;
}

.form-time-control {
  /**
   * Reduce the spacing between the form element and its label
   */
  .el-form-item__label {
    padding-bottom: 0px;
  }
}
</style>
