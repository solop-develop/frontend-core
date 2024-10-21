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
  <div class="issues-list">
    <el-card
      shadow="never"
      class="list-card-issues"
      :body-style="{ padding: '0px' }"
    >
      <div slot="header" class="clearfix">
        <el-button style="float: left;color: black;font-size: 19px;font-weight: bold;" plain type="text">
          {{ $t('issues.allRequest') }}
        </el-button>
        <el-button style="float: right;" plain type="success" @click="newIssues()">
          {{ $t('issues.createNewRequest') }}
          <i class="el-icon-plus" />
        </el-button>
        <el-button
          plain
          type="info"
          class="button-base-icon"
          style="float: right;"
          @click="activeGruop"
        >
          <svg-icon
            icon-class="group"
          />
        </el-button>
        <el-button
          plain
          type="info"
          class="button-base-icon"
          style="float: right;"
          @click="activeKanban"
        >
          <svg-icon
            icon-class="kanban"
          />
        </el-button>
      </div>

      <el-card
        shadow="never"
        :body-style="{ padding: '10px', marginTop: '10px' }"
      >
        <el-collapse accordion>
          <el-collapse-item name="1">
            <template slot="title">
              <b style="text-align: center;margin: 0px;width: 100%;font-size: 17px;font-weight: 900">
                {{ $t('issues.filters') }}
              </b>
            </template>
            <el-form :inline="true" label-position="top" class="form-base">
              <el-row :gutter="20">
                <el-col :span="6">
                  <el-form-item
                    :label="$t('issues.typeOfRequest')"
                    style="margin: 0px;margin-left: 10px;"
                    size="small"
                  >
                    <el-select
                      v-model="requestTypes"
                      size="small"
                      filterable
                      clearable
                      @visible-change="findRequestTypes"
                      @change="findStatus"
                    >
                      <el-option
                        v-for="(item, key) in listIssuesTypes"
                        :key="key"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item
                    :label="$t('issues.businessPartner')"
                    style="margin: 0px;margin-left: 10px;"
                    size="small"
                  >
                    <el-select
                      v-model="businessPartnerField"
                      remote
                      clearable
                      filterable
                      size="small"
                      reserve-keyword
                      :remote-method="remoteMethodPartner"
                      @visible-change="findBusinessPartner"
                      @change="updateListIssues"
                    >
                      <el-option
                        v-for="(item, key) in listBusinessPartnerField"
                        :key="key"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item
                    :label="$t('issues.category')"
                    style="margin: 0px;margin-left: 10px;"
                    size="small"
                  >
                    <el-select
                      v-model="categoryField"
                      remote
                      clearable
                      filterable
                      size="small"
                      reserve-keyword
                      :remote-method="remoteMethodCategory"
                      @visible-change="findCategory"
                      @change="updateListIssues"
                    >
                      <el-option
                        v-for="(item, key) in listCategoryField"
                        :key="key"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item
                    :label="$t('issues.project')"
                    style="margin: 0px;margin-left: 10px;"
                    size="small"
                  >
                    <el-select
                      v-model="projectField"
                      remote
                      clearable
                      filterable
                      size="small"
                      reserve-keyword
                      :remote-method="remoteMethodProject"
                      @visible-change="findProject"
                      @change="updateListIssues"
                    >
                      <el-option
                        v-for="(item, key) in listProjectField"
                        :key="key"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="6">
                  <el-form-item
                    :label="$t('issues.group')"
                    style="margin: 0px;margin-left: 10px;"
                    size="small"
                  >
                    <el-select
                      v-model="groupField"
                      remote
                      clearable
                      filterable
                      size="small"
                      reserve-keyword
                      :remote-method="remoteMethodGroup"
                      @visible-change="findGroup"
                      @change="updateListIssues"
                    >
                      <el-option
                        v-for="(item, key) in listGroupField"
                        :key="key"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item
                    :label="$t('issues.priority')"
                    style="margin: 0px;margin-left: 10px;"
                    size="small"
                  >
                    <el-select
                      v-model="priorityField"
                      remote
                      clearable
                      filterable
                      size="small"
                      reserve-keyword
                      @visible-change="findPriority"
                      @change="updateListIssues"
                    >
                      <el-option
                        v-for="(item, key) in listPriorityField"
                        :key="key"
                        :label="item.name"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item
                    :label="$t('issues.status')"
                    style="margin: 0px;margin-left: 10px;"
                    size="small"
                  >
                    <el-select
                      v-model="statusField"
                      remote
                      clearable
                      filterable
                      size="small"
                      reserve-keyword
                      :remote-method="remoteMethodStatus"
                      :disabled="isEmptyValue(requestTypes)"
                      @visible-change="findListStatus"
                      @change="updateListIssues"
                    >
                      <el-option
                        v-for="(item, key) in listStatusField"
                        :key="key"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item
                    :label="$t('issues.taskStatus')"
                    style="margin: 0px;margin-left: 10px;"
                    size="small"
                  >
                    <el-select
                      v-model="taskStatusField"
                      remote
                      clearable
                      filterable
                      size="small"
                      reserve-keyword
                      :remote-method="remoteMethodTaskStatus"
                      @visible-change="findTaskStatus"
                      @change="updateListIssues"
                    >
                      <el-option
                        v-for="(item, key) in listTaskStatusField"
                        :key="key"
                        :label="item.name"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
        </el-collapse>
        <br>
      </el-card>
      <div v-if="!isEdit && !isKanban" class="table-list-request" :style="isEdit ? 'max-height: 78vh;' : 'height: -webkit-fill-available;'">
        <el-empty v-if="isEmptyValue(listIssues)" />
        <span
          v-else
        >
          <span
            v-for="(data, index) in listIssues"
            :key="index"
          >
            <issue-row
              :metadata="data"
              :table-name="tableName"
              :record-id="recordId"
            />
          </span>
          <el-row>
            <el-col :span="24">
              <custom-pagination
                :total-records="recordCount"
                :is-showed-selected="false"
                :page-number="pageNumber"
                :page-size="pageSize"
                :handle-change-page-number="setPageNumber"
                :handle-change-page-size="setPageSize"
              />
              <!-- <el-pagination
                small
                layout="prev, pager, next"
                :total="50"
              /> -->
            </el-col>
          </el-row>
        </span>
      </div>
      <div
        v-else-if="isKanban"
        style="overflow: auto;"
      >
        <el-card
          shadow="never"
          :body-style="{ padding: '10px' }"
        >
          <el-empty v-if="isEmptyValue(listStatuses)" :description="$t('issues.selectTypeOfRequest')" />
          <div
            v-else
            style="display: flex;overflow: auto;"
          >
            <div
              v-for="(statusItem, index) in listStatuses"
              :key="index"
              style="height: 80vh;padding: 0px 10px;min-width: 450px;max-width: 450px;"
            >
              <el-card
                shadow="never"
                :body-style="{ padding: '10px' }"
              >
                <el-collapse v-model="statusesExpand">
                  <el-collapse-item :name="statusItem.id">
                    <template slot="title">
                      <svg-icon
                        icon-class="label"
                        style="font-size: 26px;"
                      />
                      <b style="font-size: 16px;padding-left: 10px;">
                        <i>
                          {{ statusItem.name }}
                        </i>
                      </b>
                    </template>
                    <span v-if="isEmptyValue(listKanbanGroup[statusItem.id])">
                      <el-empty :image-size="90" />
                    </span>
                    <!-- {{ listKanbanGroup[0] }} -->
                    <draggable-elements
                      v-if="!isloadinUpdateKanban"
                      :id="statusItem.id"
                      :ref="statusItem.id"
                      :list="listKanbanGroup[statusItem.id]"
                      :group="{ name: 'people', pull: replace }"
                      @change="updateStatus"
                    >
                      <el-card
                        v-for="data in listKanbanGroup[statusItem.id]"
                        :key="data.id"
                        shadow="never"
                        :body-style="{ padding: '0px' }"
                      >
                        <kanban-issues
                          :metadata="data"
                        />
                      </el-card>
                    </draggable-elements>
                  </el-collapse-item>
                </el-collapse>
              </el-card>
            </div>
          </div>
        </el-card>
      </div>

      <div
        v-else
        style="overflow: auto;"
      >
        <el-card
          shadow="never"
          :body-style="{ padding: '10px' }"
        >
          <el-empty v-if="isEmptyValue(listStatuses)" :description="$t('issues.selectTypeOfRequest')" />
          <el-collapse
            v-else
          >
            <el-collapse-item
              v-for="item in listStatuses"
              :key="item.id"
              :title="item.name"
              :name="item.id"
            >
              <template slot="title">
                <svg-icon
                  icon-class="label"
                  style="font-size: 26px;"
                />
                <b style="font-size: 16px;padding-left: 10px;">
                  <i>
                    {{ item.name }}
                  </i>
                </b>
              </template>
              <span
                v-for="(data, index) in filterData({ data: listIssues, column: item.id })"
                :key="index"
              >
                <issue-row
                  :metadata="data"
                  :table-name="tableName"
                  :record-id="recordId"
                />
              </span>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script>
