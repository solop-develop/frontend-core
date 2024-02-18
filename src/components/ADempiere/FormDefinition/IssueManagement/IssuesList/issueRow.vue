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
  <el-card
    shadow="never"
    class="list-card-issues"
    :body-style="{ padding: '0px' }"
  >
    <div
      class="table-list-request"
    >
      <el-empty v-if="isEmptyValue(metadata)" />

      <span
        v-else
      >
        <el-row>
          <el-col
            :span="1"
            style="padding-right: 0px;"
          >
            <el-popover
              placement="top-start"
              trigger="hover"
              width="650"
            >
              <issue-preview
                :metadata="metadata"
              />
              <!-- <b>
                {{ $t('issues.expirationType') }}
              </b>
              <el-tag :style="{ color: dueTypeColor(metadata), margin: '0px' }">
                {{ metadata.due_type.name }}
              </el-tag> -->
              <b slot="reference" style="font-size: 30px;padding-top: 10px;padding-left: 5px;padding-right: 5px;">
                <svg-icon
                  icon-class="issues"
                  :style="{ color: dueTypeColor(metadata), margin: '5px 0px 0px 0px' }"
                />
              </b>
            </el-popover>
          </el-col>

          <el-col
            :span="7"
            style="padding: 0px;"
          >
            <el-button
              style="color: black;padding: 0px;"
              type="text"
              @click="selectIssue(metadata)"
            >
              <p style="margin: 0px;font-size: 16px;text-align: left;margin-top: 5px;margin-bottom: 5px;">
                <!-- {{ '#' + metadata.document_no }} -->
                {{ metadata.subject }}
              </p>
              <p style="margin: 0px;text-align: initial;">
                <span
                  v-if="!isEmptyValue(metadata.project.name)"
                  effect="plain"
                >
                  <i style="font-size: 12px;color: #82848a;">
                    <b style="font-weight: bolder;">
                      <svg-icon
                        icon-class="project"
                        style="font-weight: bolder;"
                      />
                      <!-- {{ $t('issues.project') }}: -->
                    </b>
                    {{ metadata.project.name }}
                  </i>
                </span>
                <span
                  v-if="!isEmptyValue(metadata.business_partner.name)"
                  effect="plain"
                >
                  <i style="font-size: 12px;color: #82848a;">
                    <b>
                      <svg-icon icon-class="user" />
                      <!-- {{ $t('issues.businessPartner') }} : -->
                    </b>
                    {{ metadata.business_partner.name }}
                  </i>
                </span>
              </p>
            </el-button>
          </el-col>

          <el-col
            :span="4"
            style="padding: 0px;text-align: center"
          >
            <progress-percentage
              :displayed-value="metadata.task_status.name"
              :value="metadata.task_status.value"
              style="margin: 10px 0px;"
              :text-color="'white'"
            />
          </el-col>

          <el-col
            :span="4"
            style="padding: 0px;text-align: center"
          >
            <el-button
              style="margin: 10px 0px;"
              type="primary"
              size="mini"
              round
              plain
            >
              {{ metadata.sales_representative.name }}
            </el-button>
          </el-col>

          <el-col
            :span="2"
            style="padding: 0px;text-align: center"
          >
            <el-button
              style="margin: 10px 0px;"
              size="mini"
              plain
            >
              <b>
                <svg-icon icon-class="calendar" style="font-size: 20px;" />
              </b>
              <span v-if="!isEmptyValue(metadata.dateNextAction)">
                {{ formatDate({
                  value: metadata.dateNextAction
                }) }}
              </span>
              <span v-else>
                -- / -- / ----
              </span>
            </el-button>
          </el-col>

          <!-- <el-col
            :span="2"
            style="padding: 0px;text-align: center"
          >
            <el-button type="primary" size="mini" plain style="margin: 10px 0px;">
              <b>
                <svg-icon icon-class="collections" style="font-size: 20px;" />
              </b>
              {{ metadata.priority.name }}
            </el-button>
          </el-col> -->

          <el-col
            :span="3"
            style="padding: 0px;text-align: center"
          >
            <el-button v-if="!isEmptyValue(metadata.status.id) && metadata.status.id > 0" size="mini" type="info" plain style="margin: 10px 0px;">
              <b>
                <svg-icon icon-class="label" style="font-size: 20px;" />
              </b>
              {{ metadata.status.name }}
            </el-button>
            <el-button v-else size="mini" type="info" plain style="margin: 10px 0px;">
              <b>
                <svg-icon icon-class="label" style="font-size: 20px;" />
              </b>
              {{ $t('issues.emptyStatus') }}
            </el-button>
          </el-col>

          <!-- <el-col
            :span="3"
            style="padding: 0px;text-align: center"
          >
            <el-button size="mini" type="info" plain style="margin: 10px 0px;">
              <b>
                <svg-icon icon-class="label" style="font-size: 20px;" />
              </b>
              {{ metadata.request_type.name }}
            </el-button>
          </el-col> -->

          <el-col
            :span="2"
            style="padding: 0px;text-align: center"
          >
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-zoom-in"
              :alt="$t('page.processActivity.zoomIn')"
              plain
              style="float: right; margin-right: 5px; margin-left: 0px;margin-top: 5px;"
              class="button-base-icon"
              @click="zoomIssues(metadata)"
            />

            <el-popover
              ref="timeRecord"
              placement="left"
              :title="$t('form.timeRecord.timeRecord') + ' (' + metadata.id + ')'"
              trigger="click"
              width="450"
            >
              <record-time
                :issue-id="metadata.id"
              />
              <el-button
                slot="reference"
                type="primary"
                size="mini"
                plain
                class="button-base-icon"
                style="float: right; margin-right: 5px; margin-left: 0px;margin-top: 5px;"
                :alt="$t('form.timeRecord.timeRecord')"
              >
                <i class="el-icon-time" />
              </el-button>
            </el-popover>
          </el-col>
        </el-row>
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
import IssuePreview from '@/components/ADempiere/FormDefinition/IssueManagement/IssuesList/issuePreview.vue'
import RecordTime from '@/components/ADempiere/Form/Issues/recordTime.vue'
import ProgressPercentage from '@/components/ADempiere/ContainerOptions/ProgressPercentage.vue'

// Constants
import { REQUEST_WINDOW_UUID } from '@/utils/ADempiere/dictionary/form/Issues.js'

// Utils and Helper Methods
import { formatDate } from '@/utils/ADempiere/formatValue/dateFormat'
import { zoomIn } from '@/utils/ADempiere/coreUtils.js'
import { dueTypeColor } from '@/utils/ADempiere/dictionary/form/Issues'

export default defineComponent({
  name: 'IssueRow',

  components: {
    IssuePreview,
    RecordTime,
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
      required: true
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

    function zoomIssues(issues) {
      zoomIn({
        uuid: REQUEST_WINDOW_UUID,
        params: {
          filters: [
            {
              columnName: 'UUID',
              value: issues.uuid
            }
          ]
        }
      })
    }

    return {
      // Computed
      isNewIssues,
      // Methods
      dueTypeColor,
      formatDate,
      selectIssue,
      zoomIssues
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
// .list-card-issues-filter {

// }
</style>
<style scoped>
.scroll-chats {
  width: 100%;
  height: 500px;
}
</style>
