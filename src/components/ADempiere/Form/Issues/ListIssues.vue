<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 Contributor(s): Elsio Sanchez Elsiosanches@gmail.com https://github.com/Elsiosanchez
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
  <div class="issues-list">
    <el-card
      shadow="never"
      class="list-card-issues"
      :body-style="{ padding: '0px' }"
    >
      <div slot="header" class="clearfix">
        <el-button style="float: left;color: black;font-size: 19px;font-weight: bold;" plain type="text">
          {{ $t('issues.allRequest') }}
        </el-button>
        <el-button style="float: right;" plain type="success" @click="newIssues()">
          {{ $t('issues.createNewRequest') }}
          <i class="el-icon-plus" />
        </el-button>
        <el-button
          plain
          type="info"
          class="button-base-icon"
          style="float: right;"
          @click="isEdit = !isEdit"
        >
          <svg-icon
            icon-class="group"
          />
        </el-button>
        <el-button
          plain
          type="info"
          class="button-base-icon"
          style="float: right;"
          @click="isKanban = !isKanban"
        >
          <svg-icon
            icon-class="kanban"
          />
        </el-button>
      </div>
      <div v-if="!isEdit && !isKanban" class="table-list-request" :style="isEdit ? 'max-height: 78vh;' : 'max-height: 85vh;'">
        <el-empty v-if="isEmptyValue(listIssues)" />
        <span
          v-else
        >
          <el-row
            v-for="(data, index) in listIssues"
            :key="index"
          >
            <el-col
              :span="1"
              style="padding-right: 0px;"
            >
              <el-popover
                placement="top-start"
                trigger="hover"
              >
                <b>
                  {{ $t('issues.expirationType') }}
                </b>
                <el-tag :style="{ color: dueTypeColor(data), margin: '0px' }">
                  {{ data.due_type.name }}
                </el-tag>
                <b slot="reference" style="font-size: 30px;padding-top: 10px;padding-left: 5px;padding-right: 5px;">
                  <svg-icon
                    icon-class="issues"
                    :style="{ color: dueTypeColor(data), margin: '20px 0px 0px 0px' }"
                  />
                </b>
              </el-popover>
            </el-col>
            <el-col
              :span="9"
              style="padding: 0px;"
            >
              <b>
                <el-popover
                  placement="top-start"
                  trigger="hover"
                  width="650"
                >
                  <el-descriptions :column="2">
                    <template slot="title">
                      <b>
                        <svg-icon icon-class="guide" />
                        {{ data.subject }}
                      </b>
                    </template>
                    <template slot="extra">
                      <b>
                        {{ '#' }}
                        {{ data.document_no }}
                      </b>
                    </template>
                    <el-descriptions-item :span="4">
                      <template slot="label">
                        <b>
                          {{ $t('issues.summary') }}
                        </b>
                      </template>
                      <el-scrollbar wrap-class="scroll-previwer-disable" style="width: 100%; overflow: hidden;">
                        <v-md-preview :text="data.summary" class="previwer-disable" style="padding: 0px" height="150px" />
                      </el-scrollbar>
                    </el-descriptions-item>
                    <el-descriptions-item :span="4">
                      <template slot="label">
                        <b>
                          {{ $t('issues.created') }}
                        </b>
                      </template>
                      {{ data.user_name }}
                    </el-descriptions-item>
                    <el-descriptions-item style="float: right;">
                      <template slot="label">
                        <b style="padding-top: 10px !important;">
                          {{ $t('issues.priority') }}
                        </b>
                      </template>
                      <el-button type="primary" size="medium" plain style="float: right;margin-right: 10px;">
                        <svg-icon icon-class="collections" />
                        {{ data.priority.name }}
                      </el-button>
                    </el-descriptions-item>
                    <el-descriptions-item>
                      <template slot="label">
                        <b style="padding-top: 10px !important;">
                          {{ $t('issues.typeOfRequest') }}
                        </b>
                      </template>
                      <el-button size="medium" plain type="info" style="float: right;margin-right: 10px;">
                        <svg-icon icon-class="label" />
                        {{ data.request_type.name }}
                      </el-button>
                    </el-descriptions-item>
                    <el-descriptions-item>
                      <template slot="label">
                        <b style="padding-top: 5px !important;">
                          {{ $t('issues.assigned') }}
                        </b>
                      </template>
                      <el-avatar
                        v-if="isEmptyValue(data.sales_representative.avatar)"
                        icon="el-icon-user-solid"
                        size="small"
                        style="margin-left: 10px;"
                      />
                      <el-image
                        v-else
                        :src="avatarResize(data.sales_representative)"
                        fit="contain"
                        style="
                          width: 20px;
                          height: 20px;
                          border-radius: 50%;
                          display: inline-block;
                          position: relative;
                          cursor: default;
                          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
                        "
                      />
                      {{ data.sales_representative.name }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                      <template slot="label">
                        <b>
                          {{ $t('issues.expirationType') }}
                        </b>
                      </template>
                      <el-tag :style="{ color: dueTypeColor(data), margin: '0px' }">
                        {{ data.due_type.name }}
                      </el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item :span="4" style="float: right;">
                      <template slot="label">
                        <b>
                          <svg-icon icon-class="calendar" style="font-size: 18px;" />
                          {{ $t('issues.nextActionDate') }}
                        </b>
                      </template>
                      <span v-if="!isEmptyValue(data.dateNextAction)">
                        {{ formatDate({
                          value: data.dateNextAction
                        }) }}
                      </span>
                    </el-descriptions-item>
                  </el-descriptions>
                  <el-button
                    slot="reference"
                    style="color: black;padding: 0px;"
                    type="text"
                    @click="selectIssue(data)"
                  >
                    <p style="margin: 0px;font-size: 16px;text-align: left;margin-top: 5px;margin-bottom: 5px;">
                      {{ '#' + data.document_no + '  ' + data.subject }}
                    </p>
                    <p style="margin: 0px;text-align: initial;">
                      <span
                        v-if="!isEmptyValue(data.project.name)"
                        effect="plain"
                      >
                        <i style="font-size: 12px;color: #82848a;">
                          <b
                            style="font-weight: bolder;"
                          >
                            <svg-icon
                              icon-class="project"
                              style="font-weight: bolder;"
                            />
                            {{ $t('issues.project') }}:
                          </b>
                          {{ data.project.name }}
                        </i>
                      </span>
                      <span
                        v-if="!isEmptyValue(data.business_partner.name)"
                        effect="plain"
                      >
                        <i style="font-size: 12px;color: #82848a;">
                          <b>
                            <svg-icon icon-class="user" />
                            {{ $t('issues.businessPartner') }} :
                          </b>
                          {{ data.business_partner.name }}
                        </i>
                      </span>
                    </p>
                  </el-button>
                </el-popover>
              </b>
            </el-col>
            <el-col
              :span="4"
              style="padding: 0px;text-align: center"
            >
              <progress-percentage
                :value="data.task_status.value"
                :displayed-value="data.task_status.name"
                :text-color="'white'"
              />
            </el-col>
            <el-col
              :span="2"
              style="padding: 0px;text-align: center"
            >
              <el-button size="mini" plain>
                <b>
                  <svg-icon icon-class="calendar" style="font-size: 20px;" />
                </b>
                <span v-if="!isEmptyValue(data.dateNextAction)">
                  {{ formatDate({
                    value: data.dateNextAction
                  }) }}
                </span>
              </el-button>
            </el-col>
            <el-col
              :span="3"
              style="padding: 0px;text-align: center"
            >
              <el-button type="primary" size="mini" plain>
                <b>
                  <svg-icon icon-class="collections" style="font-size: 20px;" />
                  {{ $t('issues.priority') + ': ' }}
                </b>
                {{ data.priority.name }}
              </el-button>
            </el-col>
            <el-col
              :span="3"
              style="padding: 0px;text-align: center"
            >
              <el-button size="mini" type="info" plain>
                <b>
                  <svg-icon icon-class="label" style="font-size: 20px;" />
                  {{ $t('issues.taskStatus') + ': ' }}
                </b>
                {{ data.status.name }}
              </el-button>
            </el-col>
            <el-col
              :span="2"
              style="padding: 0px;text-align: center"
            >
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-zoom-in"
                :alt="$t('page.processActivity.zoomIn')"
                plain
                style="float: right; margin-right: 5px; margin-left: 0px;margin-top: 5px;"
                class="button-base-icon"
                @click="zoomIssues(data)"
              />

              <el-popover
                ref="timeRecord"
                placement="left"
                :title="$t('form.timeRecord.timeRecord') + ' (' + data.id + ')'"
                trigger="click"
                width="450"
              >
                <record-time
                  :issue-id="data.id"
                />
                <el-button
                  slot="reference"
                  type="primary"
                  size="mini"
                  plain
                  class="button-base-icon"
                  style="float: right; margin-right: 5px; margin-left: 0px;margin-top: 5px;"
                  :alt="$t('form.timeRecord.timeRecord')"
                >
                  <i class="el-icon-time" />
                </el-button>
              </el-popover>
            </el-col>
          </el-row>
        </span>
      </div>
      <div
        v-else-if="isKanban"
        style="overflow: auto;"
      >
        <el-card
          shadow="never"
          :body-style="{ padding: '10px' }"
        >
          <div
            style="display: flex;overflow: auto;"
          >
            <div
              v-for="(issues, index) in listIssuesTypes"
              :key="index"
              style="height: 85vh;padding: 0px 10px;width: 35vw;"
            >
              <el-card
                shadow="never"
                :body-style="{ padding: '10px' }"
              >
                <el-collapse accordion>
                  <el-collapse-item name="1">
                    <template slot="title">
                      <svg-icon
                        icon-class="label"
                        style="font-size: 26px;"
                      />
                      <b style="font-size: 16px;padding-left: 10px;">
                        <i>
                          {{ issues.name }}
                        </i>
                      </b>
                    </template>
                    <span v-if="isEmptyValue(filterData({ data: listIssues, column: issues.id }))">
                      <el-empty :image-size="90" />
                    </span>
                    <el-card
                      v-for="data in filterData({ data: listIssues, column: issues.id })"
                      :key="data.id"
                      shadow="never"
                      :body-style="{ padding: '10px' }"
                    >
                      <p slot="header" style="font-size: 16px;margin: 0px;">
                        <b>
                          <el-popover
                            placement="top-start"
                            trigger="hover"
                          >
                            <b>
                              {{ $t('issues.expirationType') }}
                            </b>
                            <el-tag :style="{ color: dueTypeColor(data), margin: '0px' }">
                              {{ data.due_type.name }}
                            </el-tag>
                            <b slot="reference">
                              <svg-icon
                                icon-class="issues"
                                :style="{ color: dueTypeColor(data), margin: '20px 0px 0px 0px' }"
                              />
                              {{ '#' + data.document_no }}
                            </b>
                          </el-popover>
                        </b>
                      </p>
                      <p>
                        {{ data.subject }}
                        <br>
                        {{ data.summary }}
                        <br>
                        <span
                          v-if="!isEmptyValue(data.project.name)"
                          effect="plain"
                        >
                          <i style="font-size: 12px;color: #82848a;">
                            <b
                              style="font-weight: bolder;"
                            >
                              <svg-icon
                                icon-class="project"
                                style="font-weight: bolder;"
                              />
                              {{ $t('issues.project') }}:
                            </b>
                            {{ data.project.name }}
                          </i>
                        </span>
                        <br>
                        <span
                          v-if="!isEmptyValue(data.business_partner.name)"
                          effect="plain"
                        >
                          <i style="font-size: 12px;color: #82848a;">
                            <b>
                              <svg-icon icon-class="user" />
                              {{ $t('issues.businessPartner') }} :
                            </b>
                            {{ data.business_partner.name }}
                          </i>
                        </span>
                        <br>
                        <span>
                          <i style="font-size: 12px;color: #82848a;">
                            <b>
                              <svg-icon icon-class="label" style="font-size: 20px;" />
                              {{ $t('issues.taskStatus') + ': ' }}
                            </b>
                            {{ data.status.name }}
                          </i>
                        </span>
                        <br>
                        <span type="primary" size="mini" plain>
                          <i style="font-size: 12px;color: #82848a;">
                            <b>
                              <svg-icon icon-class="collections" style="font-size: 20px;" />
                              {{ $t('issues.priority') + ': ' }}
                            </b>
                            {{ data.priority.name }}
                          </i>
                        </span>
                      </p>
                    </el-card>
                  </el-collapse-item>
                </el-collapse>
              </el-card>
            </div>
          </div>
        </el-card>
      </div>
      <div
        v-else
        style="overflow: auto;"
      >
        <el-card
          shadow="never"
          :body-style="{ padding: '10px' }"
        >
          <el-collapse>
            <el-collapse-item
              v-for="item in listIssuesTypes"
              :key="item.id"
              :title="item.name"
              :name="item.id"
            >
              <template slot="title">
                <svg-icon
                  icon-class="label"
                  style="font-size: 26px;"
                />
                <b style="font-size: 16px;padding-left: 10px;">
                  <i>
                    {{ item.name }}
                  </i>
                </b>
              </template>
              <el-row
                v-for="(data, index) in filterData({ data: listIssues, column: item.id })"
                :key="index"
                :gutter="20"
              >
                <el-col
                  :span="1"
                  style="padding-right: 0px;"
                >
                  <el-popover
                    placement="top-start"
                    trigger="hover"
                  >
                    <b>
                      {{ $t('issues.expirationType') }}
                    </b>
                    <el-tag :style="{ color: dueTypeColor(data), margin: '0px' }">
                      {{ data.due_type.name }}
                    </el-tag>
                    <b slot="reference" style="font-size: 30px;padding-top: 0px;padding-left: 5px;padding-right: 5px;">
                      <svg-icon
                        icon-class="issues"
                        :style="{ color: dueTypeColor(data), margin: '0px 0px 0px 0px' }"
                      />
                    </b>
                  </el-popover>
                </el-col>
                <el-col
                  :span="9"
                  style="padding: 0px;"
                >
                  <b>
                    <el-popover
                      placement="top-start"
                      trigger="hover"
                      width="650"
                    >
                      <el-descriptions :column="2">
                        <template slot="title">
                          <b>
                            <svg-icon icon-class="guide" />
                            {{ data.subject }}
                          </b>
                        </template>
                        <template slot="extra">
                          <b>
                            {{ '#' }}
                            {{ data.document_no }}
                          </b>
                        </template>
                        <el-descriptions-item :span="4">
                          <template slot="label">
                            <b>
                              {{ $t('issues.summary') }}
                            </b>
                          </template>
                          <el-scrollbar wrap-class="scroll-previwer-disable" style="width: 100%; overflow: hidden;">
                            <v-md-preview :text="data.summary" class="previwer-disable" style="padding: 0px" height="150px" />
                          </el-scrollbar>
                        </el-descriptions-item>
                        <el-descriptions-item :span="4">
                          <template slot="label">
                            <b>
                              {{ $t('issues.created') }}
                            </b>
                          </template>
                          {{ data.user_name }}
                        </el-descriptions-item>
                        <el-descriptions-item style="float: right;">
                          <template slot="label">
                            <b style="padding-top: 10px !important;">
                              {{ $t('issues.priority') }}
                            </b>
                          </template>
                          <el-button type="primary" size="medium" plain style="float: right;margin-right: 10px;">
                            <svg-icon icon-class="collections" />
                            {{ data.priority.name }}
                          </el-button>
                        </el-descriptions-item>
                        <el-descriptions-item>
                          <template slot="label">
                            <b style="padding-top: 10px !important;">
                              {{ $t('issues.typeOfRequest') }}
                            </b>
                          </template>
                          <el-button size="medium" plain type="info" style="float: right;margin-right: 10px;">
                            <svg-icon icon-class="label" />
                            {{ data.request_type.name }}
                          </el-button>
                        </el-descriptions-item>
                        <el-descriptions-item>
                          <template slot="label">
                            <b style="padding-top: 5px !important;">
                              {{ $t('issues.assigned') }}
                            </b>
                          </template>
                          <el-avatar
                            v-if="isEmptyValue(data.sales_representative.avatar)"
                            icon="el-icon-user-solid"
                            size="small"
                            style="margin-left: 10px;"
                          />
                          <el-image
                            v-else
                            :src="avatarResize(data.sales_representative)"
                            fit="contain"
                            style="
                              width: 20px;
                              height: 20px;
                              border-radius: 50%;
                              display: inline-block;
                              position: relative;
                              cursor: default;
                              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
                            "
                          />
                          {{ data.sales_representative.name }}
                        </el-descriptions-item>
                        <el-descriptions-item>
                          <template slot="label">
                            <b>
                              {{ $t('issues.expirationType') }}
                            </b>
                          </template>
                          <el-tag :style="{ color: dueTypeColor(data), margin: '0px' }">
                            {{ data.due_type.name }}
                          </el-tag>
                        </el-descriptions-item>
                        <el-descriptions-item :span="4" style="float: right;">
                          <template slot="label">
                            <b>
                              <svg-icon icon-class="calendar" style="font-size: 18px;" />
                              {{ $t('issues.nextActionDate') }}
                            </b>
                          </template>
                          <span v-if="!isEmptyValue(data.dateNextAction)">
                            {{ formatDate({
                              value: data.dateNextAction
                            }) }}
                          </span>
                        </el-descriptions-item>
                      </el-descriptions>
                      <el-button
                        slot="reference"
                        style="color: black;padding: 0px;"
                        type="text"
                        @click="selectIssue(data)"
                      >
                        <p style="margin: 0px;font-size: 16px;text-align: left;margin-top: 5px;margin-bottom: 5px;">
                          {{ '#' + data.document_no + '  ' + data.subject }}
                        </p>
                        <p style="margin: 0px;text-align: initial;">
                          <span
                            v-if="!isEmptyValue(data.project.name)"
                            effect="plain"
                          >
                            <i style="font-size: 12px;color: #82848a;">
                              <b
                                style="font-weight: bolder;"
                              >
                                <svg-icon
                                  icon-class="project"
                                  style="font-weight: bolder;"
                                />
                                {{ $t('issues.project') }}:
                              </b>
                              {{ data.project.name }}
                            </i>
                          </span>
                          <span
                            v-if="!isEmptyValue(data.business_partner.name)"
                            effect="plain"
                          >
                            <i style="font-size: 12px;color: #82848a;">
                              <b>
                                <svg-icon icon-class="user" />
                                {{ $t('window.containerInfo.notices.user') }} :
                              </b>
                              {{ data.business_partner.name }}
                            </i>
                          </span>
                        </p>
                      </el-button>
                    </el-popover>
                  </b>
                </el-col>
                <el-col
                  :span="4"
                  style="padding: 0px;text-align: center"
                >
                  <progress-percentage
                    :value="data.task_status.value"
                    :displayed-value="data.task_status.name"
                  />
                </el-col>
                <el-col
                  :span="2"
                  style="padding: 0px;text-align: center"
                >
                  <el-button size="mini" plain>
                    <b>
                      <svg-icon icon-class="calendar" style="font-size: 20px;" />
                    </b>
                    <span v-if="!isEmptyValue(data.dateNextAction)">
                      {{ formatDate({
                        value: data.dateNextAction
                      }) }}
                    </span>
                  </el-button>
                </el-col>
                <el-col
                  :span="3"
                  style="padding: 0px;text-align: center"
                >
                  <el-button type="primary" size="mini" plain>
                    <b>
                      <svg-icon icon-class="collections" style="font-size: 20px;" />
                      {{ $t('issues.priority') + ': ' }}
                    </b>
                    {{ data.priority.name }}
                  </el-button>
                </el-col>
                <el-col
                  :span="3"
                  style="padding: 0px;text-align: center"
                >
                  <el-button size="mini" type="info" plain>
                    <b>
                      <svg-icon icon-class="label" style="font-size: 20px;" />
                      {{ $t('issues.taskStatus') + ': ' }}
                    </b>
                    {{ data.status.name }}
                  </el-button>
                </el-col>
                <el-col
                  :span="2"
                  style="padding: 0px;text-align: center"
                >
                  <el-button
                    type="primary"
                    size="mini"
                    icon="el-icon-zoom-in"
                    :alt="$t('page.processActivity.zoomIn')"
                    plain
                    style="float: right; margin-right: 5px; margin-left: 0px;margin-top: 5px;"
                    class="button-base-icon"
                    @click="zoomIssues(data)"
                  />

                  <el-popover
                    ref="timeRecord"
                    placement="left"
                    :title="$t('form.timeRecord.timeRecord') + ' (' + data.id + ')'"
                    trigger="click"
                    width="450"
                  >
                    <record-time
                      :issue-id="data.id"
                    />
                    <el-button
                      slot="reference"
                      type="primary"
                      size="mini"
                      plain
                      class="button-base-icon"
                      style="float: right; margin-right: 5px; margin-left: 0px;margin-top: 5px;"
                      :alt="$t('form.timeRecord.timeRecord')"
                    >
                      <i class="el-icon-time" />
                    </el-button>
                  </el-popover>
                </el-col>
                <!-- <el-col
                  :span="12"
                  style="padding: 0px;text-align: center"
                >
                  <el-button
                    type="primary"
                    size="mini"
                    icon="el-icon-zoom-in"
                    :alt="$t('page.processActivity.zoomIn')"
                    plain
                    style="float: right; margin-right: 5px; margin-left: 0px;margin-top: 5px;"
                    class="button-base-icon"
                    @click="zoomIssues(data)"
                  />

                  <el-popover
                    ref="timeRecord"
                    placement="left"
                    :title="$t('form.timeRecord.timeRecord') + ' (' + data.id + ')'"
                    trigger="click"
                    width="450"
                  >
                    <record-time
                      :issue-id="data.id"
                    />
                    <el-button
                      slot="reference"
                      type="primary"
                      size="mini"
                      plain
                      class="button-base-icon"
                      style="float: right; margin-right: 5px; margin-left: 0px;margin-top: 5px;"
                      :alt="$t('form.timeRecord.timeRecord')"
                    >
                      <i class="el-icon-time" />
                    </el-button>
                  </el-popover>

                  <el-button type="primary" size="mini" plain style="float: right;margin-right: 10px;">
                    <b>
                      <svg-icon icon-class="collections" style="font-size: 20px;" />
                      {{ $t('issues.priority') + ': ' }}
                    </b>
                    {{ data.priority.name }}
                  </el-button>
                  <el-button size="mini" type="info" plain style="float: right;margin-right: 10px;">
                    <b>
                      <svg-icon icon-class="label" style="font-size: 20px;" />
                      {{ $t('issues.taskStatus') + ': ' }}
                    </b>
                    {{ data.status.name }}
                  </el-button>
                  <el-button size="mini" plain style="float: right;margin-right: 10px;">
                    <b>
                      <svg-icon icon-class="calendar" style="font-size: 20px;" />
                      {{ $t('issues.nextActionDate') + ': ' }}
                    </b>
                    <span v-if="!isEmptyValue(data.dateNextAction)">
                      {{ formatDate({
                        value: data.dateNextAction
                      }) }}
                    </span>
                  </el-button>
                </el-col> -->
              </el-row>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </div>
    </el-card>
  </div>
</template>
<script>
import {
  defineComponent, computed, ref
} from '@vue/composition-api'

import store from '@/store'

// Components and Mixins
import Comment from './component/Comment.vue'
import RecordTime from './recordTime.vue'
import ProgressPercentage from '@/components/ADempiere/ContainerOptions/ProgressPercentage.vue'
// Constants
import { REQUEST_WINDOW_UUID } from '@/utils/ADempiere/dictionary/form/Issues.js'

// Utils and Helper Methods
import { formatDate, translateDateByLong } from '@/utils/ADempiere/formatValue/dateFormat'
import { getImagePath } from '@/utils/ADempiere/resource.js'
import { showMessage } from '@/utils/ADempiere/notification'
import { zoomIn } from '@/utils/ADempiere/coreUtils.js'

// Api Request Methods
import {
  requestListRequestTypes,
  requestListPriorities
} from '@/api/ADempiere/user-interface/component/issue'

export default defineComponent({
  name: 'Issues',

  components: {
    // Editor
    Comment,
    RecordTime,
    ProgressPercentage
  },

  props: {
    tableName: {
      type: String,
      required: false
    },
    recordId: {
      type: Number,
      required: false
    }
  },

  setup(props) {
    const message = ref('')
    const filter = ref('')
    const priority = ref('')
    const isEdit = ref(false)
    const isKanban = ref(false)
    const typeRequest = ref('')
    const requestTypes = ref('')
    const currentPriority = ref('')
    const listIssuesTypes = ref([])
    const listPriority = ref([])

    const listIssues = computed(() => {
      return store.getters.getListIssues
    })

    const isNewIssues = computed({
      // getter
      get() {
        return store.getters.getNewIssues
      },
      // setter
      set(newValue) {
        store.commit('setNewIssues', newValue)
      }
    })

    const currentIssues = computed(() => {
      return store.getters.getCurrentIssues
    })

    const isShowTitleForm = computed(() => {
      return store.getters.getIsShowTitleForm
    })

    const styleAllRequestBoxCard = computed(() => {
      if (isShowTitleForm.value) return 'height: 80%;overflow: auto;'
      return 'height: 90%;overflow: auto;'
    })

    function dueTypeColor(issue) {
      const { due_type } = issue
      const { value } = due_type
      let color = '#3fb950'
      if (value === '5') {
        color = 'orange'
      } else if (value === '3') {
        color = '#ff2121'
      }
      return color
    }

    function selectIssue(issue) {
      isNewIssues.value = !isNewIssues.value
      store.dispatch('changeCurrentIssues', issue)
    }

    function newIssues(issue) {
      isNewIssues.value = !isNewIssues.value
      store.dispatch('changeCurrentIssues', issue)
    }

    function loadIssues() {
      store.dispatch('listRequest', {})
      store.dispatch('findListMailTemplates')
    }

    function zoomIssues(issues) {
      zoomIn({
        uuid: REQUEST_WINDOW_UUID,
        params: {
          filters: [
            {
              columnName: 'UUID',
              value: issues.uuid
            }
          ]
        }
      })
    }

    function avatarResize(user) {
      const { avatar } = user
      const { uri } = getImagePath({
        file: avatar,
        width: 20,
        height: 20,
        operation: 'resize'
      })
      return uri
    }

    function findRequestTypes(isVisible) {
      if (!isVisible) {
        return
      }
      requestListRequestTypes({})
        .then(response => {
          const { records } = response
          listIssuesTypes.value = records
        })
        .catch(error => {
          showMessage({
            message: error.message,
            type: 'warning'
          })
        })
    }
    function findPriority(isVisible) {
      if (!isVisible) {
        return
      }
      requestListPriorities({})
        .then(response => {
          const { records } = response
          listPriority.value = records
        })
        .catch(error => {
          showMessage({
            message: error.message,
            type: 'warning'
          })
        })
    }

    function filterData({
      data,
      column
    }) {
      return data.filter(list => list.request_type.id === column)
    }

    findRequestTypes(true)

    loadIssues()

    function percentageFormat(display) {
      return display
    }

    return {
      isEdit,
      isKanban,
      message,
      listIssues,
      requestTypes,
      listIssuesTypes,
      currentPriority,
      listPriority,
      //
      priority,
      typeRequest,
      filter,
      isNewIssues,
      currentIssues,
      styleAllRequestBoxCard,
      isShowTitleForm,
      // methods
      findRequestTypes,
      findPriority,
      dueTypeColor,
      formatDate,
      avatarResize,
      selectIssue,
      newIssues,
      loadIssues,
      zoomIssues,
      filterData,
      percentageFormat,
      translateDateByLong
    }
  }
})
</script>

<style lang="scss">
.all-request-box-card {
  padding: 0px;
  .el-card__body {
    padding: 0px;
  }
}
.table-list-request {
  .el-table td.el-table__cell div {
    display: flex;
    padding: 0px;
  }
  .el-table thead {
    display: none;
  }
  .el-table--medium .el-table__cell {
    padding: 0px;
  }
}
.p {
  margin: 0px !important;
}
.el-card__body {
  padding: 20px;
  padding-top: 0px !important;
  padding-right: 20px;
  padding-bottom: 0px!important;
  padding-left: 20px;
}
.tui-editor .te-preview-style-vertical .te-preview {
  float: left;
  width: auto !important;
}
.te-preview {
    overflow: auto;
    width: auto !important;
    padding: 0 25px;
    height: 100%;
}

.issues-card {
  .el-card__body {
    padding-top: 0px !important;
    padding-right: 0px;
    padding-bottom: 0px!important;
    padding-left: 0px;
  }
}
.list-card-issues {
  .el-card__header {
    padding: 5px 15px;
  }
}
.table-list-request {
  overflow: auto;
}
.list-card-issues-filter {

}
</style>
<style scoped>
.scroll-chats {
  width: 100%;
  height: 500px;
}
</style>
