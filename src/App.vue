<template>
  <div id="app">
    <modal-idle
      v-if="isSession && isIdle"
      :is-idle="isIdle"
    />
    <router-view />
  </div>
</template>

<script>
// components and mixins
import ModalIdle from '@/components/ADempiere/ModalIdle'
// Utils and Helper Methods
import { getResourcePath } from '@/utils/ADempiere/resource'
// Constants
import { config } from '@/utils/ADempiere/config'

export default {
  name: 'App',
  components: { ModalIdle },
  computed: {
    isIdle() {
      return this.$store.state.idleVue.isIdle
    },
    isSession() {
      return this.$store.getters['user/getIsSession']
    },
    getRole() {
      return this.$store.getters['user/getRole']
    },
    getResourceName() {
      if (this.isEmptyValue(this.getRole) && this.isEmptyValue(this.getRole.client)) return ''
      return this.$store.getters['user/getRole'].client.logo
    }
  },
  watch: {
    getResourceName(value) {
      this.loadImage()
    }
  },
  async mounted() {
    const { client } = this.getRole
    if (!this.isEmptyValue(client) && !this.isEmptyValue(client.logo)) {
      const fileName = await getResourcePath({
        clientId: client.id,
        containerId: '109',
        containerType: 'window',
        columnName: 'Logo_ID',
        recordId: client.id,
        tableName: 'AD_ClientInfo',
        resourceName: client.logo
      })
      const link = document.createElement('link')
      link.rel = 'shortcut icon'
      link.type = 'image/x-icon'
      link.href = config.adempiere.resource.url + fileName
      document.head.appendChild(link)
    }

    this.$nextTick(() => {
      window.addEventListener('resize', this.getWindowWidth)
      window.addEventListener('resize', this.getWindowHeight)

      this.getWindowWidth()
      this.getWindowHeight()
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.getWindowWidth)
    window.removeEventListener('resize', this.getWindowHeight)
  },
  methods: {
    async loadImage() {
      const { client } = this.getRole
      if (client.logo) {
        const fileName = await getResourcePath({
          clientId: client.id,
          containerId: '109',
          containerType: 'window',
          columnName: 'Logo_ID',
          recordId: client.id,
          tableName: 'AD_ClientInfo',
          resourceName: client.logo
        })
        const link = document.createElement('link')
        link.rel = 'shortcut icon'
        link.type = 'image/x-icon'
        link.href = config.adempiere.resource.url + fileName
        document.head.appendChild(link)
      }
    },
    getWindowWidth(event) {
      this.$store.dispatch('setWidth', document.documentElement.clientWidth)
    },
    getWindowHeight(event) {
      this.$store.dispatch('setHeight', document.documentElement.clientHeight)
    }
  }
}
</script>
