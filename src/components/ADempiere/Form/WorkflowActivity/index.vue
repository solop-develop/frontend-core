<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
  Contributor(s): Elsio Sanchez elsiosanches@gmail.com https://github.com/elsiosanchez
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
  <div style="height: 90vh">
    <el-card
      style="height: 100%;"
      :body-style="{ padding: '10px', height: '100%' }"
    >
      <div style="height: 65% !important;">
        <el-row
          :gutter="10"
          style="height: 100%;"
        >
          <el-col
            :span="12"
            style="height: 100%;"
          >
            <el-card
              style="height: 100%;"
              :body-style="{ padding: '5px', height: '90%' }"
            >
              <b
                slot="header"
              >
                {{ $t('form.workflowActivity.title') }}
              </b>
              <el-table
                :data="activityList"
                highlight-current-row
                style="width: 100%;height: 100%"
                border
                height="60% !important"
                @current-change="handleCurrentChange"
              >
                <index-column
                  :page-number="1"
                />
                <el-table-column
                  v-for="(workflowColumn) in headerTable"
                  :key="workflowColumn.columnName"
                  :column-key="workflowColumn.columnName"
                  :label="workflowColumn.name"
                  :align="workflowColumn.isNumeric ? 'right' : 'left'"
                  :prop="workflowColumn.columnName"
                  :width="workflowColumn.width"
                />
              </el-table>
            </el-card>
          </el-col>
          <el-col
            :span="12"
            style="height: 100%;"
          >
            <el-card
              style="height: 100%;"
              :body-style="{ padding: '5px', height: '90%' }"
            >
              <span
                slot="header"
                style="display: flex;"
              >
                <p
                  style="margin: 0px;float: left;width: 50%;"
                >
                  <el-button
                    type="text"
                    style="color: #303133;font-size: 16px;font-weight: bolder;"
                  >
                    {{ $t('field.logsField') }}
                  </el-button>
                </p>
                <p
                  style="margin: 0px;float: right;width: 50%;text-align: right"
                >
                  <el-button
                    round
                    @click="showWorkflow = !showWorkflow"
                  >
                    <svg-icon icon-class="workflow" />
                    {{ $t('form.workflowActivity.filtersSearch.seeFlowDiagram') }}
                  </el-button>
                </p>
              </span>
              <!-- {{ currentActivity }} -->
              <el-timeline v-if="!isEmptyValue(currentActivity)">
                <el-timeline-item
                  v-for="(nodes, key) in currentActivity.workflow_process.workflow_events"
                  :key="key"
                  :timestamp="translateDateByLong(nodes.log_date)"
                  placement="top"
                >
                  <b>{{ nodes.node_name }}</b> {{ nodes.text_message }}
                </el-timeline-item>
              </el-timeline>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <div style="height: 35% !important;">
        <el-card
          style="height: 100%;"
          :body-style="{ padding: '10px', height: '100%' }"
        >
          <el-form
            v-show="!isEmptyValue(currentActivity)"
            :inline="true"
            class="demo-form-inline"
          >
            <el-row :gutter="24">
              <el-col :span="8" style="text-align: center;">
                <el-form-item label="Reenviar">
                  <el-switch v-model="chooseOption" />
                </el-form-item>
              </el-col>

              <el-col v-show="isValidateUserChoice" :span="8" style="text-align: center;">
                <el-form-item :label="$t('form.workflowActivity.filtersSearch.approve')">
                  <el-switch v-model="isProved" />
                </el-form-item>
              </el-col>

              <el-col v-show="chooseOption" :span="8" style="text-align: center;">
                <el-form-item :label="$t('form.workflowActivity.filtersSearch.user')">
                  <el-select
                    v-model="userId"
                    filterable
                    @visible-change="findSalesReps"
                  >
                    <el-option
                      v-for="item in listSalesReps"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <v-md-editor
            v-model="message"
            height="200px"
          />
          <p style="text-align: end; width: 100%;margin: 5px;">
            <el-button
              type="primary"
              class="button-base-icon"
              icon="el-icon-check"
              style="float: right;"
              @click="sendOPeration()"
            />
            <el-button
              type="primary"
              plain
              icon="el-icon-zoom-in"
              :alt="$t('page.processActivity.zoomIn')"
              style="float: right; margin-right: 5px; margin-left: 0px;"
              class="button-base-icon"
              @click="zoomRecord(currentActivity)"
            />
            <el-button
              type="info"
              class="button-base-icon"
              plain
              style="float: right; margin-right: 5px;"
              @click="clearMessage()"
            >
              <svg-icon icon-class="layers-clear" />
            </el-button>
          </p>
        </el-card>
      </div>
    </el-card>
    <el-drawer
      :visible.sync="showWorkflow"
      size="50%"
    >
      <h3 slot="title" style="text-align: center;margin: 0px;">
        {{ $t('form.workflowActivity.filtersSearch.workFlowDiagram') }}
      </h3>
      <workflow-diagram
        v-if="(!isEmptyValue(workflowStatesList) && !isEmptyValue(currentActivity))"
        :node-transition-list="workflowTranstitionsList"
        :node-list="workflowStatesList"
        :current-node="currentNode"
        :orientation="'vertical'"
        :workflow-logs="currentActivity.workflow_process.workflow_events"
        style="height: 100% !important;overflow: auto;"
      />
    </el-drawer>
  </div>
