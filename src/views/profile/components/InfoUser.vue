<template>
  <el-card
    v-if="!isMobile"
    shadow="always"
    :body-style="{ padding: '5px' }"
    style="padding: 0px !important;"
  >
    <el-col :span="12">
      <h1 style="margin-bottom: 0px;">{{ $t('component.dashboard.header.welcome') }} {{ userInfo.name }}</h1>
      {{ userInfo.description }}
    </el-col>

    <el-col
      :span="12"
      style="padding-left: 2.5px;padding-right: 5px;text-align: end;"
    >
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
export default defineComponent({
  name: 'UserInfo',
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
      svgClass,
      // Computeds
      notifications,
      organization,
      currentRole,
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
</style>
