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
  <div style="height: 100%;">
    <div v-if="isLoadedMetadata" class="panel-forms">
      <div :class="classTitle">
        <title-and-help
          v-if="isShowTitleForm && !isVisibleShowButton"
          :name="formName"
          :help="formMetadata.help"
        >
          <el-button
            type="text"
            style="float: right; z-index: 5"
            :circle="true"
            icon="el-icon-arrow-up"
            @click="changeDisplatedTitle"
          />
        </title-and-help>
        <el-button
          v-if="!isShowTitleForm && !isVisibleShowButton"
          type="text"
          style="position: absolute; right: 10px;z-index: 5;"
          :circle="true"
          icon="el-icon-arrow-down"
          @click="changeDisplatedTitle"
        />
      </div>
      <div class="panel">
        <form-defintion
          :metadata="{
            ...formMetadata,
            fileName: formFileName,
            title: formName
          }"
        />
      </div>
    </div>

    <loading-view
      v-else
      key="form-loading"
    />
  </div>
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'

import router from '@/router'
import store from '@/store'

// Components and Mixins
import FormDefintion from '@/components/ADempiere/FormDefinition'
import LoadingView from '@/components/ADempiere/LoadingView/index.vue'
import TitleAndHelp from '@/components/ADempiere/TitleAndHelp'

// Utils and Helper Methods
import { isEmptyValue, getValidInteger } from '@/utils/ADempiere'

export default defineComponent({
  name: 'FormView',

  components: {
    FormDefintion,
    LoadingView,
    TitleAndHelp
  },

  setup() {
    const currentRoute = router.app._route

    const isLoadedMetadata = ref(false)
    const formMetadata = ref({
      id: -1,
      uuid: '',
      name: '',
      description: '',
      help: '',
      access_level: 0,
      file_name: '',
      isActive: false
    })

    const formId = getValidInteger(currentRoute.meta.id, true)
    const formUuid = currentRoute.meta.uuid

    const storedForm = computed(() => {
      return store.getters.getStoredForm(formUuid)
    })

    const formName = computed(() => {
      if (!isEmptyValue(formMetadata.value) && !isEmptyValue(formMetadata.value.name)) {
        return formMetadata.value.name
      }
      return currentRoute.meta.title
    })

    const formFileName = computed(() => {
      if (!isEmptyValue(formMetadata.value) && !isEmptyValue(formMetadata.value.file_name)) {
        return formMetadata.value.file_name
      }
      if (!isEmptyValue(currentRoute.meta.fileName)) {
        return currentRoute.meta.fileName
      }
      return currentRoute.meta.title
    })

    const isVisibleShowButton = computed(() => {
      return store.state.app.device === 'mobile'
    })

    const isShowTitleForm = computed(() => {
      return store.getters.getIsShowTitleForm
    })

    const styleHeight = computed(() => {
      // if (formFileName.value === 'WFActivity') {
      //   return 'height: 90vh;overflow: auto;'
      // }
      return 'height: 100% !important;overflow: auto;'
    })

    const classTitle = computed(() => {
      if (isShowTitleForm.value && !isVisibleShowButton.value) return 'title-form'
      return 'title-form-hidden'
    })

    function changeDisplatedTitle() {
      store.commit('changeShowTitleForm', !isShowTitleForm.value)
    }

    function getForm() {
      const panel = storedForm.value
      if (!isEmptyValue(panel)) {
        formMetadata.value = panel
        isLoadedMetadata.value = true
      } else {
        if (formId <= 0) {
          isLoadedMetadata.value = true
          return
        }
        store.dispatch('getFormFromServer', {
          id: formId,
          routeToDelete: currentRoute
        })
          .then(responseForm => {
            formMetadata.value = responseForm
          })
          .finally(() => {
            isLoadedMetadata.value = true
          })
      }
    }

    getForm()

    return {
      isLoadedMetadata,
      formId,
      formMetadata,
      // Computeds
      formFileName,
      formName,
      isShowTitleForm,
      classTitle,
      isVisibleShowButton,
      styleHeight,
      // Methods
      changeDisplatedTitle
    }
  }
})
</script>

<style lang="scss">
.form-view {
  .form-loaded {
    height: inherit;
  }
  .el-card__body {
    padding-top: 0px !important;
    padding-right: 0px !important;
    padding-bottom: 2px !important;
    padding-left: 0px !important;
    /* height: 100%!important; */
  }
}
.panel-forms {
  height: 100%;
  .title-form {
    height: 5%;
  }
  .title-form-hidden {
    height: 2%;
  }
  .panel {
    height: 95%;
  }
}
</style>

<style lang="scss" scoped>
  .content-collapse {
    /* height: 100%!important; */
    display: contents;
    .el-card{
      .el-card__body{
         height: 100%;
      }
    }
  }
</style>