import {
  defineComponent, computed, ref
} from '@vue/composition-api'

import store from '@/store'
import lang from '@/lang'

// Components and Mixins
import DraggableElements from 'vuedraggable'
import IssueRow from '@/components/ADempiere/FormDefinition/IssueManagement/IssuesList/issueRow.vue'
import KanbanIssues from '@/components/ADempiere/Form/Issues/ListIssues/kanban.vue'
import ProgressPercentage from '@/components/ADempiere/ContainerOptions/ProgressPercentage.vue'
import CustomPagination from '@/components/ADempiere/DataTable/Components/CustomPagination.vue'
// Utils and Helper Methods
import { showMessage } from '@/utils/ADempiere/notification'

// Api Request Methods
import {
  requestListRequestTypes,
  listCategoriesRequest,
  requestListPriorities,
  listBusinessPartners,
  requestListStatuses,
  listGroupsRequest,
  listTaskStatuses,
  listProjects
} from '@/api/ADempiere/user-interface/component/issue'
import { isEmptyValue } from '@/utils/ADempiere'
import router from '@/router'

export default defineComponent({
  name: 'Issues',

  components: {
    IssueRow,
    // Editor
    KanbanIssues,
    CustomPagination,
    DraggableElements,
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
    }
  },

  setup(props) {
    const updateDragStatus = ref('')
    const filter = ref('')
    const priority = ref('')
    const isEdit = ref(false)
    const isKanban = ref(false)
    const requestTypes = ref('')
    const businessPartnerField = ref('')
    const categoryField = ref('')
    const projectField = ref('')
    const taskStatusField = ref('')
    const currentPriority = ref('')
    const statusField = ref('')
    const listStatusField = ref([])
    const groupField = ref('')
    const priorityField = ref('')
    const listTaskStatusField = ref([])
    const listGroupField = ref([])
    const listPriorityField = ref([])
    const listProjectField = ref([])
    const listIssuesTypes = ref([])
    const listBusinessPartnerField = ref([])
    const listCategoryField = ref([])
    const listStatuses = ref([])
    const listStatusesKanban = ref([])
    const statusesExpand = ref([])
    const timeOut = ref(null)
    /**
     * Computed
     */
    const isAll = computed(() => {
      return router.app._route.meta.isAll
    })
    const listIssues = computed(() => {
      return store.getters.getListIssues(isAll.value)
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

    const listKanbanGroup = computed(() => {
      return store.getters.getListKanbanGroup
    })

    const recordCount = computed(() => {
      return store.getters.geIssuesData.recordCount
    })

    const pageNumber = computed(() => {
      return store.getters.geIssuesData.pageNumber
    })

    const pageSize = computed(() => {
      return store.getters.geIssuesData.pageSize
    })

    function newIssues(issue) {
      isNewIssues.value = !isNewIssues.value
      store.dispatch('changeCurrentIssues', issue)
    }

    function loadIssues() {
      if (isAll.value) return
      store.dispatch('listRequest', {
        businessPartnerId: isEmptyValue(businessPartnerField.value) ? 0 : businessPartnerField.value,
        categoryId: isEmptyValue(categoryField.value) ? 0 : categoryField.value,
        projectId: isEmptyValue(projectField.value) ? 0 : projectField.value,
        statusId: isEmptyValue(statusField.value) ? 0 : statusField.value,
        groupId: isEmptyValue(groupField.value) ? 0 : groupField.value,
        taskStatusValue: taskStatusField.value,
        priorityValue: priorityField.value
      })
        .then(response => {
          if (!isEmptyValue(response)) {
            const list = {}
            const emptyStatus = listStatuses.value.find(statusItem => {
              return statusItem.id === 0
            })
            if (isEmptyValue(emptyStatus)) {
              listStatuses.value.unshift({
                name: lang.t('issues.emptyStatus'),
                id: 0,
                sequence: -1
              })
            }
            listStatuses.value.forEach(elementStatus => {
              list[elementStatus.id] = response.filter(issueItem => {
                return issueItem.status.id === elementStatus.id
              })
            })
            store.commit('setListKanbanGroup', list)
          }
        })
      store.dispatch('findListMailTemplates')
    }

    function findRequestTypes(isVisible) {
      if (!isVisible) {
        return
      }
      requestListRequestTypes({})
        .then(response => {
          const { records } = response
          listIssuesTypes.value = records
          if (listStatuses.value.length <= 1 && isEmptyValue(requestTypes.value)) {
            findStatus(records[0].id)
            requestTypes.value = records[0].id
          }
        })
        .catch(error => {
          showMessage({
            message: error.message,
            type: 'warning'
          })
        })
    }

    function findBusinessPartner(isVisible) {
      if (!isVisible || !isEmptyValue(listBusinessPartnerField.value)) {
        return
      }
      listBusinessPartners({})
        .then(response => {
          const { records } = response
          listBusinessPartnerField.value = records
          if (listBusinessPartnerField.value.length <= 1 && isEmptyValue(businessPartnerField.value)) {
            businessPartnerField.value = records[0].id
          }
        })
        .catch(error => {
          showMessage({
            message: error.message,
            type: 'warning'
          })
        })
    }

    function findCategory(isVisible) {
      if (!isVisible || !isEmptyValue(listCategoryField.value)) {
        return
      }
      listCategoriesRequest({})
        .then(response => {
          const { records } = response
          listCategoryField.value = records
          if (listCategoryField.value.length <= 1 && isEmptyValue(categoryField.value)) {
            // findStatus(records[0].id)
            categoryField.value = records[0].id
          }
        })
        .catch(error => {
          showMessage({
            message: error.message,
            type: 'warning'
          })
        })
    }

    function findProject(isVisible) {
      if (!isVisible || !isEmptyValue(listProjectField.value)) {
        return
      }
      listProjects({})
        .then(response => {
          const { records } = response
          listProjectField.value = records
          if (listProjectField.value.length <= 1 && isEmptyValue(projectField.value)) {
            projectField.value = records[0].id
          }
        })
        .catch(error => {
          showMessage({
            message: error.message,
            type: 'warning'
          })
        })
    }

    function findGroup(isVisible) {
      if (!isVisible || !isEmptyValue(listGroupField.value)) {
        return
      }
      listGroupsRequest({})
        .then(response => {
          const { records } = response
          listGroupField.value = records
          if (listGroupField.value.length <= 1 && isEmptyValue(groupField.value)) {
            // findStatus(records[0].id)
            groupField.value = records[0].id
          }
        })
        .catch(error => {
          showMessage({
            message: error.message,
            type: 'warning'
          })
        })
    }

    function findPriority(isVisible) {
      if (!isVisible || !isEmptyValue(listPriorityField.value)) {
        return
      }
      requestListPriorities({})
        .then(response => {
          const { records } = response
          listPriorityField.value = records
          if (listPriorityField.value.length <= 1 && isEmptyValue(priorityField.value)) {
            priorityField.value = records[0].value
          }
        })
        .catch(error => {
          showMessage({
            message: error.message,
            type: 'warning'
          })
        })
    }

    function findTaskStatus(isVisible) {
      if (!isVisible || !isEmptyValue(listTaskStatusField.value)) {
        return
      }
      listTaskStatuses({})
        .then(response => {
          const { records } = response
          listTaskStatusField.value = records
          if (listTaskStatusField.value.length <= 1 && isEmptyValue(taskStatusField.value)) {
            taskStatusField.value = records[0].value
          }
        })
        .catch(error => {
          showMessage({
            message: error.message,
            type: 'warning'
          })
        })
    }

    function findListStatus(isVisible) {
      if (!isVisible || !isEmptyValue(listStatusField.value)) {
        return
      }
      requestListStatuses({
        requestTypeId: requestTypes.value
      })
        .then(response => {
          const { records } = response
          listStatusField.value = records
          if (listStatusField.value.length <= 1 && isEmptyValue(statusField.value)) {
            statusField.value = records[0].id
          }
        })
        .catch(error => {
          showMessage({
            message: error.message,
            type: 'warning'
          })
        })
    }

    function filterData({
      data,
      column
    }) {
      return data.filter(list => list.status.id === column)
    }

    // loadIssues()

    function activeGruop() {
      isEdit.value = !isEdit.value
      isKanban.value = false
      findRequestTypes(true)
      findBusinessPartner(true)
    }

    function activeKanban() {
      isEdit.value = false
      isKanban.value = !isKanban.value
      findRequestTypes(true)
      findBusinessPartner(true)
    }

    function findStatus(request) {
      if (!request) return
      requestListStatuses({
        requestTypeId: request
      })
        .then(response => {
          const { records } = response
          const statusesList = records
          const list = {}
          statusesList.unshift({
            name: lang.t('issues.emptyStatus'),
            id: 0,
            sequence: -1
          })
          statusesList.forEach(statusItem => {
            // expand all statuses
            statusesExpand.value.push(statusItem.id)
            // fill issues by status
            list[statusItem.id] = listIssues.value.filter(issueItem => {
              return issueItem.status.id === statusItem.id
            })
          })
          store.commit('setListKanbanGroup', list)
          listStatuses.value = records.sort((a, b) => a.sequence - b.sequence)
        })
        .catch(error => {
          showMessage({
            message: error.message,
            type: 'warning'
          })
        })
    }

    function replace(params) {
      updateDragStatus.value = params.options.id
    }
    const isloadinUpdateKanban = ref(false)

    function updateStatus(params) {
      let element = {}
      if (isEmptyValue(params) && isEmptyValue(params.removed.element) && isEmptyValue(params.add.element)) return
      if (params.removed) {
        element = params.removed.element
      }
      if (params.add) {
        element = params.add.element
      }
      // element = !isEmptyValue(params.removed) ? params.removed.element : params.add.element
      if (isEmptyValue(element)) return
      const {
        id,
        uuid,
        group,
        status,
        subject,
        summary,
        project,
        priority,
        category,
        task_status,
        request_type,
        parent_issue,
        business_partner,
        date_next_action,
        sales_representative
      } = element
      if (status.id === updateDragStatus.value) return
      isloadinUpdateKanban.value = true
      store.dispatch('editIssues', {
        id,
        uuid,
        subject,
        summary,
        requestTypeId: request_type.id,
        salesRepresentativeId: sales_representative.id,
        priorityValue: priority.value,
        statusId: updateDragStatus.value,
        categoryId: category.id,
        groupId: group.id,
        businessPartnerId: business_partner.id,
        projectId: project.id,
        taskStatusValue: task_status.value,
        dateNextAction: date_next_action,
        parentIssueId: parent_issue.id
      })
        .finally(() => {
          isloadinUpdateKanban.value = false
          loadIssues()
        })
    }

    function updateListIssues({
      pageNumber,
      pageSize
    }) {
      if (isAll.value) {
        store.dispatch('listRequestAll', {
          businessPartnerId: isEmptyValue(businessPartnerField.value) ? 0 : businessPartnerField.value,
          categoryId: isEmptyValue(categoryField.value) ? 0 : categoryField.value,
          projectId: isEmptyValue(projectField.value) ? 0 : projectField.value,
          statusId: isEmptyValue(statusField.value) ? 0 : statusField.value,
          groupId: isEmptyValue(groupField.value) ? 0 : groupField.value,
          taskStatusValue: taskStatusField.value,
          priorityValue: priorityField.value,
          pageNumber,
          pageSize
        })
          .finally(() => {
            loadIssues()
          })
        return
      }
      store.dispatch('listRequest', {
        businessPartnerId: isEmptyValue(businessPartnerField.value) ? 0 : businessPartnerField.value,
        categoryId: isEmptyValue(categoryField.value) ? 0 : categoryField.value,
        projectId: isEmptyValue(projectField.value) ? 0 : projectField.value,
        statusId: isEmptyValue(statusField.value) ? 0 : statusField.value,
        groupId: isEmptyValue(groupField.value) ? 0 : groupField.value,
        taskStatusValue: taskStatusField.value,
        priorityValue: priorityField.value,
        pageNumber,
        pageSize
      })
        .finally(() => {
          loadIssues()
        })
    }

    /**
     * Search Remote Method
     */

    function remoteMethodPartner(searchValue) {
      clearTimeout(timeOut.value)
      timeOut.value = setTimeout(() => {
        listBusinessPartners({
          searchValue
        })
          .then(response => {
            const { records } = response
            listBusinessPartnerField.value = records
          })
      }, 500)
    }

    function remoteMethodCategory(searchValue) {
      clearTimeout(timeOut.value)
      timeOut.value = setTimeout(() => {
        listCategoriesRequest({
          searchValue
        })
          .then(response => {
            const { records } = response
            listCategoryField.value = records
          })
      }, 500)
    }

    function remoteMethodProject(searchValue) {
      clearTimeout(timeOut.value)
      timeOut.value = setTimeout(() => {
        listProjects({
          searchValue
        })
          .then(response => {
            const { records } = response
            listProjectField.value = records
          })
      }, 500)
    }

    function remoteMethodGroup(searchValue) {
      clearTimeout(timeOut.value)
      timeOut.value = setTimeout(() => {
        listGroupsRequest({
          searchValue
        })
          .then(response => {
            const { records } = response
            listGroupField.value = records
          })
      }, 500)
    }

    function remoteMethodPriorities(searchValue) {
      clearTimeout(timeOut.value)
      timeOut.value = setTimeout(() => {
        requestListPriorities({
          searchValue
        })
          .then(response => {
            const { records } = response
            listPriorityField.value = records
          })
      }, 500)
    }

    function remoteMethodStatus(searchValue) {
      clearTimeout(timeOut.value)
      timeOut.value = setTimeout(() => {
        requestListStatuses({
          searchValue
        })
          .then(response => {
            const { records } = response
            listStatusField.value = records
          })
      }, 500)
    }

    function remoteMethodTaskStatus(searchValue) {
      clearTimeout(timeOut.value)
      timeOut.value = setTimeout(() => {
        listTaskStatuses({
          searchValue
        })
          .then(response => {
            const { records } = response
            listTaskStatusField.value = records
          })
      }, 500)
    }

    function setPageNumber(pageNumber) {
      updateListIssues({
        pageNumber
      })
    }
    function setPageSize(pageSize) {
      updateListIssues({
        pageSize
      })
    }

    return {
      statusesExpand,
      listKanbanGroup,
      updateDragStatus,
      isloadinUpdateKanban,
      //
      pageSize,
      pageNumber,
      recordCount,
      timeOut,
      isEdit,
      isKanban,
      listIssues,
      groupField,
      statusField,
      projectField,
      requestTypes,
      listStatuses,
      categoryField,
      priorityField,
      listGroupField,
      listIssuesTypes,
      currentPriority,
      listStatusField,
      taskStatusField,
      listProjectField,
      listPriorityField,
      listCategoryField,
      listStatusesKanban,
      businessPartnerField,
      listTaskStatusField,
      listBusinessPartnerField,
      //
      filter,
      priority,
      isNewIssues,
      // methods
      remoteMethodPriorities,
      remoteMethodTaskStatus,
      remoteMethodCategory,
      remoteMethodProject,
      remoteMethodPartner,
      findBusinessPartner,
      remoteMethodStatus,
      remoteMethodGroup,
      findRequestTypes,
      updateListIssues,
      findPriority,
      findTaskStatus,
      findListStatus,
      findCategory,
      activeKanban,
      updateStatus,
      setPageNumber,
      setPageSize,
      activeGruop,
      findProject,
      findStatus,
      loadIssues,
      filterData,
      findGroup,
      newIssues,
      replace
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
