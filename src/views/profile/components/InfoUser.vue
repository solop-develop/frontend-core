<template>
  <el-card v-if="!isMobile" shadow="always">
    <el-col :span="16" style="padding-right:10px;margin-bottom:20px;">
      <h1 style="margin-bottom: 5px;">{{ $t('component.dashboard.header.welcome') }} {{ userInfo.name }}</h1>
      {{ userInfo.description }}
    </el-col>

    <el-col :span="8" style="padding-left: 2.5px;padding-right: 2.5px;margin-bottom: 15px;">
      <br>
      <b>{{ $t('component.dashboard.header.role') }}: </b> {{ currentRole.name }} <br>
      <b>{{ $t('component.dashboard.header.client') }}: </b> {{ currentRole.clientName }} <br>
      <b>{{ $t('component.dashboard.header.organization') }}: </b> {{ organization.name }} <br>
      <b>{{ $t('component.dashboard.header.warehouse') }}: </b> {{ warehouse.name }} <br>
      <br>
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
          <br>
          <b>{{ $t('component.dashboard.header.role') }}: </b> {{ currentRole.name }} <br>
          <b>{{ $t('component.dashboard.header.client') }}: </b> {{ currentRole.clientName }} <br>
          <b>{{ $t('component.dashboard.header.organization') }}: </b> {{ organization.name }} <br>
          <b>{{ $t('component.dashboard.header.warehouse') }}: </b> {{ warehouse.name }} <br>
          <br>
        </el-col>
      </el-card>
    </el-col>
  </el-card>
</template>

<script>
import store from '@/store'
import { defineComponent, computed } from '@vue/composition-api'

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

    return {
      // computeds
      organization,
      currentRole,
      warehouse,
      userInfo,
      isMobile
    }
  }
})
</script>
