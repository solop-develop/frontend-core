<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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
  <el-main
    v-shortkey="shortsKey"
    v-loading="isLoadingFields"
    class="accouting-combintantions-list-container"
    style="padding-top: 0px"
    @shortkey.native="keyAction"
  >
    <el-collapse v-model="activeAccordion" accordion class="accouting-combintantions-query-criteria">
      <el-collapse-item name="query-criteria">
        <template slot="title">
          {{ title }}
        </template>

        <el-form
          label-position="top"
          size="small"
          @submit.native.prevent="notSubmitForm"
        >
          <el-row>
            <field-definition
              v-for="(field) in metadataList"
              :key="field.columnName"
              :metadata-field="{
                ...field,
                parentUuid: metadata.parentUuid
              }"
              :container-uuid="'Business-Partner-List'"
              :container-manager="containerManagerSearchList"
            />
          </el-row>
        </el-form>

        <el-button
          type="primary"
          class="button-save"
          plain
          style="float: right;margin-top: 0.5%;margin-bottom: 0.5%;"
          @click="saveAccoutingCombination()"
        >
          <svg-icon icon-class="save-AD" />
        </el-button>
      </el-collapse-item>
    </el-collapse>

    <el-table
      ref="accountCombinationsTable"
      v-loading="isLoadingRecords"
      class="accouting-combintantions-table"
      :data="recordsList"
      highlight-current-row
      border
      fit
      :height="200"
      :max-height="400"
      size="mini"
      @current-change="handleCurrentChange"
      @row-dblclick="changeRecord"
    >
      <p slot="empty" style="width: 100%;">
        {{ $t('notifications.searchWithOutRecords') }}
      </p>

      <index-column
        :page-number="pageNumber"
      />

      <el-table-column
        v-for="(head, key) in labelTable"
        :key="key"
        :label="head.label"
        prop="value"
        header-align="center"
      >
        <template slot-scope="scope">
          <!-- formatted displayed value -->
          <cell-display-info
            :parent-uuid="metadata.parentUuid"
            :container-uuid="uuidForm"
            :field-attributes="head"
            :container-manager="containerManagerSearchList"
            :scope="scope"
            :data-row="scope.row"
          />
        </template>
      </el-table-column>
    </el-table>

    <el-row class="accouting-combintantions-footer">
      <el-col :span="20">
        <custom-pagination
          :total="recordData.recordCount"
          :current-page="pageNumber"
          :container-manager="containerManagerSearchList"
          :handle-change-page="setPage"
          :records-page="recordsList.length"
          :selection="selection"
        />
      </el-col>

      <el-col :span="4">
        <samp style="float: right; padding-top: 4px;">
          <el-button
            :loading="isLoadingRecords"
            type="success"
            class="button-base-icon"
            icon="el-icon-refresh-right"
            @click="searchRecordsList();"
          />

          <el-button
            type="danger"
            class="button-base-icon"
            icon="el-icon-close"
            @click="closeList(); clearValues();"
          />

          <el-button
            type="primary"
            class="button-base-icon"
            icon="el-icon-check"
            @click="changeRecord()"
          />
        </samp>
      </el-col>
    </el-row>
  </el-main>
</template>

<script>
// Constants
import { ACCOUTING_COMBINATIONS_LIST_FORM, COLUMN_NAME } from '@/utils/ADempiere/dictionary/field/accoutingCombination.js'
import fieldsList from './fieldsList'
import { DISPLAY_COLUMN_PREFIX, UNIVERSALLY_UNIQUE_IDENTIFIER_COLUMN_SUFFIX } from '@/utils/ADempiere/dictionaryUtils'

// Components and Mixins
import mixinAccountingCombination from './mixinAccountingCombination.js'
import CellDisplayInfo from '@/components/ADempiere/DataTable/Components/CellDisplayInfo.vue'
import CustomPagination from '@/components/ADempiere/DataTable/Components/CustomPagination.vue'
import FieldDefinition from '@/components/ADempiere/FieldDefinition/index.vue'
import IndexColumn from '@/components/ADempiere/DataTable/Components/IndexColumn.vue'

