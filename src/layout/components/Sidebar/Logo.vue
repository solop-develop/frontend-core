<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link sidebar-logo-link-close" to="/">
        <el-tooltip placement="right">
          <div slot="content">{{ getRole.name }} | {{ getRole.client.name }}</div>
          <img v-if="logo" :src="logo" class="sidebar-logo">
          <svg-icon v-else icon-class="AD" style="width: 2em !important;height: 2em !important;font-size: 25px;padding-left: 5px;padding-right: 0px;cursor: pointer;" />
          <b style="margin-left: 5px;">{{ title }}</b>
        </el-tooltip>
      </router-link>

      <span v-else>
        <p key="expand" style="display: flex;text-align: center;width: 100%;padding: 0px 15px;margin-top: 0px;">
          <img v-if="logo" :src="logo" class="sidebar-logo" @click="dashboard()">
          <svg-icon v-else icon-class="AD" style="width: 2em !important;height: 2em !important;font-size: 25px;padding-left: 5px;padding-right: 0px;cursor: pointer;" />
          <b style="color: white;font-size: 18px;padding-top: 15px;cursor: pointer; margin-left: 5px;" @click="dashboard()">{{ getName }}</b><br>
        </p>
        <el-tooltip placement="right">
          <div slot="content">{{ getRole.name }} | {{ getRole.client.name }}</div>
          <p class="sidebar-sub-title" style="color: white; font-size: 12px;margin: 0px;margin-top: 0px;" @click="profile()">
            {{ getRole.name }} | {{ getRole.client.name }}
          </p>
        </el-tooltip>
      </span>
    </transition>
  </div>
</template>

<script>
import { getImagePath } from '@/utils/ADempiere/resource.js'
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      // title: 'Vue Element Admin',
      title: 'ADempiere'
      // logo: 'https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png'
      // logo: 'https://avatars1.githubusercontent.com/u/1263359?s=200&v=4?imageView2/1/w/80/h/80'
    }
  },
  computed: {
    getRole() {
      return this.$store.getters['user/getRole']
    },
    getName() {
      const { name } = this.$store.getters['user/getSystem']
      if (name) return name
      return 'ADempiere'
    },
    logo() {
      const { client } = this.getRole
      const { logo } = client
      if (logo) {
        const { uri } = getImagePath({
          file: logo,
          width: 50,
          height: 50,
          operation: 'resize'
        })

        return uri
      }
      return undefined
    }
  },
  methods: {
    profile() {
      this.$router.push({
        path: '/profile/index?'
      }, () => {})
    },
    dashboard() {
      this.$router.push({
        path: '/'
      }, () => {})
    }
  }
}
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
