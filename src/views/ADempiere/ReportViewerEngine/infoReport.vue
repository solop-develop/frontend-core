<template>
  <el-row :gutter="12">
    <el-col :span="18">
      <el-descriptions :column="3" :label-style="{'font-weight': 'bold'}">
        <el-descriptions-item label="Valor Máximo">
          <span :style="{ 'color': data.maximum_value.value < 0? 'red' : '' }">
            {{ data.maximum_value.value }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="Valor">
          <span :style="{ 'color': data.value.value < 0? 'red' : '' }">
            {{ data.value.value }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="Valor Desviado">
          <span :style="{ 'color': data.deviation_value.value < 0? 'red' : '' }">
            {{ data.deviation_value.value }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="Valor Medio">
          <span :style="{ 'color': data.mean_value.value < 0? 'red' : '' }">
            {{ data.mean_value.value }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="Valor de Suma">
          <span :style="{ 'color': data.sum_value.value < 0? 'red' : '' }">
            {{ data.sum_value.value }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="Valor de Cuenta">
          <span :style="{ 'color': data.count_value.value < 0? 'red' : '' }">
            {{ data.count_value.value }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="Valor Minimo">
          <span :style="{ 'color': data.minimum_value.value < 0? 'red' : '' }">
            {{ data.minimum_value.value }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="Valor de Varianza">
          <span :style="{ 'color': data.variance_value.value < 0? 'red' : '' }">
            {{ data.variance_value.value }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="Valor de Visualización">
          <span :style="{ 'color': data.display_value.value < 0? 'red' : '' }">
            {{ data.display_value.value }}
          </span>
        </el-descriptions-item>
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

<style lang="scss" scoped>
.el-descriptions-item__content {
  margin-left: auto !important;
  margin-right: auto !important;

}
</style>
<style>
.el-descriptions-item__container .el-descriptions-item__content {
  justify-content: end;
}

</style>
