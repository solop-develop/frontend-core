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
      <div v-if="!isEdit && !isKanban" class="table-list-request" :style="isEdit ? 'max-height: 78vh;' : 'max-height: 85vh;'">
        <el-empty v-if="isEmptyValue(listIssues)" />
        <span
          v-else
        >
          <span
            v-for="(data, index) in listIssues"
            :key="index"
          >
            <items
              :metadata="data"
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
          <div
            style="display: flex;overflow: auto;"
          >
            <div
              v-for="(issues, index) in listIssuesTypes"
              :key="index"
              style="height: 85vh;padding: 0px 10px;width: 35vw;"
            >
              <el-card
                shadow="never"
                :body-style="{ padding: '10px' }"
              >
                <el-collapse accordion>
                  <el-collapse-item name="1">
                    <template slot="title">
                      <svg-icon
                        icon-class="label"
                        style="font-size: 26px;"
                      />
                      <b style="font-size: 16px;padding-left: 10px;">
                        <i>
                          {{ issues.name }}
                        </i>
                      </b>
                    </template>
                    <span v-if="isEmptyValue(filterData({ data: listIssues, column: issues.id }))">
                      <el-empty :image-size="90" />
                    </span>
                    <el-card
                      v-for="data in filterData({ data: listIssues, column: issues.id })"
                      :key="data.id"
                      shadow="never"
                      :body-style="{ padding: '0px' }"
                    >
                      <kanban
                        :metadata="data"
                      />
                    </el-card>
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
          <el-collapse>
            <el-collapse-item
              v-for="item in listIssuesTypes"
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
                <items
                  :metadata="data"
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

// Components and Mixins
import Comment from '@/components/ADempiere/Form/Issues/component/Comment.vue'
import RecordTime from '@/components/ADempiere/Form/Issues/recordTime.vue'
import Items from '@/components/ADempiere/Form/Issues/ListIssues/items.vue'
import Kanban from '@/components/ADempiere/Form/Issues/ListIssues/kanban.vue'
import ProgressPercentage from '@/components/ADempiere/ContainerOptions/ProgressPercentage.vue'
// Constants
import { REQUEST_WINDOW_UUID } from '@/utils/ADempiere/dictionary/form/Issues.js'

// Utils and Helper Methods
import { formatDate, translateDateByLong } from '@/utils/ADempiere/formatValue/dateFormat'
import { getImagePath } from '@/utils/ADempiere/resource.js'
import { showMessage } from '@/utils/ADempiere/notification'
import { zoomIn } from '@/utils/ADempiere/coreUtils.js'

// Api Request Methods
import {
  requestListRequestTypes,
  requestListPriorities
} from '@/api/ADempiere/user-interface/component/issue'

export default defineComponent({
  name: 'Issues',

  components: {
    // Editor
    Items,
    Kanban,
    Comment,
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

  setup(props) {
    const message = ref('')
    const filter = ref('')
    const priority = ref('')
    const isEdit = ref(false)
    const isKanban = ref(false)
    const typeRequest = ref('')
    const requestTypes = ref('')
    const currentPriority = ref('')
    const listIssuesTypes = ref([])
    const listPriority = ref([])

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

    function findRequestTypes(isVisible) {
      if (!isVisible) {
        return
      }
      requestListRequestTypes({})
        .then(response => {
          const { records } = response
          listIssuesTypes.value = records
        })
        .catch(error => {
          showMessage({
            message: error.message,
            type: 'warning'
          })
        })
    }
    function findPriority(isVisible) {
      if (!isVisible) {
        return
      }
      requestListPriorities({})
        .then(response => {
          const { records } = response
          listPriority.value = records
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
      return data.filter(list => list.request_type.id === column)
    }

    findRequestTypes(true)

    loadIssues()

    function percentageFormat(display) {
      return display
    }

    function activeGruop() {
      isEdit.value = !isEdit.value
      isKanban.value = false
    }

    function activeKanban() {
      isEdit.value = false
      isKanban.value = !isKanban.value
    }

    return {
      isEdit,
      isKanban,
      message,
      listIssues,
      requestTypes,
      listIssuesTypes,
      currentPriority,
      listPriority,
      //
      priority,
      typeRequest,
      filter,
      isNewIssues,
      currentIssues,
      styleAllRequestBoxCard,
      isShowTitleForm,
      // methods
      findRequestTypes,
      findPriority,
      dueTypeColor,
      formatDate,
      avatarResize,
      selectIssue,
      newIssues,
      loadIssues,
      zoomIssues,
      filterData,
      percentageFormat,
      activeGruop,
      activeKanban,
      translateDateByLong
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
.list-card-issues-filter {

}
</style>
<style scoped>
.scroll-chats {
  width: 100%;
  height: 500px;
}
</style>
