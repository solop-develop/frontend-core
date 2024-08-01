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
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link sidebar-logo-link-close" to="/">
        <el-tooltip placement="right">
          <div slot="content">
            {{ getRole.name }} | {{ getRole.client.name }} | {{ storedOrganization.name }}
          </div>
          <img v-if="clientLogo" :src="clientLogo" class="sidebar-logo" style="height: 50px;width: 50px;">
          <img v-else src="https://avatars1.githubusercontent.com/u/1263359?s=200&v=4" class="sidebar-logo" style="height: 50px;width: 50px;">
          <!-- <svg-icon v-else icon-class="AD" class="standard-logo" /> -->
          <b style="margin-left: 5px;">{{ title }}</b>
        </el-tooltip>
      </router-link>

      <span v-else>
        <p key="expand" style="display: flex;text-align: center;width: 100%;padding: 0px 15px;margin-top: 0px;">
          <img v-if="clientLogo" :src="clientLogo" class="sidebar-logo" style="height: 50px;width: 50px;" @click="dashboard()">
          <img v-else src="https://avatars1.githubusercontent.com/u/1263359?s=200&v=4" class="sidebar-logo" style="height: 50px;width: 50px;" @click="dashboard()">
          <!-- <svg-icon v-else icon-class="AD" class="standard-logo" /> -->
          <b style="color: white;font-size: 18px;padding-top: 15px;cursor: pointer; margin-left: 5px;" @click="dashboard()">
            {{ systemName }}
          </b>
          <br>
        </p>
        <p class="sidebar-sub-title" style="color: white; font-size: 12px;margin: 0px;margin-top: 0px;" @click="profile()">
          {{ getRole.name }} | {{ getRole.client.name }} | {{ storedOrganization.name }}
        </p>
      </span>
    </transition>
  </div>
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'
import router from '@/router'
import store from '@/store'

// Utils and Helper Methods
import { pathImageWindows } from '@/utils/ADempiere/resource'

// Constants
import { COLUMN_NAME, TABLE_NAME_CLIENT } from '@/utils/ADempiere/constants/resoucer.ts'

export default defineComponent({
  name: 'SidebarLogo',

  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },

  setup() {
    // Ref
    const title = ref('ADempiere')
    const clientLogo = ref('')

    // Computed
    const getRole = computed(() => {
      return store.getters['user/getRole']
    })

    const systemName = computed(() => {
      const { name } = store.getters['user/getSystem']
      if (name) return name
      return 'ADempiere'
    })

    const storedOrganization = computed(() => {
      return store.getters['user/getOrganization']
    })

    const clientId = computed(() => {
      const { client } = store.getters['user/getRole']
      return client.uuid
    })

    const imageUrl = computed(() => {
      return pathImageWindows({
        clientId: clientId.value,
        tableName: TABLE_NAME_CLIENT,
        recordId: clientId.value,
        columnName: COLUMN_NAME,
        resourceName: `${COLUMN_NAME}.png`
      })
    })

    // Methods
    async function loadImage() {
      clientLogo.value = 'https://avatars1.githubusercontent.com/u/1263359?s=200&v=4'
      fetch(imageUrl.value)
        .then(response => {
          if (response.status === 200) {
            clientLogo.value = imageUrl.value
            return
          }
        })
    }

    function profile() {
      router.push({
        path: '/profile/index?'
      }, () => {})
    }

    function dashboard() {
      router.push({
        path: '/'
      }, () => {})
    }

    loadImage()

    return {
      // Ref
      title,
      clientLogo,
      imageUrl,
      clientId,
      // Computed
      getRole,
      systemName,
      storedOrganization,
      // Methods
      dashboard,
      loadImage,
      profile
    }
  }
})
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  min-height: 70px;
  max-height: 90px;
  // line-height: 50px;
  background: #2b2f3a;
  text-align: center;
  overflow: hidden;

  .standard-logo {
    width: 2em !important;
    height: 2em !important;
    font-size: 25px;
    padding-left: 5px;
    padding-right: 0px;
    cursor: pointer;
  }

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;
    padding-top: 10px;

    & .sidebar-logo {
      // width: 32px;
      // height: 32px;
      vertical-align: middle;
      margin-right: 12px;
      cursor: pointer;
    }

    & .sidebar-title {
      display: inline-block;
      cursor: pointer;
      margin: 0;
      color: #fff;
      font-weight: 600;
      // line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }

    & .sidebar-sub-title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      // display: inline-block;
      cursor: pointer;
      margin-top: 10px;
      padding-top: 0px;
      color: #fff;
      font-size: 12px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }
  & .sidebar-logo-link-close {
    line-height: 50px;
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
