<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 Contributor(s): Elsio Sanchez elsiosanches@gmail.com https://github.com/elsiosanchez
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
  <div style="padding: 10px;">
    <el-card
      shadow="header"
      :body-style="{ padding: '5px', margin: '0px' }"
      class="tracking"
    >
      <el-steps
        simple
        :space="200"
        :active="activeSteps"
        class="tracking-step"
        finish-status="success"
        style="padding: 13px 8%;"
      >
        <el-step
          v-for="status in listStatuses"
          :key="status.id"
          :title="status.name"
        >
          <svg-icon
            slot="icon"
            :icon-class="icon(status)"
            style="font-size: 30px !important;padding-top: 10px;"
          />
        </el-step>
      </el-steps>
      <el-card
        shadow="header"
        :body-style="{ padding: '5px', margin: '0px' }"
        class="tracking"
      >
        <span slot="header">
          <h2 style="margin: 0px 0px;">
            <el-button
              type="info"
              plain
              class="button-base-icon"
              style="margin-right: 5px;"
              @click="undoTracking()"
            >
              <i class="el-icon-arrow-left" style="font-size: 18px;" />
            </el-button>
            {{ 'No.' + tracking.document_no }} - {{ tracking.subject }}
          </h2>
        </span>
        <el-card
          shadow="header"
          :body-style="{ padding: '5px', margin: '0px' }"
        >
          <v-md-preview :text="tracking.summary" class="previwer-disable" height="200px" style="padding: 0px" />
        </el-card>
        <p style="margin: 0px;">
          <span style="font-size: 12px;color: #82848a;">
            {{ $t('issues.isCreated') }} {{ tracking.dateNextAction }}
          </span>
          <i class="el-icon-date" style="color: #82848a;" />
        </p>
        <el-card
          shadow="header"
          :body-style="{ padding: '15px', marginTop: '15px' }"
        >
          <el-timeline style="padding-left: 5px;padding-right: 15px;">
            <el-timeline-item
              v-for="(activity, index) in historyTracking"
              :key="index"
              :timestamp="activity.date"
              :color="activity.color"
              style="margin-left: 10px;"
            >
              <el-card
                shadow="header"
                :body-style="{ padding: '15px', marginTop: '15px' }"
                class="timeline-tracking"
              >
                <span slot="header">
                  <svg-icon icon-class="user" />
                  <b>
                    {{ activity.user.name }}
                  </b>
                </span>
                <span style="padding: 20px;">
                  {{ activity.displayed_value }}
                </span>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-card>
    </el-card>
  </div>
</template>

<script>
import {
  defineComponent,
  computed
} from '@vue/composition-api'

// import lang from '@/lang'
import store from '@/store'

// Components and Mixins
import 'simple-m-editor/dist/simple-m-editor.css'

// Utils and Helper Methods=

export default defineComponent({
  name: 'InfoPanel',

  props: {
    tracking: {
      type: Object,
      default: () => {},
      required: true
    }
  },

  setup(props) {
    const listStatuses = computed(() => {
      return store.getters.getListStatus.sort((itemA, itemB) => {
        return itemA.id - itemB.id
      })
    })

    const activeSteps = computed(() => {
      if (listStatuses.value) {
        const active = listStatuses.value.findIndex(status => status.id === props.tracking.status.id)
        if (active) return active
      }
      return 1
    })

    const historyTracking = computed(() => {
      return store.getters.getListHistoryTracking
    })

    function icon(status) {
      let svg
      switch (status.id) {
        case 1000005:
          svg = 'warehouse'
          break
        case 1000006:
          svg = 'requests'
          break
        case 1000007:
          svg = 'transit'
          break
        case 1000008:
          svg = 'approval'
          break
        case 1000009:
          svg = 'delivery-customer'
          break
      }
      return svg
    }

    function undoTracking() {
      store.commit('setCurrentTracking', {})
    }

    return {
      listStatuses,
      activeSteps,
      historyTracking,
      icon,
      undoTracking
    }
  }
})
</script>

<style lang="scss">
.tracking-step {
  .el-steps {
    .el-steps--simple {
      padding: 10px 2% !important;
      border-radius: 4px;
      background: #F5F7FA;
    }
  }
  .el-steps--simple {
    padding: 10px 2% !important;
    border-radius: 4px;
    background: #F5F7FA;
  }
  .el-step.is-simple:not(:last-of-type) .el-step__title {
    max-width: 95%;
    word-break: break-all;
  }
  .el-step__icon.is-text {
    border: 0px;
  }
  .el-step.is-simple .el-step__icon {
    background: transparent;
    width: 16px;
    height: 16px;
    font-size: 18px;
  }
}
.timeline-tracking {
  .el-card .el-card__header {
    padding: 10px 8px !important;
  }
}
</style>
