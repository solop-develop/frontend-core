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
      <div slot="header" class="clearfix-express-receipt">
        <el-row :gutter="24">

          <el-col :span="8">
            <upload-resource
              table-name="AD_ImpFormat"
              :record-id="100000"
            />
          </el-col>

          <el-form
            ref="form-express-receipt"
            label-position="top"
            class="field-from"
            inline
          >
            <el-col :span="8">
              <el-form-item
                label="lista de conjuntos de caracteres"
                style="width: 100%;"
              >
                <el-select
                  v-model="currrentCharsets"
                  style="width: 100%;"
                  filterable
                  clearable
                  :remote-method="remoteSearchCharsets"
                  @visible-change="findCharsets"
                >
                  <el-option
                    v-for="item in optionsCharsets"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="Formato de Importación"
                style="width: 100%;"
              >
                <el-select
                  v-model="currrentImportFormats"
                  style="width: 100%;"
                  filterable
                  clearable
                  :remote-method="remoteSearchImportFormats"
                  @visible-change="findImportFormats"
                >
                  <el-option
                    v-for="item in optionsImportFormats"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </div>
      <br>

      <el-table
        :data="dataTable"
        border
        highlight-current-row
        style="width: 100%"
        height="450"
      >
        <el-table-column
          v-for="item of headerTable"
          :key="item.label"
          :width="(item.length >= 5) ? '350' : 'auto'"
        >
          <template slot="header" slot-scope="scope">
            {{ scope.row }}
            <span v-if="isEmptyValue(formatFields)">
              {{ item.label }}
            </span>
            <span v-else>
              <el-dropdown trigger="click" @command="handleFormat">
                <span class="el-dropdown-link">
                  {{ item.label }} <svg-icon icon-class="more-vertical" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <template
                    v-for="field in formatFields"
                  >
                    <el-dropdown-item
                      :key="field.id"
                      :command="{
                        header: item,
                        field: field.name
                      }"
                    >
                      {{ field.name }}
                    </el-dropdown-item>
                  </template>
                </el-dropdown-menu>
              </el-dropdown>
            </span>
          </template>
          <template slot-scope="scope">
            {{ scope.row[item.key] }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import {
  defineComponent,
  ref,
  computed
} from '@vue/composition-api'

import store from '@/store'

// Components and Mixins
import UploadExcelComponent from '@/themes/default/components/UploadExcel/index.vue'
import UploadResource from '@/themes/default/components/ADempiere/PanelInfo/Component/AttachmentManager/uploadResource.vue'

// Api Request Methods
import {
  listCharsets,
  listImportFormats
} from '@/api/ADempiere/form/VFileImport.js'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere'

export default defineComponent({
  name: 'VFileImport',

  components: {
    UploadExcelComponent,
    UploadResource
  },

  setup() {
    /**
     * Ref
     */
    const headerTable = ref([])
    const dataTable = ref([])
    const formatFields = ref([])

    /**
     * Computed
     */
    const currrentCharsets = computed({
      // getter
      get() {
        const { charsets } = store.getters.getAttribute
        return charsets
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
        return importFormats
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

    // Optener Excel

    function beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (isLt1M) {
        return true
      }
      console.log('error')
      return false
    }

    function handleSuccess({ data, workbook, firstSheetName, worksheet, results, header }) {
      const epale = results.filter((data, index) => {
        if (index <= 50) {
          return data
        }
      })
      dataTable.value = epale
      headerTable.value = header.map(list => {
        return {
          key: list,
          label: list
        }
      })
    }
    /**
     * Watch
     */
    return {
      // Ref
      headerTable,
      dataTable,
      formatFields,
      // Computed
      optionsCharsets,
      currrentCharsets,
      optionsImportFormats,
      currrentImportFormats,
      // Methods
      findCharsets,
      infoImportFormats,
      findImportFormats,
      remoteSearchCharsets,
      remoteSearchImportFormats,
      // Optener CSV
      beforeUpload,
      handleSuccess,
      handleFormat
      // Action Panel Footer
    }
  }
})
</script>