</template>

<script>
import {
  defineComponent,
  computed,
  watch,
  ref
} from '@vue/composition-api'

import lang from '@/lang'
import store from '@/store'

// Components and Mixins
import 'simple-m-editor/dist/simple-m-editor.css'
import WorkflowDiagram from '@/components/ADempiere/WorkflowManager/WorkflowDiagram.vue'
import IndexColumn from '@/components/ADempiere/DataTable/Components/IndexColumn.vue'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { translateDateByLong } from '@/utils/ADempiere/formatValue/dateFormat'
import { generateWorkflowDiagram } from '@/utils/ADempiere/dictionary/workflow'
import { showMessage } from '@/utils/ADempiere/notification'
import { zoomIn } from '@/utils/ADempiere/coreUtils.js'

// API Request Methods
import {
  requestListSalesRepresentatives
} from '@/api/ADempiere/user-interface/component/issue'
import {
  processWorkflowActivity,
  forwardWorkflowActivity
} from '@/api/ADempiere/workflow.js'

export default defineComponent({
  name: 'WorkflowActivity',

  components: {
    IndexColumn,
    WorkflowDiagram
  },

  setup() {
    /**
     * Ref
     */
    const message = ref('')
    const chooseOption = ref(false)
    const isProved = ref(false)
    const userId = ref('')
    const listSalesReps = ref([])
    const showWorkflow = ref(false)
    const workflowTranstitionsList = ref([])
    const workflowStatesList = ref([])
    const currentWorkflow = ref({})
    const listProcessWorkflow = ref([])
    const currentNode = ref([
      {
        classname: 'delete',
        id: ''
      }
    ])

    /**
     * Computed
     */
    const activityList = computed(() => {
      const list = store.getters.getRecordsWorkflowActivities
      if (!isEmptyValue(list)) {
        const workflowList = list.map(nodo => {
          const index = nodo.workflow_process.text_message.search(':')
          const summaryText = nodo.workflow_process.text_message.slice(0, index)
          return {
            ...nodo,
            summary: nodo.zoom_windows[0].description + ' ' + summaryText
          }
        }).filter(activity => !isEmptyValue(activity.id))
        if (!isEmptyValue(workflowList)) {
          store.commit('setActivity', workflowList[0])
          return workflowList
        }
      }
      return []
    })

    const headerTable = computed(() => {
      return [
        {
          columnName: 'node.priority',
          name: lang.t('form.workflowActivity.table.priority'),
          isNumeric: true,
          width: 90
        },
        {
          columnName: 'node.name',
          name: lang.t('form.workflowActivity.table.node'),
          isNumeric: false,
          width: 250
        },
        {
          columnName: 'summary',
          name: lang.t('report.summary'),
          isNumeric: false,
          width: 'auto'
        }
      ]
    })

    const currentActivity = computed(() => {
      return store.getters.getCurrentActivity
    })

    const isValidateUserChoice = computed(() => {
      if (!isEmptyValue(currentActivity.value) && !isEmptyValue(currentActivity.value.node) && !isEmptyValue(currentActivity.value.node.action_name)) {
        if (!chooseOption.value && currentActivity.value.node.action_name === 'USER_CHOICE') {
          return true
        }
      }
      return !chooseOption.value
    })

    /**
     * Methods
     */

    function handleCurrentChange(activity) {
      store.commit('setActivity', activity)
    }

    function loadActivity() {
      store.dispatch('loadActivity', {})
    }

    function generateWorkflow(activity) {
      if (isEmptyValue(activity)) return
      currentWorkflow.value = activity
      listProcessWorkflow.value = !isEmptyValue(currentWorkflow.value.workflow_process) ? currentWorkflow.value.workflow_process.workflow_events.reverse() : []
      if (!isEmptyValue(activity.node.id)) {
        currentNode.value = [{
          classname: 'delete',
          id: activity.node.id
        }]
      }

      const {
        transitionsList,
        statesList
      } = generateWorkflowDiagram(activity.workflow)

      workflowTranstitionsList.value = transitionsList
      workflowStatesList.value = statesList
    }

    function clearMessage() {
      message.value = ''
    }

    function zoomRecord(activity) {
      const { zoom_windows, table_name, record_id, is_sales_transaction } = activity
      let currentActivity = zoom_windows.at(0)
      if (zoom_windows.length > 1) {
        currentActivity = zoom_windows.find(zoomItem => {
          return zoomItem.is_sales_transaction === is_sales_transaction
        })
      }
      const columnName = table_name + '_ID'
      // table_name
      zoomIn({
        attributeValue: `window_${currentActivity.id}`,
        attributeName: 'containerKey',
        query: {
          [columnName]: record_id
        },
        params: {
          [columnName]: record_id
        }
      })
      clearData()
    }

    function sendOPeration() {
      if (isProved.value) {
        processWorkflow(currentActivity.value)
      } else {
        forwardWorkflow(currentActivity.value)
      }
      clearData()
      store.dispatch('loadActivity', {})
    }

    function forwardWorkflow({ id, uuid }) {
      forwardWorkflowActivity({
        id,
        uuid,
        message: message.value,
        userId: userId.value
      })
        .then(() => {
          showMessage({
            message: 'OK',
            type: 'success'
          })
        })
        .catch(error => {
          console.warn(`Forward Workflow Activities: ${error.message}. Code: ${error.code}.`)
          let message = error.message
          if (!isEmptyValue(error.response) && !isEmptyValue(error.response.data.message)) {
            message = error.response.data.message
          }

          showMessage({
            type: 'error',
            message,
            showClose: true
          })
        })
    }
    function processWorkflow({ id, uuid }) {
      processWorkflowActivity({
        id,
        uuid,
        message: message.value,
        isApproved: isProved.value
      })
        .then(() => {
          showMessage({
            message: 'OK',
            type: 'success'
          })
        })
        .catch(error => {
          console.warn(`Process Workflow Activities: ${error.message}. Code: ${error.code}.`)
          let message = error.message
          if (!isEmptyValue(error.response) && !isEmptyValue(error.response.data.message)) {
            message = error.response.data.message
          }

          showMessage({
            type: 'error',
            message,
            showClose: true
          })
        })
    }

    function clearData() {
      message.value = ''
      chooseOption.value = false
      userId.value = ''
      isProved.value = false
    }

    function findSalesReps(isVisible) {
      if (!isVisible) {
        return
      }
      requestListSalesRepresentatives({
        pageSize: 500
      })
        .then(response => {
          const { records } = response
          listSalesReps.value = records
        })
        .catch(error => {
          showMessage({
            message: error.message,
            type: 'warning'
          })
        })
    }

    loadActivity()

    /**
     * Watch
     */

    watch(currentActivity, (newValue) => {
      if (newValue && !isEmptyValue(newValue)) {
        generateWorkflow(newValue)
      }
    })

    return {
      // Ref
      message,
      userId,
      isProved,
      showWorkflow,
      chooseOption,
      listSalesReps,
      currentNode,
      currentWorkflow,
      workflowStatesList,
      listProcessWorkflow,
      workflowTranstitionsList,
      // Computed
      headerTable,
      activityList,
      currentActivity,
      isValidateUserChoice,
      // Methods
      zoomRecord,
      clearMessage,
      sendOPeration,
      findSalesReps,
      handleCurrentChange,
      // Utils
      translateDateByLong,
      generateWorkflowDiagram
    }
  }
})
</script>

