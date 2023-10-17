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
  <div>
    <el-container
      v-if="isLoadedMetadata"
      key="form-loaded"
    >
      <el-main style="padding: 0px !important;">
        <el-row>
          <el-col :span="24">
            <el-card
              class="content-collapse"
            >
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
              <div style="height: 100%">
                <form-panel
                  :metadata="{
                    ...formMetadata,
                    fileName: formFileName,
                    title: formName
                  }"
                />
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>

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
import FormPanel from '@/components/ADempiere/Form'
import LoadingView from '@/components/ADempiere/LoadingView/index.vue'
import TitleAndHelp from '@/components/ADempiere/TitleAndHelp'

// Utils and Helper Methods
import { isEmptyValue, getValidInteger } from '@/utils/ADempiere'

export default defineComponent({
  name: 'FormView',

  components: {
    FormPanel,
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
      isVisibleShowButton,
      // Methods
      changeDisplatedTitle
    }
  }
})
</script>

<style>
  .el-card__body {
    padding-top: 0px !important;
    padding-right: 0px !important;
    padding-bottom: 2px !important;
    padding-left: 0px !important;
    /* height: 100%!important; */
  }
</style>
