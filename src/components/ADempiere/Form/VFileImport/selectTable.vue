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
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program. If not, see <https:www.gnu.org/licenses/>.
-->

<template>
  <div>
    <el-row>
      <el-card
        id="panel-select-table"
        class="panel-select-table"
      >
        <div slot="header" class="clearfix" style="padding: 0px; !important">
          <h3
            v-if="isEmptyValue(currentTable)"
            style="text-align: center;margin: 0px;"
          >
            {{ $t('form.VFileImport.selectTable.title') }}
          </h3>
          <span
            v-else
          >
            <el-card
              shadow="never"
              style="width: 30%;display: inline-block;background-color: #eaf5fe;border: 1px solid #36a3f7;margin-top: 5px;"
            >
              <span>
                <span
                  style="float: left;font-size: 50px;margin: 0px;border-right-color: #dfe4ed;border-right-width: 1px;border-right-style: solid;padding: 5px;"
                >
                  <i v-if="currentTable.icon.type === 'i'" :class="currentTable.icon.class" />
                  <svg-icon v-else :icon-class="currentTable.icon.class" />
                </span>
                <p
                  style="text-align: center;margin: 0px;font-size: 12px;"
                >
                  <br>
                  <b>{{ currentTable.name }}</b>
                  <br>
                  {{ '( ' + currentTable.table_name + ' )' }}
                </p>
              </span>
            </el-card>
            <el-form
              ref="form-express-receipt"
              label-position="top"
              class="form-min-label"
              inline
              style="float: right;width: 50%;display: flex;"
            >
              <el-form-item
                style="width: 100%;margin-left: 10px;text-align: center;"
              >
                <template slot="label">
                  <span style="color: #f34b4b"> * </span>
                  {{ $t('form.VFileImport.selectTable.importFormat') }}
                </template>
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
              <el-form-item
                style="width: 100%;margin-left: 10px;margin-right: 10px;text-align: center;"
              >
                <template slot="label">
                  <span style="color: #f34b4b"> * </span>
                  {{ $t('form.VFileImport.selectTable.listOfCharacterSets') }}
                </template>
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
            </el-form>
          </span>
        </div>

        <el-scrollbar :wrap-class="scrollListTable">
          <el-row :gutter="10">
            <template v-for="(table, key) in listTables">
              <el-col :key="key" :span="6" style="height: 113px;">
                <el-card
                  shadow="never"
                  :class="isActiveTable(table)"
                  :body-style="{ padding: '10px' }"
                >
                  <div
                    style="padding: 0px;margin: 0px;"
                    @click="selectTabla(table)"
                  >
                    <p
                      style="text-align: center;font-size: 50px;margin: 0px"
                    >
                      <i v-if="table.icon.type === 'i'" :class="table.icon.class" />
                      <svg-icon v-else :icon-class="table.icon.class" />
                    </p>
                    <p
                      style="text-align: center;margin: 0px; font-size: 12px;"
                    >
                      <b>{{ table.name }}</b>
                      <br>
                      {{ '( ' + table.table_name + ' )' }}
                    </p>
                  </div>
                </el-card>
              </el-col>
            </template>
          </el-row>
        </el-scrollbar>
      </el-card>
    </el-row>

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
  // ref
} from '@vue/composition-api'

import store from '@/store'

// Api Request Methods
import {
  listCharsets,
  listImportFormats
} from '@/api/ADempiere/form/VFileImport.js'

// Utils and Helper Methods
import {
  isEmptyValue,
  setIconsTableName
} from '@/utils/ADempiere'

export default defineComponent({
  name: 'selectTable',

  props: {
    metadata: {
      type: Object,
      default: () => {
        return {}
      }
    },
    parentUuid: {
      type: String,
      default: undefined
    },
    containerUuid: {
      type: String,
      default: ''
    }
  },

  setup() {
    /**
    * Computed
    */
    const listTables = computed(() => {
      const { listTables } = store.getters.getOptions
      return listTables.map(tables => {
        return {
          ...tables,
          icon: setIconsTableName({
            tableName: tables.table_name
          })
        }
      })
    })

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

    const tableId = computed(() => {
      const { tablaId } = store.getters.getAttribute
      return tablaId
    })

    const currentTable = computed(() => {
      if (!isEmptyValue(tableId.value)) {
        const current = listTables.value.find(tables => tables.id === tableId.value)
        return current
      }
      return {}
    })

    const scrollListTable = computed(() => {
      if (isEmptyValue(currentTable.value)) return 'scroll-list-tables'
      return 'scroll-current-tables'
    })

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

    function findFilter(queryString) {
      return (query) => {
        const search = queryString.toLowerCase()
        return query.label.toLowerCase().includes(search)
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

    function findImportFormats(isFind, searchValue) {
      if (!isFind) {
        return
      }
      listImportFormats({
        searchValue,
        id: tableId.value
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

    function remoteSearchImportFormats(query) {
      if (!isEmptyValue(query) && query.length > 2) {
        const result = optionsImportFormats.value.filter(findFilter(query))
        if (isEmptyValue(result)) {
          findCharsets(true, query)
        }
      }
    }

    function isActiveTable(table) {
      const { id } = table
      if (!isEmptyValue(tableId.value) && tableId.value === id) {
        return 'custom-card-select'
      }
      return 'custom-card'
    }

    function infoImportFormats(id) {
      if (isEmptyValue(id)) return
      store.dispatch('importFormats', {
        id
      })
    }

    function selectTabla(table) {
      store.dispatch('changeTable', table)
      store.dispatch('listProcess', table)
    }

    store.dispatch('findListTable')

    watch(tableId, (newValue, oldValue) => {
      if (newValue) {
        store.commit('updateAttributeVFileImport', {
          attribute: 'attribute',
          criteria: 'importFormats',
          value: ''
        })
        store.commit('updateAttributeVFileImport', {
          attribute: 'file',
          criteria: 'data',
          value: []
        })
        store.commit('updateAttributeVFileImport', {
          attribute: 'file',
          criteria: 'header',
          value: []
        })
        store.commit('updateAttributeVFileImport', {
          attribute: 'file',
          criteria: 'resource',
          value: {}
        })
        if (isEmptyValue(optionsCharsets.value)) findCharsets(true)
        const defaultCharset = optionsCharsets.value.find(list => list.label === 'UTF-8')
        if (isEmptyValue(currrentCharsets.value) && !isEmptyValue(defaultCharset)) {
          currrentCharsets.value = defaultCharset.value
        }
      }
    })

    return {
      listTables,
      tableId,
      currentTable,
      scrollListTable,
      optionsCharsets,
      currrentImportFormats,
      currrentCharsets,
      optionsImportFormats,
      isActiveTable,
      selectTabla,
      remoteSearchCharsets,
      remoteSearchImportFormats,
      findImportFormats,
      findCharsets
    }
  }
})
</script>

<style lang="scss">
.form-item-criteria {
  margin-top: 0px;
  margin-left: 0px;
  margin-bottom: 0px;
  margin-right: 0px;
  padding-bottom: 0px;
  .el-form-item__label {
    padding-bottom: 0px;
  }
  .el-form-item--medium .el-form-item__label {
    padding-bottom: 0px;
  }
  .el-form--inline .el-form-item {
    margin: 0px;
  }
}
.scroll-list-tables {
  max-height: 75vh;
}
.scroll-current-tables {
  max-height: 65vh;
}
.custom-card-select {
  margin: 0.5px;
  cursor: pointer;
  background-color: #eaf5fe;
  border: 1px solid #36a3f7;
}
.el-card__header {
  padding: 0px;
}
</style>
