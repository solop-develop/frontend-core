<template>
  <el-dialog
    :title="$t('report.dialogLegacy.displayOptions')"
    top="2vh"
    :visible.sync="showDialog"
    @close="viewShowDialog"
  >
    <el-row :gutter="12">
      <el-col :span="24">
        <el-card>
          <el-row :gutter="12">
            <el-col :span="12" style="width: 50%; text-align: center;">
              <el-radio
                v-model="check"
                :label="0"
                label-position="left"
                style="font-size: 18px; padding-bottom: 2%"
              >
                {{ $t('report.dialogLegacy.showReport') }}
                <i class="el-icon-view" />
              </el-radio>
            </el-col>
            <el-col :span="12" style="width: 50%; text-align: center;">
              <el-radio
                v-model="check"
                :label="1"
                label-position="left"
                style="font-size: 18px; padding-right: 1%; padding-bottom: 2%"
              >
                {{ $t('report.dialogLegacy.downloadFiles') }}
                <svg-icon
                  icon-class="cloud_download"
                />
              </el-radio>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col style="margin-top: 1%">
        <el-button
          class="button-base-icon"
          icon="el-icon-check"
          style="float: right;"
          type="primary"
          :disabled="isLoading"
          @click="printProcess()"
        />
        <el-button
          class="button-base-icon"
          icon="el-icon-close"
          style="float: right; margin-right: 1%;"
          type="danger"
          :disabled="isLoading"
          @click="viewShowDialog()"
        />
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import store from '@/store'
import { defineComponent, computed, ref } from '@vue/composition-api'
import { showNotification } from '@/utils/ADempiere/notification.js'

export default defineComponent({
  name: 'dialogLegacy',
  props: {
    tableName: {
      type: String,
      required: false
    },
    process: {
      type: Object,
      required: true
    },
    recordId: {
      type: Number,
      required: false
    },
    containerUuid: {
      type: String,
      required: false
    }
  },
  setup(props, { root }) {
    const isLoading = computed(() => {
      return store.getters.getIsLoadingDialog
    })
    const check = ref(0)
    const ids = ref([])
    //
    const showDialog = computed(() => {
      return store.getters.getViewDialog
    })
    const selectionsList = computed(() => {
      return store.getters.getTabSelectionsList({
        containerUuid: props.containerUuid
      })
    })
    //
    function viewShowDialog() {
      store.commit('setViewDialog', false)
    }
    function printProcess() {
      selectionsList.value.forEach(e => {
        const id = e[`${props.tableName}_ID`]
        if (!ids.value.includes(id)) {
          ids.value.push(id)
        }
      })
      showNotification({
        title: this.$t('notifications.processing'),
        message: props.tableName,
        type: 'info'
      })
      store.commit('setIsLoadingDialog', true)
      store.dispatch('printBarch', {
        tableName: props.tableName,
        reportId: props.process.internal_id,
        ids: ids.value,
        checkValue: check.value,
        containerUuid: props.containerUuid,
        reportUuid: root.$route.meta.action_uuid
      })
        .finally(() => {
          viewShowDialog()
          store.commit('setIsLoadingDialog', false)
        })
    }
    return {
      showDialog,
      isLoading,
      check,
      selectionsList,
      //
      viewShowDialog,
      printProcess
    }
  }
})

</script>
