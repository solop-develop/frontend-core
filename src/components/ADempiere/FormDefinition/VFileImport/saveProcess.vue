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
                    {{ currentCharset }}
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
                    {{ importFormat.name }}
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
                  v-if="!isEmptyValue(importProcessList) && importProcessList.length > 0"
                  plain
                  split-button
                  :hide-on-click="true"
                  :class="{ 'action-container': true, 'without-defualt-action': false }"
                  @click="loadProcess({ processId: importProcessList[0].id, processUuid: importProcessList[0].values.UUID })"
                  @command="handleCommand"
                >
                  <span>
                    {{ importProcessList[0].values.DisplayColumn }}
                  </span>
                  <el-dropdown-menu
                    slot="dropdown"
                  >
                    <template
                      v-for="(process, index) in importProcessList"
                    >
                      <el-dropdown-item
                        :key="index"
                        :command="process.id + '|' + process.values.UUID"
                      >
                        {{ process.values.DisplayColumn }}
                      </el-dropdown-item>
                    </template>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-tag
                  v-else-if="!isEmptyValue(importProcessList) && importProcessList.length === 1"
                  @click="loadProcess(importProcessList[0].id)"
                >
                  <b style="font-size: 16px;">
                    {{ importProcessList[0].values.DisplayColumn }}
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
      v-if="isProcess && !isEmptyValue(getProcessDefinition)"
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
  watch
} from '@vue/composition-api'

import store from '@/store'

// Components and Mixins
import PanelDefinition from '@/components/ADempiere/PanelDefinition/index.vue'

// Utils and Helper Methods
import { containerManager } from '@/utils/ADempiere/dictionary/process.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'saveProcess',

  components: {
    PanelDefinition
  },

  setup() {
    /**
     * Computed
     */
    const storedTableName = computed(() => {
      return store.getters.getStoredCurrentTableName
    })

    const currentCharset = computed(() => {
      const { charsets } = store.getters.getAttribute
      return charsets
    })

    const importFormat = computed(() => {
      return store.getters.getImportFormat
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
        if (value) {
          store.dispatch('getProcessesListFromServer', storedTableName.value)
        }
      }
    })

    const importProcessList = computed(() => {
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
    function loadProcess({ processId, processUuid }) {
      const storedProcess = store.getters.getStoredProcess(processUuid)
      if (!isEmptyValue(storedProcess)) {
        store.commit('updateAttributeVFileImport', {
          attribute: 'attribute',
          criteria: 'processDefinition',
          value: storedProcess
        })
        return
      }
      store.dispatch('getProcessDefinitionFromServer', {
        id: processId
      })
        .then(processResponse => {
          store.commit('updateAttributeVFileImport', {
            attribute: 'attribute',
            criteria: 'processDefinition',
            value: processResponse
          })
        })
    }

    function handleCommand(key) {
      const values = key.split('|')
      loadProcess({
        processId: values.at(0),
        processUuid: values.at(1)
      })
    }

    watch(importProcessList, (newValue, oldValue) => {
      if (!isEmptyValue(newValue)) {
        const currentProcess = newValue.at()
        loadProcess({
          processId: currentProcess.id,
          processUuid: currentProcess.values.UUID
        })
      }
    })

    return {
      // Ref
      isProcess,
      spanSize,
      // Computed
      importProcessList,
      containerManager,
      getProcessDefinition,
      currentCharset,
      importFormat,
      // Methods
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
