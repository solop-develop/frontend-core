<template>
  <div style="margin-left: -10px; display: flex; align-items: center;">
    <el-button
      plain
      size="mini"
      type="primary"
      class="custom-button"
      :disabled="isLoadingReport"
      @click="viewShowDialog"
    >
      {{ $t('report.reportEnginer.share') }}
    </el-button>
  </div>
</template>
<script>
import store from '@/store'
import language from '@/lang'

import { defineComponent, computed } from '@vue/composition-api'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
export default defineComponent({
  name: 'downloadButtom',

  props: {
    containerUuid: {
      type: String,
      required: false
    },
    reportOutput: {
      type: Object,
      required: true
    },
    containerManager: {
      type: Object,
      required: false
    },
    isLoadingReport: {
      type: Boolean,
      required: true
    }
  },
  setup() {
    const storedMailTemplatesList = computed(() => {
      return store.getters.getListMailTemplates
    })
    function viewShowDialog() {
      let menuDefault = ''
      if (!isEmptyValue(storedMailTemplatesList.value) && !isEmptyValue(storedMailTemplatesList.value.menus)) {
        menuDefault = storedMailTemplatesList.value.menus[0].mail_text
      }
      const link = language.t('report.reportEnginer.urlPublic')
      store.commit('setDefaultBody', menuDefault + `\n\n\n[${link}](www.123892138.com)`)
      store.commit('setShowDialog', true)
    }
    return {
      storedMailTemplatesList,
      viewShowDialog
    }
  }
})

</script>
