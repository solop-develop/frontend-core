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
    <el-row v-loading="isLoadingTablesList">
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

          <span v-else>
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
              <import-formats-list />
              <charsets-list />
            </el-form>
          </span>
        </div>

        <el-scrollbar :wrap-class="scrollListTable">
          <el-row :gutter="10">
            <el-col v-for="(table, key) in storedImportTablesList" :key="key" :span="6" style="height: 113px;">
              <el-card
                shadow="never"
                :class="isActiveTable(table)"
                :body-style="{ padding: '10px' }"
              >
                <div
                  style="padding: 0px;margin: 0px;"
                  @click="selectTableName(table)"
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
  ref,
  watch
  // ref
} from '@vue/composition-api'

import store from '@/store'

// Components and Mixins
import CharsetsList from './charsetsList.vue'
import ImportFormatsList from './importFormatsList.vue'

// Utils and Helper Methods
import {
  isEmptyValue
} from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'selectTable',

  components: {
    CharsetsList,
    ImportFormatsList
  },

  setup() {
    const isLoadingTablesList = ref(false)

    /**
    * Computed
    */
    const storedImportTablesList = computed(() => {
      return store.getters.getStoredImportTablesList
    })

    const storedTableName = computed(() => {
      return store.getters.getStoredCurrentTableName
    })

    const currentTable = computed(() => {
      if (isEmptyValue(storedTableName.value)) {
        return {}
      }
      const current = storedImportTablesList.value.find(tables => {
        return tables.table_name === storedTableName.value
      })
      return current
    })

    const scrollListTable = computed(() => {
      if (isEmptyValue(currentTable.value)) {
        return 'scroll-list-tables'
      }
      return 'scroll-current-tables'
    })

    function isActiveTable(table) {
      const { table_name } = table
      if (!isEmptyValue(storedTableName.value) && storedTableName.value === table_name) {
        return 'custom-card-select'
      }
      return 'custom-card'
    }

    function selectTableName(tableDefinition) {
      const { table_name } = tableDefinition
      store.commit('setTableName', table_name)
      store.commit('updateAttributeVFileImport', {
        attribute: 'attribute',
        criteria: 'importFormatId',
        value: ''
      })
      store.commit('setImportFormatsList', [])
    }

    if (isEmptyValue(storedImportTablesList.value)) {
      isLoadingTablesList.value = true
      store.dispatch('getImportTablesListFromServer')
        .finally(() => {
          isLoadingTablesList.value = false
        })
    }

    watch(storedTableName, (newValue, oldValue) => {
      if (newValue) {
        store.commit('updateAttributeVFileImport', {
          attribute: 'attribute',
          criteria: 'importFormatId',
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
      }
    })

    return {
      isLoadingTablesList,
      storedImportTablesList,
      storedTableName,
      currentTable,
      scrollListTable,
      isActiveTable,
      selectTableName
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
