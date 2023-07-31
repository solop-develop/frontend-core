<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="8" :xs="24">
          <user-card :user="user" />
        </el-col>

        <el-col :span="16" :xs="24">
          <el-card shadow="always">
            <el-col :span="16" style="padding-right:10px;margin-bottom:20px;">
              <h1 style="margin-bottom: 5px;">{{ $t('component.dashboard.header.welcome') }} {{ userInfo.name }}</h1>
              {{ userInfo.description }}
            </el-col>

            <el-col :span="8">
              <br>
              <b>{{ $t('component.dashboard.header.role') }}: </b> {{ currentRole.name }} <br>
              <b>{{ $t('component.dashboard.header.client') }}: </b> {{ currentRole.clientName }} <br>
              <b>{{ $t('component.dashboard.header.organization') }}: </b> {{ organization.name }} <br>
              <b>{{ $t('component.dashboard.header.warehouse') }}: </b> {{ warehouse.name }} <br>
              <br>
            </el-col>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import UserCard from './components/UserCard'

export default {
  name: 'Profile',
  components: {
    UserCard
  },
  data() {
    return {
      user: {},
      activeTab: 'role'
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