// Utils and Helper Methods
import { isEmptyValue, isSameValues } from '@/utils/ADempiere/valueUtils'
import { convertObjectToKeyValue } from '@/utils/ADempiere/valueFormat'
import {
  // createFieldFromDefinition,
  createFieldFromDictionary
} from '@/utils/ADempiere/lookupFactory'
import { containerManager as containerManagerForm } from '@/utils/ADempiere/dictionary/form'

export default {
  name: 'TableQueryCriteria',

  components: {
    CellDisplayInfo,
    CustomPagination,
    FieldDefinition,
    IndexColumn
  },

  mixins: [
    mixinAccountingCombination
  ],

  props: {
    containerManager: {
      type: Object,
      default: () => ({
        actionPerformed: () => {},
        getFieldsLit: () => {},
        setDefaultValues: () => {}
      })
    },
    metadata: {
      type: Object,
      default: () => {
        return {
          containerUuid: ACCOUTING_COMBINATIONS_LIST_FORM,
          columnName: COLUMN_NAME
        }
      }
    },
    showPopover: {
      type: Boolean,
      default: () => false
    }
  },

  data() {
    return {
      activeAccordion: 'query-criteria',
      fieldsList,
      metadataList: [],
      timeOutRecords: null,
      timeOutUpdate: null,
      isLoadingRecords: false,
      timeOutFields: null,
      isLoadingFields: false,
      unsubscribe: () => {}
    }
  },

  computed: {
    uuidForm() {
      if (!isEmptyValue(this.metadata.containerUuid)) {
        return this.metadata.columnName + '_' + this.metadata.containerUuid
      }
      return ACCOUTING_COMBINATIONS_LIST_FORM
    },
    accoutingCombinationId() {
      return this.$store.getters.getValueOfField({
        containerUuid: this.metadata.containerUuid,
        columnName: this.metadata.columnName
      })
    },
    title() {
      let title = this.metadata.panelName
      if (!isEmptyValue(this.metadata.panelName) && !isSameValues(this.metadata.panelName, this.metadata.name)) {
        title += ` (${this.metadata.name})`
      }
      return title
    },
    shortsKey() {
      return {
        close: ['esc'],
        refreshList: ['f5']
      }
    },
    selection() {
      if (isEmptyValue(this.currentRow)) {
        return 0
      }
      return 1
    },
    containerManagerSearchList() {
      return {
        ...this.containerManager,
        ...containerManagerForm,
        setPage: this.setPage
      }
    },
    labelTable() {
      return this.metadataList.map(field => {
        if (field.columnName === 'AD_Client_ID') {
          return {
            label: field.name,
            columnName: 'DisplayColumn_AD_Client_ID'
          }
        } else if (field.columnName === 'AD_Org_ID') {
          return {
            label: field.name,
            columnName: 'DisplayColumn_AD_Org_ID'
          }
        } else if (field.columnName === 'Account_ID') {
          return {
            label: field.name,
            columnName: 'DisplayColumn_Account_ID'
          }
        } else if (field.columnName === 'M_Product_ID') {
          return {
            label: field.name,
            columnName: 'DisplayColumn_M_Product_ID'
          }
        } else if (field.columnName === 'C_BPartner_ID') {
          return {
            label: field.name,
            columnName: 'DisplayColumn_C_BPartner_ID'
          }
        } else if (field.columnName === 'C_Project_ID') {
          return {
            label: field.name,
            columnName: 'DisplayColumn_C_Project_ID'
          }
        } else if (field.columnName === 'C_Campaign_ID') {
          return {
            label: field.name,
            columnName: 'DisplayColumn_C_Campaign_ID'
          }
        }
        return {
          label: field.name,
          columnName: field.columnName
        }
      })
    },
    recordData() {
      return this.$store.getters.getAccountCombinationsData({
        containerUuid: this.uuidForm
      })
    },
    pageNumber() {
      return this.recordData.pageNumber
    },
    isReadyFromGetData() {
      const { isLoaded } = this.recordData
      return !isLoaded && this.showPopover
    },
    currentRow: {
      set(rowSelected) {
        this.$store.commit('setAccountCombinationsSelectedRow', {
          containerUuid: this.uuidForm,
          currentRow: rowSelected
        })
      },
      get() {
        return this.$store.getters.getAccountCombinationsCurrentRow({
          containerUuid: this.uuidForm
        })
      }
    },
    currentCombinations() {
      return this.$store.getters.getCurrentAccountCombinations({
        containerUuid: this.uuidForm
      })
    }
  },

  watch: {
    // isReadyFromGetData(isToLoad) {
    //   if (isToLoad) {
    //     this.searchRecordsList()
    //   }
    // },
    showPopover(value) {
      if (value && isEmptyValue(this.metadataList)) {
        clearTimeout(this.timeOutFields)
        this.timeOutFields = setTimeout(() => {
          this.getFieldsList()
        }, 500)
      }
    }
  },

  created() {
    this.unsubscribe = this.subscribeChanges()
  },

  mounted() {
    if (!this.isEmptyValue(this.accoutingCombinationId)) {
      this.$store.dispatch('getAccountingCombination', {
        containerUuid: this.uuidForm,
        id: this.accoutingCombinationId
      })
        .then(response => {
          this.defaultValue(response)
        })
    }
    this.$nextTick(() => {
      if (this.$refs.accountCombinationsTable) {
        this.$refs.accountCombinationsTable.setCurrentRow(this.currentRow)
      }
    })

    if (this.showPopover) {
      clearTimeout(this.timeOutFields)
      this.timeOutFields = setTimeout(() => {
        this.getFieldsList()
      }, 500)
    }
  },

  beforeDestroy() {
    this.unsubscribe()
  },

  methods: {
    defaultValue(row) {
      const attibutesList = convertObjectToKeyValue({
        object: row.attributes,
        keyName: 'columnName',
        valueName: 'value'
      })

      this.$store.commit('updateValuesOfContainer', {
        containerUuid: this.uuidForm,
        attributes: attibutesList
      })
    },
    saveAccoutingCombination() {
      const attributes = this.$store.getters.getValuesView({
        containerUuid: this.uuidForm,
        format: 'array'
      }).filter(item => {
        return item.columnName !== 'Combination' &&
          this.metadataList.find(itemDefinition => itemDefinition.columnName === item.columnName)
      }).map(item => {
        return {
          value: item.value,
          key: item.columnName
        }
      })

      this.$store.dispatch('saveAccountCombinations', {
        parentUuid: this.metadata.parentUuid,
        containerUuid: this.uuidForm,
        attributes,
        contextAttributesList: this.contextAttributesList
      })
      this.searchRecordsList()
    },
    handleCurrentChange(row) {
      this.currentRow = row

      const attibutesList = convertObjectToKeyValue({
        object: row,
        keyName: 'columnName',
        valueName: 'value'
      })

      this.$store.commit('updateValuesOfContainer', {
        containerUuid: this.uuidForm,
        attributes: attibutesList
      })
    },
    keyAction(event) {
      switch (event.srcKey) {
        case 'refreshList':
          /**
           * TODO: When refreshing you are making 2 list requests, you can be the
           * observer that activates the second request
          */
          this.searchRecordsList()
          break

        case 'close':
          this.closeList()
          break
      }
    },
    changeRecord() {
      if (!isEmptyValue(this.currentRow)) {
        this.setValues(this.currentRow)
        this.closeList()
      }
    },
    closeList() {
      this.$store.commit('setAccountCombinationsShow', {
        containerUuid: this.uuidForm,
        show: false
      })
    },
    setPage(pageNumber) {
      this.searchRecordsList(pageNumber)
    },
    subscribeChanges() {
      return this.$store.subscribe((mutation, state) => {
        if (mutation.type === 'updateValueOfField') {
          if (mutation.payload.containerUuid === this.uuidForm) {
            const { columnName } = mutation.payload
            if (!columnName.startsWith(DISPLAY_COLUMN_PREFIX) && !columnName.includes(UNIVERSALLY_UNIQUE_IDENTIFIER_COLUMN_SUFFIX)) {
              // not included in the query criteria filter
              if (columnName === 'Alias') {
                return
              }
              // mandatory values
              if (this.isEmptyValue(mutation.payload.value) && ['AD_Org_ID', 'Account_ID'].includes(columnName)) {
                return
              }
              this.isLoadingRecords = true
              clearTimeout(this.timeOutUpdate)
              this.timeOutUpdate = setTimeout(() => {
                this.searchRecordsList()
              }, 1500)
            }
          }
        }
      })
    },
    getFieldsList() {
      const list = []
      this.isLoadingFields = true
      this.fieldsList.forEach(element => {
        createFieldFromDictionary(element)
          .then(responseField => {
            list.push({
              ...responseField,
              parentUuid: this.metadata.parentUuid,
              containerUuid: this.uuidForm
            })
          }).catch(error => {
            console.warn(`LookupFactory: Get Field From Server (State) - Error ${error.code}: ${error.message}.`)
          })
          .finally(() => {
            if (list.length === this.fieldsList.length) {
              this.metadataList = list
              this.isLoadingFields = false
            }
          })
      })
    },
    searchRecordsList(pageNumber = 0, isConvert = true) {
      let parentUuid = this.metadata.parentUuid
      if (isEmptyValue(parentUuid)) {
        parentUuid = this.metadata.containerUuid
      }
      const filters = this.$store.getters.getValuesView({
        containerUuid: this.uuidForm,
        format: 'array'
      }).filter(item => {
        return !this.isEmptyValue(item.value) &&
          item.columnName !== 'Combination' &&
          item.columnName !== 'Alias' &&
          this.metadataList.find(itemDefinition => itemDefinition.columnName === item.columnName)
          // !item.columnName.startsWith(DISPLAY_COLUMN_PREFIX) &&
          // !ROW_KEY_ATTRIBUTES.includes(item.columnName) &&
          // !item.columnName.includes(UNIVERSALLY_UNIQUE_IDENTIFIER_COLUMN_SUFFIX)
      })

      clearTimeout(this.timeOutRecords)
      this.timeOutRecords = setTimeout(() => {
        // search on server
        this.isLoadingRecords = true
        this.$store.dispatch('listAccountCombinations', {
          parentUuid: this.metadata.parentUuid,
          containerUuid: this.uuidForm,
          contextAttributesList: this.contextAttributesList,
          filters,
          pageNumber
        })
          .then(response => {
            if (isEmptyValue(response)) {
              this.$message({
                type: 'warning',
                showClose: true,
                message: this.$t('notifications.searchWithOutRecords')
              })
            }

            this.$nextTick(() => {
              if (this.$refs.accountCombinationsTable) {
                this.$refs.accountCombinationsTable.setCurrentRow(this.currentRow)
              }
            })
          })
          .finally(() => {
            this.isLoadingRecords = false
          })
      }, 500)
    }
  }
}
</script>

<style lang="scss">
.accouting-combintantions-list-container {
  .accouting-combintantions-query-criteria {
    // space between quey criteria and table
    .el-collapse-item__content {
      padding-bottom: 0px !important;
    }

    .button-save {
      padding: 2px 6px;
      svg {
        font-size: 30px !important;
      }
    }
  }
}
</style>
