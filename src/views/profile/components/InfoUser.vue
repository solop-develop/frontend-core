<template>
  <el-card v-if="!isMobile" shadow="always">
    <el-col :span="16" style="padding-right:10px;margin-bottom:20px;">
      <h1 style="margin-bottom: 0px;">{{ $t('component.dashboard.header.welcome') }} {{ userInfo.name }}</h1>
      {{ userInfo.description }}
    </el-col>

    <el-col :span="8" style="padding-left: 2.5px;padding-right: 2.5px;">
      <el-descriptions
        class="notificarion-table"
        :border="true"
        :column="1"
        size="mini"
      >
        <template
          v-for="(list, key) in notifications"
        >
          <el-descriptions-item
            :key="key"
          >
            <template slot="label">
              <p
                style="margin: 0px;cursor: pointer;"
                @click="zoomNotifications(list)"
              >
                <svg-icon
                  :icon-class="svgClass(list)"
                  style="font-size: 15px !important"
                />
                <b>
                  {{ list.name }}
                </b>
              </p>
            </template>
            <p
              style="margin: 0px;text-align: center;cursor: pointer;"
              @click="zoomNotifications(list)"
            >
              {{ list.quantity }}
            </p>
          </el-descriptions-item>
        </template>
      </el-descriptions>
    </el-col>
  </el-card>
  <el-card v-else shadow="always">
    <el-col :span="24" style="padding-right:10px;margin-bottom:20px;">
      <el-card shadow="always">
        <el-col :span="24" style="padding-right:10px;margin-bottom:20px;">
          <h1 style="margin-bottom: 5px;">{{ $t('component.dashboard.header.welcome') }} {{ userInfo.name }}</h1>
          {{ userInfo.description }}
        </el-col>

        <el-col :span="24">
          <el-descriptions
            class="notificarion-table"
            :border="true"
            :column="1"
            size="mini"
          >
            <template
              v-for="(list, key) in notifications"
            >
              <el-descriptions-item
                :key="key"
              >
                <template slot="label">
                  <p
                    style="margin: 0px;cursor: pointer;"
                    @click="zoomNotifications(list)"
                  >
                    <svg-icon
                      :icon-class="svgClass(list)"
                      style="font-size: 15px !important"
                    />
                    <b>
                      {{ list.name }}
                    </b>
                  </p>
                </template>
                <p
                  style="margin: 0px;text-align: center;cursor: pointer;"
                  @click="zoomNotifications(list)"
                >
                  {{ list.quantity }}
                </p>
              </el-descriptions-item>
            </template>
          </el-descriptions>
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

    function svgClass(notification) {
      let svg = 'default-notifications'
      switch (notification.name) {
        case language.t('profile.notice'):
          svg = 'notifications'
          break
        case language.t('profile.request'):
          svg = 'guide'
          break
        case language.t('profile.workflowActivities'):
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
      isMobile
    }
  }
})
</script>

<style lang="scss" scoped>
.notificarion-table {
  padding: 5px;
}
</style>
