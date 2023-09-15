<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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
  <el-main
    v-shortkey="shortsKey"
    v-loading="isLoadingFields"
    class="business-partners-list-container"
    style="padding-top: 0px"
    @shortkey.native="keyAction"
  >
    <el-collapse v-model="activeAccordion" accordion class="business-partners-query-criteria">
      <el-collapse-item name="query-criteria">
        <template slot="title">
          {{ title }}
        </template>

        <el-form
          label-position="top"
          size="mini"
          @submit.native.prevent="notSubmitForm"
        >
          <el-row>
            <field-definition
              v-for="(field) in metadataList"
              :key="field.columnName"
              :metadata-field="field"
              :container-uuid="'Business-Partner-List'"
              :container-manager="containerManagerBPList"
            />
          </el-row>
        </el-form>
      </el-collapse-item>
    </el-collapse>

    <el-table
      ref="businessPartnerTable"
      v-loading="isLoadingRecords"
      class="business-partners-table"
      :data="recordsList"
      highlight-current-row
      border
      fit
      :max-height="300"
      size="mini"
      @current-change="handleCurrentChange"
      @row-dblclick="changeBusinessPartner"
    >
      <p slot="empty" style="width: 100%;">
        {{ $t('businessPartner.emptyBusinessPartner') }}
      </p>

      <index-column
        :page-number="pageNumber"
        :page-size="pageSize"
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
            :container-manager="containerManagerBPList"
            :scope="scope"
            :data-row="scope.row"
          />
        </template>
      </el-table-column>
    </el-table>

    <el-row :gutter="24" class="business-partners-footer">
      <el-col :span="14">
        <custom-pagination
          :total="businessPartnerData.recordCount"
          :current-page="pageNumber"
          :container-manager="containerManagerBPList"
          :handle-change-page="setPage"
          :records-page="recordsList.length"
          :selection="selection"
          :handle-size-change="handleChangeSizePage"
        />
      </el-col>

      <el-col :span="10">
        <samp style="float: right; padding-top: 4px;">
          <el-button
            type="info"
            class="button-base-icon"
            plain
            @click="clearFormValues(); searchBPartnerList();"
          >
            <svg-icon icon-class="layers-clear" />
          </el-button>

          <el-button
            :loading="isLoadingRecords"
            type="success"
            class="button-base-icon"
            icon="el-icon-refresh-right"
            @click="searchBPartnerList();"
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
            @click="changeBusinessPartner()"
          />
        </samp>
      </el-col>
    </el-row>
  </el-main>
</template>

<script>
import store from '@/store'

// Constants
import { BUSINESS_PARTNERS_LIST_FORM } from '@/utils/ADempiere/dictionary/field/businessPartner.js'
import FIELDS_LIST from './fieldsListSearch'
import { DISPLAY_COLUMN_PREFIX } from '@/utils/ADempiere/dictionaryUtils'
import { IS_SO_TRX } from '@/utils/ADempiere/constants/systemColumns'

// Components and Mixins
import businessPartnerMixin from './mixinBusinessPartner'
import fieldSearchMixin from '../mixinFieldSearch'
import CellDisplayInfo from '@/components/ADempiere/DataTable/Components/CellDisplayInfo.vue'
import CustomPagination from '@/components/ADempiere/DataTable/Components/CustomPagination.vue'
import IndexColumn from '@/components/ADempiere/DataTable/Components/IndexColumn.vue'
import FieldDefinition from '@/components/ADempiere/FieldDefinition/index.vue'

// Utils and Helper Methods
import { isEmptyValue, isSameValues } from '@/utils/ADempiere/valueUtils'
import {
  // createFieldFromDefinition,
  createFieldFromDictionary
} from '@/utils/ADempiere/lookupFactory'
import { containerManager as containerManagerForm } from '@/utils/ADempiere/dictionary/form'

