<template>
  <el-container
    key="child-income-loaded"
    class="child-income-view"
  >
    <el-main>
      <el-collapse accordion>
        <el-collapse-item :title="$t('timeControl.addResource')" name="1">
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
                    style="padding-top: 10px;"
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
                  label="Confirmado"
                  :style="cssStyleFront"
                >
                  <el-select
                    v-model="confirmedFind"
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
                    @click="listResourcesAssignment"
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
        highlight-current-row
        border
        style="width: 100%;"
        @row-click="handleRowClick"
        @row-dblclick="addLine(currentResource)"
      >
        <el-table-column
          v-for="(head, key) in heardList"
          :key="key"
          :label="head.label"
          :align="head.align"
          :width="isMobile ? '110px' : head.size"
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
      </el-table>
      <el-row :gutter="24">
        <el-col :span="20">
          <custom-pagination
            :total="totalRecords"
            :records-page="tableData.length"
            :selection="selection"
            :handle-change-page="setPage"
          />
        </el-col>
        <el-col :span="24">
          <samp style="float: right; padding-right: 10px;">
            <el-button
              :loading="isLoadingRecords"
              type="success"
              icon="el-icon-refresh-right"
              @click="listResourcesAssignment();"
            />
            <el-button
              type="danger"
              class="custom-button-create-bp"
              icon="el-icon-close"
              @click="closeShowList()"
            />
            <el-button
              type="primary"
              class="custom-button-create-bp"
              icon="el-icon-check"
              @click="addLine(currentResource)"
            />
          </samp>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import { defineComponent, ref, computed } from '@vue/composition-api'

import lang from '@/lang'
import store from '@/store'
import router from '@/router'
// componets and mixins
import TitleAndHelp from '@/components/ADempiere/TitleAndHelp'
import CustomPagination from '@/components/ADempiere/DataTable/Components/CustomPagination.vue'
import FieldDefinition from '@/components/ADempiere/FieldDefinition/index.vue'
import heardList from './headerTable'
import fieldsList from './fieldsList'
import { containerManager as containerManagerForm } from '@/utils/ADempiere/dictionary/form/index.js'
// api request methods
import {
  requestCreateResource,
  requestUpdateResource,
  requestDeleteResource,
  requestListResource,
  requestConfirmResourceAssignnment
} from '@/api/ADempiere/form/timeControl.js'
import {
  createOrderLine
  // updateOrderLine
} from '@/api/ADempiere/form/point-of-sales.js'

// utils and helper methods
import { createFieldFromDictionary } from '@/utils/ADempiere/lookupFactory'
import { ROW_ATTRIBUTES } from '@/utils/ADempiere/tableUtils'
import { showMessage } from '@/utils/ADempiere/notification'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { timeFormat } from '@/utils/ADempiere/formatValue/dateFormat.js'
import { convertBooleanToTranslationLang } from '@/utils/ADempiere/formatValue/booleanFormat.js'
import { generatePageToken } from '@/utils/ADempiere/dataUtils'

