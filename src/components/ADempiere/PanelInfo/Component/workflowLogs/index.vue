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
  <span>
    <workflow-status-bar
      :container-uuid="containerUuid"
    />

    <el-timeline v-if="!isEmptyValue(storedWorkflowLogs.list)">
      <el-timeline-item
        v-for="(worrkflow, keys) in storedWorkflowLogs.list"
        :key="worrkflow.logId"
        :type="worrkflow.type"
        :color="'#0bbd87'"
        :timestamp="worrkflow.logDate"
        placement="top"
      >
        <el-card shadow="hover" class="clearfix" style="padding: 2%">
          <div>
            <span style="color: #606266; font-weight: bold;">
              {{ $t('workflow.updatedBy') }} <b>:</b> {{ worrkflow.userName }} <i class="el-icon-user-solid" />
            </span>
            <el-link
              type="primary"
              style="float: right;"
              @click="showkey(keys)"
            >
              {{ $t('window.containerInfo.changeDetail') }}
            </el-link>
          </div>
          <el-collapse-transition>
            <el-scrollbar wrap-class="scroll-child">
              <div v-show="(currentKey === keys)">
                <el-timeline>
                  <el-timeline-item
                    v-for="(events, index) in worrkflow.workflowEventsList"
                    :key="index"
                    :color="index === 0 ? 'red' : '#0bbd87'"
                    :timestamp="events.logDate"
                  >
                    <span style="color: #606266; font-weight: bold;">
                      {{ $t('workflow.node') }} <b>:</b> {{ events.nodeName }} <svg-icon icon-class="example" /> <br>
                      {{ $t('workflow.statusName') }} <b>:</b> {{ events.workflowStateName }} <svg-icon icon-class="documentation" /> <br>
                    </span>
                    <span v-if="!isEmptyValue(events.textMessage)" style="color: #606266; font-weight: bold;">
                      <!-- <el-scrollbar wrap-class="scroll-child"> -->
                      {{ $t('workflow.message') }} <b>:</b> {{ events.textMessage }} <svg-icon icon-class="message" />
                      <!-- </el-scrollbar> -->
                    </span>
                    <!-- {{ events.nodeName }} -->
                  </el-timeline-item>
                </el-timeline>
              </div>
            </el-scrollbar>
          </el-collapse-transition>
        </el-card>
      </el-timeline-item>
    </el-timeline>

    <div v-else>
      <el-empty />
    </div>
  </span>
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'

import store from '@/store'

// Components and Mixins
import WorkflowStatusBar from '@/components/ADempiere/WorkflowManager/WorkflowStatusBar.vue'

export default defineComponent({
  name: 'WorkflowLog',

  components: {
    WorkflowStatusBar
  },

  props: {
    containerUuid: {
      type: String,
      default: () => ''
    }
  },

  setup(props) {
    const currentKey = ref(0)
    const typeAction = ref(0)
    const currentTabLogs = ref('0')

    // use getter to reactive properties
    const storedWorkflowLogs = computed(() => {
      return store.getters.getWorkFlowLogs({
        containerUuid: props.containerUuid
      })
    })

    /**
     * showkey
     */
    const showkey = (key, index) => {
      if (key === currentKey.value && index === typeAction.value) {
        currentKey.value = 1000
      } else {
        currentKey.value = key
        typeAction.value = index
      }
    }

    return {
      currentTabLogs,
      typeAction,
      currentKey,
      storedWorkflowLogs,
      // Methods
      showkey
    }
  }

})
</script>