export default {
  name: 'BusinessPartnersList',

  components: {
    CellDisplayInfo,
    CustomPagination,
    FieldDefinition,
    IndexColumn
  },

  mixins: [
    fieldSearchMixin,
    businessPartnerMixin
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
          containerUuid: BUSINESS_PARTNERS_LIST_FORM,
          columnName: 'C_BPartner_ID'
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
      fieldsList: FIELDS_LIST,
      metadataList: [],
      timeOutRecords: null,
      isLoadingRecords: false,
      timeOutFields: null,
      isLoadingFields: false,
      unsubscribe: () => {}
    }
  },

  computed: {
    title() {
      let title = this.$t('form.pos.order.BusinessPartnerCreate.businessPartner')
      if (!isEmptyValue(this.metadata.panelName) && !isSameValues(this.metadata.panelName, this.metadata.name)) {
        title += ` (${this.metadata.panelName})`
      }
      return title
    },
    uuidForm() {
      if (!isEmptyValue(this.metadata.containerUuid)) {
        return this.metadata.columnName + '_' + this.metadata.containerUuid
      }
      return BUSINESS_PARTNERS_LIST_FORM
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
    containerManagerBPList() {
      return {
        ...this.containerManager,
        ...containerManagerForm,
        setPage: this.setPage
      }
    },
    labelTable() {
      return this.metadataList.map(field => {
        return {
          label: field.name,
          columnName: field.columnName
        }
      })
    },
    businessPartnerData() {
      return store.getters.getBusinessPartnerData({
        containerUuid: this.uuidForm
      })
    },
    pageNumber() {
      return this.businessPartnerData.pageNumber
    },
    pageSize() {
      return this.businessPartnerData.pageSize
    },
    isReadyFromGetData() {
      const { isLoaded } = this.businessPartnerData
      return !isLoaded && this.showPopover
    },
    currentRow: {
      set(rowSelected) {
        store.commit('setBusinessPartnerSelectedRow', {
          containerUuid: this.uuidForm,
          currentRow: rowSelected
        })
      },
      get() {
        return store.getters.getBusinessPartnerCurrentRow({
          containerUuid: this.uuidForm
        })
      }
    },
    isSOTrx() {
      return this.$store.getters.getValueOfFieldOnContainer({
        parentUuid: this.metadata.parentUuid,
        containerUuid: this.metadata.containerUuid,
        columnName: IS_SO_TRX
      })
    },
    oldFilter() {
      return this.$store.getters.getFilterList({ containerUuid: this.uuidForm })
    }
  },

  watch: {
    isReadyFromGetData(isToLoad) {
      if (isToLoad) {
        this.searchBPartnerList()
      }
    },
    showPopover(value) {
      if (value && isEmptyValue(this.metadataList)) {
        clearTimeout(this.timeOutFields)
        this.timeOutFields = setTimeout(() => {
          this.setFieldsList()
        }, 500)
      }
    }
  },

  created() {
    this.unsubscribe = this.subscribeChanges()
    if (
      !isEmptyValue(this.oldFilter) &&
      this.oldFilter !== this.isSOTrx
    ) {
      this.searchBPartnerList()
    }
    if (this.isReadyFromGetData) {
      this.searchBPartnerList()
    }
  },

  mounted() {
    this.$nextTick(() => {
      if (this.$refs.businessPartnerTable) {
        this.$refs.businessPartnerTable.setCurrentRow(this.currentRow)
      }
    })

    if (this.showPopover) {
      clearTimeout(this.timeOutFields)
      this.timeOutFields = setTimeout(() => {
        this.setFieldsList()
      }, 500)
    }
  },

  beforeDestroy() {
    this.unsubscribe()
  },

  methods: {
    handleCurrentChange(row) {
      this.currentRow = row
    },
    keyAction(event) {
      switch (event.srcKey) {
        case 'refreshList':
          /**
           * TODO: When refreshing you are making 2 list requests, you can be the
           * observer that activates the second request
          */
          this.searchBPartnerList()
          break

        case 'close':
          this.closeList()
          break
      }
    },
    changeBusinessPartner() {
      if (!isEmptyValue(this.currentRow)) {
        this.setValues(this.currentRow)
        this.closeList()
      }
    },
    closeList() {
      store.commit('setBusinessPartnerShow', {
        containerUuid: this.uuidForm,
        show: false
      })
    },
    setPage(pageNumber) {
      this.searchBPartnerList(pageNumber, this.pageSize)
    },
    subscribeChanges() {
      return store.subscribe((mutation, state) => {
        if (mutation.type === 'updateValueOfField') {
          if (mutation.payload.containerUuid === this.uuidForm) {
            this.searchBPartnerList()
          }
        }
      })
    },
    setFieldsList() {
      const list = []
      this.isLoadingFields = true
      this.fieldsList.forEach(element => {
        createFieldFromDictionary(element)
          .then(responseField => {
            list.push({
              ...responseField,
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
    searchBPartnerList(pageNumber = 0, pageSize) {
      let parentUuid = this.metadata.parentUuid
      if (isEmptyValue(parentUuid)) {
        parentUuid = this.metadata.containerUuid
      }

      const filters = store.getters.getValuesView({
        containerUuid: this.uuidForm,
        format: 'array'
      })
        .filter(attribute => {
          if (attribute.columnName.startsWith(DISPLAY_COLUMN_PREFIX)) {
            return false
          }
          return !isEmptyValue(attribute.value)
        })

      this.isLoadingRecords = true
      clearTimeout(this.timeOutRecords)
      this.timeOutRecords = setTimeout(() => {
        // search on server
        this.containerManager.getSearchInfoList({
          parentUuid,
          containerUuid: this.uuidForm,
          contextColumnNames: this.metadata.reference.contextColumnNames,
          tableName: this.metadata.reference.tableName,
          uuid: this.metadata.uuid,
          filters,
          pageNumber,
          pageSize
        })
          .then(response => {
            this.$store.commit('setFiltersList', {
              containerUuid: this.uuidForm,
              isSOTrx: this.isSOTrx
            })
            if (isEmptyValue(response)) {
              this.$message({
                type: 'warning',
                showClose: true,
                message: this.$t('businessPartner.notFound')
              })
            }

            this.$nextTick(() => {
              if (this.$refs.businessPartnerTable) {
                this.$refs.businessPartnerTable.setCurrentRow(this.currentRow)
              }
            })
          })
          .finally(() => {
            this.isLoadingRecords = false
          })
      }, 500)
    },
    handleChangeSizePage(pageSize) {
      this.searchBPartnerList(1, pageSize)
    }
  }
}
</script>

<style lang="scss">
.business-partners-list-container {
  .business-partners-query-criteria {
    // space between quey criteria and table
    .el-collapse-item__content {
      padding-bottom: 0px !important;
    }
  }
}
</style>
