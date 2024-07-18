<template>
  <el-row :gutter="12">
    <el-col :span="18" style="width: 100%;">
      <el-descriptions :column="3" :label-style="{'font-weight': 'bold'}" class="contentModalReport">
        <el-descriptions-item :label="$t('report.reportEnginer.max')" class="small-text">
          <span :style="{ 'color': data.maximum_value.display_value < 0? 'red' : '' }">
            {{ data.maximum_value.display_value }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item :label="$t('report.reportEnginer.summation')" class="small-text">
          <span :style="{ 'color': data.sum_value.display_value < 0? 'red' : '' }">
            {{ data.sum_value.display_value }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item :label="$t('report.reportEnginer.standardDeviation')" class="small-text">
          <span :style="{ 'color': data.deviation_value.display_value < 0? 'red' : '' }">
            {{ data.deviation_value.display_value }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item :label="$t('report.reportEnginer.average')" class="small-text">
          <span :style="{ 'color': data.mean_value.display_value < 0? 'red' : '' }">
            {{ data.mean_value.display_value }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item :label="$t('report.reportEnginer.Count')" class="small-text">
          <span :style="{ 'color': data.count_value.display_value < 0? 'red' : '' }">
            {{ data.count_value.display_value }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item :label="$t('report.reportEnginer.variance')" class="small-text">
          <span :style="{ 'color': data.variance_value.display_value < 0? 'red' : '' }">
            {{ data.variance_value.display_value }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item :label="$t('report.reportEnginer.min')" class="small-text">
          <span :style="{ 'color': data.minimum_value.display_value < 0? 'red' : '' }">
            {{ data.minimum_value.display_value }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item class="small-text" />
      </el-descriptions>
    </el-col>
  </el-row>
</template>
<script>
import { defineComponent } from '@vue/composition-api'
export default defineComponent({
  name: 'InfoReport',
  props: {
    data: {
      type: Object,
      required: true
    }
  }
})
</script>
