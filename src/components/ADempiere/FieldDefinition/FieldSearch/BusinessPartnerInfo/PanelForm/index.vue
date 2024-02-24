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
    class="business-partners-container"
  >
    <query-criteria
      :uuid-form="uuidForm"
      :metadata="metadata"
    />

    <table-records
      :uuid-form="uuidForm"
    />

    <panel-footer
      :uuid-form="uuidForm"
    />
  </el-main>
</template>

<script>
import {
  defineComponent, computed, ref, watch, nextTick
} from '@vue/composition-api'

import store from '@/store'

// Constants
import { BUSINESS_PARTNERS_LIST_FORM } from '@/utils/ADempiere/dictionary/field/search/businessPartner.ts'

// Components and Mixins
import QueryCriteria from './QueryCriteria/index.vue'
import TableRecords from './tableRecords.vue'
import PanelFooter from './panelFooter.vue'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'PanelForm',

  components: {
    QueryCriteria,
    TableRecords,
    PanelFooter
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

  setup(props) {
    const timeOutRecords = ref(null)

    const uuidForm = computed(() => {
      if (!isEmptyValue(props.metadata.containerUuid)) {
        return props.metadata.columnName + '_' + props.metadata.containerUuid
      }
      return BUSINESS_PARTNERS_LIST_FORM
    })

    const businessPartnerData = computed(() => {
      return store.getters.getBusinessPartnerData({
        containerUuid: uuidForm.value
      })
    })

    const isLoadingRecords = computed(() => {
      const { isLoading } = businessPartnerData.value
      return isLoading
    })

    const isReadyFromGetData = computed(() => {
      const { isLoaded } = businessPartnerData.value
      return !isLoaded && props.showPopover
    })

    function searchBPartnerList(pageNumber = 0, pageSize) {
      let parentUuid = props.metadata.parentUuid
      if (isEmptyValue(parentUuid)) {
        parentUuid = props.metadata.containerUuid
      }

      // const filters = store.getters.getValuesView({
      //   containerUuid: uuidForm.value,
      //   format: 'array'
      // })
      //   .filter(attribute => {
      //     if (attribute.columnName.startsWith(DISPLAY_COLUMN_PREFIX)) {
      //       return false
      //     }
      //     return !isEmptyValue(attribute.value)
      //   })

      // isLoadingRecords.value = true
      clearTimeout(timeOutRecords.value)
      timeOutRecords.value = setTimeout(() => {
        // search on server
        props.containerManager.getSearchRecordsList({
          parentUuid,
          containerUuid: uuidForm.value,
          contextColumnNames: props.metadata.reference.contextColumnNames,
          tableName: props.metadata.reference.tableName,
          uuid: props.metadata.uuid,
          id: props.metadata.id,
          // filters,
          pageNumber,
          pageSize
        })
          .then(response => {
            // store.commit('setFiltersList', {
            //   containerUuid: uuidForm.value,
            //   isSOTrx: this.isSOTrx
            // })
            if (isEmptyValue(response)) {
              // this.$message({
              //   type: 'warning',
              //   showClose: true,
              //   message: this.$t('businessPartner.notFound')
              // })
            }

            nextTick(() => {
              // if (this.$refs.businessPartnerTable) {
              //   this.$refs.businessPartnerTable.setCurrentRow(this.currentRow)
              // }
            })
          })
          .finally(() => {
            // isLoadingRecords.value = false
          })
      }, 500)
    }

    watch(isReadyFromGetData, (newValue, oldValue) => {
      if (newValue) {
        searchBPartnerList()
      }
    })

    if (isReadyFromGetData.value) {
      searchBPartnerList()
    }

    return {
      uuidForm,
      isLoadingRecords,
      isReadyFromGetData,
      businessPartnerData
    }
  }
})
</script>

<style lang="scss">
.business-partners-container {
  padding-top: 0px;
  padding-bottom: 0px;
}
</style>
