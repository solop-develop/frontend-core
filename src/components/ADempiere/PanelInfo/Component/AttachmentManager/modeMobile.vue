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
    style="margin-left: 15px;margin-right: 15px;margin-bottom: 10%;height: -webkit-fill-available;overflow-x: hidden;overflow-y: auto;"
  >
    <el-main>
      <div v-if="isEmptyValue(attachmentList)">
        <el-empty />
      </div>

      <el-row style="margin-left: 0px; margin-right: 0px; margin-bottom: 10px;">
        <el-col :span="12">
          <upload-resource
            style="float: left;"
            :table-name="tableName"
            :record-id="recordId"
            :record-uuid="recordUuid"
          />
        </el-col>

        <el-col :span="8" style="float: right; text-align: end;padding: 0px;">
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
          </el-button>
        </el-col>
      </el-row>

      <!-- Mosaic View -->
      <el-row v-if="!isList" :gutter="20">
        <el-col v-for="(file, key) in attachmentList" :key="key" :span="24">
          <el-card shadow="hover" :class="{ 'image-attachment': true, 'is-current': isCurrent(file) }">
            <div v-if="isSelectable" slot="header" class="clearfix" style="margin-top: 16px; margin-bottom: 16px;">
              <el-radio
                v-model="resourceReference.id"
                :label="file.id"
                @click="resourceReference = file"
              >
                {{ file.name }}
              </el-radio>
            </div>
            <p
              v-else
              style="font-size: 14px;box-sizing: border-box;overflow: hidden;text-overflow: ellipsis;white-space: normal;word-break: break-all;"
            >
              {{ file.name }}
            </p>

            <el-image
              class="image-card-attachment"
              :src="file.src"
              fit="contain"
              :preview-src-list="previewList"
              style="padding-left: 0px;padding-right: 0px;border: 1px solid rgba(184, 186, 188, 0.64);width: 200px;height: 200px;"
            />
            <!-- Buttons -->
            <p style="text-align: center;">
              <el-button-group>
                <el-popover
                  :value="isShowMessage"
                  placement="bottom"
                  trigger="click"
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
                </el-popover>
                <el-popover
                  placement="bottom"
                  trigger="click"
                >
                  <el-descriptions class="margin-top" :column="1" border>
                    <el-descriptions-item :label="$t('component.attachment.fileName')">
                      {{ file.name }}
                    </el-descriptions-item>
                    <el-descriptions-item :label="$t('component.attachment.fileSize')">
                      {{ formatFileSize(file.file_size) }}
                    </el-descriptions-item>
                    <el-descriptions-item :label="$t('component.attachment.fileFormat')">
                      {{ file.content_type }}
                    </el-descriptions-item>
                    <el-descriptions-item :label="$t('component.attachment.description')">
                      {{ file.description }}
                    </el-descriptions-item>
                    <el-descriptions-item :label="$t('component.attachment.message')">
                      {{ file.text_message }}
                    </el-descriptions-item>
                  </el-descriptions>
                  <el-button
                    slot="reference"
                    icon="el-icon-info"
                    plain
                  />
                </el-popover>
                <el-button
                  icon="el-icon-delete"
                  plain
                  @click="handleRemove(file)"
                />
                <el-button
                  icon="el-icon-download"
                  plain
                  @click="handleDownload(file)"
                />
              </el-button-group>
            </p>
          </el-card>
        </el-col>
      </el-row>

      <!-- List View -->
      <el-row v-else :gutter="20">
        <el-col v-for="(file, key) in attachmentList" :key="key" :span="24">
          <el-card shadow="hover" :class="{ 'image-attachment': true, 'is-current': isCurrent(file) }">
            <div style="float: left;width: 40%; height: 100px;">
              <el-image
                class="image-card-attachment"
                :src="file.src"
                fit="contain"
                :preview-src-list="previewList"
                style="padding-left: 0px;padding-right: 0px;border: 1px solid rgba(184, 186, 188, 0.64);width: 150px;height: 100px;float: left;margin-top: 5%;"
              />
            </div>
            <div style="float: left;padding-top: 2%;width: 60%;">
              <el-radio
                v-if="isSelectable"
                v-model="resourceReference.id"
                :label="file.id"
                @click="resourceReference = file"
              >
                {{ file.name }}
              </el-radio>
              <p
                v-else
                style="font-size: 14px;box-sizing: border-box;overflow: hidden;text-overflow: ellipsis;white-space: normal;word-break: break-all;text-align: end;padding-right: 10px;"
              >
                {{ file.name }}
                <br>
                {{ formatFileSize(file.file_size) }}
              </p>
              <br>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
    <el-footer
      height="auto"
    >
      <!-- Add Description -->
      <el-card v-if="!isEmptyValue(currentAttachment.textMessage) && !isEditHeard" class="box-card">
        <div slot="header" class="clearfix">
          <b style="font-size: 20px;">
            {{ currentAttachment.textMessage }}
          </b>
          <el-button
            plain
            style="color: black;float: right;"
            @click="updateDescriptionHeader(currentAttachment.textMessage)"
          >
            <svg-icon icon-class="edit" />
          </el-button>
        </div>
      </el-card>
      <el-card v-else class="box-card">
        {{ currentAttachment.textMessage }}
        <b slot="header" style="font-size: 20px;">
          {{ $t('component.attachment.addDescription') }}
        </b>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-input
              v-model="resourceDescription"
              type="textarea"
              :placeholder="$t('component.attachment.addDescription')"
              maxlength="2000"
              show-word-limit
            />
          </el-col>
        </el-row>
        <p style="text-align: end;">
          <el-button
            plain
            type="info"
            class="button-base-icon"
            style="font-size: 25px;"
            :disabled="isEmptyValue(resourceDescription)"
            @click="clearDescriptionHeader"
          >
            <svg-icon icon-class="layers-clear" />
          </el-button>
          <el-button
            type="danger"
            icon="el-icon-close"
            class="button-base-icon"
            style="margin-top: 10px;"
            @click="closeNote"
          />
          <el-button
            type="primary"
            class="button-base-icon"
            icon="el-icon-check"
            :disabled="isEmptyValue(resourceDescription)"
            @click="addAttachmentDescriptionHeader"
          />
        </p>
      </el-card>
    </el-footer>
  </el-container>

  <loading-view
    v-else
    key="Attachment-Manager-Loading"
  />
</template>

<script src="./attachment.js" />
<style lang="scss" scoped src="./attchment.scss" />
