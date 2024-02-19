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
        v-if="isKanban || isEdit"
        shadow="never"
        :body-style="{ padding: '20px' }"
      >
        <el-form label-position="top" class="form-min-label">
          <el-form-item :label="$t('issues.typeOfRequest')" style="margin: 0px;">
            <el-select
              v-model="requestTypes"
              filterable
              clearable
              @visible-change="findRequestTypes"
              @change="findStatus"
            >
              <el-option
                v-for="item in listIssuesTypes"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <br>
      </el-card>
      <div v-if="!isEdit && !isKanban" class="table-list-request" :style="isEdit ? 'max-height: 78vh;' : 'max-height: 85vh;'">
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
                        <!-- <div
                          v-else
                          key="form-loading"
                          v-loading="true"
                          :element-loading-text="$t('notifications.loading')"
                          element-loading-spinner="el-icon-loading"
                          element-loading-background="rgba(255, 255, 255, 0.8)"
                          class="view-loading"
                        /> -->
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
import RecordTime from '@/components/ADempiere/Form/Issues/recordTime.vue'
import IssueRow from '@/components/ADempiere/FormDefinition/IssueManagement/IssuesList/issueRow.vue'
import KanbanIssues from '@/components/ADempiere/Form/Issues/ListIssues/kanban.vue'
import ProgressPercentage from '@/components/ADempiere/ContainerOptions/ProgressPercentage.vue'

// Utils and Helper Methods
import { showMessage } from '@/utils/ADempiere/notification'

// Api Request Methods
import {
  requestListRequestTypes,
  requestListStatuses
} from '@/api/ADempiere/user-interface/component/issue'
import { isEmptyValue } from '@/utils/ADempiere'

export default defineComponent({
  name: 'Issues',

  components: {
    IssueRow,
    // Editor
    KanbanIssues,
    DraggableElements,
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
    }
  },

  setup() {
    const updateDragStatus = ref('')
    const filter = ref('')
    const priority = ref('')
    const isEdit = ref(false)
    const isKanban = ref(false)
    const requestTypes = ref('')
    const currentPriority = ref('')
    const listIssuesTypes = ref([])
    const listPriority = ref([])
    const listStatuses = ref([])
    const listStatusesKanban = ref([])
    const statusesExpand = ref([])

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

    const listKanbanGroup = computed(() => {
      return store.getters.getListKanbanGroup
    })

    function newIssues(issue) {
      isNewIssues.value = !isNewIssues.value
      store.dispatch('changeCurrentIssues', issue)
    }

    function loadIssues() {
      store.dispatch('listRequest', {})
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

    function filterData({
      data,
      column
    }) {
      return data.filter(list => list.status.id === column)
    }

    // findRequestTypes(true)

    // loadIssues()

    function activeGruop() {
      isEdit.value = !isEdit.value
      isKanban.value = false
      findRequestTypes(true)
      // findStatus(listIssuesTypes.value[0].id)
    }

    function activeKanban() {
      isEdit.value = false
      isKanban.value = !isKanban.value
      findRequestTypes(true)
      // findStatus(listIssuesTypes.value[0].id)
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

    return {
      listKanbanGroup,
      isloadinUpdateKanban,
      updateDragStatus,
      statusesExpand,
      //
      isEdit,
      isKanban,
      listIssues,
      requestTypes,
      listIssuesTypes,
      currentPriority,
      listPriority,
      listStatuses,
      listStatusesKanban,
      //
      priority,
      filter,
      isNewIssues,
      // methods
      findRequestTypes,
      findStatus,
      newIssues,
      loadIssues,
      filterData,
      activeGruop,
      activeKanban,
      updateStatus,
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
