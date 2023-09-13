<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Elsio Sanchez elsiosanches@gmail.com www.erpya.com
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.
 You should have received a copy of the GNU General Public License
 along with this program. If not, see <https:www.gnu.org/licenses/>.
-->

<template>
  <el-skeleton :loading="isLoading" animated>
    <template slot="template">
      <el-skeleton-item
        style="width: 140px; height: 140px;"
        variant="image"
      />
    </template>

    <template>
      <el-card :body-style="{ padding: '0px', marginBottom: '1px' }">
        <el-carousel v-if="listImage.length > 1" trigger="click" height="150px">
          <template>
            <el-carousel-item v-for="item in listImage.length" :key="item">
              <el-image
                :src="getImageFromSource(listImage[item - 1])"
                class="image"
                :preview-src-list="listImageProduct"
                style="width: 140px;height: 140px;display: contents;"
              >
                <div slot="error" class="image-slot">
                  <el-skeleton :loading="true" animated>
                    <template slot="template">
                      <el-skeleton-item
                        variant="image"
                        style="width: auto; height: 140px;"
                      />
                    </template>
                  </el-skeleton>
                </div>
              </el-image>
            </el-carousel-item>
          </template>
        </el-carousel>

        <template v-else-if="listImage.length === 1">
          <el-image
            :src="getImageFromSource(listImage[0])"
            class="image"
            :preview-src-list="listImageProduct"
            style="width: 140px;height: 140px;display: contents;"
          >
            <div slot="error" class="image-slot">
              <el-skeleton :loading="true" animated>
                <template slot="template">
                  <el-skeleton-item
                    variant="image"
                    style="width: auto; height: 140px;"
                  />
                </template>
              </el-skeleton>
            </div>
          </el-image>
        </template>

        <el-image
          v-else
          :src="imageNotAvailable"
          class="image"
          style="width: 140px;height: 140px;display: contents;"
        />
      </el-card>
    </template>
  </el-skeleton>
</template>

<script>
// API Request Methods
import { requestAttachment } from '@/api/ADempiere/user-interface/component/resource'

// Utils and Helper Methods
import { getImagePath } from '@/utils/ADempiere/resource.js'

export default {
  name: 'ImageProduct',

  props: {
    stepReference: {
      type: String,
      default: 'carousel'
    },
    steps: {
      type: Array,
      default: () => []
    },
    indicator: {
      type: Number,
      default: 0
    },
    show: {
      type: Boolean,
      default: false
    },
    metadataLine: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      isLoading: true,
      listImage: []
    }
  },

  computed: {
    product() {
      return this.$store.state['pointOfSales/orderLine/index'].line.product
    },
    imageNotAvailable() {
      return require('@/image/ADempiere/priceChecking/no-image.jpg')
    },
    listImageProduct() {
      if (this.isEmptyValue(this.listImage)) return []
      return this.listImage.map(product => this.getImageFromSource(product))
    }
  },
  watch: {
    indicator(value) {
      this.$refs[this.stepReference].activeIndex = value
    },
    show(value) {
      if (value && !this.isEmptyValue(this.metadataLine) && this.metadataLine.uuid === this.$store.state['pointOfSales/orderLine/index'].line.uuid) {
        this.getListImageProduct(this.metadataLine)
      }
    },
    product(value) {
      if (this.show && !this.isEmptyValue(this.metadataLine) && this.metadataLine.uuid === this.$store.state['pointOfSales/orderLine/index'].line.uuid) {
        this.getListImageProduct(this.metadataLine)
      }
    }
  },

  methods: {
    getListImageProduct(line) {
      this.isLoading = true
      this.listImage = []

      requestAttachment({
        tableName: 'M_Product',
        recordId: line.product.id,
        recordUuid: line.product.uuid
      })
        .then(response => {
          if (!this.isEmptyValue(response.resourceReferencesList)) {
            this.listImage = response.resourceReferencesList
          }
        })
        .finally(() => {
          this.isLoading = false
        })
    },

    getImageFromSource(file) {
      const image = getImagePath({
        file: file.file_name,
        width: 300,
        height: 300
      })
      return image.uri
    }
  }
}
</script>

<style>
.el-carousel__container {
  position: relative;
  height: 100%;
}
</style>
