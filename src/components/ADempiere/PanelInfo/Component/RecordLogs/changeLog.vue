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
  <el-row>
    <!--
    <el-col :span="1">
      <span style="color: white;">.</span>
    </el-col>
    -->

    <el-col :span="9" style="margin-left: 25px;">
      <span style="color: #606266; font-weight: bold;">
        {{ changeLog.display_column_name }}
      </span>
      ({{ changeLog.column_name }})
    </el-col>

    <el-col :span="7">
      <document-status-tag
        v-if="isDocumentStatus({ columnName: changeLog.column_name })"
        style="text-decoration:line-through;"
        :value="changeLog.old_value"
        :displayed-value="changeLog.old_display_value"
      />
      <el-link v-else type="danger" style="text-decoration:line-through;">
        {{ changeLog.old_display_value }}
      </el-link>
    </el-col>

    <el-col :span="7">
      <document-status-tag
        v-if="isDocumentStatus({ columnName: changeLog.column_name })"
        :value="changeLog.new_value"
        :displayed-value="changeLog.new_display_value"
      />
      <el-link v-else type="success">
        {{ changeLog.new_display_value }}
      </el-link>
    </el-col>
  </el-row>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

// Components and Mixins
import DocumentStatusTag from '@/components/ADempiere/ContainerOptions/DocumentStatusTag/index.vue'

// Utils and Helper Methods
import { isDocumentStatus } from '@/utils/ADempiere/constants/systemColumns'

export default defineComponent({
  name: 'ChangeLog',

  components: {
    DocumentStatusTag
  },

  props: {
    changeLog: {
      type: Object,
      required: true
    }
  },

  setup() {
    return {
      isDocumentStatus
    }
  }
})
</script>
