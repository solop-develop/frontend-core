<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Elsio Sanchez elsiosanchez15@outlook.com https://github.com/elsiosanchez
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
  <div class="main-express-receipt">
    <el-card class="box-card">
      <el-card>
        <el-row :gutter="24">
          <el-form
            ref="form-express-receipt"
            label-position="top"
            class="form-min-label"
            inline
          >
            <el-col :span="spanSize" style="border: 1px solid #e6ebf5;">
              <el-form-item
                :label="$t('form.VFileImport.selectTable.listOfCharacterSets')"
                style="width: 100%;text-align: center;margin-bottom: 0px !important;"
              >
                <el-tag>
                  <b style="font-size: 16px;">
                    {{ currrentCharsets.label }}
                  </b>
                </el-tag>
              </el-form-item>
            </el-col>
            <el-col :span="spanSize" style="border: 1px solid #e6ebf5;">
              <el-form-item
                :label="$t('form.VFileImport.selectTable.importFormat')"
                style="width: 100%;text-align: center;margin-bottom: 0px !important;"
              >
                <el-tag>
                  <b style="font-size: 16px;">
                    {{ currrentImportFormats.label }}
                  </b>
                </el-tag>
              </el-form-item>
            </el-col>
            <el-col :span="spanSize" style="border: 1px solid #e6ebf5;">
              <el-form-item
                :label="$t('form.VFileImport.step.saveAndProcess')"
                style="width: 100%;text-align: center;margin-bottom: 0px !important;"
              >
                <el-switch
                  v-model="isProcess"
                />
              </el-form-item>
            </el-col>
            <el-col v-if="isProcess" :span="spanSize" style="border: 1px solid #e6ebf5;">
              <el-form-item
                :label="$t('form.VFileImport.saveAndProcess.processes')"
                style="width: 100%;text-align: center;margin-bottom: 0px !important;"
              >
                <el-dropdown
                  v-if="!isEmptyValue(listProcess) && listProcess.length > 1"
                  plain
                  split-button
                  :hide-on-click="true"
                  :class="{ 'action-container': true, 'without-defualt-action': false }"
                  @click="loadProcess(listProcess[0])"
                  @command="handleCommand"
                >
                  <span>
                    {{ listProcess[0].DisplayColumn }}
                  </span>
                  <el-dropdown-menu
                    slot="dropdown"
                  >
                    <template
                      v-for="(process, index) in listProcess"
                    >
                      <el-dropdown-item
                        :key="index"
                        :command="process.uuid"
                      >
                        {{ process.DisplayColumn }}
                      </el-dropdown-item>
                    </template>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-tag
                  v-else-if="!isEmptyValue(listProcess) && listProcess.length === 1"
                  @click="loadProcess(listProcess[0])"
                >
                  <b style="font-size: 16px;">
                    {{ listProcess[0].DisplayColumn }}
                  </b>
                </el-tag>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </el-card>
      <br>
    </el-card>
    <el-card
      v-if="!isEmptyValue(getProcessDefinition)"
      shadow="never"
      style="padding: 0px 10px !important;"
    >
      <panel-definition
        :parent-uuid="''"
        :container-uuid="getProcessDefinition.containerUuid"
        :container-manager="containerManager"
        :is-filter-records="false"
        :is-tab-panel="true"
      />
    </el-card>
    <el-row>
      <slot
        name="footer"
      />
    </el-row>
  </div>
</template>

<script>
import {
  defineComponent,
  computed,
  watch,
  ref
} from '@vue/composition-api'

import store from '@/store'

// Components and Mixins
import PanelDefinition from '@/components/ADempiere/PanelDefinition/index.vue'
// Api Request Methods
import {
  listCharsets,
  listImportFormats
} from '@/api/ADempiere/form/VFileImport.js'
import { requestProcessMetadata } from '@/api/ADempiere/dictionary/process.js'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere'
import { containerManager } from '@/utils/ADempiere/dictionary/process.js'

