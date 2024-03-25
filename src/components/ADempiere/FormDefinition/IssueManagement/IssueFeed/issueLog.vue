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
  <el-card class="list-comments">
    <issue-avatar :user="comment.user" style="font-size: 10px" />
    <el-descriptions :column="1" style="margin-top: 10px; margin-bottom:10px">
      <el-descriptions-item
        v-for="log in comment.change_logs"
        :key="log.id"
        label-style="{ color: #606266; }"
      >
        <template slot="label">
          <label style="color: #606266;padding-right: 5px; font-size: 10px">
            {{ log.label }}
          </label>
          <!-- ({{ log.column_name }}) -->
        </template>
        <span style="font-weight: bold">
          <el-link
            :type="!isEmptyValue(log.displayed_value) ? 'success' : 'danger'"
            :style="isEmptyValue(log.displayed_value) ? 'text-decoration:line-through; font-size:10px' : 'font-size:10px'"
          >
            <b v-if="!isEmptyValue(log.new_value) && log.new_value.type === 'date'">
              {{ isEmptyValue(log.new_value.value) ? 'NULL': translateDate({value:log.new_value.value, format:'onlyDateLatin'}) }}
            </b>
            <b v-else>
              {{ isEmptyValue(log.displayed_value) ?'NULL': log.displayed_value }}
            </b>
          </el-link>
        </span>
      </el-descriptions-item>onlyDate
    </el-descriptions>
  </el-card>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
import { translateDate } from '@/utils/ADempiere/formatValue/dateFormat'
import IssueAvatar from '@/components/ADempiere/FormDefinition/IssueManagement/issueAvatar.vue'
export default defineComponent({
  name: 'IssueLog',

  components: {
    IssueAvatar
  },

  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  setup() {
    return {
      translateDate
    }
  }
})
</script>
