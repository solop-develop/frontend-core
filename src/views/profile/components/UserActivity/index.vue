<template>
  <el-card
    shadow="always"
    :body-style="{ padding: '10px 5px' }"
  >
    <el-empty v-if="isEmptyValue(getActivityUser)" :image-size="200" />
    <el-timeline v-else style="padding: 0px;">
      <el-scrollbar :wrap-class="isMobile ? 'scroll-logs-user-mobile' : 'scroll-logs-user'">
        <el-timeline-item
          v-for="(logsUser) in getActivityUser"
          :key="logsUser.id"
          :type="colorTypeLogs(logsUser)"
          :timestamp="logTimesTamp(logsUser)"
          placement="top"
        >
          <el-card
            shadow="hover"
            style="padding: 0px !important;"
            :body-style="{ padding: '10px 5px' }"
          >
            <div :style="styleShow(logsUser.show)">
              <span style="color: #606266; font-weight: bold;">
                <svg-icon
                  :icon-class="iconTypelogs(logsUser)"
                />
                <b style="padding: 0px 5px;">
                  {{ nameLogs(logsUser) }}
                </b>
                <el-tag
                  :type="colorTypeLogs(logsUser)"
                >
                  {{ typeLogs(logsUser) }}
                </el-tag>
                <el-tag
                  v-if="false"
                  :type="status(logsUser).color"
                >
                  {{ status(logsUser).text }}
                </el-tag>
              </span>

              <el-link
                type="primary"
                style="float: right;"
                @click="showkey(logsUser)"
              >
                {{ $t('window.containerInfo.changeDetail') }}
              </el-link>
            </div>

            <el-collapse-transition>
              <div
                v-show="logsUser.show"
                style="margin-top: 10px;"
              >
                <process-logs
                  v-if="logsUser.userActivityTypeName === 'PROCESS_LOG'"
                  :list-parameters="logsUser.processLog.parameters"
                  :list-logs="logsUser.processLog.logsList"
                  :summary="logsUser.processLog.summary"
                  :status="logsUser.processLog.isError"
                />
                <windows-logs
                  v-else
                  :list-change-logs="logsUser.entityLog.changeLogs"
                  :entity-logs="logsUser.entityLog"
                />
              </div>
            </el-collapse-transition>
          </el-card>
        </el-timeline-item>
      </el-scrollbar>
    </el-timeline>
  </el-card>
</template>

<script>
import lang from '@/lang'
import store from '@/store'
// Components and Mixins
import WindowsLogs from '@/views/profile/components/UserActivity/WindowsLogs.vue'
import ProcessLogs from '@/views/profile/components/UserActivity/ProcessLogs.vue'

// Utils and Helper Methods
import { translateDateByLong } from '@/utils/ADempiere/formatValue/dateFormat'

import {
  defineComponent,
  computed,
  ref
} from '@vue/composition-api'

export default defineComponent({
  name: 'UserLog',
  components: {
    WindowsLogs,
    ProcessLogs
  },
  setup() {
    // Ref
    const currentKey = ref(0)
    const typeAction = ref(0)
    const activeName = ref([])

    // Computed

    const getActivityUser = computed({
      // getter
      get() {
        return store.getters['user/getActivityLogs']
      },
      // setter
      set(newValue) {
        store.dispatch('user/loadingActivitylogs', newValue)
      }
    })

    const isMobile = computed(() => {
      return store.getters.device === 'mobile'
    })

    // Methods

    /**
     * Set Color according to log type
     * @param {objec} log
     */

    function colorTypeLogs(log) {
      const { userActivityTypeName, processLog } = log
      let color
      switch (userActivityTypeName) {
        case 'ENTITY_LOG':
          color = 'primary'
          break
        case 'PROCESS_LOG':
          if (processLog.output) {
            color = 'info'
          } else {
            color = 'success'
          }
          break
      }
      return color
    }

    function status(log) {
      const { userActivityTypeName, processLog } = log
      let status
      switch (userActivityTypeName) {
        case 'ENTITY_LOG':
          status = {
            isShow: false,
            color: ''
          }
          break
        case 'PROCESS_LOG':
          if (processLog.output) {
            status = {
              isShow: false,
              color: ''
            }
          } else {
            status = {
              isShow: true,
              color: (processLog.isError) ? 'danger' : 'success',
              text: (processLog.isError) ? lang.t('notifications.error') : lang.t('notifications.succesful')
            }
          }
          break
      }
      return status
    }

    function showkey(logs) {
      const { index, show } = logs
      const activityLogs = getActivityUser.value.map(list => {
        if (index === list.index) {
          return {
            ...list,
            show: !show
          }
        }
        return list
      })
      store.commit('user/setActivityLogs', activityLogs)
    }

    function iconTypelogs(log) {
      const { userActivityTypeName, processLog } = log
      let svg = 'info'
      switch (userActivityTypeName) {
        case 'ENTITY_LOG':
          svg = 'tab'
          break
        case 'PROCESS_LOG':
          if (processLog.output) {
            svg = 'skill'
          } else {
            svg = 'component'
          }
          break
      }
      return svg
    }

    function typeLogs(log) {
      const { userActivityTypeName, processLog } = log
      let type
      switch (userActivityTypeName) {
        case 'ENTITY_LOG':
          type = lang.t('views.window')
          break
        case 'PROCESS_LOG':
          if (processLog.output) {
            type = lang.t('views.report')
          } else {
            type = lang.t('views.process')
          }
          break
      }
      return type
    }

    function setUserLogs() {
      store.dispatch('user/loadingActivitylogs')
    }

    function styleShow(show) {
      if (show) return 'padding: 0px;padding-top: 10px'
      return 'padding: 0px;'
    }

    function nameLogs(log) {
      const { userActivityTypeName, processLog, entityLog } = log
      let name
      switch (userActivityTypeName) {
        case 'ENTITY_LOG':
          name = entityLog.tableName
          break
        case 'PROCESS_LOG':
          name = processLog.name
          break
      }
      return name
    }

    function logTimesTamp(logs) {
      const { userActivityTypeName, processLog, entityLog } = logs
      let date = new Date()
      switch (userActivityTypeName) {
        case 'ENTITY_LOG':
          date = entityLog.logDate
          break
        case 'PROCESS_LOG':
          date = processLog.lastRun
          break
      }
      return translateDateByLong(date)
    }

    setUserLogs()

    return {
      // Ref
      currentKey,
      typeAction,
      activeName,
      // Computeds
      getActivityUser,
      isMobile,
      // Methods
      showkey,
      styleShow,
      nameLogs,
      typeLogs,
      status,
      setUserLogs,
      iconTypelogs,
      logTimesTamp,
      colorTypeLogs
    }
  }
})
</script>

<style lang="scss">
.scroll-logs-user {
  max-height: 50vh;
}
.scroll-logs-user-mobile {
  max-height: 95vh;
}
.el-timeline-item__wrapper {
  position: relative;
  padding-left: 15px;
  top: -3px;
}
.el-timeline-item__node--normal {
  left: 0px;
  width: 12px;
  height: 12px;
}
.el-timeline-item {
  position: relative;
  padding-bottom: 10px;
}
.descriptions-item-process {
  text-align: center;
}
</style>