export default defineComponent({
  name: 'saveProcess',

  components: {
    PanelDefinition
  },

  setup() {
    /**
     * Computed
     */

    const listField = ref([])

    const dataTable = computed(() => {
      const { data } = store.getters.getFile
      return data
    })

    const headerTable = computed(() => {
      const { header } = store.getters.getFile
      return header
    })

    const getInfoImportFormats = computed(() => {
      return store.getters.getInfoFormat
    })

    const currentLine = computed(() => {
      return store.getters.getNavigationLine
    })

    const spanSize = computed(() => {
      if (isProcess.value) return 6
      return 8
    })

    const isProcess = computed({
      // getter
      get() {
        const { isProcess } = store.getters.getAttribute
        return isProcess
      },
      // setter
      set(value) {
        store.commit('updateAttributeVFileImport', {
          attribute: 'attribute',
          criteria: 'isProcess',
          value: value
        })
      }
    })

    const formatFields = computed({
      // getter
      get() {
        const { formatFields } = store.getters.getAttribute
        return formatFields
      },
      // setter
      set(value) {
        store.commit('setInfoFormat', value)
      }
    })

    const currrentCharsets = computed({
      // getter
      get() {
        const { charsets } = store.getters.getAttribute
        const { listCharsets } = store.getters.getOptions
        const defautl = listCharsets.find(list => list.value === charsets)
        if (!isEmptyValue(defautl)) {
          return defautl
        }
        return {
          label: '',
          value: null
        }
      },
      // setter
      set(value) {
        store.commit('updateAttributeVFileImport', {
          attribute: 'attribute',
          criteria: 'charsets',
          value
        })
      }
    })

    const currrentImportFormats = computed({
      // getter
      get() {
        const { importFormats } = store.getters.getAttribute
        const { listImportFormats } = store.getters.getOptions
        const defautl = listImportFormats.find(list => list.value === importFormats)
        if (!isEmptyValue(defautl)) {
          return defautl
        }
        return {
          label: '',
          value: null
        }
      },
      // setter
      set(value) {
        store.commit('updateAttributeVFileImport', {
          attribute: 'attribute',
          criteria: 'importFormats',
          value
        })
        infoImportFormats(value)
      }
    })

    // List Options
    const optionsCharsets = computed({
      // getter
      get() {
        const { listCharsets } = store.getters.getOptions
        return listCharsets
        // return []
      },
      // setter
      set(list) {
        store.commit('updateAttributeVFileImport', {
          attribute: 'options',
          criteria: 'listCharsets',
          value: list
        })
      }
    })

    const optionsImportFormats = computed({
      // getter
      get() {
        const { listImportFormats } = store.getters.getOptions
        return listImportFormats
        // return []
      },
      // setter
      set(list) {
        store.commit('updateAttributeVFileImport', {
          attribute: 'options',
          criteria: 'listImportFormats',
          value: list
        })
      }
    })

    const listProcess = computed(() => {
      const { listProcess } = store.getters.getOptions
      return listProcess
    })

    const getProcessDefinition = computed(() => {
      const { processDefinition } = store.getters.getAttribute
      return processDefinition
    })

    /**
     * Methods
     */
    function remoteSearchCharsets(query) {
      if (!isEmptyValue(query) && query.length > 2) {
        const result = optionsCharsets.value.filter(findFilter(query))
        if (isEmptyValue(result)) {
          findCharsets(true, query)
        }
      }
    }

    function findCharsets(isFind, searchValue) {
      if (!isFind) {
        return
      }
      listCharsets({
        searchValue
      })
        .then(response => {
          const { records } = response
          optionsCharsets.value = records.map(list => {
            const { DisplayColumn, ValueColumn } = list.values
            return {
              value: ValueColumn,
              label: DisplayColumn
            }
          })
        })
    }

    function remoteSearchImportFormats(query) {
      if (!isEmptyValue(query) && query.length > 2) {
        const result = optionsImportFormats.value.filter(findFilter(query))
        if (isEmptyValue(result)) {
          findCharsets(true, query)
        }
      }
    }

    function findImportFormats(isFind, searchValue) {
      if (!isFind) {
        return
      }
      listImportFormats({
        searchValue
      })
        .then(response => {
          const { records } = response
          optionsImportFormats.value = records.map(list => {
            const { DisplayColumn } = list.values
            return {
              value: list.id,
              label: DisplayColumn
            }
          })
        })
    }

    function findFilter(queryString) {
      return (query) => {
        const search = queryString.toLowerCase()
        return query.label.toLowerCase().includes(search)
      }
    }

    function infoImportFormats(id) {
      if (isEmptyValue(id)) return
      store.dispatch('importFormats', {
        id
      })
        .then(response => {
          formatFields.value = response.formatFields
        })
    }

    function handleFormat(field) {
      const alo = headerTable.value.map(header => {
        if (field.header === header) {
          return {
            ...header,
            label: field.field
          }
        }
        return header
      })
      headerTable.value = alo
    }

    function handleSuccess({ results, header }) {
      const data = results.filter((data, index) => {
        if (index <= 50) {
          return data
        }
      })
      store.commit('updateAttributeVFileImport', {
        attribute: 'file',
        criteria: 'data',
        value: data
      })
      store.commit('updateAttributeVFileImport', {
        attribute: 'file',
        criteria: 'header',
        value: header.map(list => {
          return {
            key: list,
            label: list
          }
        })
      })
    }

    function displayValue(field, index) {
      const { header } = store.getters.getFile
      if (isEmptyValue(header)) return
      const line = formatFields.value.map(list => {
        return {
          ...list,
          defaultValue: currentLine.value[header[field.startNo - 1].key]
        }
      })
      listField.value = line
      return line[field.startNo - 1].defaultValue
    }
    const singleTable = ref(null)

    function loadProcess(process) {
      const { id } = process
      requestProcessMetadata({
        id
      })
        .then(response => {
          store.dispatch('getProcessDefinitionFromServer', {
            uuid: response.uuid
          })
            .then(processResponse => {
              store.commit('updateAttributeVFileImport', {
                attribute: 'attribute',
                criteria: 'processDefinition',
                value: processResponse
              })
            })
        })
    }

    function handleCommand(uuid) {
      const currentProcess = listProcess.value.find(list => list.uuid === uuid)
      loadProcess(currentProcess)
    }

    watch(isProcess, (newValue, oldValue) => {
      if (newValue) {
        const { tablaId } = store.getters.getAttribute
        const { listTables } = store.getters.getOptions
        const currentTable = listTables.find(list => list.id === tablaId)
        store.dispatch('listProcess', {
          tableName: currentTable.table_name
        })
      }
    })

    return {
      // Ref
      isProcess,
      spanSize,
      headerTable,
      dataTable,
      formatFields,
      listField,
      singleTable,
      // Computed
      currentLine,
      listProcess,
      optionsCharsets,
      currrentCharsets,
      containerManager,
      getProcessDefinition,
      getInfoImportFormats,
      optionsImportFormats,
      currrentImportFormats,
      // Methods
      findCharsets,
      infoImportFormats,
      findImportFormats,
      remoteSearchCharsets,
      remoteSearchImportFormats,
      handleSuccess,
      handleFormat,
      displayValue,
      loadProcess,
      handleCommand
    }
  }
})
</script>

