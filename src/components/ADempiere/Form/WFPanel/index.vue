<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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
  <el-card shadow="always" class="box-card">
    <el-container>
      <el-header class="header">
        <el-card class="box-card">
          <el-form
            label-position="top"
            label-width="200px"
            class="from-wf-panel"
          >
            <el-row :gutter="24">
              <field-definition
                v-for="(fieldMetadata) in fieldsList"
                :key="fieldMetadata.columnName"
                :metadata-field="{
                  ...fieldMetadata,
                  size: {
                    xl: 8,
                    lg:10,
                    md:12,
                    sm: 24
                  }
                }"
                :container-uuid="formUuid"
                :container-manager="containerManager"
              />
            </el-row>
          </el-form>
        </el-card>
      </el-header>
    </el-container>
    <br>
    <br>

    <workflow-diagram
      v-if="!isEmptyValue(workflowStatesList)"
      :node-transition-list="workflowTranstitionsList"
      :node-list="workflowStatesList"
      :current-node="stateSemanticsList"
    />

    <loading-view
      v-if="isLoadingWorkFlow"
      key="window-loading"
    />
  </el-card>
</template>

<script>
import { defineComponent, ref, onUnmounted, computed } from '@vue/composition-api'

import store from '@/store'

// Constants
import { COLUMN_NAME, WORKFLOW_EDITOR_FORM } from '@/utils/ADempiere/dictionary/form/workflowEditor.js'
import fieldsListDefinition from './fieldsList.js'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

// Components and Mixins
import FieldDefinition from '@/components/ADempiere/FieldDefinition/index.vue'
import LoadingView from '@/components/ADempiere/LoadingView/index.vue'
import useForm from '@/components/ADempiere/Form/useForm'
import WorkflowDiagram from '@/components/ADempiere/WorkflowManager/WorkflowDiagram.vue'

/**
 * TODO: Store workflow diagram on vuex to cache on client side.
 */
export default defineComponent({
  name: 'WFPanel',

  components: {
    FieldDefinition,
    LoadingView,
    WorkflowDiagram
  },

  props: {
    metadata: {
      type: Object,
      default: () => {
        return {
          uuid: WORKFLOW_EDITOR_FORM,
          containerUuid: WORKFLOW_EDITOR_FORM
        }
      }
    }
  },

  setup(props, { root }) {
    const formUuid = root.$route.meta.uuid

    // TODO: Manage with uuid
    // TODO: When enabled it duplicates the requests for the fields
    // show title
    // store.commit('changeShowTitleForm', true)

    const {
      containerManager,
      fieldsList
    } = useForm({
      containerUuid: formUuid,
      metadata: props.metadata,
      fieldsListDefinition
    })

    const isLoadingWorkFlow = ref(false)

    const stateSemanticsList = ref([])

    const workflowStatesList = ref([])
    const workflowTranstitionsList = ref([])

    const storedValue = computed(() => {
      return store.getters.getValueOfFieldOnContainer({
        containerUuid: formUuid,
        columnName: COLUMN_NAME
      })
    })

    const currentWorkfllowId = ref(storedValue.value)

    // methods
    function selectWorkflow({ workflowId, workflowUuid }) {
      isLoadingWorkFlow.value = true

      if (isEmptyValue(workflowId) && isEmptyValue(workflowUuid)) {
        // clear diagram
        workflowStatesList.value = []
        isLoadingWorkFlow.value = false
        return
      }

      const workflow = store.getters.getStoredWorkflowById(workflowId)
      if (workflow) {
        generateWorkflow(workflow)
        isLoadingWorkFlow.value = false
        return
      }

      store.dispatch('getWorkflowFromServer', {
        id: workflowId,
        uuid: workflowUuid
      })
        .then(response => {
          generateWorkflow(response)
        })
        .catch(error => {
          console.warn(`Get Workflow From Server - Error ${error.code}: ${error.message}.`)
        })
        .finally(() => {
          isLoadingWorkFlow.value = false
        })
    }

    function generateWorkflow(workflowDefinition) {
      const { diagramMetadata } = workflowDefinition
      workflowStatesList.value = diagramMetadata.statesList
      workflowTranstitionsList.value = diagramMetadata.transitionsList
      stateSemanticsList.value = diagramMetadata.stateSemanticsList
    }

    function subscribeWorkflowChange() {
      return store.subscribe((mutation, state) => {
        if (mutation.type === 'updateValueOfField') {
          if (mutation.payload.containerUuid === formUuid && mutation.payload.columnName === COLUMN_NAME) {
            if (mutation.payload.value === currentWorkfllowId.value) {
              return
            }
            currentWorkfllowId.value = mutation.payload.value
            selectWorkflow({
              workflowId: mutation.payload.value
            })
          }
        }
      })
    }

    const unsubscribeWorkflowChange = subscribeWorkflowChange()

    onUnmounted(() => {
      unsubscribeWorkflowChange()
    })

    return {
      // ref
      formUuid,
      isLoadingWorkFlow,
      stateSemanticsList,
      workflowStatesList,
      workflowTranstitionsList,
      fieldsList,
      containerManager: {
        ...containerManager
      }
    }
  }
})
</script>

<style lang="scss">
  .from-wf-panel {
    padding-top: 10px;
    padding-left: 20px;
    padding-right: 20px;
  }
</style>
