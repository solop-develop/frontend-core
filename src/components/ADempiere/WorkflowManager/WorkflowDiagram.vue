<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A.
  Contributor(s): Elsio Sanchez esanchez@erpya.com www.erpya.com
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
  <el-container
    v-shortkey="{ close: ['esc'] }"
    @shortkey.native="closeNodeInfo"
  >
    <transition name="el-zoom-in-bottom">
      <!-- <el-card
        v-show="showedInfo"
        :style="{ position: 'absolute', zIndex: '9999', left: leftContextualMenu + 'px', top: topContextualMenu + 'px', width: '40% !important;' }"
        class="box-card"
      >
        <div slot="header" class="clearfix">
          <span>
            <svg-icon icon-class="example" />
            {{ infoNode.label }}
          </span>
          <el-button
            style="float: right; padding: 3px 0"
            type="text"
            icon="el-icon-close"
            @click="showedInfo = !showedInfo"
          />
        </div>

        <div v-if="!isEmptyValue(nodeLogs)" class="text item">
          <el-timeline class="info">
            <el-timeline-item
              v-for="(logs, key) in nodeLogs"
              :key="key"
              :timestamp="translateDateByLong(logs.log_date)"
              placement="top"
            >
              <el-card style="padding: 20px!important;">
                <span>
                  <b> {{ $t('page.login.userName') }} : </b>{{ logs.user_name }} <i class="el-icon-user-solid" />
                </span>
                <br>
                <b> {{ $t('report.summary') }} :</b> {{ logs.text_message }}
                <br>
                <b> {{ 'Responsable' }} :</b> {{ logs.responsible_name }}
                <br>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-card> -->
      <el-card
        v-show="showedInfo"
        shadow="always"
        class="collapse-workflow"
        :style="{ position: 'absolute', zIndex: '9999', padding: '10px', left: leftContextualMenu + 'px', top: topContextualMenu + 'px', width: '40% !important;' }"
      >
        <el-collapse
          v-model="activeCollapse"
          style="padding: 0px;"
        >
          <el-collapse-item name="1" style="padding: 0px;">
            <template slot="title">
              <b style="padding-left: 1%;float: left;width: 90%;">
                <svg-icon icon-class="example" />
                {{ infoNode.label }}
              </b>
              <el-button
                style="float: right;font-size: 20px;color: black;text-align: end;"
                type="text"
                icon="el-icon-close"
                @click="showedInfo = !showedInfo"
              />
            </template>
            <el-timeline class="info">
              <el-timeline-item
                v-for="(logs, key) in nodeLogs"
                :key="key"
                :timestamp="translateDateByLong(logs.log_date)"
                placement="top"
              >
                <el-card style="padding: 20px!important;">
                  <span>
                    <b> {{ $t('page.login.userName') }} : </b>{{ logs.user_name }} <i class="el-icon-user-solid" />
                  </span>
                  <br>
                  <b v-show="!isEmptyValue(logs.text_message)"> {{ $t('report.summary') }} :</b> {{ logs.text_message }}
                  <br>
                  <b v-show="!isEmptyValue(logs.responsible_name)"> {{ $t('window.containerInfo.logWorkflow.responsible') }} :</b> {{ logs.responsible_name }}
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </transition>

    <el-main style="overflow: auto;display: contents; position: relative;height: 100%;">
      <vue-workflow-chart
        v-if="!isEmptyValue(nodeList)"
        id="Diagrama"
        :transitions="nodeTransitionList"
        :states="nodeList"
        :state-semantics="currentNode"
        :orientation="orientation"
        style="position: inherit;"
        @state-click="onLabelClicked($event)"
      />
    </el-main>
  </el-container>
</template>

<script>
import { ref, computed, watch } from '@vue/composition-api'

import store from '@/store'

// Components and Mixins
import VueWorkflowChart from 'vue-workflow-chart'

// Utils and Helper Methods
import { translateDateByLong } from '@/utils/ADempiere/formatValue/dateFormat'

export default {
  name: 'WorkflowDiagram',

  components: {
    VueWorkflowChart
  },

  props: {
    nodeList: {
      type: Array,
      default: () => []
    },
    nodeTransitionList: {
      type: Array,
      default: () => []
    },
    currentNode: {
      type: Array,
      default: () => [{
        classname: 'delete',
        id: ''
      }]
    },
    workflowLogs: {
      type: Array,
      default: () => []
    },
    orientation: {
      type: String,
      default: () => 'horizontal'
    }
  },

  setup(props) {
    const showedInfo = ref(false)
    const infoNode = ref({})
    const nodeLogs = ref([])
    const topContextualMenu = ref(0)
    const leftContextualMenu = ref(0)
    const activeCollapse = '1'

    function closeNodeInfo() {
      showedInfo.value = false
    }

    function onLabelClicked(id) {
      infoNode.value = props.nodeList.find(node => node.id === id)
      nodeLogs.value = props.workflowLogs.filter(node => node.node_uuid === infoNode.value.id)
      const menuMinWidth = isMobile.value ? 0 : 105
      const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      const offsetWidth = this.$el.offsetWidth // container width
      const maxLeft = offsetWidth - menuMinWidth // left boundary
      const left = event.clientX - offsetLeft + 15 // 15: margin right

      leftContextualMenu.value = left
      if (left > maxLeft) {
        leftContextualMenu.value = maxLeft
      }

      const menutTop = isMobile.value ? 50 : 350

      const offsetTop = this.$el.getBoundingClientRect().top
      const top = event.clientY - offsetTop + menutTop
      topContextualMenu.value = top
      showedInfo.value = true
    }

    const watchNode = computed(() => {
      return props.nodeList
    })

    const widthDetails = computed(() => {
      if (isMobile.value) {
        return 80
      }
      return 40
    })

    const isMobile = computed(() => {
      return store.state.app.device === 'mobile'
    })

    watch(watchNode, (newValue, oldValue) => {
      closeNodeInfo()
    })

    return {
      activeCollapse,
      showedInfo,
      infoNode,
      nodeLogs,
      topContextualMenu,
      leftContextualMenu,
      widthDetails,
      isMobile,
      // methods
      closeNodeInfo,
      onLabelClicked,
      translateDateByLong,
      watchNode
    }
  }
}
</script>

<style scoped>
.info {
  margin: 0px;
  font-size: 14px;
  list-style: none;
  padding: 10px;
}
.vue-workflow-chart-state {
  background-color: #fff;
  padding: 20px;
  border-radius: 3px;
  color: #11353d;
  font-size: 15px;
  font-family: Open Sans;
  /* font-weight: 600; */
  margin-right: 20px;
  margin-bottom: 20px;
  max-width: 15%;
  text-align: center;
  -webkit-box-shadow: 0 2px 4px 0 rgb(0 0 0 / 20%);
  box-shadow: 0 2px 4px 0 rgb(0 0 0 / 20%);
}
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
@import '~vue-workflow-chart/dist/vue-workflow-chart.css';
.vue-workflow-chart-state-delete {
  color: white;
  background: #AED5FE;
}
.vue-workflow-chart-transition-arrow-delete {
  fill: #AED5FE;
}
.vue-workflow-chart-transition-path-delete {
  stroke: #AED5FE;
}
.collapse-workflow {
  width: 30% !important;
  .el-collapse-item__content {
    padding-bottom: 0px;
    font-size: 13px;
    color: #303133;
    line-height: 1.7692307692;
  }
  .el-timeline-item {
    position: relative;
    padding-bottom: 0px;
  }
  .el-collapse-item__header {
    width: 100% !important;
  }
}
</style>
