<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 Contributor(s): Elsio Sanchez elsiosanchez15@outlook.com https://github.com/elsiosanchez
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
            <el-col :span="8" style="border: 1px solid rgb(230, 235, 245);padding: 0px 10px;">
              <el-form-item
                :label="$t('form.VFileImport.configureToImport.selectFileToImport')"
                style="width: 100%;text-align: center;margin-bottom: 0px !important;color: transparent !important;"
              >
                <upload-resource
                  style="display: inline-block; text-align: center;"
                  table-name="AD_ImpFormat"
                  :record-id="currrentImportFormats.value"
                  :load-data="handleSuccess"
                />

                <select-resource
                  :print-format-id="currrentImportFormats.value"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8" style="border: 1px solid #e6ebf5;">
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
            <el-col :span="8" style="border: 1px solid #e6ebf5;">
              <el-form-item
                :label="$t('form.VFileImport.selectTable.importFormat')"
                style="width: 100%;text-align: center;margin-bottom: 0px !important;"
              >
                <el-tag v-if="optionsImportFormats.length <= 1">
                  <b style="font-size: 16px;">
                    {{ currrentImportFormats.label }}
                  </b>
                </el-tag>
                <el-dropdown
                  v-else
                  plain
                  split-button
                  :hide-on-click="true"
                  :class="{ 'action-container': true, 'without-defualt-action': false }"
                  @command="handleCommand"
                >
                  <span>
                    {{ currrentImportFormats.label }}
                  </span>
                  <el-dropdown-menu
                    slot="dropdown"
                  >
                    <el-dropdown-item
                      v-for="(list, index) in optionsImportFormats"
                      :key="index"
                      :command="list.value"
                    >
                      {{ list.label }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </el-card>
      <br>

      <table-records />
    </el-card>

    <el-card
      v-if="!isEmptyValue(getInfoImportFormats)"
      shadow="never"
      style="padding: 0px 10px !important;"
    >
      <el-card
        shadow="never"
      >
        <p
          style="font-size: 18px;text-align: center;margin: 5px;"
        >
          <b>
            {{ getInfoImportFormats.name }}
          </b>
        </p>
        <p
          style="font-size: 14px;text-align: center;margin: 5px;"
        >
          {{ getInfoImportFormats.description }}
        </p>
      </el-card>

      <el-scrollbar wrap-class="scroll-list-field">
        <import-format-fields />
      </el-scrollbar>

      <el-row>
        <slot
          name="footer"
        />
      </el-row>
    </el-card>
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
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import UploadResource from '@/components/ADempiere/PanelInfo/Component/AttachmentManager/uploadResource.vue'
import TableRecords from './tableRecords.vue'
import ImportFormatFields from './importFormatFields.vue'
import SelectResource from './selectResource.vue'

// Api Request Methods
import {
  listCharsets,
  listImportFormats
} from '@/api/ADempiere/form/VFileImport.js'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere'

export default defineComponent({
  name: 'SelectFile',

  components: {
    TableRecords,
    ImportFormatFields,
    SelectResource,
    UploadExcelComponent,
    UploadResource
  },

  setup() {
    /**
     * Computed
     */
    const getInfoImportFormats = computed(() => {
      return store.getters.getInfoFormat
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

    const resourceId = computed(() => {
      const { id } = store.getters.getResourceReference
      return id
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

    function handleSuccess({ resource, file }) {
      store.commit('updateAttributeVFileImport', {
        attribute: 'file',
        criteria: 'resource',
        value: {
          ...resource,
          fileLabel: file.name
        }
      })
      store.dispatch('listFilePreview', resource)
    }

    function handleCommand(command) {
      store.commit('updateAttributeVFileImport', {
        attribute: 'attribute',
        criteria: 'importFormats',
        value: command
      })
      store.dispatch('listFilePreview')
    }

    watch(resourceId, (newValue, oldValue) => {
      if (!isEmptyValue(newValue) && newValue !== oldValue) {
        store.commit('updateAttributeVFileImport', {
          attribute: 'file',
          criteria: 'resource',
          value: { id: newValue }
        })
        store.dispatch('listFilePreview', newValue)
      }
    })

    return {
      // Ref
      formatFields,
      // Computed
      resourceId,
      optionsCharsets,
      currrentCharsets,
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
.scroll-list-field {
  max-height: 25vh;
}
</style>
