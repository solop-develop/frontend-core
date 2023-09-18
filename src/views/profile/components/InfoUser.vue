<template>
  <el-card
    v-if="!isMobile"
    shadow="always"
    :body-style="{ padding: '5px' }"
    style="padding: 0px !important;"
  >
    <el-col :span="showPanel ? 15 : 12">
      <h1 v-if="!showPanel" style="margin-bottom: 0px;">{{ $t('component.dashboard.header.welcome') }} {{ userInfo.name }}</h1>
      <br>
      <span v-if="showPanel">
        <el-row>
          <el-col :span="15">
            <svg-icon icon-class="company" />
            {{ systemInfo.name }}
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 2.5px;">
          <el-col :span="12">
            <p
              class="label-system"
            >
              <svg-icon icon-class="collections" />
              {{ $t('profile.systemInformation.deploymentName') + ': ' }}
            </p>
          </el-col>
          <el-col :span="12">
            <el-tag>
              <b>
                <svg-icon icon-class="collections" />
                {{ systemInfo.lastBuildInfo }}
              </b>
            </el-tag>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 2.5px;">
          <el-col :span="12">
            <p
              class="label-system"
            >
              <svg-icon icon-class="calendar" />
              {{ $t('profile.systemInformation.dateVersion') + ': ' }}
            </p>
          </el-col>
          <el-col :span="12">
            <el-tag>
              <b>
                <svg-icon icon-class="calendar" />
                {{ translateDateByLong(systemInfo.backendDateVersion) }}
              </b>
            </el-tag>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 2.5px;">
          <el-col :span="12">
            <p
              class="label-system"
            >
              <svg-icon icon-class="status" />
              {{ $t('profile.systemInformation.releaseNumber') + ': ' }}
            </p>
          </el-col>
          <el-col :span="12">
            <el-tag>
              <b>
                <svg-icon icon-class="tag" />
                {{ systemInfo.releaseNo }}
              </b>
            </el-tag>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 2.5px;">
          <el-col :span="12">
            <p
              class="label-system"
            >
              <svg-icon icon-class="backend" />
              {{ $t('profile.systemInformation.backEndVersion') + ': ' }}
            </p>
          </el-col>
          <el-col :span="12">
            <el-tag>
              <b>
                <svg-icon icon-class="tag" />
                {{ systemInfo.backendMainVersion }}
              </b>
            </el-tag>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 10px;">
          <el-col :span="12">
            <p
              class="label-system"
            >
              <svg-icon icon-class="proxy" />
              {{ $t('profile.systemInformation.proxyVersion') + ': ' }}
            </p>
          </el-col>
          <el-col :span="12">
            <el-tag>
              <b>
                <svg-icon icon-class="tag" />
                {{ systemInfo.proxyVersion }}
              </b>
            </el-tag>
          </el-col>
        </el-row>
      </span>
    </el-col>

    <el-col
      v-if="!showPanel"
      :span="showPanelNotifications ? 11 : 12"
      style="text-align: end;"
    >
      <el-row style="margin-top: 5px; margin-bottom: 5px;">
        <el-col :span="18">
          <el-button
            type="primary"
            plain
            circle
            @click="zoomNotifications(notice)"
          >
            <svg-icon
              icon-class="notifications"
              style="font-size: 15px !important"
            />
          </el-button>
        </el-col>
        <el-col :span="6" style="text-align: start; padding-left: 1px;">
          <el-badge
            :value="notice.quantity"
            class="item"
            type="primary"
            :hidden="notice.quantity == 0"
            style="margin-right: 10px"
          >
            <el-button
              round
              plain
              style="padding: 15px 0px 5px 0px;border: 0px;"
              @click="zoomNotifications(notice)"
            >
              {{ $t('profile.notice') }}
            </el-button>
          </el-badge>
        </el-col>
      </el-row>
      <el-row style="margin-top: 5px; margin-bottom: 5px;">
        <el-col :span="18">
          <el-button
            type="primary"
            plain
            circle
            @click="zoomNotifications(request)"
          >
            <svg-icon
              icon-class="guide"
              style="font-size: 15px !important"
            />
          </el-button>
        </el-col>
        <el-col :span="6" style="text-align: start; padding-left: 1px;">
          <el-badge
            :value="request.quantity"
            class="item"
            type="primary"
            :hidden="request.quantity == 0"
            style="margin-right: 10px"
          >
            <el-button
              round
              plain
              style="padding: 15px 0px 5px 0px;border: 0px;"
              @click="zoomNotifications(request)"
            >
              {{ $t('profile.request') }}
            </el-button>
          </el-badge>
        </el-col>
      </el-row>
      <el-row style="margin-top: 5px; margin-bottom: 5px;">
        <el-col :span="18">
          <el-button
            type="primary"
            plain
            circle
            @click="zoomNotifications(workflow)"
          >
            <svg-icon
              icon-class="workflow"
              style="font-size: 15px !important"
            />
          </el-button>
        </el-col>
        <el-col :span="6" style="text-align: start; padding-left: 1px;">
          <el-badge
            :value="workflow.quantity"
            class="item"
            type="primary"
            :hidden="workflow.quantity == 0"
            style="margin-right: 10px"
          >
            <el-button
              round
              plain
              style="padding: 15px 0px 5px 0px;border: 0px;"
              @click="zoomNotifications(workflow)"
            >
              {{ $t('profile.workflowActivities') }}
            </el-button>
          </el-badge>
        </el-col>
      </el-row>
    </el-col>
  </el-card>
  <el-card
    v-else
    shadow="always"
    :body-style="{ padding: '0px' }"
  >
    <el-col :span="24" style="padding-right:10px;margin-bottom:20px;">
      <el-card
        shadow="always"
        :body-style="{ padding: '0px !important;' }"
      >
        <el-col :span="24" style="padding-right:10px;margin-bottom:20px;">
          <h1 style="margin-bottom: 5px;">{{ $t('component.dashboard.header.welcome') }} {{ userInfo.name }}</h1>
          {{ userInfo.description }}
        </el-col>

        <el-col :span="24">
          <span
            style="border: 0px solid #d3d4d6;border-radius: 10px;"
          >
            <el-badge
              :value="notice.quantity"
              class="item"
              type="primary"
              :hidden="notice.quantity == 0"
              style="margin-right: 10px"
            >
              <el-button
                round
                plain
                style="padding: 5px 0px 5px 15px;border: 0px;"
                @click="zoomNotifications(notice)"
              >
                <el-button
                  type="primary"
                  plain
                  circle
                  @click="zoomNotifications(notice)"
                >
                  <svg-icon
                    icon-class="notifications"
                    style="font-size: 15px !important"
                  />
                </el-button>
                {{ $t('profile.notice') }}
              </el-button>
            </el-badge>
            <br>
            <el-badge
              :value="request.quantity"
              class="item"
              type="primary"
              :hidden="request.quantity == 0"
              style="margin-right: 10px"
            >
              <el-button
                round
                plain
                style="padding: 5px 0px 5px 15px;border: 0px;"
                @click="zoomNotifications(request)"
              >
                <el-button
                  type="primary"
                  plain
                  circle
                  @click="zoomNotifications(request)"
                >
                  <svg-icon
                    icon-class="guide"
                    style="font-size: 15px !important"
                  />
                </el-button>
                {{ $t('profile.request') }}
              </el-button>
            </el-badge>
            <br>
            <el-badge
              :value="workflow.quantity"
              class="item"
              type="primary"
              :hidden="workflow.quantity == 0"
              style="margin-right: 10px"
            >
              <el-button
                round
                plain
                style="padding: 5px 0px 5px 15px;border: 0px;"
                @click="zoomNotifications(workflow)"
              >
                <el-button
                  type="primary"
                  plain
                  circle
                  @click="zoomNotifications(workflow)"
                >
                  <svg-icon
                    icon-class="workflow"
                    style="font-size: 15px !important"
                  />
                </el-button>
                {{ $t('profile.workflowActivities') }}
              </el-button>
            </el-badge>
          </span>
        </el-col>
      </el-card>
    </el-col>
  </el-card>
