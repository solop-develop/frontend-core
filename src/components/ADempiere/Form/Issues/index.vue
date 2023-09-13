<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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
  <el-container :style="isNewIssues ? 'height: 90vh;padding: 0px;display: contents' : 'height: 90vh;padding: 0px;'">
    <el-main style="padding: 0px;">
      <el-card v-if="!isNewIssues" class="all-request-box-card">
        <div slot="header" class="clearfix">
          <b style="color: black; font-size: 19px;">
            {{ $t('issues.allRequest') }}
          </b>
          <el-button style="float: right;" plain type="success" @click="newIssues()">
            {{ $t('issues.createNewRequest') }}
            <i class="el-icon-plus" />
          </el-button>
        </div>
        <div class="table-list-request">
          <el-empty v-if="isEmptyValue(listIssues)" style="height: 600px;" />
          <el-table
            v-else
            :data="listIssues"
          >
            <!-- @row-click="selectIssue" -->
            <el-table-column style="display: flex;" :label="$t('issues.allRequest')">
              <template slot-scope="scope">
                <el-popover
                  placement="top-start"
                  trigger="hover"
                >
                  <b>
                    {{ $t('issues.expirationType') }}
                  </b>
                  <el-tag :style="{ color: dueTypeColor(scope.row), margin: '0px' }">
                    {{ scope.row.due_type.name }}
                  </el-tag>
                  <b slot="reference" style="font-size: 30px;padding-top: 10px;padding-left: 5px;padding-right: 5px;">
                    <svg-icon
                      icon-class="issues"
                      :style="{ color: dueTypeColor(scope.row), margin: '20px 0px 0px 0px' }"
                    />
                  </b>
                </el-popover>

                <div style="margin-top: 0px;margin-bottom: 0px;width: 100%;">
                  <p style="font-size: 18px;width: 100%;margin-top: 10px;margin-bottom: 10px;">
                    <b>
                      <el-popover
                        placement="top-start"
                        trigger="hover"
                        width="650"
                      >
                        <el-descriptions :column="2">
                          <template slot="title">
                            <b>
                              <svg-icon icon-class="guide" />
                              {{ scope.row.subject }}
                            </b>
                          </template>
                          <template slot="extra">
                            <b>
                              {{ '#' }}
                              {{ scope.row.document_no }}
                            </b>
                          </template>
                          <el-descriptions-item :span="4">
                            <template slot="label">
                              <b>
                                {{ $t('issues.summary') }}
                              </b>
                            </template>
                            <el-scrollbar wrap-class="scroll-previwer-disable" style="width: 100%; overflow: hidden;">
                              <v-md-preview :text="scope.row.summary" class="previwer-disable" style="padding: 0px" height="150px" />
                            </el-scrollbar>
                          </el-descriptions-item>
                          <el-descriptions-item :span="4">
                            <template slot="label">
                              <b>
                                {{ $t('issues.created') }}
                              </b>
                            </template>
                            {{ scope.row.user_name }}
                          </el-descriptions-item>
                          <el-descriptions-item style="float: right;">
                            <template slot="label">
                              <b style="padding-top: 10px !important;">
                                {{ $t('issues.priority') }}
                              </b>
                            </template>
                            <el-button type="primary" size="medium" plain style="float: right;margin-right: 10px;">
                              <svg-icon icon-class="collections" />
                              {{ scope.row.priority.name }}
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
                              {{ scope.row.request_type.name }}
                            </el-button>
                          </el-descriptions-item>
                          <el-descriptions-item>
                            <template slot="label">
                              <b style="padding-top: 5px !important;">
                                {{ $t('issues.assigned') }}
                              </b>
                            </template>
                            <el-avatar
                              v-if="isEmptyValue(scope.row.sales_representative.avatar)"
                              icon="el-icon-user-solid"
                              size="small"
                              style="margin-left: 10px;"
                            />
                            <el-image
                              v-else
                              :src="avatarResize(scope.row.sales_representative)"
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
                            />
                            {{ scope.row.sales_representative.name }}
                          </el-descriptions-item>
                          <el-descriptions-item>
                            <template slot="label">
                              <b>
                                {{ $t('issues.expirationType') }}
                              </b>
                            </template>
                            <el-tag :style="{ color: dueTypeColor(scope.row), margin: '0px' }">
                              {{ scope.row.due_type.name }}
                            </el-tag>
                          </el-descriptions-item>
                          <el-descriptions-item :span="4" style="float: right;">
                            <template slot="label">
                              <b>
                                <svg-icon icon-class="calendar" style="font-size: 18px;" />
                                {{ $t('issues.nextActionDate') }}
                              </b>
                            </template>
                            <span v-if="!isEmptyValue(scope.row.dateNextAction)">
                              {{ formatDate({
                                value: scope.row.dateNextAction
                              }) }}
                            </span>
                          </el-descriptions-item>
                        </el-descriptions>
                        <el-button
                          slot="reference"
                          style="color: black;padding: 0px;"
                          type="text"
                          @click="selectIssue(scope.row)"
                        >
                          <p style="margin: 0px;font-size: 18px;text-align: left;margin-top: 5px;margin-bottom: 5px;">
                            {{ '#' + scope.row.document_no + '  ' + scope.row.subject }}
                          </p>
                          <p style="margin: 0px;text-align: initial;">
                            <i style="font-size: 12px;color: #82848a;">
                              <b>
                                <svg-icon icon-class="calendar" style="font-size: 18px;" />
                                {{ $t('issues.nextActionDate') + ': ' }}
                              </b>
                              <span v-if="!isEmptyValue(scope.row.dateNextAction)">
                                {{ formatDate({
                                  value: scope.row.dateNextAction
                                }) }}
                              </span>
                            </i>
                          </p>
                        </el-button>
                      </el-popover>
                    </b>

                    <el-button
                      type="primary"
                      icon="el-icon-zoom-in"
                      :alt="$t('page.processActivity.zoomIn')"
                      plain
                      style="float: right; margin-right: 5px; margin-left: 0px;margin-top: 5px;"
                      class="button-base-icon"
                      @click="zoomIssues(scope.row)"
                    />

                    <el-popover
                      ref="timeRecord"
                      placement="left"
                      :title="$t('form.timeRecord.timeRecord') + ' (' + scope.row.id + ')'"
                      trigger="click"
                      width="450"
                    >
                      <record-time
                        :issue-id="scope.row.id"
                      />
                      <el-button
                        slot="reference"
                        type="primary"
                        plain
                        class="button-base-icon"
                        style="float: right; margin-right: 5px; margin-left: 0px;margin-top: 5px;"
                        :alt="$t('form.timeRecord.timeRecord')"
                      >
                        <i class="el-icon-time" />
                      </el-button>
                    </el-popover>

                    <el-button type="primary" size="medium" plain style="float: right;margin-right: 10px;">
                      <b>
                        <svg-icon icon-class="collections" style="font-size: 20px;" />
                        {{ $t('issues.priority') + ': ' }}
                      </b>
                      {{ scope.row.priority.name }}
                    </el-button>
                    <el-button size="medium" type="info" plain style="float: right;margin-right: 10px;">
                      <b>
                        <svg-icon icon-class="label" style="font-size: 20px;" />
                        {{ $t('issues.typeOfRequest') + ': ' }}
                      </b>
                      {{ scope.row.request_type.name }}
                    </el-button>
                  </p>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </el-main>
    <el-footer v-if="isNewIssues" height="20%">
      <comment
        :table-name="tableName"
        :record-id="recordId"
      />
    </el-footer>
  </el-container>
