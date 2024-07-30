<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
  Contributor(s): Elsio Sanchez elsiosanches@gmail.com https://github.com/elsiosanchez
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
  <el-container
    v-if="!isLoading"
    style="margin-left: 15px; margin-right: 20px;height: 89vh;"
  >
    <el-main>
      <el-card class="box-card">
        <el-row
          slot="header"
          class="attachment-panel"
          :gutter="20"
        >
          <el-col :span="12">
            <upload-resource
              style="float: left;"
              :table-name="tableName"
              :record-id="recordId"
              :record-uuid="recordUuid"
              :container-manager="containerManager"
              :container-uuid="containerUuid"
              :parent-uuid="parentUuid"
            />
          </el-col>

          <el-col :span="8" style="float: right; text-align: end;">
            <el-button
              v-if="isList"
              plain
              style="color: black;"
              @click="isList = !isList"
            >
              <i class="el-icon-menu" />
              {{ $t('component.attachment.toggleView') }}
            </el-button>
            <el-button
              v-else
              plain
              style="color: black;"
              @click="isList = !isList"
            >
              <svg-icon icon-class="list" />
              {{ $t('component.attachment.toggleView') }}
            </el-button>
          </el-col>
        </el-row>

        <!-- Mosaic View -->
        <el-row v-if="!isList" :gutter="20">
          <el-col v-for="(file, key) in attachmentList" :key="key" :span="8" style="height: 380px;">
            <el-card shadow="hover" :class="{ 'image-attachment': true, 'is-current': isCurrent(file) }">
              <div v-if="isSelectable" slot="header" class="clearfix" style="margin-top: 16px; margin-bottom: 16px;">
                <el-radio
                  v-model="resourceReference"
                  :label="file.fullName"
                  @click="resourceReference = file.fullName"
                >
                  {{ file.name }}
                </el-radio>
              </div>
              <p
                v-else
                style="font-size: 14px;text-align: center;box-sizing: border-box;overflow: hidden;text-overflow: ellipsis;white-space: normal;word-break: break-all;"
              >
                {{ file.name }}
              </p>
              <p style="width: 100%;text-align: center;margin: 0px;">
                <el-image
                  class="image-card-attachment"
                  :src="file.src"
                  fit="contain"
                  :preview-src-list="previewList"
                  style="padding-left: 0px;padding-right: 0px;border: 1px solid rgba(184, 186, 188, 0.64);width: 150px;height: 200px;"
                />
              </p>
              <!-- Buttons -->
              <div style="text-align: center;padding: 10px 5px;">
                <el-popover
                  placement="bottom"
                  trigger="click"
                  class="class-group-botton-option"
                >
                  <el-descriptions class="margin-top" :column="1" border>
                    <el-descriptions-item :label="$t('component.attachment.fileName')">
                      {{ file.name }}
                    </el-descriptions-item>
                    <el-descriptions-item :label="$t('component.attachment.fileSize')">
                      {{ formatFileSize(file.size) }}
                    </el-descriptions-item>
                    <el-descriptions-item :label="$t('component.attachment.fileFormat')">
                      {{ file.content_type }}
                    </el-descriptions-item>
                  </el-descriptions>
                  <el-button
                    slot="reference"
                    icon="el-icon-info"
                    plain
                  />
                </el-popover>
                <!-- <el-popover
                  :value="isShowMessage"
                  placement="bottom"
                  trigger="click"
                  class="class-group-botton-option"
                >
                  <el-form
                    label-position="top"
                    class="form-min-label"
                  >
                    <el-form-item
                      :label="$t('component.attachment.addDescription')"
                    >
                      <el-input
                        v-model="addDescription"
                        maxlength="255"
                        show-word-limit
                      />
                    </el-form-item>
                    <el-form-item
                      :label="$t('component.attachment.addMessage')"
                    >
                      <el-input
                        v-model="addMessage"
                        type="textarea"
                        maxlength="2000"
                        show-word-limit
                      />
                    </el-form-item>
                  </el-form>

                  <p style="text-align: end;">
                    <el-button
                      plain
                      type="info"
                      class="button-base-icon"
                      style="font-size: 25px;"
                      @click="cleanMessage()"
                    >
                      <svg-icon icon-class="layers-clear" />
                    </el-button>
                    <el-button
                      type="danger"
                      class="button-base-icon"
                      icon="el-icon-close"
                      @click="closeMessage(file)"
                    />
                    <el-button
                      type="primary"
                      class="button-base-icon"
                      icon="el-icon-check"
                      @click="sendMessage(file)"
                    />
                  </p>
                  <el-button
                    slot="reference"
                    icon="el-icon-chat-line-square"
                    plain
                    @click="openMessage(file)"
                  />
                </el-popover> -->
                <file-share
                  :image-id="file.id"
                  :resource-name="file.file_name"
                  :file="file"
                  :file-name="file.name"
                  :file-url="file.fullName"
                  class="class-group-botton-option"
                />
                <el-button
                  plain
                  icon="el-icon-delete"
                  class="class-group-botton-option"
                  style="padding-left: 10px !important;padding-right: 10px !important;"
                  @click="handleRemove(file)"
                />
                <el-button
                  class="class-group-botton-option"
                  style="padding-left: 10px !important;padding-right: 10px !important;color: black;font-weight: bold;"
                  plain
                  @click="handleDownload(file)"
                >
                  <svg-icon
                    icon-class="cloud_download"
                  />
                </el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <!-- List View -->
        <list-view v-else :is-selectable="isSelectable" />
      </el-card>

      <div v-if="isEmptyValue(attachmentList)">
        <el-empty />
      </div>
    </el-main>
  </el-container>

  <loading-view
    v-else
    key="Attachment-Manager-Loading"
  />
</template>

<script src="./attachment.js" />

<!-- <style lang="scss" scoped src="./attchment.scss" /> -->
<style lang="scss">
.attachment-panel {
  padding: 0px !important;
}
.class-group-botton-option {
  font-size: 20px !important;
  padding-top: 5px !important;
  padding-bottom: 5px !important;
  padding-left: 5px !important;
  padding-right: 5px !important;
  .el-button--medium {
    font-size: 20px !important;
    padding-top: 5px !important;
    padding-bottom: 5px !important;
    padding-left: 10px !important;
    padding-right: 10px !important;
  }
}
</style>
