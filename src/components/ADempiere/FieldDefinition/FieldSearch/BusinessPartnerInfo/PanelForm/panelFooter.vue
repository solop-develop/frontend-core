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
  <el-row :gutter="24" class="business-partners-footer">
    <el-col :span="14">
      <!-- <custom-pagination
        :total="recordCount"
        :current-page="pageNumber"
        :container-manager="containerManagerBPList"
        :handle-change-page="setPage"
        :records-page="recordsList.length"
        :selection="selection"
        :handle-size-change="handleChangeSizePage"
      /> -->
    </el-col>

    <el-col :span="10">
      <samp style="float: right; padding-top: 4px;">
        <el-button
          type="info"
          class="button-base-icon"
          plain
        >
          <!-- @click="clearFormValues(); searchBPartnerList();" -->
          <svg-icon icon-class="layers-clear" />
        </el-button>

        <el-button
          :loading="isLoadingRecords"
          type="success"
          class="button-base-icon"
          icon="el-icon-refresh-right"
          @click="loadRecordsList({});"
        />

        <el-button
          type="danger"
          class="button-base-icon"
          icon="el-icon-close"
        />
        <!-- @click="closeList(); clearValues();" -->

        <el-button
          type="primary"
          class="button-base-icon"
          icon="el-icon-check"
        />
        <!-- @click="changeBusinessPartner()" -->
      </samp>
    </el-col>
  </el-row>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

import store from '@/store'

// Constants
import {
  BUSINESS_PARTNERS_LIST_FORM,
  COLUMN_NAME
} from '@/utils/ADempiere/dictionary/field/search/businessPartner.ts'

// Components and Mixins
import CustomPagination from '@/components/ADempiere/DataTable/Components/CustomPagination.vue'
import useBusinessPartner from './useBusinessPartner'

export default defineComponent({
  name: 'PanelFooter',

  components: {
    CustomPagination
  },

  props: {
    uuidForm: {
      required: true,
      type: String
    },
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
          columnName: COLUMN_NAME
        }
      }
    },
    showPopover: {
      type: Boolean,
      default: () => false
    }
  },

  setup(props) {
    const {
      isLoadingRecords,
      loadRecordsList
    } = useBusinessPartner({
      uuidForm: props.uuidForm,
      parentUuid: props.metadata.parentUuid,
      containerUuid: props.metadata.containerUuid,
      containerManager: props.containerManager,
      fieldAttributes: props.metadata
    })

    const recordCount = computed(() => {
      return store.getters.getBusinessPartnerRecordCount({
        containerUuid: props.uuidForm
      })
    })

    return {
      isLoadingRecords,
      recordCount,
      //
      loadRecordsList
    }
  }
})
</script>
