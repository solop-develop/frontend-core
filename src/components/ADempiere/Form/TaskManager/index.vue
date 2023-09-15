<!--
ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
Contributor(s): Elsio Sanchez elsiosanchez15@outlook.com https://github.com/elsiosanchez
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
  <div style="height: 85vh;overflow: auto;">
    <el-card class="box-card" style="margin: 0px 5px;padding: 10px 15px;">
      <div slot="header" class="clearfix">
        <h1 style="width: 200px;padding: 0px;margin: 0px 10px;display: contents;">
          {{ $t('form.tasks.title') }}
        </h1>
        <el-button
          type="primary"
          icon="el-icon-refresh-left"
          class="button-base-icon"
          :disabled="isRun"
          style="float: right;"
          @click="getListJobs"
        />
      </div>
      <el-card class="box-card" style="margin: 0px 10px;padding: : 0px 10px;">
        <el-table
          v-if="isEmptyValue(currentJob)"
          :data="list"
          style="width: 100%"
        >
          <el-table-column
            v-for="(header, key) in headerList"
            :key="key"
            :align="header.align"
            :width="header.width"
            :label="header.label"
          >
            <template slot-scope="scope">
              <el-button v-if="'success' === header.key" :type="scope.row[header.key] ? 'primary' : 'danger'" round>
                {{ scope.row[header.key] }}
              </el-button>
              <span v-else>
                {{ scope.row[header.key] }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('form.tasks.table.options')"
            width="200"
          >
            <template slot-scope="scope">
              <el-button
                type="success"
                class="button-base-icon"
                :loading="scope.row.isLoading"
                plain
                :disabled="scope.row.isLoading"
                @click="runJob(scope.row)"
              >
                <svg-icon v-if="!scope.row.isLoading" icon-class="run" />
              </el-button>
              <el-button
                type="info"
                class="button-base-icon"
                :loading="scope.row.isLoading"
                plain
                :disabled="scope.row.isLoading"
                @click="selectJobs(scope.row)"
              >
                <svg-icon v-if="!scope.row.isLoading" icon-class="details" />
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-card v-else class="box-card">
          <div slot="header" class="clearfix">
            <h3 style="width: 200px;padding: 0px;margin: 0px;display: contents;">
              {{ currentJob.displayname }}
            </h3>
            <el-button
              type="success"
              class="button-base-icon"
              :loading="isRun"
              plain
              :disabled="isRun"
              style="float: right;font-size: 26px;margin-left: 10px;"
              @click="runJob(currentJob)"
            >
              <svg-icon v-if="!isRun" icon-class="run" />
            </el-button>
            <el-button
              type="primary"
              icon="el-icon-refresh-left"
              class="button-base-icon"
              plain
              style="float: right;"
              :disabled="isRun"
              @click="executionsJobs(currentJob.id)"
            />
            <el-button
              class="button-base-icon"
              plain
              style="float: right;font-size: 26px;"
              @click="copyOutput(currentJob.executor_config)"
            >
              <svg-icon icon-class="clipboard" />
            </el-button>
            <el-button
              type="info"
              class="button-base-icon"
              plain
              style="float: right;font-size: 26px;"
              @click="currentJob = {}"
            >
              <svg-icon icon-class="undo" />
            </el-button>
          </div>
          <el-tabs
            v-model="nameTab"
            type="border-card"
            @tab-click="selectTabs"
          >
            <el-tab-pane :label="$t('form.tasks.summary')" name="summaryJobs">
              <el-form label-position="top">
                <span v-if="!isRun">
                  <el-form-item
                    v-for="(summary, index) in summarysList"
                    :key="index"
                    :label="summary.label"
                    style="margin-bottom: 0px"
                  >
                    {{ currentJob[summary.key] }}
                  </el-form-item>
                  <el-form-item style="margin-bottom: 0px">
                    <div id="code" style="background: #282c34;color: #fff;padding: 15px;overflow: auto;">
                      {{ currentJob.executor_config }}
                    </div>
                  </el-form-item>
                </span>
                <span v-else>
                  <el-skeleton
                    v-for="empty in 4"
                    :key="empty"
                    animated
                    style="margin: 20px 0px;"
                  >
                    <template slot="template">
                      <el-skeleton-item variant="p" style="width: 20%" />
                      <br>
                      <el-skeleton-item variant="p" style="width: 60%" />
                    </template>
                  </el-skeleton>
                  <br>
                  <el-skeleton />
                </span>
              </el-form>
            </el-tab-pane>
            <el-tab-pane :label="$t('form.tasks.executions')" name="executionsJobs">
              <el-table
                v-loading="isRun"
                :data="executionsLogs"
                lazy
                style="width: 100%"
                height="60vh"
              >
                <el-table-column
                  type="expand"
                >
                  <template slot-scope="props">
                    <!-- {{ props.row.logs }} -->
                    <el-form v-if="!isEmptyValue(props.row.logs)" label-position="top">
                      <el-form-item v-if="!isEmptyValue(props.row.logs.summary)" :label="$t('page.processActivity.logs')" style="margin-bottom: 0;">
                        {{ props.row.logs.summary }}
                      </el-form-item>
                      <el-scrollbar v-if="!isEmptyValue(props.row.logs.logs)" wrap-class="popover-scroll">
                        <el-descriptions class="margin-top" title="Logs" :column="1" border>
                          <el-descriptions-item
                            v-for="(item, index) in props.row.logs.logs"
                            :key="index"
                            :label="item.record_id"
                          >
                            {{ item.log }}
                          </el-descriptions-item>
                        </el-descriptions>
                      </el-scrollbar>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column
                  v-for="(header, key) in executionsList"
                  :key="key"
                  :align="header.align"
                  :width="header.width"
                  :label="header.label"
                >
                  <template slot-scope="scope">
                    <el-button v-if="'success' === header.key" :type="scope.row[header.key] ? 'success' : 'danger'" round>
                      <span v-if="scope.row[header.key]">
                        {{ $t('form.tasks.table.success') }}
                      </span>
                      <span v-else>
                        {{ $t('form.tasks.table.error') }}
                      </span>
                    </el-button>
                    <span v-else>
                      {{ scope.row[header.key] }}
                    </span>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-card>
    </el-card>
  </div>
</template>

<script>
import {
  defineComponent,
  ref
} from '@vue/composition-api'

import summarysList from './summarysList.js'
import executionsList from './executionsList.js'
import headerList from './headerList.js'

// Api Request Methods
import {
  run,
  restore,
  listJobs,
  executions
} from '@/api/ADempiere/form/TaskManager.js'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere'
import { showMessage } from '@/utils/ADempiere/notification'
import { copyToClipboard } from '@/utils/ADempiere/coreUtils.js'
import { formatDate } from '@/utils/ADempiere/formatValue/dateFormat'

export default defineComponent({
  name: 'TaskManager',

  setup() {
    /**
     * Ref
     */
    const list = ref([])
    const isRun = ref(false)
    const tasks = ref('Tasks')
    const currentJob = ref({})
    const executionsLogs = ref([])
    const nameTab = ref('summaryJobs')

    /**
     * Methods
     */
    function selectJobs(row, column, event) {
      // if (column.label === 'Operaciones') {
      //   return
      // }
      currentJob.value = row
    }

    function getListJobs() {
      listJobs()
        .then(response => {
          const message = response.status
          if (['Error', 'failed', 'error'].includes(message)) {
            showMessage({
              message: response.status,
              type: 'error'
            })
          }
          if (!isEmptyValue(response)) {
            list.value = response.map(listJob => {
              return {
                ...listJob,
                isLoading: false
              }
            })
          }
        })
        .catch(error => {
          showMessage({
            message: error.message,
            type: 'error'
          })
          console.warn({ error })
        })
    }

    function selectTabs(tab) {
      const { name } = tab
      if (name === 'executionsJobs') {
        executionsJobs(currentJob.value.id)
      }
    }

    function executionsJobs(id) {
      executions({
        id
      })
        .then(response => {
          if (isEmptyValue(response)) return []
          executionsLogs.value = response.map(list => {
            const { output, started_at, finished_at } = list
            const index = output.search('{"id"')
            const result = output.slice(index, output.length)
            const logs = (result.length > 5) ? JSON.parse(result) : {}
            return {
              ...list,
              startDate: formatDate({ value: started_at, isTime: true, isDate: true }),
              finishedDate: formatDate({ value: finished_at, isTime: true, isDate: true }),
              logs
            }
          })
        })
        .catch(error => {
          console.warn({ error })
          showMessage({
            message: error.message,
            type: 'error'
          })
        })
    }

    function runJob(job) {
      const { id } = job
      isRun.value = true
      job.isLoading = true
      run({
        id
      })
        .then(response => {
          const message = response.status
          if (['Error', 'failed', 'error'].includes(message)) {
            showMessage({
              message: response.status,
              type: 'error'
            })
          }
          getListJobs()
          isRun.value = false
          job.isLoading = false
          executionsJobs(id)
        })
        .catch(error => {
          console.warn({ error })
          showMessage({
            message: error.message,
            type: 'error'
          })
          job.isLoading = false
          isRun.value = false
        })
    }

    function restoreJob() {
      restore()
        .then(response => {
          getListJobs()
          isRun.value = false
        })
        .catch(error => {
          console.warn({ error })
          showMessage({
            message: error.message,
            type: 'error'
          })
          isRun.value = false
        })
    }

    function copyOutput(text) {
      copyToClipboard({
        text: JSON.stringify(text),
        isShowMessage: true
      })
    }

    getListJobs()

    return {
      // Refs
      executionsLogs,
      executionsList,
      headerList,
      summarysList,
      currentJob,
      nameTab,
      tasks,
      isRun,
      list,
      // Methods
      restoreJob,
      selectJobs,
      selectTabs,
      executionsJobs,
      runJob,
      copyOutput,
      getListJobs
    }
  }
})
</script>
