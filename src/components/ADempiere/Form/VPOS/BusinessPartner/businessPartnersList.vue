<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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
    v-shortkey="popoverListBusinessParnet ? { close: ['esc'] } : {}"
    class="pos-bpartner-list-container"
    @shortkey.native="actionList"
  >
    <el-collapse v-model="activeAccordion" accordion class="pos-bpartner-list-query-criteria">
      <el-collapse-item name="query-criteria">
        <template slot="title">
          {{ $t('form.pos.order.BusinessPartnerCreate.businessPartner') }}
          <template v-if="!isEmptyValue(parentMetadata.name)">
            ({{ parentMetadata.name }})
          </template>
          <!-- <i class="el-icon-circle-plus" /> -->
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
              :metadata-field="field"
              :container-uuid="'Business-Partner-List'"
              :container-manager="{
                ...containerManager,
                getLookupList,
                isDisplayedField,
                generalInfoSearch,
                searchTableHeader,
                isDisplayedDefault,
                isMandatoryField,
                isReadOnlyField,
                changeFieldShowedFromUser
              }"
            />
          </el-row>
        </el-form>
      </el-collapse-item>
    </el-collapse>

    <el-table
      ref="businesPartnerTable"
      v-loading="isLoadedList"
      :data="businessPartnersList"
      highlight-current-row
      :border="true"
      fit
      height="250"
      size="small"
      @current-change="handleCurrentChange"
      @row-dblclick="changeCustomer"
    >
      <p slot="empty" style="width: 100%;">
        {{ $t('businessPartner.emptyBusinessPartner') }}
      </p>
      <el-table-column
        v-for="(heard, key) in labelTable"
        :key="key"
        :label="heard.label"
        prop="value"
      >
        <span v-if="heard.columnName === 'Value'" slot-scope="scope">
          {{ scope.row.value }}
        </span>
        <span v-else-if="heard.columnName === 'Name'" slot-scope="scope">
          {{ scope.row.name }}
        </span>
        <span v-else-if="heard.columnName === 'TaxID'" slot-scope="scope">
          {{ scope.row.taxId }}
        </span>
      </el-table-column>
    </el-table>

    <el-row :gutter="24" class="pos-bpartner-list-footer">
      <el-col :span="18">
        <custom-pagination
          :total="businessPartners.recordCount"
          :current-page="businessPartners.pageNumber"
          :handle-change-page="handleChangePage"
          :records-page="businessPartnersList.length"
        />
      </el-col>

      <el-col :span="6">
        <samp style="float: right; padding-right: 10px;">
          <el-button
            :loading="isLoadedList"
            type="success"
            class="button-base-icon"
            icon="el-icon-refresh-right"
            size="small"
            @click="searchBPartnerList({});"
          />
          <el-button
            type="danger"
            icon="el-icon-close"
            class="button-base-icon"
            size="small"
            @click="closeListCustomer"
          />
          <el-button
            type="primary"
            icon="el-icon-check"
            class="button-base-icon"
            size="small"
            :disabled="isDisabled"
            @click="changeCustomer"
          />
        </samp>
      </el-col>
    </el-row>
  </el-main>
</template>

<script>
// Constants
import fieldsList from './fieldsListSearch.js'

// Components and Mixins
import CustomPagination from '@/components/ADempiere/DataTable/Components/CustomPagination.vue'
import BParterMixin from './mixinBusinessPartner.js'
import FieldDefinition from '@/components/ADempiere/FieldDefinition/index.vue'

// Utils and Helper Methods
import {
  // createFieldFromDefinition,
  createFieldFromDictionary
} from '@/utils/ADempiere/lookupFactory'
import {
  getLookupList,
  isDisplayedField,
  isDisplayedDefault,
  generalInfoSearch,
  searchTableHeader,
  isMandatoryField,
  isReadOnlyField,
  changeFieldShowedFromUser
} from '@/components/ADempiere/Form/VPOS/containerManagerPos.js'

