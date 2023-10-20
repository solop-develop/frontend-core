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

// API Request Methods
import { requestProcessMetadata } from '@/api/ADempiere/dictionary/index.ts'

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
    function infoImportFormats(id) {
      if (isEmptyValue(id)) return
      store.dispatch('importFormats', {
        id
      })
        .then(response => {
          formatFields.value = response.formatFields
        })
    }

    const singleTable = ref(null)

    function loadProcess(process) {
      const { id } = process
      requestProcessMetadata({
        id
      })
        .then(response => {
          store.dispatch('getProcessDefinitionFromServer', {
            id: response.id.toString()
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
      infoImportFormats,
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
