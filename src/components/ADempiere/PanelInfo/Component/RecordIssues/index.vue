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
  <span
    v-if="!isLoading"
  >
    <el-container style="height: 100% !important;">
      <el-main style="overflow: auto;padding: 0px;">
        <issues-list
          v-if="!isNewIssues"
          :table-name="tableName"
          :record-id="recordId"
        />

        <comment
          v-else
          :table-name="tableName"
          :record-id="recordId"
        />
      </el-main>
    </el-container>
  </span>
  <loading-view
    v-else
    key="Record-Issues-Loading"
  />
</template>

<script>
import {
  defineComponent, computed, ref
} from '@vue/composition-api'

import store from '@/store'

// Components and Mixins
// import Comment from './component/Comment.vue'
import IssuesList from '@/components/ADempiere/Form/Issues/ListIssues/index.vue'
import Comment from '@/components/ADempiere/Form/Issues/component/Comment.vue'
import LoadingView from '@/components/ADempiere/LoadingView/index.vue'
import RecordTime from '@/components/ADempiere/Form/Issues/recordTime.vue'

// Constants
import { REQUEST_WINDOW_UUID } from '@/utils/ADempiere/dictionary/form/Issues.js'

// Utils and Helper Methods
import { formatDate } from '@/utils/ADempiere/formatValue/dateFormat'
import { zoomIn } from '@/utils/ADempiere/coreUtils.js'
import { getImagePath } from '@/utils/ADempiere/resource.js'
import { dueTypeColor } from '@/utils/ADempiere/dictionary/form/Issues'

export default defineComponent({
  name: 'RecordIssues',

  components: {
    // Editor
    Comment,
    IssuesList,
    LoadingView,
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
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },

  setup(props) {
    const message = ref('')
    const filter = ref('')
    const priority = ref('')
    const typeRequest = ref('')
    const dateNextAction = ref(null)

    // const chartOptions = {
    //   minWidth: 100,
    //   maxWidth: 600,
    //   minHeight: 100,
    //   maxHeight: 300
    // }

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

    function selectIssue(issue) {
      isNewIssues.value = !isNewIssues.value
      store.dispatch('changeCurrentIssues', issue)
    }

    function newIssues(issue) {
      isNewIssues.value = !isNewIssues.value
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

    // store.dispatch('findListMailTemplates')

    return {
      message,
      listIssues,
      //
      priority,
      typeRequest,
      dateNextAction,
      filter,
      isNewIssues,
      currentIssues,
      // methods
      dueTypeColor,
      formatDate,
      selectIssue,
      newIssues,
      zoomIssues,
      avatarResize
    }
  }
})
</script>

<style lang="scss">
.all-request-box-card {
  padding: 0px;
  border: 0px;
  .el-card {
    border: 0px;
  }
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
