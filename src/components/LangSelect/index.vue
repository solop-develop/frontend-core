<template>
  <el-dropdown
    trigger="click"
  >
    <span class="el-dropdown-link">
      <svg-icon class-name="international-icon" icon-class="language" />
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-for="(language, key) in list"
        :key="key"
      >
        <el-dropdown
          @command="handleSetLanguage"
        >
          <span class="el-dropdown-link">
            {{ language.language_name }}
            <i
              class="el-icon-arrow-down el-icon--right"
            />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(languageChild, index) in language.childs"
              :key="index"
              :command="languageChild"
              :disabled="languageChild.language === currentLanguage"
            >
              {{ languageChild.language_name }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

import store from '@/store'
import router from '@/router'
// Constants
import {
  DEFAULT_LANGUAGE_LIST
} from '@/utils/ADempiere/dictionary/language.ts'

// Utils and Helper Methods
import { showMessage } from '@/utils/ADempiere/notification'
import { isEmptyValue } from '@/utils/ADempiere'

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

    const currentLanguage = computed(() => {
      return store.getters.getCurrentLanguage
    })

    const languageAll = computed(() => {
      return store.getters.getLanguages
    })

    const list = computed(() => {
      const groupedLanguages = languageAll.value.reduce((acc, lang) => {
        const languageCode = lang.language_iso
        if (!acc[languageCode]) {
          acc[languageCode] = []
        }
        acc[languageCode].push(lang)
        return acc
      }, {})

      const result = Object.entries(groupedLanguages).map(([languageCode, languages]) => ({
        ...displayLanguage(languageCode),
        childs: languages
      }))
      return result
    })

    /**
     * Methods
     */
    function handleSetLanguage(lang) {
      this.$i18n.locale = lang.language_iso
      store.dispatch('app/setLanguage', lang.language)
        .then(() => {
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

    function load() {
      store.dispatch('requestLanguagesLoaded')
    }

    function displayLanguage(lang) {
      if (isEmptyValue(lang) && isEmptyValue(DEFAULT_LANGUAGE_LIST)) return lang
      const langs = DEFAULT_LANGUAGE_LIST.find(item => {
        if (item.language_iso === lang) {
          return item
        }
      })
      return langs || {
        language_iso: lang,
        label: lang
      }
    }

    load()

    return {
      // Computed
      list,
      languageAll,
      currentLanguage,
      // Methods
      load,
      handleSetLanguage
    }
  }
})
</script>