export default {
  name: 'BusinessPartnersList',

  components: {
    CustomPagination,
    FieldDefinition
  },

  mixins: [
    // formMixin,
    BParterMixin
  ],

  props: {
    metadata: {
      type: Object,
      default: () => {
        return {
          uuid: 'Business-Partner-List',
          containerUuid: 'Business-Partner-List'
        }
      }
    },
    showsPopover: {
      type: Boolean,
      default: () => false
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    showField: {
      type: Boolean,
      default: true
    },
    containerManager: {
      type: Object,
      default: () => ({
        actionPerformed: () => {},
        getFieldsLit: () => {},
        setDefaultValues: () => {}
      })
    }
  },

  data() {
    return {
      isLoadedRecords: false,
      activeAccordion: 'query-criteria',
      fieldsList,
      selectCustomer: {},
      metadataList: [],
      isLoadedList: false,
      unsubscribe: () => {}
    }
  },

  computed: {
    businessPartners() {
      return this.$store.getters.getBusinessPartner
    },
    businessPartnersList() {
      return this.$store.getters.getBusinessPartnersList
    },
    isReadyFromGetData() {
      const { isLoaded, isReload } = this.businessPartners
      return (!isLoaded || isReload) && this.showsPopover
    },
    popoverListBusinessParnet() {
      return this.$store.getters.getPopoverListBusinessParnet
    },
    labelTable() {
      const listFilters = this.metadataList.filter(field => field.columnName !== 'Code')
      const label = listFilters.map(field => {
        return {
          label: field.name,
          columnName: field.columnName
        }
      })
      return label
    }
  },

  watch: {
    isReadyFromGetData(isToLoad) {
      if (isToLoad) {
        this.searchBPartnerList({})
      }
    },
    showField(value) {
      if (value && this.isEmptyValue(this.metadataList)) {
        this.setFieldsList()
      }
    }
  },

  created() {
    this.unsubscribe = this.subscribeChanges()
    if (this.isEmptyValue(this.metadataList)) {
      this.setFieldsList()
    }
    if (this.isReadyFromGetData) {
      this.searchBPartnerList({})
    }
  },

  beforeDestroy() {
    this.unsubscribe()
  },

  methods: {
    getLookupList,
    isDisplayedField,
    isDisplayedDefault,
    generalInfoSearch,
    searchTableHeader,
    isMandatoryField,
    isReadOnlyField,
    changeFieldShowedFromUser,
    actionList(event) {
      this.closeListCustomer()
    },
    handleCurrentChange(row) {
      this.selectCustomer = row
    },
    changeCustomer() {
      if (!this.isEmptyValue(this.selectCustomer)) {
        this.$store.commit('customer', this.selectCustomer)
        this.setBusinessPartner(this.selectCustomer)
        this.closeListCustomer()
      }
    },
    closeListCustomer() {
      this.$store.commit('setBusinessPartnersList', {
        businessPartnersList: [],
        isLoaded: true,
        isReload: false
      })
      this.$store.commit('changePopoverListBusinessPartner', false)
    },
    handleChangePage(newPage) {
      this.searchBPartnerList({
        pageNumber: newPage
      }, false)
      // this.$store.dispatch('setBPartnerPageNumber', newPage)
    },
    subscribeChanges() {
      return this.$store.subscribe((mutation, state) => {
        if (mutation.type === 'updateValueOfField' &&
          mutation.payload.containerUuid === this.metadata.containerUuid) {
          const values = this.$store.getters.getValuesView({
            containerUuid: mutation.payload.containerUuid,
            format: 'object'
          })
          clearTimeout(this.timeOut)
          this.timeOut = setTimeout(() => {
            this.searchBPartnerList(values)
          }, 1000)
        }
      })
    },
    searchBPartnerList(values, isConvert = true) {
      if (isConvert && !this.isEmptyValue(values)) {
        values = this.convertValuesToSend(values)
      }
      this.isLoadedList = true
      return this.$store.dispatch('listBPartnerFromServer', values)
        .then(response => {
          if (this.isEmptyValue(response)) {
            this.$message({
              type: 'warning',
              showClose: true,
              message: this.$t('businessPartner.notFound')
            })
          }
          return response
        })
        .finally(() => {
          this.isLoadedList = false
          this.isLoadedRecords = true
        })
    },
    setFieldsList() {
      const list = []
      // Product Code
      this.fieldsList.forEach(element => {
        createFieldFromDictionary(element)
          .then(response => {
            const data = response
            list.push({
              ...data,
              containerUuid: 'Business-Partner-List'
            })
          }).catch(error => {
            console.warn(`LookupFactory: Get Field From Server (State) - Error ${error.code}: ${error.message}.`)
          })
      })
      this.metadataList = list
    }
  }
}
</script>

<style lang="scss">
.pos-bpartner-list-container {
  .pos-bpartner-list-query-criteria {
    // space between quey criteria and table
    .el-collapse-item__content {
      padding-bottom: 0px !important;
    }
  }
}

.el-table__empty-text {
  line-height: 60px;
  width: 100%;
  color: #909399;
}
</style>
