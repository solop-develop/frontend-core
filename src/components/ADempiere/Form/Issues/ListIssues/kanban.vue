<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
  Contributor(s): Elsio Sanchez Elsiosanches@gmail.com https://github.com/Elsiosanchez
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
  <el-card
    shadow="never"
    class="list-card-issues"
    :body-style="{ padding: '10px' }"
  >
    <div
      class="table-list-request"
    >
      <el-empty v-if="isEmptyValue(metadata)" />
      <span
        v-else
      >
        <p
          slot="header"
          style="font-size: 16px;width: 100%;margin: 0px;border: 1px solid rgb(230, 235, 245);border-right: 0px;border-left: 0px;"
        >
          <b style="text-align: left;">
            <el-popover
              placement="top-start"
              trigger="hover"
            >
              <b>
                {{ $t('issues.expirationType') }}
              </b>
              <el-tag :style="{ color: dueTypeColor(metadata), margin: '0px' }">
                {{ metadata.due_type.name }}
              </el-tag>
              <b slot="reference">
                <svg-icon
                  icon-class="issues"
                  :style="{ color: dueTypeColor(metadata), margin: '20px 0px 0px 0px' }"
                />
                <span style="font-size: 12px;">
                  {{ '#' + metadata.document_no }}
                </span>
                <!-- <br> -->
                <!-- <b style="font-size: 18px;float: right;">
                  {{ metadata.subject }}
                </b> -->
              </b>
            </el-popover>
          </b>
          <b style="float: right;">
            <el-popover
              placement="top-start"
              trigger="hover"
              width="650"
            >
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
                  <el-avatar
                    v-if="isEmptyValue(metadata.sales_representative.avatar)"
                    icon="el-icon-user-solid"
                    size="small"
                    style="margin-left: 10px;"
                  />
                  <!-- <el-image
                    v-else
                    :src="avatarResize(metadata.sales_representative)"
                    fit="contain"
                    style="
                      width: 20px;
                      height: 20px;
                      border-radius: 50%;
                      display: inline-block;
                      position: relative;
                      cursor: default;
                      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
                    "
                  /> -->
                  {{ metadata.sales_representative.name }}
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
                </el-descriptions-item>
              </el-descriptions>
              <el-button
                slot="reference"
                style="color: black;padding: 0px;"
                type="text"
                @click="selectIssue(metadata)"
              >
                <p style="margin: 0px;font-size: 18px;font-weight: bold;">
                  {{ metadata.subject }}
                </p>
              </el-button>
            </el-popover>
          </b>
        </p>
        <!-- <hr> -->
        <p style="margin: 0px;">
          <!-- {{ metadata.subject }} -->
          <!-- <br> -->
          <span
            v-if="!isEmptyValue(metadata.sales_representative.name)"
            effect="plain"
          >
            <i style="font-size: 12px;color: #82848a;">
              <b
                style="font-weight: bolder;"
              >
                <svg-icon
                  icon-class="project"
                  style="font-weight: bolder;"
                />
                {{ $t('issues.assigned') }}:
              </b>
              {{ metadata.sales_representative.name }}
            </i>
            <br>
          </span>
          <span
            v-if="!isEmptyValue(metadata.project.name)"
            effect="plain"
          >
            <i style="font-size: 12px;color: #82848a;">
              <b
                style="font-weight: bolder;"
              >
                <svg-icon
                  icon-class="project"
                  style="font-weight: bolder;"
                />
                {{ $t('issues.project') }}:
              </b>
              {{ metadata.project.name }}
            </i>
            <br>
          </span>
          <span
            v-if="!isEmptyValue(metadata.business_partner.name)"
            effect="plain"
          >
            <i style="font-size: 12px;color: #82848a;">
              <b>
                <svg-icon icon-class="user" />
                {{ $t('issues.businessPartner') }} :
              </b>
              {{ metadata.business_partner.name }}
            </i>
            <br>
          </span>
          <span>
            <i style="font-size: 12px;color: #82848a;">
              <b>
                <svg-icon icon-class="label" style="font-size: 20px;" />
                {{ $t('issues.taskStatus') + ': ' }}
              </b>
              {{ metadata.status.name }}
            </i>
            <br>
          </span>
          <span type="primary" size="mini" plain>
            <i style="font-size: 12px;color: #82848a;">
              <b>
                <svg-icon icon-class="collections" style="font-size: 20px;" />
                {{ $t('issues.priority') + ': ' }}
              </b>
              {{ metadata.priority.name }}
            </i>
            <br>
          </span>
          <span type="primary" size="mini" plain>
            <progress-percentage
              :displayed-value="metadata.task_status.name"
              :value="metadata.task_status.value"
              style="margin: 10px 0px;"
              :text-color="'white'"
            />
          </span>
        </p>
      </span>
    </div>
  </el-card>
</template>

<script>
import {
  defineComponent,
  computed
} from '@vue/composition-api'

import store from '@/store'

// Components and Mixins
// import RecordTime from '@/components/ADempiere/Form/Issues/recordTime.vue'
import ProgressPercentage from '@/components/ADempiere/ContainerOptions/ProgressPercentage.vue'

// Utils and Helper Methods
import { formatDate } from '@/utils/ADempiere/formatValue/dateFormat'
import { dueTypeColor } from '@/utils/ADempiere/dictionary/form/Issues'

export default defineComponent({
  name: 'IssuesKanban',

  components: {
  //   RecordTime,
    ProgressPercentage
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
      default: {}
    }
  },

  setup() {
    const isNewIssues = computed(() => {
      return store.getters.getNewIssues
    })

    function selectIssue(issue) {
      store.commit('setNewIssues', !isNewIssues.value)
      store.dispatch('changeCurrentIssues', issue)
    }

    return {
      // Computed
      isNewIssues,
      // Methods
      dueTypeColor,
      selectIssue,
      formatDate
    }
  }
})
</script>

<style lang="scss">
.all-request-box-card {
  padding: 0px;
  .el-card__body {
    padding: 0px;
  }
}
.table-list-request {
  .el-table td.el-table__cell div {
    display: flex;
    padding: 0px;
  }
  .el-table thead {
    display: none;
  }
  .el-table--medium .el-table__cell {
    padding: 0px;
  }
}
.p {
  margin: 0px !important;
}
.el-card__body {
  padding: 20px;
  padding-top: 0px !important;
  padding-right: 20px;
  padding-bottom: 0px!important;
  padding-left: 20px;
}
.tui-editor .te-preview-style-vertical .te-preview {
  float: left;
  width: auto !important;
}
.te-preview {
    overflow: auto;
    width: auto !important;
    padding: 0 25px;
    height: 100%;
}

.issues-card {
  .el-card__body {
    padding-top: 0px !important;
    padding-right: 0px;
    padding-bottom: 0px!important;
    padding-left: 0px;
  }
}
.list-card-issues {
  .el-card__header {
    padding: 5px 15px;
  }
}
.table-list-request {
  overflow: auto;
}
</style>
<style scoped>
.scroll-chats {
  width: 100%;
  height: 500px;
}
</style>
