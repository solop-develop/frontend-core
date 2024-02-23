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
  <el-descriptions :column="2">
    <template slot="title">
      <b>
        <svg-icon icon-class="guide" />
        {{ metadata.subject }}
      </b>
    </template>
    <template slot="extra">
      <b>
        {{ '#' }}
        {{ metadata.document_no }}
      </b>
    </template>

    <el-descriptions-item :span="4">
      <template slot="label">
        <b>
          {{ $t('issues.summary') }}
        </b>
      </template>
      <el-scrollbar wrap-class="scroll-previwer-disable" style="width: 100%; overflow: hidden;">
        <v-md-preview :text="metadata.summary" class="previwer-disable" style="padding: 0px" height="150px" />
      </el-scrollbar>
    </el-descriptions-item>

    <el-descriptions-item :span="4">
      <template slot="label">
        <b>
          {{ $t('issues.created') }}
        </b>
      </template>
      {{ metadata.user.name }}
    </el-descriptions-item>

    <el-descriptions-item style="float: right;">
      <template slot="label">
        <b style="padding-top: 10px !important;">
          {{ $t('issues.priority') }}
        </b>
      </template>
      <el-button type="primary" size="medium" plain style="float: right;margin-right: 10px;">
        <svg-icon icon-class="collections" />
        {{ metadata.priority.name }}
      </el-button>
    </el-descriptions-item>

    <el-descriptions-item>
      <template slot="label">
        <b style="padding-top: 10px !important;">
          {{ $t('issues.typeOfRequest') }}
        </b>
      </template>
      <el-button size="medium" plain type="info" style="float: right;margin-right: 10px;">
        <svg-icon icon-class="label" />
        {{ metadata.request_type.name }}
      </el-button>
    </el-descriptions-item>

    <el-descriptions-item>
      <template slot="label">
        <b style="padding-top: 5px !important;">
          {{ $t('issues.assigned') }}
        </b>
      </template>
      <issue-avatar :user="metadata.sales_representative" />
    </el-descriptions-item>

    <el-descriptions-item>
      <template slot="label">
        <b>
          {{ $t('issues.expirationType') }}
        </b>
      </template>
      <el-tag :style="{ color: dueTypeColor(metadata), margin: '0px' }">
        {{ metadata.due_type.name }}
      </el-tag>
    </el-descriptions-item>

    <el-descriptions-item :span="4" style="float: right;">
      <template slot="label">
        <b>
          <svg-icon icon-class="calendar" style="font-size: 18px;" />
          {{ $t('issues.nextActionDate') }}
        </b>
      </template>
      <span v-if="!isEmptyValue(metadata.dateNextAction)">
        {{ formatDate({
          value: metadata.dateNextAction
        }) }}
      </span>
      <span v-else>
        --/--/----
      </span>
    </el-descriptions-item>
  </el-descriptions>
</template>

<script>
import {
  defineComponent
} from '@vue/composition-api'

// Components and Mixins
import IssueAvatar from '@/components/ADempiere/FormDefinition/IssueManagement/issueAvatar.vue'

// Utils and Helper Methods
import { formatDate } from '@/utils/ADempiere/formatValue/dateFormat'
import { dueTypeColor } from '@/utils/ADempiere/dictionary/form/Issues'

export default defineComponent({
  name: 'IssuePreview',

  components: {
    IssueAvatar
  },

  props: {
    tableName: {
      type: String,
      required: false
    },
    recordId: {
      type: Number,
      required: false
    },
    metadata: {
      type: Object,
      required: true
    }
  },

  setup() {
    return {
      dueTypeColor,
      formatDate
    }
  }
})
</script>
