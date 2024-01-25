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
    <issue-avatar :user="comment.user" />

    <el-descriptions :column="1">
      <el-descriptions-item
        v-for="log in comment.change_logs"
        :key="log.id"
        label-style="{ color: #606266; font-weight: bold; }"
      >
        <template slot="label">
          <span style="color: #606266; font-weight: bold;padding-right: 5px;">
            {{ log.label }}
          </span>
          ({{ log.column_name }})
        </template>

        <span style="font-weight: bold;">
          <el-link
            :type="!isEmptyValue(log.displayed_value) ? 'success' : 'danger'"
            :style="isEmptyValue(log.displayed_value) ? 'text-decoration:line-through;' : ''"
          >
            <b>
              {{ isEmptyValue(log.displayed_value) ? 'NULL' : log.displayed_value }}
            </b>
          </el-link>
        </span>
      </el-descriptions-item>
    </el-descriptions>
  </el-card>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

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
  }
})
</script>