<style lang="scss" scoped>
  .demo-form-inline {
    .el-form-item {
      margin: 0px;
    }
  }
  .from-main {
    padding-right: 1% !important;
    padding-bottom: 0px !important;
    padding-top: 0px !important;
    padding-left: 1% !important;
  }
  .card-form {
    height: 100% !important;
    overflow: auto;
  }
  .header {
    padding-bottom: 0px;
    padding-top: 1.5%;
    box-sizing: border-box;
    flex-shrink: 0;
    padding-left: 1%;
    padding-right: 1%;
  }
  .from-footer {
    height: 5% !important;
    box-sizing: border-box;
    flex-shrink: 0;
  }
  .footer {
    padding-top: 0px;
    height: 10% !important;
    padding-bottom: 0px;
  }
  .main {
    padding-bottom: 0px;
    padding-top: 0px;
  }
  .search {
    height: 100%;
  }
  .show-title-footer {
    padding-top: 0px;
    height: 8% !important;
    padding-bottom: 0px;
  }
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
<style scoped>
  .panel_main {
    height: 100%;
    width: 100%;
  }
</style>
<style lang='scss'>
.scroll-child {
  max-height: 450px;
}
.el-card {
  border-radius: 4px;
  border: 1px solid #e6ebf5;
  background-color: #FFFFFF;
  overflow: hidden;
  color: #303133;
  -webkit-transition: 0.3s;
  transition: 0.3s;
  display: block;
}
.headerTable {
  .el-card {
    border-radius: 4px;
    border: 1px solid #e6ebf5;
    background-color: #FFFFFF;
    overflow: hidden;
    color: #303133;
    -webkit-transition: 0.3s;
    transition: 0.3s;
    display: block;
  }
  .el-card__body {
    height: 80% !important;
  }
}
.headerLogs {
  .el-card {
    border-radius: 4px;
    border: 1px solid #e6ebf5;
    background-color: #FFFFFF;
    overflow: hidden;
    color: #303133;
    -webkit-transition: 0.3s;
    transition: 0.3s;
    display: block;
  }
  .el-card__body {
    height: 95% !important;
  }
}
</style>
