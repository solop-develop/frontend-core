<template>
  <el-dropdown trigger="click" class="international" @command="handleSetLanguage">
    <div style="margin-right: 5px;margin-left: 4px;">
      <svg-icon class-name="international-icon" icon-class="language" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :disabled="language==='zh'" command="zh">
        中文
      </el-dropdown-item>
      <el-dropdown-item :disabled="language==='en'" command="en">
        English
      </el-dropdown-item>
      <el-dropdown-item :disabled="language==='es'" command="es">
        Español
      </el-dropdown-item>
      <el-dropdown-item :disabled="language==='ja'" command="ja">
        日本語
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

import store from '@/store'
import router from '@/router'

// Utils and Helper Methods
import { showMessage } from '@/utils/ADempiere/notification'

export default defineComponent({
  name: 'SearchCriteria',

  setup(props, { root }) {
    /**
     * Const
     */
    const currentRoute = router.app._route
    /**
    * Computed
    */

    const language = computed(() => {
      return store.getters.language
    })

    /**
     * Methods
     */
    function handleSetLanguage(lang) {
      this.$i18n.locale = lang
      store.dispatch('app/setLanguage', lang)
        .then(response => {
          const { path } = currentRoute
          if (path !== '/login') {
            location.reload()
          }
          showMessage({
            message: 'Switch Language Success',
            type: 'success'
          })
        })
        .catch(error => {
          showMessage({
            message: error.message,
            type: 'error'
          })
        })
    }

    return {
      // Computed
      language,
      // Methods
      handleSetLanguage
    }
  }
})
</script>
