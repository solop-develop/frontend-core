<template>
  <el-card shadow="hover" style="padding: 0px !important;">
    <el-descriptions
      v-if="!isEmptyValue(listChangeLogs)"
      :column="1"
      style="margin-top: 5px"
    >
      <template
        v-for="(changeLog, key) in listChangeLogs"
      >
        <el-descriptions-item
          :key="key"
          :label="$t('window.containerInfo.log.field')"
          label-style="{ color: #606266; font-weight: bold; }"
        >
          <span style="color: #606266; font-weight: bold;">
            {{ changeLog.display_column_name }}
          </span>
        </el-descriptions-item>

        <el-descriptions-item
          :key="key"
          :label="$t('window.containerInfo.log.recordID')"
          label-style="{ color: #606266; font-weight: bold; }"
        >
          <span style="color: #606266; font-weight: bold;">
            {{ recordId }}
          </span>
        </el-descriptions-item>

        <el-descriptions-item
          :key="key"
          :label="$t('window.containerInfo.log.newValue')"
          label-style="{ color: #606266; font-weight: bold; }"
        >
          <document-status-tag
            v-if="isDocument(changeLog)"
            :value="changeLog.new_value"
            :displayed-value="changeLog.new_display_value"
          />
          <el-link v-else type="success">
            {{ changeLog.new_display_value }}
          </el-link>
        </el-descriptions-item>

        <el-descriptions-item
          :key="key"
          :label="$t('window.containerInfo.log.oldValue')"
          label-style="{ color: #606266; font-weight: bold; }"
        >
          <document-status-tag
            v-if="isDocument(changeLog)"
            :value="changeLog.old_value"
            :displayed-value="changeLog.old_display_value"
          />
          <strike v-else>
            <el-link
              type="danger"
            >
              {{ changeLog.old_display_value }}
            </el-link>
          </strike>
        </el-descriptions-item>
        <el-descriptions-item
          :key="key"
          :label="$t('window.containerInfo.log.column')"
          label-style="{ color: #606266; font-weight: bold; }"
        >
          <span style="color: #606266; font-weight: bold;">
            {{ changeLog.column_name }}
          </span>
        </el-descriptions-item>
      </template>
    </el-descriptions>
  </el-card>
</template>

<script>
import {
  defineComponent,
  computed
} from '@vue/composition-api'

import { isDocumentStatus } from '@/utils/ADempiere/constants/systemColumns'
import DocumentStatusTag from '@/components/ADempiere/ContainerOptions/DocumentStatusTag/index.vue'

export default defineComponent({
  name: 'WindowsLogs',
  components: { DocumentStatusTag },
  props: {
    listChangeLogs: {
      type: Array,
      requiere: true
    },
    entityLogs: {
      type: Object,
      default: {}
    }
  },
  setup(props) {
    const recordId = computed(() => {
      const { recordId } = props.entityLogs
      return recordId
    })

    function isDocument(changeLog) {
      return Boolean(isDocumentStatus({ columnName: changeLog.column_name }))
    }

    return {
      isDocument,
      recordId
    }
  }
})
</script>