</template>

<script>
import store from '@/store'
import router from '@/router'
import language from '@/lang'
import { defineComponent, computed } from '@vue/composition-api'

// Utils and Helper Methods
import { zoomIn } from '@/utils/ADempiere/coreUtils.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { translateDateByLong } from '@/utils/ADempiere/formatValue/dateFormat'

export default defineComponent({
  name: 'UserInfo',

  props: {
    showPanel: {
      type: Boolean,
      default: false
    },
    showPanelNotifications: {
      type: Boolean,
      default: false
    }
  },

  setup() {
    const currentRole = computed(() => {
      return store.getters['user/getRole']
    })

    const userInfo = computed(() => {
      return store.getters['user/userInfo']
    })

    const organization = computed(() => {
      return store.getters['user/getOrganization']
    })

    const warehouse = computed(() => {
      return store.getters['user/getWarehouse'] || {
        name: ''
      }
    })

    const isMobile = computed(() => {
      return store.state.app.device === 'mobile'
    })

    const systemInfo = computed(() => {
      const info = store.getters['user/getSystem']
      if (!isEmptyValue(info)) return info
      return {
        name: 'ADempiere'
      }
    })

    const notifications = computed(() => {
      return store.getters.getListNotifiications
    })

    const notice = computed(() => {
      if (!isEmptyValue(notifications.value)) return notifications.value[0]
      return {
        quantity: 0
      }
    })

    const request = computed(() => {
      if (!isEmptyValue(notifications.value)) return notifications.value[1]
      return {
        quantity: 0
      }
    })

    const workflow = computed(() => {
      if (!isEmptyValue(notifications.value)) return notifications.value[2]
      return {
        quantity: 0
      }
    })

    function svgClass(notification) {
      let svg = 'default-notifications'
      switch (notification.name) {
        case language.t('profile.notice'):
          svg = 'notifications'
          break
        case language.t('profile.request'):
          svg = 'guide'
          break
        case language.t('profile.workflowActivitiesguide'):
          svg = 'workflow'
          break
      }
      return svg
    }

    function zoomNotifications(notification) {
      if (notification.name === 'Solicitud' || notification.name === 'Request') {
        router.push({
          name: 'Issues'
        }, () => {})
        return
      }
      zoomIn({
        uuid: notification.action_uuid
      })
    }

    return {
      // Methods
      zoomNotifications,
      translateDateByLong,
      svgClass,
      // Computeds
      notifications,
      organization,
      currentRole,
      systemInfo,
      warehouse,
      userInfo,
      isMobile,
      workflow,
      request,
      notice
    }
  }
})
</script>

<style lang="scss" scoped>
.notificarion-table {
  padding: 5px;
}

.label-system {
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>
