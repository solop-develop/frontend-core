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
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program. If not, see <https:www.gnu.org/licenses/>.
-->

<template>
  <el-container class="panel_main">
    <el-header>
      <title-and-help
        :name="workflowName"
        :help="$route.meta.description"
      />
    </el-header>

    <el-main v-if="isLoadedMetadata">
      <workflow-diagram
        v-if="!isEmptyValue(getStoredWorkflow)"
        :node-transition-list="getStoredWorkflow.diagramMetadata.transitionsList"
        :node-list="getStoredWorkflow.diagramMetadata.statesList"
        :current-node="getStoredWorkflow.diagramMetadata.stateSemanticsList"
      />
    </el-main>

    <div
      v-else
      key="form-loading"
      v-loading="!isLoadedMetadata"
      :element-loading-text="$t('notifications.loading')"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)"
      class="view-loading"
    />
  </el-container>
</template>

<script>
import { defineComponent, computed, ref, onBeforeMount } from '@vue/composition-api'

import router from '@/router'
import store from '@/store'

// Components and Mixins
import TitleAndHelp from '@/components/ADempiere/TitleAndHelp'
import WorkflowDiagram from '@/components/ADempiere/WorkflowManager/WorkflowDiagram.vue'

// API Request Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
// import { getWorkflow } from '@/api/ADempiere/workflow.js'

export default defineComponent({
  name: 'WorkflowView',

  components: {
    WorkflowDiagram,
    TitleAndHelp
  },

  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },

  setup() {
    const isLoadedMetadata = ref(false)

    const currentRoute = router.app._route

    const workflowUuid = computed(() => {
      return currentRoute.meta.uuid
    })
    const workflowId = computed(() => {
      return currentRoute.meta.id
    })
    const workflowName = computed(() => {
      return getStoredWorkflow.value.name || currentRoute.meta.title
    })
    const getStoredWorkflow = computed(() => {
      return store.getters.getStoredWorkflowByUuid(workflowUuid.value)
    })

    function loadWorkflow() {
      isLoadedMetadata.value = false
      const workflow = getStoredWorkflow.value
      if (isEmptyValue(workflow)) {
        store.dispatch('getWorkflowFromServer', {
          containerUuid: workflowUuid.value,
          id: workflowId.value,
          routeToDelete: currentRoute
        }).finally(() => {
          isLoadedMetadata.value = true
        })
      } else {
        isLoadedMetadata.value = true
      }
    }

    // function serverWorkflow({ tableName }) {
    //   if (isEmptyValue(tableName)) {
    //     return ''
    //   }
    //   getWorkflow({
    //     tableName
    //   })
    //     .then(response => {
    //       listWorkflow(response.records)
    //     })
    //     .catch(error => {
    //       console.warn(`serverWorkflow: ${error.message}. Code: ${error.code}.`)
    //     })
    // }

    onBeforeMount(() => {
      loadWorkflow()
    })

    return {
      isLoadedMetadata,
      workflowName,
      getStoredWorkflow
    }
  }
})
</script>

<style scoped>
  .panel_main {
    height: 100%;
    width: 100%;
  }
</style>