export default defineComponent({
  name: 'TableTimeControl',

  // Components Used on the Panel

  components: {
    FieldDefinition,
    TitleAndHelp,
    CustomPagination
  },

  // Components Used on the Panel

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
    const name = ref('')
    const nameEdit = ref('')
    const timeOutFocus = ref(null)
    const descriptionEdit = ref('')
    const description = ref('')
    const tableData = ref([])
    const isLoadingFields = ref(false)
    const isLoadingCreate = ref(false)
    const metadataList = ref([])
    const currentResource = ref({})
    const isLoadingRecords = ref(false)
    // Pagination
    const totalRecords = ref(0)
    // Search
    const nameFind = ref('')
    const confirmedFind = ref('Y')
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
    const descriptionFind = ref('')

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
      return 'padding-top: 45px;'
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
     * listResource - List Control Table
     * @param {object} confirmResource - Change status of a record in the time control table
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
          listResourcesAssignment()
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
          listResourcesAssignment()
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
          listResourcesAssignment()
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

    function confirmResource(row) {
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
          listResourcesAssignment()
        })
    }
    function handleRowClick(row) {
      currentResource.value = row
    }

    function addLine(row, order) {
      const { resourceAssignmentUuid = row.uuid } = row
      const currentPointOfSales = store.getters.posAttributes.currentPointOfSales
      if (isEmptyValue(currentPointOfSales.currentOrder.uuid)) {
        createOrder(row)
        return
      }

      createOrderLine({
        posUuid: currentPointOfSales.uuid,
        orderUuid: currentPointOfSales.currentOrder.uuid,
        resourceAssignmentUuid
      })
        .then((response) => {
          store.dispatch('reloadOrder', { orderUuid: currentPointOfSales.currentOrder.uuid })
          showMessage({
            message: lang.t('timeControl.recordConfirmed'),
            type: 'success'
          })
          closeShowList()
        })
        .catch(error => {
          showMessage({
            message: error,
            type: 'error'
          })
          closeShowList()
          console.warn(`create Order Line: Confirme Resource Server (State) - Error ${error.code}: ${error.message}.`)
        })
    }
    function createOrder(resource) {
      store.dispatch('createOrder', {
        posUuid: store.getters.posAttributes.currentPointOfSales.uuid,
        customerUuid: store.getters.posAttributes.currentPointOfSales.templateCustomer.uuid,
        salesRepresentativeUuid: store.getters.posAttributes.currentPointOfSales.salesRepresentative.uuid
      })
        .then((response) => {
          router.push({
            params: {
              ...router.app._route.params
            },
            query: {
              ...router.app._route.query,
              action: response.uuid
            }
          })
          addLine(resource, response)
        })
        .catch(error => {
          showMessage({
            message: error,
            type: 'error'
          })
          console.warn(`create Order Line: Confirme Resource Server (State) - Error ${error.code}: ${error.message}.`)
        })
    }
    function closeShowList(params) {
      store.commit('showListResources', false)
      store.commit('setDialogoComponent', false)
      // router.push({
      //   params: {
      //     ...router.app._route.params
      //   },
      //   query: {
      //     ...router.app._route.query,
      //   }
      // })
      store.commit('setShowPOSOptions', false)
    }

    function listResourcesAssignment(pageNumber = 1) {
      const resourceTypeId = store.getters.getValueOfField({
        containerUuid: 'ChildIncome',
        columnName: 'RecurringTypeSearch'
      })
      isLoadingRecords.value = true
      requestListResource({
        resourceTypeId,
        name: nameFind.value,
        description: descriptionFind.value,
        confirmedFind: confirmedFind.value,
        isWaitingForOrdered: true,
        pageToken: generatePageToken({ pageNumber })
      })
        .then(response => {
          // recordCount.value = response.recordCount
          const { records, recordCount } = response
          totalRecords.value = recordCount
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

    function setPage(pageName) {
      listResourcesAssignment(pageName)
    }

    if (!isLoadingFields.value) {
      setFieldsList({})
    }

    // Get Record Control Table
    listResourcesAssignment()

    return {
      // Ref
      name,
      nameEdit,
      isLoadingRecords,
      descriptionEdit,
      description,
      tableData,
      isLoadingFields,
      isLoadingCreate,
      metadataList,
      timeOutFocus,
      currentResource,
      // Paginations
      totalRecords,
      nameFind,
      descriptionFind,
      confirmedFind,
      confirmedOptionsList,
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
      confirmResource,
      handleRowClick,
      addLine,
      closeShowList,
      createOrder,
      listResourcesAssignment,
      setFieldsList,
      setPage
    }
  }
})
</script>

<style>
.el-card__body {
  padding-right: 20px !important;
  padding-left: 20px !important;
}
</style>
