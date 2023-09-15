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
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program. If not, see <https:www.gnu.org/licenses/>.
-->

<template>
  <el-container
    key="child-income-loaded"
    class="view-base child-income-view"
  >
    <el-header>
      <div class="center" style="width: 100%">
        <title-and-help
          :name="$t('window.childIncome')"
          :help="$t('window.childIncome')"
        />
      </div>
    </el-header>

    <el-main>
      <el-card class="box-card">
        <el-form
          ref="form"
          :inline="true"
          label-width="120px"
          style="margin-top: 50px !important;margin-left: 5px !important;margin-bottom: 20px !important;"
        >
          <field-definition
            v-for="(field) in metadataList"
            :key="field.columnName"
            :metadata-field="field"
            :container-uuid="'ChildIncome'"
            :container-manager="containerManager"
          />
          <el-form-item :label="$t('timeControl.name')">
            <el-input v-model="name" type="text" />
          </el-form-item>
          <el-form-item :label="$t('timeControl.description')">
            <el-input v-model="description" type="textarea" autosize />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              :loading="isLoadingCreate"
              :disabled="isValidateAdd"
              @click="addChild()"
            >
              {{ $t('timeControl.addChild') }}
            </el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="tableData"
          stripe
          highlight-current-row
          border
          style="width: 100%;margin-bottom: 20px;"
        >
          <el-table-column
            v-for="(head, key) in heardList"
            :key="key"
            :label="head.label"
            :align="head.align"
            header-align="center"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.isEditRow && (head.columnName === 'name' || head.columnName === 'description')">
                <el-input v-model="scope.row[head.columnName]" type="text" />
              </span>
              <span v-else>
                {{ scope.row[head.columnName] }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('form.pos.tableProduct.options')"
          >
            <template slot-scope="scope">
              <el-button :type="scope.row.isEditRow ? 'primary' : 'success'" :icon="scope.row.isEditRow ? 'el-icon-check' : 'el-icon-edit'" size="mini" style="margin-right: 3%;" @click="editChild(scope.row)" />
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteChild(scope.row)" />
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-main>
  </el-container>
</template>

<script>
import { defineComponent, ref, computed } from '@vue/composition-api'

import store from '@/store'

// componets and mixins
import TitleAndHelp from '@/components/ADempiere/TitleAndHelp'
import FieldDefinition from '@/components/ADempiere/FieldDefinition/index.vue'

// Constants
import fieldsList from './fieldsList'
import heardList from './headerTable'
import { ROW_ATTRIBUTES } from '@/utils/ADempiere/tableUtils'

// Utils and Helper Methods
import {
  requestCreateResource,
  requestUpdateResource,
  requestDeleteResource,
  requestListResource
} from '@/api/ADempiere/form/timeControl.js'
import { createFieldFromDictionary } from '@/utils/ADempiere/lookupFactory'
import { showMessage } from '@/utils/ADempiere/notification'
import { containerManager as containerManagerForm } from '@/utils/ADempiere/dictionary/form/index.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { translateDateByLong } from '@/utils/ADempiere/formatValue/dateFormat.js'

export default defineComponent({
  name: 'ChildIncome',

  components: {
    TitleAndHelp,
    FieldDefinition
  },

  setup() {
    // Ref
    const area = ref('')
    const name = ref('')
    const description = ref('')
    const tableData = ref([])
    const isLoadingFields = ref(false)
    const isLoadingCreate = ref(false)
    const metadataList = ref([])

    // computed
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

    // Function

    function addChild() {
      isLoadingCreate.value = true
      requestCreateResource({
        typeUuid: recurringTypeUuid.value,
        typeId: recurringType.value,
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
      requestUpdateResource({
        ...row
      })
        .then(response => {
          console.log({ response })
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
      requestDeleteResource({
        ...row
      })
        .then(response => {
          console.log({ response })
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
      if (row.isEditRow) {
        updateCurrentRow(row)
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

    function listResource() {
      requestListResource()
        .then(response => {
          const { records } = response
          const recordsList = records.map(row => {
            return {
              ...row,
              resourceNameType: row.resource.name,
              dateFrom: translateDateByLong(row.assign_date_from),
              dateTo: translateDateByLong(row.assign_date_to),
              ...ROW_ATTRIBUTES
            }
          })
          tableData.value = recordsList
        }).catch(error => {
          showMessage({
            message: error,
            type: 'error'
          })
          console.warn(`requestListResource: List Resource Server (State) - Error ${error.code}: ${error.message}.`)
        })
    }

    if (!isLoadingFields.value) {
      setFieldsList({})
    }

    listResource()

    return {
      // Ref
      area,
      name,
      description,
      tableData,
      isLoadingFields,
      isLoadingCreate,
      metadataList,
      // Computed
      recurringType,
      recurringTypeUuid,
      isValidateAdd,
      // import
      heardList,
      fieldsList,
      containerManager: {
        ...containerManagerForm
      },
      // function
      addChild,
      deleteChild,
      editChild,
      listResource
    }
  }
})
</script>
