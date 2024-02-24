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
  <div>
    <el-table
      ref="businessPartnerTable"
      v-loading="isLoadingRecords"
      class="business-partners-table"
      highlight-current-row
      :border="true"
      fit
      :data="recordsList"
      :max-height="300"
      size="mini"
    >
      <p slot="empty" style="width: 100%;">
        {{ $t('field.businessPartner.emptyBusinessPartner') }}
      </p>

      <index-column />

      <el-table-column
        prop="value"
        :label="$t('field.businessPartner.value')"
        header-align="center"
      />
      <el-table-column
        prop="name"
        :label="$t('field.businessPartner.name')"
        header-align="center"
      />
      <el-table-column
        prop="business_partner_group"
        :label="$t('field.businessPartner.group')"
        header-align="center"
      />
      <el-table-column
        prop="open_balance_amount"
        :label="$t('field.businessPartner.openBalance')"
        header-align="center"
      >
        <span slot-scope="scope" class="cell-align-right">
          {{ scope.row.open_balance_amount }}
        </span>
      </el-table-column>

      <el-table-column
        prop="credit_available_amount"
        :label="$t('field.businessPartner.creditAvailable')"
        header-align="center"
      >
        <span slot-scope="scope" class="cell-align-right">
          {{ scope.row.credit_available_amount }}
        </span>
      </el-table-column>

      <el-table-column
        prop="credit_used_amount"
        :label="$t('field.businessPartner.creditUsed')"
        header-align="center"
      >
        <span slot-scope="scope" class="cell-align-right">
          {{ scope.row.credit_used_amount }}
        </span>
      </el-table-column>

      <el-table-column
        prop="revenue_amount"
        :label="$t('field.businessPartner.revenue')"
        header-align="center"
      >
        <span slot-scope="scope" class="cell-align-right">
          {{ scope.row.revenue_amount }}
        </span>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

import store from '@/store'

import IndexColumn from '@/components/ADempiere/DataTable/Components/IndexColumn.vue'

export default defineComponent({
  name: 'TableRecords',

  components: {
    IndexColumn
  },

  props: {
    uuidForm: {
      required: true,
      type: String
    }
  },

  setup(props) {
    const recordsList = computed(() => {
      return store.getters.getBusinessPartnerRecordsList({
        containerUuid: props.uuidForm
      })
    })

    const isLoadingRecords = computed(() => {
      return store.getters.getIsLoadingBusinessPartnerRecord({
        containerUuid: props.uuidForm
      })
    })

    return {
      isLoadingRecords,
      recordsList
    }
  }
})
</script>
