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
  <el-card class="box-card">
    <el-divider content-position="left">
      {{ $t('window.containerInfo.accountingInformation.selection') }}
    </el-divider>

    <el-form
      ref="form-query-criteria"
      label-position="top"
      class="form-base"
      size="small"
      inline
    >
      <el-row :gutter="20">
        <el-col :span="8">
          <accouting-schema-filter />
        </el-col>

        <el-col :span="8">
          <posting-type-filter />
        </el-col>

        <template v-if="isDocumentSelectable">
          <el-col v-if="false" :span="8">
            <organization-filter />
          </el-col>
        </template>
      </el-row>
    </el-form>
  </el-card>
</template>

<script>
import { computed, defineComponent } from '@vue/composition-api'

// Components and Mixins
import AccoutingSchemaFilter from './accoutingSchemaFilter.vue'
import OrganizationFilter from './organizationFilter.vue'
import PostingTypeFilter from './postingTypeFilter.vue'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'QueryCriteria',

  components: {
    AccoutingSchemaFilter,
    OrganizationFilter,
    PostingTypeFilter
  },

  props: {
    containerUuid: {
      type: String,
      default: () => ''
    },
    tableName: {
      type: String,
      default: () => ''
    },
    recordId: {
      type: Number,
      default: () => 0
    }
  },

  setup(props) {
    const isDocumentSelectable = computed(() => {
      return isEmptyValue(props.tableName) && props.recordId <= 0
    })

    return {
      isDocumentSelectable
    }
  }
})
</script>
