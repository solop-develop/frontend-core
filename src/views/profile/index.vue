<template>
  <div
    class="class-profile"
  >
    <div v-if="user">
      <el-row :gutter="5" style="padding: 10px;padding-bottom: 0px;margin: 0px;">
        <!-- Image User -->
        <el-col :span="8" :xs="24">
          <user-card :user="user" />
        </el-col>
        <el-col :span="16" :xs="24">
          <el-card shadow="always">
            <el-tabs v-model="activeTab" class="tab-profile">
              <el-tab-pane :label="$t('profile.role')" name="role">
                <!-- Info User -->
                <user-info
                  :show-panel="false"
                  :show-panel-notifications="true"
                />
              </el-tab-pane>
              <!-- Settings -->
              <el-tab-pane :label="$t('page.settings.title')" :name="$t('page.settings.title')">
                <settings />
              </el-tab-pane>
              <!-- Info Company -->
              <el-tab-pane
                :label="$t('profile.systemInformation.tabLabel')"
                :name="$t('profile.systemInformation.tabLabel')"
              >
                <user-info
                  :show-panel="true"
                />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
      <!-- Logs User -->
      <el-row :gutter="0" style="padding: 0px 10px;margin: 0px;">
        <el-card :body-style="{ padding: '10px 5px' }">
          <div slot="header" class="clearfix">
            <b style="font-size: 18px;">
              <svg-icon icon-class="tree-table" /> {{ $t('profile.activityLogs') }}
            </b>
            <span style="float: right;">
              <el-date-picker
                v-model="filterDate"
                type="date"
                :picker-options="pickerOptions"
              />
            </span>
          </div>
          <user-activity />
        </el-card>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import UserCard from './components/UserCard.vue'
import UserInfo from '@/views/profile/components/InfoUser.vue'
import UserActivity from '@/views/profile/components/UserActivity/index.vue'
import { Settings } from '@/layout/components'

export default {
  name: 'Profile',
  components: {
    UserCard,
    Settings,
    UserInfo,
    UserActivity
  },
  data() {
    return {
      user: {},
      activeTab: 'role',
      filterDate: new Date(),
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ]),
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader,
      showNavar: state => state.settings.showNavar,
      showMenu: state => state.settings.showMenu
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
    currentRole() {
      return this.$store.getters['user/getRole']
    },
    userInfo() {
      return this.$store.getters['user/userInfo']
    },
    organization() {
      return this.$store.getters['user/getOrganization']
    },
    warehouse() {
      return this.$store.getters['user/getWarehouse'] || {
        name: ''
      }
    }
  },
  watch: {
    filterDate(date) {
      this.$store.dispatch('user/loadingActivitylogs', date)
    }
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      this.user = {
        name: this.name,
        role: this.roles.join(' | '),
        email: 'admin@test.com',
        avatar: this.avatar
      }
    }
  }
}
</script>
<style lang="scss">
.class-profile {
  height: 100% !important;
  width: 100% !important;
  overflow: auto;
  display: block !important;
}
</style>