</template>

<script>
import {
  defineComponent, computed, ref
} from '@vue/composition-api'

import store from '@/store'

// Components and Mixins
import Comment from './component/Comment.vue'
import RecordTime from './recordTime.vue'

// Constants
import { REQUEST_WINDOW_UUID } from '@/utils/ADempiere/dictionary/form/Issues.js'

// Utils and Helper Methods
import { formatDate } from '@/utils/ADempiere/formatValue/dateFormat'
import { zoomIn } from '@/utils/ADempiere/coreUtils.js'
import { getImagePath } from '@/utils/ADempiere/resource.js'

export default defineComponent({
  name: 'Issues',

  components: {
    // Editor
    Comment,
    RecordTime
  },

  props: {
    tableName: {
      type: String,
      required: false
    },
    recordId: {
      type: Number,
      required: false
    }
  },

  setup(props) {
    const message = ref('')
    const filter = ref('')
    const priority = ref('')
    const typeRequest = ref('')

    const listIssues = computed(() => {
      return store.getters.getListIssues
    })

    const isNewIssues = computed({
      // getter
      get() {
        return store.getters.getNewIssues
      },
      // setter
      set(newValue) {
        store.commit('setNewIssues', newValue)
      }
    })

    const currentIssues = computed(() => {
      return store.getters.getCurrentIssues
    })

    const isShowTitleForm = computed(() => {
      return store.getters.getIsShowTitleForm
    })

    const styleAllRequestBoxCard = computed(() => {
      if (isShowTitleForm.value) return 'height: 80%;overflow: auto;'
      return 'height: 90%;overflow: auto;'
    })

    function dueTypeColor(issue) {
      const { due_type } = issue
      const { value } = due_type
      let color = '#3fb950'
      if (value === '5') {
        color = 'orange'
      } else if (value === '3') {
        color = '#ff2121'
      }
      return color
    }

    function selectIssue(issue) {
      isNewIssues.value = !isNewIssues.value
      store.dispatch('changeCurrentIssues', issue)
    }

    function newIssues(issue) {
      isNewIssues.value = !isNewIssues.value
      store.dispatch('changeCurrentIssues', issue)
    }

    function loadIssues() {
      store.dispatch('listRequest', {})
      store.dispatch('findListMailTemplates')
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

    function avatarResize(user) {
      const { avatar } = user
      const { uri } = getImagePath({
        file: avatar,
        width: 20,
        height: 20,
        operation: 'resize'
      })
      return uri
    }

    loadIssues()

    return {
      message,
      listIssues,
      //
      priority,
      typeRequest,
      filter,
      isNewIssues,
      currentIssues,
      styleAllRequestBoxCard,
      isShowTitleForm,
      // methods
      dueTypeColor,
      formatDate,
      avatarResize,
      selectIssue,
      newIssues,
      loadIssues,
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
// .el-descriptions-item__label:not(.is-bordered-label) {
//   padding-top: 10px;
// }
</style>
<style scoped>
.scroll-chats {
  width: 100%;
  height: 500px;
}
</style>