<style lang="scss">
.el-table--border th.el-table__cell {
  border-bottom: 1px solid #dfe6ec;
  background: #E8F4FF;
}
.el-input.is-disabled .el-input__inner {
    background-color: #F5F7FA;
    border-color: #dfe4ed;
    color: rgb(27, 26, 26);
    cursor: not-allowed;
}
.action-container {
  &.without-defualt-action {
    .el-button {
      padding-left: 5px;
      padding-right: 8px;
    }
  }

  .el-button-group {
    // light blue style of the first section of the menu button
    // >.el-button::first-child {
    >.el-button:not(:last-child) {
      :not(.without-defualt-action) {
        min-width: 105px;
      }
      font-weight: bold;
      // margin-right: -1px;
      color: #0080ff;
      border-color: #0080ff;
      background: #ecf5ff;
    }

    // light blue style of the drop down menu section
    .el-button--primary:last-child {
      // margin-right: 2px;
      color: #0080ff;
      border-color: #0080ff;
      background: #e6f1fd;
      border-left-color: #000000 !important;
    }

    // dark blue style when pointing to the menu
    .el-button--primary:hover {
      background: #1890ff;
      border-color: #1890ff;
      color: #FFFFFF;
    }
    .el-button-group > .el-button:last-child {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      font-weight: bold !important;
      color: #0080ff;
      border-color: #0080ff;
      background: #ecf5ff;
    }
  }
}
</style>
