<template>
  <el-card shadow="hover" style="padding: 0px !important;">
    <el-descriptions v-if="!isEmptyValue(listParameters)" title="Parametros" :column="1" style="margin-top: 5px">
      <template
        v-for="(params, key) in listParameters"
      >
        <el-descriptions-item
          :key="key"
          :label="params.columnName"
          label-style="{ color: #606266; font-weight: bold; }"
        >
          <span style="color: #606266; font-weight: bold;">
            {{ params.value }}
          </span>
        </el-descriptions-item>
      </template>
    </el-descriptions>
    <el-descriptions
      v-if="!isEmptyValue(listLogs)"
      title="Logs"
      :column="1"
      style="margin-top: 5px"
    >
      <template
        v-for="(activity, key) in listLogs"
      >
        <el-descriptions-item
          :key="key"
          :label="activity.id"
          label-style="{ color: #606266; font-weight: bold; }"
        >
          <span style="color: #606266; font-weight: bold;">
            {{ activity.log }}
          </span>
        </el-descriptions-item>
      </template>
    </el-descriptions>
    <el-descriptions :title="$t('page.processActivity.logs')">
      <el-descriptions-item :label="$t('page.processActivity.logs')">
        {{ summary }}
      </el-descriptions-item>
    </el-descriptions>
  </el-card>
</template>

<script>
import {
  defineComponent
} from '@vue/composition-api'

export default defineComponent({
  name: 'ProcessLogs',
  props: {
    listParameters: {
      type: Array,
      default: []
    },
    listLogs: {
      type: Array,
      default: []
    },
    summary: {
      type: String,
      default: ''
    },
    status: {
      type: Boolean,
      default: false
    }
  }
})
</script>
