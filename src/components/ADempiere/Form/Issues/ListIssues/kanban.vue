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
          style="font-size: 16px;margin: 0px;border: 1px solid rgb(230, 235, 245);border-right: 0px;border-left: 0px;"
        >
          <b>
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
                {{ '#' + metadata.document_no }}
              </b>
            </el-popover>
          </b>
        </p>
        <!-- <hr> -->
        <p style="margin: 0px;">
          {{ metadata.subject }}
          <br>
          {{ metadata.summary }}
          <br>
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
          </span>
          <br>
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
          </span>
          <br>
          <span>
            <i style="font-size: 12px;color: #82848a;">
              <b>
                <svg-icon icon-class="label" style="font-size: 20px;" />
                {{ $t('issues.taskStatus') + ': ' }}
              </b>
              {{ metadata.status.name }}
            </i>
          </span>
          <br>
          <span type="primary" size="mini" plain>
            <i style="font-size: 12px;color: #82848a;">
              <b>
                <svg-icon icon-class="collections" style="font-size: 20px;" />
                {{ $t('issues.priority') + ': ' }}
              </b>
              {{ metadata.priority.name }}
            </i>
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
// import ProgressPercentage from '@/components/ADempiere/ContainerOptions/ProgressPercentage.vue'

// Utils and Helper Methods
import { formatDate } from '@/utils/ADempiere/formatValue/dateFormat'

export default defineComponent({
  name: 'kanban',

  // components: {
  //   RecordTime,
  //   ProgressPercentage
  // },

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
.list-card-issues-filter {

}
</style>
<style scoped>
.scroll-chats {
  width: 100%;
  height: 500px;
}
</style>
