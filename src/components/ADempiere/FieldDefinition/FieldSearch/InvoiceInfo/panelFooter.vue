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
  <el-row :gutter="24">
    <el-col :span="14">
      <custom-pagination
        :container-manager="containerManager"
        :total-records="recordCount"
        :is-showed-selected="false"
        :selection="selectedRecords"
        :page-number="pageNumber"
        :page-size="pageSize"
        :handle-change-page-number="setPageNumber"
        :handle-change-page-size="setPageSize"
      />
    </el-col>
    <el-col :span="10">
      <samp style="float: right; padding-top: 10px">
        <el-button
          type="info"
          class="button-base-icon"
          plain
        >
          <svg-icon icon-class="layers-clear" />
        </el-button>
        <el-button
          :loading="isLoadingRecords"
          type="success"
          class="button-base-icon"
          icon="el-icon-refresh-right"
          @click="searchRecordsList({})"
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
</template>

<script>
import { computed, defineComponent, ref } from '@vue/composition-api'
import store from '@/store'

// Components and Mixins
import CustomPagination from '@/components/ADempiere/DataTable/Components/CustomPagination.vue'
import IndexColumn from '@/components/ADempiere/DataTable/Components/IndexColumn.vue'
import useInvoice from './PanelForm/useInvoice.js'
import fieldSearchMixin from '../mixinFieldSearch'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { INVOICE_LIST_FORM, COLUMN_NAME } from '@/utils/ADempiere/dictionary/field/search/invoice.ts'

export default defineComponent({
  name: 'PanelFooter',

  components: {
    CustomPagination,
    IndexColumn
  },

  mixins: [
    fieldSearchMixin
  ],

  computed: {
    uuidForm() {
      if (!isEmptyValue(this.metadata.containerUuid)) {
        return this.metadata.columnName + '_' + this.metadata.containerUuid
      }
      return INVOICE_LIST_FORM
    }
  },

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
          containerUuid: INVOICE_LIST_FORM,
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
      timeOutRecords: null,
      isLoadingRecords: false,
      timeOutFields: null,
      isLoadingFields: false,
      unsubscribe: () => {}
    }
  },

  methods: {
    closeList() {
      store.commit('setGeneralInfoShow', {
        containerUuid: this.uuidForm,
        show: false
      })
    }
  },

  setup(props) {
    const invoicesData = ref(0)
    const currentRow = ref(0)
    const isLoadingRecords = ref(false)
    const timeOutRecords = ref(null)

    const {
      closeList,
      setValues
    } = useInvoice({
      uuidForm: props.uuidForm,
      parentUuid: props.metadata.parentUuid,
      containerUuid: props.metadata.containerUuid,
      containerManager: props.containerManager,
      fieldAttributes: props.metadata
    })

    function searchRecordsList() {
      store.dispatch('searchInvociesInfos', {
        page_size: 0
      })
        .then(() => {
          clearTimeout(timeOutRecords.value)
          isLoadingRecords.value = true
          timeOutRecords.value = setTimeout(() => {
            isLoadingRecords.value = false
          }, 1000)
        })
    }

    const selectedRecords = computed(() => {
      if (!isEmptyValue(currentRow.value)) {
        return 1
      }
      return 0
    })

    const recordCount = computed(() => {
      return store.getters.getCountInvocies
    })

    const pageNumber = computed(() => {
      return invoicesData.value.pageNumber
    })

    const pageSize = computed(() => {
      return invoicesData.value.pageSize
    })
    function setPageNumber(page_token) {
      store.dispatch('searchInvociesInfos', {
        page_token
      })
    }
    function setPageSize(page_size) {
      store.dispatch('searchInvociesInfos', {
        page_size
      })
    }

    function changeRecord(row) {
      if (!isEmptyValue(row)) {
        setValues(row)
        store.commit('setGeneralInfoShow', {
          containerUuid: props.uuidForm,
          show: false
        })
      }
    }

    return {
      isLoadingRecords,
      //
      searchRecordsList,
      setPageNumber,
      setPageSize,
      closeList,
      //
      recordCount,
      pageNumber,
      pageSize,
      selectedRecords,
      changeRecord
    }
  }
})
</script>
