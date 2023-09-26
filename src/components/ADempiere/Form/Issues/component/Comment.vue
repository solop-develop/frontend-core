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
  <span>
    <el-container style="height: 90vh">
      <!-- {{ $store.getters['settings/getFixedHeader'] }} -->
      <el-header v-if="isMobile" ref="scrollIssues" height="70%" style="overflow: auto;padding: 0px;">
        <el-card v-if="isEmptyValue(currentIssues) || isPanelNewRequest" class="comments-card" style="height: auto;padding: 0px;">
          <div slot="header" class="clearfix">
            <el-button style="float: left; margin-right: 10px;" size="mini" plain type="info" @click="SelectionIssue">
              <i class="el-icon-arrow-left" style="font-size: 18px;" />
            </el-button>
            <b style="color: black; font-size: 19px;">
              {{ $t('issues.newRequest') }}
            </b>
          </div>
          <div style="display: flex;width: -webkit-fill-available;">
            <div style="padding: 0px;width: 100%;">
              <el-card class="card-summary" shadow="never">
                <el-row>
                  <el-form label-position="top">
                    <el-col :span="24">
                      <el-form-item>
                        <el-input v-model="subject" :placeholder="$t('issues.issues')" />
                      </el-form-item>
                    </el-col>
                  </el-form>
                </el-row>
                <el-row>
                  <el-form label-position="top">
                    <el-col :span="24">
                      <el-form-item style="margin-bottom: 0px;">
                        <el-card v-if="summaryNewPreview" shadow="never">
                          <el-scrollbar wrap-class="scroll-previwer-disable">
                            <v-md-preview
                              :text="summary"
                              height="150px"
                              class="previwer-disable"
                              style="padding: 0px"
                            />
                          </el-scrollbar>
                        </el-card>
                        <v-md-editor
                          v-else
                          v-model="summary"
                          :placeholder="$t('issues.summary')"
                          height="360px"
                          left-toolbar="undo redo clear h bold italic strikethrough quote ul ol table hr link image code save | emoji listMailTemplates"
                          :toolbar="listOption"
                          right-toolbar="sync-scroll fullscreen"
                          mode="edit"
                        />
                      </el-form-item>
                    </el-col>
                  </el-form>
                </el-row>
                <el-button
                  style="float: right;margin: 10px;"
                  :disabled="isDisabledSave"
                  type="primary"
                  icon="el-icon-check"
                  class="button-base-icon"
                  :loading="isLoadingNewIssues"
                  @click="saveIssues()"
                />
                <el-button
                  type="danger"
                  icon="el-icon-close"
                  style="float: right;margin-top: 10px;"
                  class="button-base-icon"
                  @click="SelectionIssue"
                />
                <el-button
                  type="info"
                  plain
                  style="float: right; margin-top: 10px;"
                  class="button-base-icon"
                  :disabled="isEmptyValue(summary)"
                  @click="summary = ''"
                >
                  <svg-icon icon-class="layers-clear" />
                </el-button>
                <el-checkbox
                  v-model="summaryNewPreview"
                  :label="$t('issues.preview')"
                  :border="true"
                  style="float: right;margin-top: 10px"
                />
              </el-card>
            </div>
            <div style="padding: 0px 15px;border: 1px solid #e6ebf5;">
              <el-form label-position="top" class="form-min-label">
                <el-form-item :label="$t('issues.typeOfRequest')" style="margin: 0px;">
                  <el-select
                    v-model="currentRequestTypes"
                    filterable
                    @visible-change="findRequestTypes"
                    @change="exitPopover('newtypeOfRequest')"
                  >
                    <el-option
                      v-for="item in listIssuesTypes"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('issues.status')" style="margin: 0px;">
                  <el-select
                    v-model="currentStatus"
                    filterable
                    :disabled="isEmptyValue(currentRequestTypes)"
                    @visible-change="findStatus"
                    @change="exitPopover('')"
                  >
                    <el-option
                      v-for="item in listStatuses"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('issues.priority')" style="margin: 0px;">
                  <el-select
                    v-model="currentPriority"
                    filterable
                    @visible-change="findPriority"
                    @change="exitPopover('')"
                  >
                    <el-option
                      v-for="item in listPriority"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="Agente Comercial" style="margin: 0px;">
                  <el-select
                    v-model="currentSalesReps"
                    remote
                    filterable
                    :loading="loadingSales"
                    :remote-method="remoteMethodSales"
                    @visible-change="findSalesReps"
                    @change="exitPopover('')"
                  >
                    <el-option
                      v-for="item in listSalesReps"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="Proxima Fecha" style="margin: 0px;">
                  <el-date-picker
                    v-model="newDateNextAction"
                    clearable
                    type="datetime"
                    placeholder="Proxima Fecha"
                  />
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-card>
        <el-card v-else class="comments-card" style="padding: 0px;height: auto;">
          <div slot="header" class="comments-card-clearfix" style="height: auto;">
            <el-button
              style="margin-right: 10px;"
              class="button-base-icon"
              plain
              type="info"
              @click="cancelEdit(currentIssues)"
            >
              <i class="el-icon-arrow-left" style="font-size: 18px;" />
            </el-button>
            <span v-if="!isPanelEditRequest" style="color: black; font-size: 18px;">
              {{ '#' + currentIssues.document_no }}
              {{ currentIssues.subject }}
            </span>
            <el-row v-else :gutter="20">
              <el-form label-position="top">
                <el-col :span="4">
                  <el-form-item style="padding: 0px;margin-bottom: 0px;">
                    <span style="color: black; font-size: 16px;">
                      {{ '#' + currentIssues.document_no }}
                    </span>
                  </el-form-item>
                </el-col>
                <el-col :span="20">
                  <el-form-item style="padding: 0px;margin-bottom: 0px;">
                    <el-input v-model="currentIssues.subject" placeholder="Asunto" />
                  </el-form-item>
                </el-col>
              </el-form>
            </el-row>
            <el-dropdown v-if="!isPanelEditRequest" trigger="click" style="float: right" @command="handleCommandIssues">
              <span class="el-dropdown-link">
                <el-button type="text" size="mini" style="color: black;">
                  <b>
                    <svg-icon icon-class="more-vertical" style="font-size: 15px;" />
                  </b>
                </el-button>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-edit" :command="{currentIssues, option:'edit'}"> {{ $t('issues.edit') }} </el-dropdown-item>
                <el-dropdown-item icon="el-icon-delete" :command="{currentIssues, option:'delete'}"> {{ $t('issues.delete') }} </el-dropdown-item>
                <el-dropdown-item icon="el-icon-zoom-in" :command="{currentIssues, option:$t('page.processActivity.zoomIn')}"> {{ $t('page.processActivity.zoomIn') }} </el-dropdown-item>
                <el-dropdown-item icon="el-icon-time" :command="{currentIssues, option: 'timeRecord'}">
                  <el-popover
                    ref="timeRecord"
                    placement="left"
                    :title="$t('form.timeRecord.timeRecord') + ' (' + currentIssues.id + ')'"
                    trigger="click"
                    width="450"
                  >
                    <record-time
                      :issue-id="currentIssues.id"
                    />
                    <el-button slot="reference" type="text">
                      {{ $t('form.timeRecord.timeRecord') }}
                    </el-button>
                  </el-popover>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div id="panel-issues" style="display: flex;width: -webkit-fill-available;overflow: auto;">
            <div id="panel-rigth" style="padding: 0px 15px;border: 1px solid #e6ebf5;">
              <el-form label-position="top" class="form-comments">
                <el-form-item :label="$t('issues.typeOfRequest')">
                  <el-select
                    v-model="currentRequestTypes"
                    filterable
                    @visible-change="findRequestTypes"
                    @change="updateIssuesTypeRequest"
                  >
                    <el-option
                      v-for="item in listIssuesTypes"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('issues.status')">
                  <el-select
                    v-model="currentStatus"
                    filterable
                    :disabled="isEmptyValue(currentRequestTypes)"
                    @visible-change="findStatus"
                    @change="updateIssuesStatus"
                  >
                    <el-option
                      v-for="item in listStatuses"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('issues.priority')">
                  <el-select
                    v-model="currentPriority"
                    filterable
                    @visible-change="findPriority"
                    @change="updateIssuesPriority"
                  >
                    <el-option
                      v-for="item in listPriority"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="Agente Comercial">
                  <el-select
                    v-model="currentSalesReps"
                    remote
                    filterable
                    :loading="loadingSales"
                    :remote-method="remoteMethodSales"
                    @visible-change="findSalesReps"
                    @change="updateIssuesSalesReps"
                  >
                    <el-option
                      v-for="item in listSalesReps"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="Proxima Fecha">
                  <el-date-picker
                    v-model="currentDateNextAction"
                    type="datetime"
                    placeholder="Proxima Fecha"
                    @change="updateIssuesDateNextAction"
                  />
                </el-form-item>
              </el-form>
            </div>
            <div id="panel-left" style="padding: 0px;width: 100%;">
              <el-card class="card-summary" shadow="never" style="height: 100% !important">
                <el-row v-if="isPanelEditRequest" style="height: 100% !important">
                  <el-form label-position="top">
                    <el-col :span="24">
                      <el-form-item :label="$t('issues.summary')">
                        <el-card v-if="summaryUpdatePreview" shadow="never">
                          <el-scrollbar wrap-class="scroll-previwer-disable">
                            <v-md-preview :text="updateSummary" class="previwer-disable" style="padding: 0px" height="150px" />
                          </el-scrollbar>
                        </el-card>
                        <v-md-editor
                          v-else
                          v-model="updateSummary"
                          height="250px"
                          left-toolbar="undo redo clear h bold italic strikethrough quote ul ol table hr link image code save | emoji listMailTemplates"
                          :toolbar="listOption"
                          right-toolbar="sync-scroll fullscreen"
                          mode="edit"
                        />
                      </el-form-item>
                      <span v-if="isPanelEditRequest">
                        <el-button
                          type="primary"
                          icon="el-icon-check"
                          class="button-base-icon"
                          style="float: right;margin: 10px;"
                          @click="updateIssuesSummary(currentIssues)"
                        />
                        <el-button
                          type="danger"
                          icon="el-icon-close"
                          class="button-base-icon"
                          style="float: right;margin-top: 10px;"
                          @click="editIssues(currentIssues)"
                        />
                        <el-button
                          type="info"
                          plain
                          style="float: right; margin-top: 10px;"
                          class="button-base-icon"
                          :disabled="isEmptyValue(summary)"
                          @click="updateSummary = ''"
                        >
                          <svg-icon icon-class="layers-clear" />
                        </el-button>
                        <el-checkbox
                          v-model="summaryUpdatePreview"
                          :label="$t('issues.preview')"
                          class="button-base-icon"
                          :border="true"
                          style="float: right;margin-top: 10px;"
                        />
                      </span>
                    </el-col>
                  </el-form>
                </el-row>
                <p v-else style="font-size: 14px;margin: 0px;height: 100% !important">
                  <el-scrollbar wrap-class="scroll-comments">
                    <v-md-preview :text="currentIssues.summary" class="previwer-disable" height="200px" style="padding: 0px" />
                  </el-scrollbar>
                </p>
              </el-card>
            </div>
          </div>
          <i style="font-size: 12px;color: #82848a;">
            {{ $t('issues.isCreated') }} {{ translateDateByLong(currentIssues.created) }} {{ $t('issues.by') }} {{ currentIssues.user_name }} <svg-icon icon-class="user" />
          </i>
        </el-card>
        <br>
        <el-timeline v-if="!isEmptyValue(currentIssues) && !isPanelNewRequest" style="padding-left: 15px;padding-right: 15px;">
          <el-timeline-item
            v-for="(comment, index) in listComments"
            :key="index"
            type="primary"
            :timestamp="translateDateByLong(comment.created)"
            style="margin-left: 10px;"
          >
            <span v-if="comment.issue_comment_type === 1">
              <svg-icon v-if="isEmptyValue(comment.user.avatar)" icon-class="user" />
              <el-image
                :src="avatarResize(comment.user)"
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
              <b>
                {{ comment.user.name }}
              </b>
              {{ logDisplayLanguaje(true, false) }}
              <b>
                {{ labelDisplayChange(comment, true) }}
              </b>
              <span v-show="!isEmptyValue(labelDisplayChange(comment, false, true))">
                {{ logDisplayLanguaje(false, true) }}
              </span>
              <b>
                {{ labelDisplayChange(comment, false, true) }}
              </b>
            </span>
            <el-card v-else class="list-comments">
              <div slot="header" class="list-comments-clearfix">
                <span>
                  <svg-icon icon-class="user" /> {{ comment.user_name }}
                </span>
                <el-dropdown trigger="click" style="float: right" @command="handleCommand">
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini" style="color: black;">
                      <b>
                        <svg-icon icon-class="more-vertical" />
                      </b>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item icon="el-icon-edit" :disabled="validateUser(comment)" :command="{comment, option:'edit'}"> {{ $t('issues.edit') }} </el-dropdown-item>
                    <el-dropdown-item icon="el-icon-delete" :disabled="validateUser(comment)" :command="{comment, option:'delete'}"> {{ $t('issues.delete') }} </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
              <div>
                <v-md-preview v-if="!comment.isEdit" :text="comment.result" class="previwer-disable" style="padding: 0px" />
                <span v-else>
                  <el-card v-if="commentUpdatePreview" shadow="never">
                    <el-scrollbar wrap-class="scroll-previwer-disable">
                      <v-md-preview :text="commentUpdate" class="previwer-disable" style="padding: 0px" height="150px" />
                    </el-scrollbar>
                  </el-card>
                  <v-md-editor
                    v-else
                    v-model="commentUpdate"
                    height="150px"
                    left-toolbar="undo redo clear h bold italic strikethrough quote ul ol table hr link image code save | emoji listMailTemplates"
                    :toolbar="listOption"
                    right-toolbar="sync-scroll fullscreen"
                    mode="edit"
                  />
                  <el-button
                    type="primary"
                    icon="el-icon-check"
                    class="button-base-icon"
                    style="float: right; margin: 10px;"
                    @click="updateComment(comment)"
                  />
                  <el-button
                    type="danger"
                    icon="el-icon-close"
                    class="button-base-icon"
                    style="float: right; margin-top: 10px;"
                    @click="comment.isEdit = !comment.isEdit"
                  />
                  <el-button
                    type="info"
                    plain
                    class="button-base-icon"
                    style="float: right; margin-top: 10px;"
                    @click="commentUpdate = ''"
                  >
                    <svg-icon icon-class="layers-clear" />
                  </el-button>
                  <el-checkbox
                    v-model="commentUpdatePreview"
                    :label="$t('issues.preview')"
                    :border="true"
                    style="float: right; margin-top: 10px;"
                  />
                </span>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-header>
      <el-header v-else ref="scrollIssues" height="70%" style="overflow: auto;padding: 0px;">
        <el-card v-if="isEmptyValue(currentIssues) || isPanelNewRequest" class="comments-card" style="height: auto;padding: 0px;">
          <div slot="header" class="clearfix">
            <el-button style="float: left; margin-right: 10px;" size="mini" plain type="info" @click="SelectionIssue">
              <i class="el-icon-arrow-left" style="font-size: 18px;" />
            </el-button>
            <b style="color: black; font-size: 19px;">
              {{ $t('issues.newRequest') }}
            </b>
          </div>
          <div style="display: flex;width: -webkit-fill-available;">
            <div style="padding: 0px;width: 100%;">
              <el-card class="card-summary" shadow="never">
                <el-row>
                  <el-form label-position="top">
                    <el-col :span="24">
                      <el-form-item>
                        <el-input v-model="subject" :placeholder="$t('issues.issues')" />
                      </el-form-item>
                    </el-col>
                  </el-form>
                </el-row>
                <el-row>
                  <el-form label-position="top">
                    <el-col :span="24">
                      <el-form-item style="margin-bottom: 0px;">
                        <el-card v-if="summaryNewPreview" shadow="never">
                          <el-scrollbar wrap-class="scroll-previwer-disable">
                            <v-md-preview :text="summary" class="previwer-disable" style="padding: 0px" height="150px" />
                          </el-scrollbar>
                        </el-card>
                        <v-md-editor
                          v-else
                          v-model="summary"
                          :placeholder="$t('issues.summary')"
                          height="250px"
                          left-toolbar="undo redo clear h bold italic strikethrough quote ul ol table hr link image code save | emoji listMailTemplates"
                          :toolbar="listOption"
                          right-toolbar="sync-scroll fullscreen"
                          mode="edit"
                        />
                      </el-form-item>
                    </el-col>
                  </el-form>
                </el-row>
                <el-button
                  style="float: right;margin: 10px;"
                  :disabled="isDisabledSave"
                  type="primary"
                  icon="el-icon-check"
                  class="button-base-icon"
                  :loading="isLoadingNewIssues"
                  @click="saveIssues()"
                />
                <el-button
                  type="danger"
                  icon="el-icon-close"
                  style="float: right;margin-top: 10px;"
                  class="button-base-icon"
                  @click="SelectionIssue"
                />
                <el-button
                  type="info"
                  plain
                  style="float: right; margin-top: 10px;"
                  class="button-base-icon"
                  :disabled="isEmptyValue(summary)"
                  @click="summary = ''"
                >
                  <svg-icon icon-class="layers-clear" />
                </el-button>
                <el-checkbox
                  v-model="summaryNewPreview"
                  :label="$t('issues.preview')"
                  :border="true"
                  style="float: right;margin-top: 10px"
                />
              </el-card>
            </div>
            <div style="padding: 0px 15px;border: 1px solid #e6ebf5;">
              <el-form label-position="top" class="form-min-label">
                <el-form-item :label="$t('issues.typeOfRequest')" style="margin: 0px;">
                  <el-select
                    v-model="currentRequestTypes"
                    filterable
                    @visible-change="findRequestTypes"
                    @change="exitPopover('newtypeOfRequest')"
                  >
                    <el-option
                      v-for="item in listIssuesTypes"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('issues.status')" style="margin: 0px;">
                  <el-select
                    v-model="currentStatus"
                    filterable
                    :disabled="isEmptyValue(currentRequestTypes)"
                    @visible-change="findStatus"
                    @change="exitPopover('')"
                  >
                    <el-option
                      v-for="item in listStatuses"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('issues.priority')" style="margin: 0px;">
                  <el-select
                    v-model="currentPriority"
                    filterable
                    @visible-change="findPriority"
                    @change="exitPopover('')"
                  >
                    <el-option
                      v-for="item in listPriority"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="Agente Comercial" style="margin: 0px;">
                  <el-select
                    v-model="currentSalesReps"
                    remote
                    filterable
                    :loading="loadingSales"
                    :remote-method="remoteMethodSales"
                    @visible-change="findSalesReps"
                    @change="exitPopover('')"
                  >
                    <el-option
                      v-for="item in listSalesReps"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="Proxima Fecha" style="margin: 0px;">
                  <el-date-picker
                    v-model="newDateNextAction"
                    type="datetime"
                    placeholder="Proxima Fecha"
                    @change="exitPopover('')"
                  />
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-card>
        <el-card v-else class="comments-card" style="padding: 0px;height: auto;">
          <div slot="header" class="comments-card-clearfix" style="height: auto;">
            <el-button
              style="margin-right: 10px;"
              class="button-base-icon"
              plain
              type="info"
              @click="cancelEdit(currentIssues)"
            >
              <i class="el-icon-arrow-left" style="font-size: 18px;" />
            </el-button>
            <span v-if="!isPanelEditRequest" style="color: black; font-size: 18px;">
              {{ '#' + currentIssues.document_no }}
              {{ currentIssues.subject }}
            </span>
            <!-- </span> -->
            <el-row v-else :gutter="20">
              <el-form label-position="top">
                <el-col :span="4">
                  <el-form-item style="padding: 0px;margin-bottom: 0px;">
                    <span style="color: black; font-size: 16px;">
                      {{ '#' + currentIssues.document_no }}
                    </span>
                  </el-form-item>
                </el-col>
                <el-col :span="20">
                  <el-form-item style="padding: 0px;margin-bottom: 0px;">
                    <el-input v-model="currentIssues.subject" placeholder="Asunto" />
                  </el-form-item>
                </el-col>
              </el-form>
            </el-row>
            <el-dropdown v-if="!isPanelEditRequest" trigger="click" style="float: right" @command="handleCommandIssues">
              <span class="el-dropdown-link">
                <el-button type="text" size="mini" style="color: black;">
                  <b>
                    <svg-icon icon-class="more-vertical" style="font-size: 15px;" />
                  </b>
                </el-button>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-edit" :command="{currentIssues, option:'edit'}"> {{ $t('issues.edit') }} </el-dropdown-item>
                <el-dropdown-item icon="el-icon-delete" :command="{currentIssues, option:'delete'}"> {{ $t('issues.delete') }} </el-dropdown-item>
                <el-dropdown-item icon="el-icon-zoom-in" :command="{currentIssues, option:$t('page.processActivity.zoomIn')}"> {{ $t('page.processActivity.zoomIn') }} </el-dropdown-item>
                <el-dropdown-item icon="el-icon-time" :command="{currentIssues, option: 'timeRecord'}">
                  <el-popover
                    ref="timeRecord"
                    placement="left"
                    :title="$t('form.timeRecord.timeRecord') + ' (' + currentIssues.id + ')'"
                    trigger="click"
                    width="450"
                  >
                    <record-time
                      :issue-id="currentIssues.id"
                    />
                    <el-button slot="reference" type="text">
                      {{ $t('form.timeRecord.timeRecord') }}
                    </el-button>
                  </el-popover>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button v-if="!isPanelEditRequest" style="float: right;margin-right: 10px;" plain type="success" @click="newIssues()">
              {{ $t('issues.createNewRequest') }}
              <i class="el-icon-plus" />
            </el-button>
          </div>
          <div id="panel-issues" style="display: flex;width: -webkit-fill-available;">
            <div id="panel-left" style="padding: 0px;width: 100%;">
              <el-card class="card-summary" shadow="never" style="height: 100% !important">
                <el-row v-if="isPanelEditRequest" style="height: 100% !important">
                  <el-form label-position="top">
                    <el-col :span="24">
                      <el-form-item :label="$t('issues.summary')">
                        <el-card v-if="summaryUpdatePreview" shadow="never">
                          <el-scrollbar wrap-class="scroll-previwer-disable">
                            <v-md-preview :text="updateSummary" class="previwer-disable" style="padding: 0px" height="150px" />
                          </el-scrollbar>
                          <!-- <div v-markdown="updateSummary" class="output" /> -->
                        </el-card>
                        <v-md-editor
                          v-else
                          v-model="updateSummary"
                          height="250px"
                          left-toolbar="undo redo clear h bold italic strikethrough quote ul ol table hr link image code save | emoji listMailTemplates"
                          :toolbar="listOption"
                          right-toolbar="sync-scroll fullscreen"
                          mode="edit"
                        />
                      </el-form-item>
                      <span v-if="isPanelEditRequest">
                        <el-button
                          type="primary"
                          icon="el-icon-check"
                          class="button-base-icon"
                          style="float: right;margin: 10px;"
                          @click="updateIssuesSummary(currentIssues)"
                        />
                        <el-button
                          type="danger"
                          icon="el-icon-close"
                          class="button-base-icon"
                          style="float: right;margin-top: 10px;"
                          @click="editIssues(currentIssues)"
                        />
                        <el-button
                          type="info"
                          plain
                          style="float: right; margin-top: 10px;"
                          class="button-base-icon"
                          :disabled="isEmptyValue(summary)"
                          @click="updateSummary = ''"
                        >
                          <svg-icon icon-class="layers-clear" />
                        </el-button>
                        <el-checkbox
                          v-model="summaryUpdatePreview"
                          :label="$t('issues.preview')"
                          class="button-base-icon"
                          :border="true"
                          style="float: right;margin-top: 10px;"
                        />
                      </span>
                    </el-col>
                  </el-form>
                </el-row>
                <p v-else style="font-size: 14px;margin: 0px;height: 100% !important">
                  <el-scrollbar wrap-class="scroll-comments">
                    <v-md-preview :text="currentIssues.summary" class="previwer-disable" height="200px" style="padding: 0px" />
                  </el-scrollbar>
                </p>
              </el-card>
            </div>
            <div id="panel-rigth" style="padding: 0px 15px;border: 1px solid #e6ebf5;">
              <el-form label-position="top" class="form-min-label">
                <el-form-item :label="$t('issues.typeOfRequest')" style="margin: 0px;">
                  <el-select
                    v-model="currentIssues.request_type.name"
                    filterable
                    @visible-change="findRequestTypes"
                    @change="updateIssuesTypeRequest"
                  >
                    <el-option
                      v-for="item in listIssuesTypes"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('issues.status')" style="margin: 0px;">
                  <el-select
                    v-model="currentIssues.status.name"
                    filterable
                    :disabled="isEmptyValue(currentRequestTypes)"
                    @visible-change="findStatus"
                    @change="updateIssuesStatus"
                  >
                    <el-option
                      v-for="item in listStatuses"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('issues.priority')" style="margin: 0px;">
                  <el-select
                    v-model="currentIssues.priority.name"
                    filterable
                    @visible-change="findPriority"
                    @change="updateIssuesPriority"
                  >
                    <el-option
                      v-for="item in listPriority"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="Agente Comercial" style="margin: 0px;">
                  <el-select
                    v-model="currentIssues.sales_representative.name"
                    remote
                    filterable
                    :loading="loadingSales"
                    :remote-method="remoteMethodSales"
                    @visible-change="findSalesReps"
                    @change="updateIssuesSalesReps"
                  >
                    <el-option
                      v-for="item in listSalesReps"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="Proxima Fecha" style="margin: 0px;">
                  <el-date-picker
                    v-model="currentIssues.dateNextAction"
                    type="datetime"
                    format="dd-MM-yyyy HH:mm:ss"
                    placeholder="Proxima Fecha"
                    @change="updateIssuesDateNextAction"
                  />
                </el-form-item>
              </el-form>
            </div>
          </div>
          <i style="font-size: 12px;color: #82848a;">
            {{ $t('issues.isCreated') }} {{ translateDateByLong(currentIssues.created) }} {{ $t('issues.by') }}
            <svg-icon
              v-if="isEmptyValue(currentIssues.user.avatar)"
              icon-class="user"
            />
            <el-image
              :src="avatarResize(currentIssues.user)"
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
            <b> {{ currentIssues.user.name }} </b>
          </i>
        </el-card>
        <br>
        <el-scrollbar v-if="getFixedHeader" ref="scrollTimeLineTabComments" wrap-class="scroll-timeline-from">
          <el-timeline v-if="!isEmptyValue(currentIssues) && !isPanelNewRequest" style="padding-left: 15px;padding-right: 15px;">
            <el-timeline-item
              v-for="(comment, index) in listComments"
              :key="index"
              type="primary"
              :timestamp="translateDateByLong(comment.created)"
              style="margin-left: 10px;"
            >
              <span v-if="comment.issue_comment_type === 1">
                <svg-icon v-if="isEmptyValue(comment.user.avatar)" icon-class="user" />
                <el-image
                  :src="avatarResize(comment.user)"
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
                <b>
                  {{ comment.user.name }}
                </b>
                {{ logDisplayLanguaje(true, false) }}
                <b>
                  {{ labelDisplayChange(comment, true) }}
                </b>
                <span v-show="!isEmptyValue(labelDisplayChange(comment, false, true))">
                  {{ logDisplayLanguaje(false, true) }}
                </span>
                <b>
                  {{ labelDisplayChange(comment, false, true) }}
                </b>
              </span>
              <el-card v-else class="list-comments">
                <div slot="header" class="list-comments-clearfix">
                  <span>
                    <svg-icon v-if="isEmptyValue(comment.user.avatar)" icon-class="user" />
                    <el-image
                      :src="avatarResize(comment.user)"
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
                    <b>
                      {{ comment.user.name }}
                    </b>
                  </span>
                  <el-dropdown trigger="click" style="float: right" @command="handleCommand">
                    <span class="el-dropdown-link">
                      <el-button type="text" size="mini" style="color: black;">
                        <b>
                          <svg-icon icon-class="more-vertical" />
                        </b>
                      </el-button>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item icon="el-icon-edit" :disabled="validateUser(comment)" :command="{comment, option:'edit'}"> {{ $t('issues.edit') }} </el-dropdown-item>
                      <el-dropdown-item icon="el-icon-delete" :disabled="validateUser(comment)" :command="{comment, option:'delete'}"> {{ $t('issues.delete') }} </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
                <div>
                  <!-- <div v-if="!comment.isEdit" v-markdown="comment.result" class="output" /> -->
                  <v-md-preview v-if="!comment.isEdit" :text="comment.result" class="previwer-disable" style="padding: 0px" />
                  <span v-else>
                    <el-card v-if="commentUpdatePreview" shadow="never">
                      <el-scrollbar wrap-class="scroll-previwer-disable">
                        <v-md-preview :text="commentUpdate" class="previwer-disable" style="padding: 0px" height="150px" />
                      </el-scrollbar>
                      <!-- <v-md-preview v-if="commentUpdate" :text="comment.result" class="previwer-disable" style="padding: 0px" /> -->
                      <!-- <div v-markdown="commentUpdate" class="output" /> -->
                    </el-card>
                    <!-- <div v-if="commentUpdatePreview" v-markdown="comment.result" class="output" /> -->
                    <v-md-editor
                      v-else
                      v-model="commentUpdate"
                      height="150px"
                      left-toolbar="undo redo clear h bold italic strikethrough quote ul ol table hr link image code save | emoji listMailTemplates"
                      :toolbar="listOption"
                      right-toolbar="sync-scroll fullscreen"
                      mode="edit"
                    />
                    <el-button
                      type="primary"
                      icon="el-icon-check"
                      class="button-base-icon"
                      style="float: right; margin: 10px;"
                      @click="updateComment(comment)"
                    />
                    <el-button
                      type="danger"
                      icon="el-icon-close"
                      class="button-base-icon"
                      style="float: right; margin-top: 10px;"
                      @click="comment.isEdit = !comment.isEdit"
                    />
                    <el-button
                      type="info"
                      plain
                      class="button-base-icon"
                      style="float: right; margin-top: 10px;"
                      @click="commentUpdate = ''"
                    >
                      <svg-icon icon-class="layers-clear" />
                    </el-button>
                    <el-checkbox
                      v-model="commentUpdatePreview"
                      :label="$t('issues.preview')"
                      :border="true"
                      style="float: right; margin-top: 10px;"
                    />
                  </span>
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-scrollbar>
        <span v-else>
          <el-timeline v-if="!isEmptyValue(currentIssues) && !isPanelNewRequest" style="padding-left: 15px;padding-right: 15px;">
            <el-timeline-item
              v-for="(comment, index) in listComments"
              :key="index"
              type="primary"
              :timestamp="translateDateByLong(comment.created)"
              style="margin-left: 10px;"
            >
              <span v-if="comment.issue_comment_type === 1">
                <svg-icon v-if="isEmptyValue(comment.user.avatar)" icon-class="user" />
                <el-image
                  :src="avatarResize(comment.user)"
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
                <b>
                  {{ comment.user.name }}
                </b>
                {{ logDisplayLanguaje(true, false) }}
                <b>
                  {{ labelDisplayChange(comment, true) }}
                </b>
                <span v-show="!isEmptyValue(labelDisplayChange(comment, false, true))">
                  {{ logDisplayLanguaje(false, true) }}
                </span>
                <b>
                  {{ labelDisplayChange(comment, false, true) }}
                </b>
              </span>
              <el-card v-else class="list-comments">
                <div slot="header" class="list-comments-clearfix">
                  <span>
                    <svg-icon icon-class="user" /> {{ comment.user_name }}
                  </span>
                  <el-dropdown trigger="click" style="float: right" @command="handleCommand">
                    <span class="el-dropdown-link">
                      <el-button type="text" size="mini" style="color: black;">
                        <b>
                          <svg-icon icon-class="more-vertical" />
                        </b>
                      </el-button>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item icon="el-icon-edit" :disabled="validateUser(comment)" :command="{comment, option:'edit'}"> {{ $t('issues.edit') }} </el-dropdown-item>
                      <el-dropdown-item icon="el-icon-delete" :disabled="validateUser(comment)" :command="{comment, option:'delete'}"> {{ $t('issues.delete') }} </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
                <div>
                  <!-- <div v-if="!comment.isEdit" v-markdown="comment.result" class="output" /> -->
                  <v-md-preview v-if="!comment.isEdit" :text="comment.result" class="previwer-disable" style="padding: 0px" />
                  <span v-else>
                    <el-card v-if="commentUpdatePreview" shadow="never">
                      <el-scrollbar wrap-class="scroll-previwer-disable">
                        <v-md-preview :text="commentUpdate" class="previwer-disable" style="padding: 0px" height="150px" />
                      </el-scrollbar>
                      <!-- <v-md-preview v-if="commentUpdate" :text="comment.result" class="previwer-disable" style="padding: 0px" /> -->
                      <!-- <div v-markdown="commentUpdate" class="output" /> -->
                    </el-card>
                    <!-- <div v-if="commentUpdatePreview" v-markdown="comment.result" class="output" /> -->
                    <v-md-editor
                      v-else
                      v-model="commentUpdate"
                      height="150px"
                      left-toolbar="undo redo clear h bold italic strikethrough quote ul ol table hr link image code save | emoji listMailTemplates"
                      :toolbar="listOption"
                      right-toolbar="sync-scroll fullscreen"
                      mode="edit"
                    />
                    <el-button
                      type="primary"
                      icon="el-icon-check"
                      class="button-base-icon"
                      style="float: right; margin: 10px;"
                      @click="updateComment(comment)"
                    />
                    <el-button
                      type="danger"
                      icon="el-icon-close"
                      class="button-base-icon"
                      style="float: right; margin-top: 10px;"
                      @click="comment.isEdit = !comment.isEdit"
                    />
                    <el-button
                      type="info"
                      plain
                      class="button-base-icon"
                      style="float: right; margin-top: 10px;"
                      @click="commentUpdate = ''"
                    >
                      <svg-icon icon-class="layers-clear" />
                    </el-button>
                    <el-checkbox
                      v-model="commentUpdatePreview"
                      :label="$t('issues.preview')"
                      :border="true"
                      style="float: right; margin-top: 10px;"
                    />
                  </span>
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </span>
      </el-header>
      <el-main height="auto" style="height: auto;overflow: auto;padding: 0px 0px 30px !important;">
        <div v-if="!isEmptyValue(currentIssues) && !isPanelNewRequest">
          <el-card v-if="commentPreview" shadow="never" class="is-add-new-comments">
            <!-- <v-md-preview :text="comments" height="200px" /> -->
            <!-- <div v-markdown="comments" class="output" /> -->
            <div slot="header">
              <b>
                {{ $t('issues.preview') }}
              </b>
            </div>
            <el-scrollbar wrap-class="scroll-previwer-disable">
              <v-md-preview :text="comments" class="previwer-disable" style="padding: 0px" height="150px" />
            </el-scrollbar>
          </el-card>
          <el-card v-else shadow="never" class="is-add-new-comments" style="padding: 0px;">
            <div slot="header">
              <b>
                {{ $t('issues.commentary') }}
              </b>
            </div>
            <v-md-editor
              v-model="comments"
              :placeholder="$t('issues.addNewCommentary')"
              height="150px"
              left-toolbar="undo redo clear h bold italic strikethrough quote ul ol table hr link image code save | emoji listMailTemplates"
              right-toolbar="isCollapseUp sync-scroll fullscreen"
              mode="edit"
              :toolbar="listOption"
            />
          </el-card>
          <el-button
            type="primary"
            icon="el-icon-check"
            class="button-base-icon"
            style="float: right; margin: 10px;"
            :disabled="isEmptyValue(comments)"
            @click="addNewComments()"
          />
          <el-button
            type="danger"
            icon="el-icon-close"
            style="float: right;margin-top: 10px;"
            class="button-base-icon"
            @click="cancelEdit(currentIssues)"
          />
          <el-button
            type="info"
            plain
            style="float: right; margin-top: 10px;"
            class="button-base-icon"
            :disabled="isEmptyValue(comments)"
            @click="clearComments()"
          >
            <svg-icon icon-class="layers-clear" />
          </el-button>
          <el-checkbox
            v-model="commentPreview"
            :label="$t('issues.preview')"
            :border="true"
            style="float: right; margin-top: 10px;"
            class="button-base-icon"
            :disabled="isEmptyValue(comments)"
          />
        </div>
      </el-main>
    </el-container>
  </span>
</template>

<script>
import {
  defineComponent, computed, ref, watch, nextTick
} from '@vue/composition-api'

import lang from '@/lang'
import store from '@/store'

// Components and Mixins
import 'simple-m-editor/dist/simple-m-editor.css'
import RecordTime from '../recordTime.vue'

// Constants
import { REQUEST_WINDOW_UUID } from '@/utils/ADempiere/dictionary/form/Issues.js'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere'
import { showMessage } from '@/utils/ADempiere/notification'
import { translateDateByLong, formatDate } from '@/utils/ADempiere/formatValue/dateFormat'
import { zoomIn } from '@/utils/ADempiere/coreUtils.js'
import { getImagePath } from '@/utils/ADempiere/resource.js'

// Api Request Methods
import {
  requestListSalesRepresentatives,
  requestListRequestTypes,
  requestListStatuses,
  requestListPriorities
} from '@/api/ADempiere/user-interface/component/issue'

export default defineComponent({
  name: 'IssueComment',

  components: {
    RecordTime
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

  setup(props, { refs }) {
    // Const
    const tableName = props.tableName
    const recordId = props.recordId
    // Ref
    const subject = ref('')
    const currentSalesReps = ref('')
    const currentRequestTypes = ref('')
    const currentStatus = ref('')
    const currentPriority = ref('')
    const currentDateNextAction = ref('')
    const newDateNextAction = ref(new Date())
    const summary = ref('')
    const updateSummary = ref('')
    const comments = ref('')
    const commentUpdate = ref('')
    const markdownContent = ref('')
    const commentUpdatePreview = ref(false)
    const commentPreview = ref(false)
    const summaryUpdatePreview = ref(false)
    const summaryNewPreview = ref(false)
    const isPanelNewRequest = ref(false)
    const isPanelEditRequest = ref(false)
    const scrollTimeLineTabComments = ref(null)
    const scrollIssues = ref(null)
    // List
    const listSalesReps = ref([])
    const listIssuesTypes = ref([])
    const listStatuses = ref([])
    const listPriority = ref([])
    const isCollapseComments = ref(false)
    const isLoadingNewIssues = ref(false)
    const centerDialogVisible = ref(false)

    currentSalesReps.value = store.getters['user/userInfo'].id

    const listOption = computed(() => {
      const listMailTemplates = store.getters.getListMailTemplates
      listMailTemplates.isCollapseDown = {
        icon: 'el-icon-arrow-down',
        title: 'Collapse',
        action(editor) {
          isCollapseComments.value = !isCollapseComments.value
        }
      }
      listMailTemplates.isCollapseUp = {
        icon: 'el-icon-arrow-up',
        title: 'Collapse',
        action(editor) {
          isCollapseComments.value = !isCollapseComments.value
        }
      }
      return listMailTemplates
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

    const isDisabledSave = computed(() => {
      return isEmptyValue(subject.value) ||
      isEmptyValue(currentSalesReps.value) ||
      isEmptyValue(currentRequestTypes.value) ||
      isEmptyValue(currentStatus.value) ||
      isEmptyValue(currentPriority.value) ||
      isEmptyValue(summary.value)
    })

    const currentIssues = computed(() => {
      return store.getters.getCurrentIssues
    })

    const userId = computed(() => {
      return store.getters['user/userInfo'].id
    })

    const isShowTitleForm = computed(() => {
      return store.getters.getIsShowTitleForm
    })

    const isPanelEditIssues = computed(() => {
      if (isEmptyValue(currentIssues.value)) return false
      return currentIssues.value.isEdit
    })

    const listComments = computed(() => {
      return store.getters.getListComments
    })

    const currentRequestTypesLabel = computed(() => {
      if (!isEmptyValue(currentRequestTypes.value) && !isEmptyValue(listIssuesTypes.value)) {
        return listIssuesTypes.value.find(list => list.id === currentRequestTypes.value)
      }
      return ''
    })

    const currentPriorityLabel = computed(() => {
      if (!isEmptyValue(currentPriority.value) && !isEmptyValue(listPriority.value)) {
        return listPriority.value.find(list => list.value === currentPriority.value)
      }
      return ''
    })

    const currentSalesRepsLabel = computed(() => {
      if (!isEmptyValue(currentSalesReps.value) && !isEmptyValue(listSalesReps.value)) {
        return listSalesReps.value.find(list => list.id === currentSalesReps.value)
      }
      return ''
    })

    const currentStatusLabel = computed(() => {
      if (!isEmptyValue(currentStatus.value) && !isEmptyValue(listStatuses.value)) {
        return listStatuses.value.find(list => list.id === currentStatus.value)
      }
      return ''
    })

    const getFixedHeader = computed(() => {
      return store.getters['settings/getFixedHeader']
    })

    function findSalesReps(isVisible, searchValue) {
      return new Promise((resolve, reject) => {
        if (!isVisible) {
          resolve([])
        }
        loadingSales.value = true
        requestListSalesRepresentatives({
          searchValue
        })
          .then(response => {
            const { records } = response
            listSalesReps.value = records
            resolve(records)
          })
          .catch(error => {
            showMessage({
              message: error.message,
              type: 'warning'
            })
            resolve([])
          })
          .finally(() => {
            loadingSales.value = false
          })
      })
    }

    const loadingSales = ref(false)

    function remoteMethodSales(query) {
      if (!isEmptyValue(query) && query.length > 1) {
        findSalesReps(true, query)
      }
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

    function findStatus(isVisible) {
      let requestTypeId = currentRequestTypes.value
      if (!isVisible) {
        return
      }
      if (!isEmptyValue(currentIssues.value) && !isPanelNewRequest.value) {
        requestTypeId = currentIssues.value.request_type.id
      }
      requestListStatuses({
        requestTypeId
      })
        .then(response => {
          const { records } = response
          listStatuses.value = records
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

    function saveIssues() {
      isLoadingNewIssues.value = true
      summaryNewPreview.value = false
      store.dispatch('newIssues', {
        tableName,
        recordId,
        subject: subject.value,
        summary: summary.value,
        requestTypeId: currentRequestTypes.value,
        salesRepresentativeId: currentSalesReps.value,
        statusId: currentStatus.value,
        priorityValue: currentPriority.value,
        dateNextAction: newDateNextAction.value
      })
        .then(response => {
          store.commit('setCurrentIssues', response)
          store.dispatch('listComments', response)
            .then(response => {
              showMessage({
                message: 'OK',
                type: 'success'
              })
              isLoadingNewIssues.value = false
              isPanelNewRequest.value = false
            })
        })
        .catch(error => {
          isLoadingNewIssues.value = false
          showMessage({
            message: error.message,
            type: 'warning'
          })
        })
    }

    function updateIssuesSalesReps(newValue) {
      const {
        id,
        uuid,
        subject,
        summary
      } = currentIssues.value
      store.dispatch('editIssues', {
        id,
        uuid,
        subject,
        summary,
        requestTypeId: currentIssues.value.request_type.id,
        requestTypeUuid: currentIssues.value.request_type.uuid,
        salesRepresentativeId: newValue,
        priorityValue: currentIssues.value.priority.value
      })
      // refs.updateSalesReps.showPopper = false
    }

    function updateIssuesTypeRequest(newValue) {
      const {
        id,
        uuid,
        subject,
        summary
      } = currentIssues.value
      store.dispatch('editIssues', {
        id,
        uuid,
        subject,
        summary,
        requestTypeId: newValue,
        salesRepresentativeId: currentIssues.value.sales_representative.id,
        salesRepresentativeUuid: currentIssues.value.sales_representative.uuid,
        priorityValue: currentIssues.value.priority.value,
        statusId: currentIssues.value.status.id
      })
      // refs.typeOfRequest.showPopper = false
      // refs.typeOfRequest.activated = false
    }
    function updateIssuesSummary(issues) {
      const {
        id,
        uuid,
        subject
      } = currentIssues.value
      store.dispatch('editIssues', {
        id,
        uuid,
        subject,
        summary: updateSummary.value,
        requestTypeId: currentIssues.value.request_type.id,
        requestTypeUuid: currentIssues.value.request_type.uuid,
        salesRepresentativeId: currentIssues.value.sales_representative.id,
        salesRepresentativeUuid: currentIssues.value.sales_representative.uuid,
        priorityValue: currentIssues.value.priority.value,
        statusId: currentIssues.value.status.id
      })
      editIssues(issues)
    }

    function updateIssuesPriority(newValue) {
      const {
        id,
        uuid,
        subject,
        summary
      } = currentIssues.value
      store.dispatch('editIssues', {
        id,
        uuid,
        subject,
        summary,
        requestTypeId: currentIssues.value.request_type.id,
        requestTypeUuid: currentIssues.value.request_type.uuid,
        salesRepresentativeId: currentIssues.value.sales_representative.id,
        salesRepresentativeUuid: currentIssues.value.sales_representative.uuid,
        priorityValue: newValue,
        statusId: currentIssues.value.status.id
      })
      // refs.updatePriority.showPopper = false
    }

    function updateIssuesStatus(newValue) {
      const {
        id,
        uuid,
        subject,
        summary
      } = currentIssues.value
      store.dispatch('editIssues', {
        id,
        uuid,
        subject,
        summary,
        requestTypeId: currentIssues.value.request_type.id,
        requestTypeUuid: currentIssues.value.request_type.uuid,
        salesRepresentativeId: currentIssues.value.sales_representative.id,
        salesRepresentativeUuid: currentIssues.value.sales_representative.uuid,
        priorityValue: currentIssues.value.priority.value,
        statusId: currentStatus.value
      })
      // refs.newStatus.showPopper = false
    }

    function updateIssuesDateNextAction(newValue) {
      const {
        id,
        uuid,
        subject,
        summary
      } = currentIssues.value
      store.dispatch('editIssues', {
        id,
        uuid,
        subject,
        summary,
        requestTypeId: currentIssues.value.request_type.id,
        requestTypeUuid: currentIssues.value.request_type.uuid,
        salesRepresentativeId: currentIssues.value.sales_representative.id,
        salesRepresentativeUuid: currentIssues.value.sales_representative.uuid,
        priorityValue: currentIssues.value.priority.value,
        statusId: currentIssues.value.status.id,
        dateNextAction: newValue
      })
      // refs.updateDate.showPopper = false
    }

    function exitPopover(popoverOption) {
      if (popoverOption === 'newtypeOfRequest') {
        findStatus(true)
        const requestType = this.listIssuesTypes.find(list => list.id === this.currentRequestTypes)
        const { default_status } = requestType
        // if (isEmptyValue(default_status.name)) return this.currentStatus = ''
        this.currentStatus = default_status.id
      }
      if (isEmptyValue(popoverOption)) return
    }

    function SelectionIssue(issues) {
      if (isPanelNewRequest.value) {
        isPanelNewRequest.value = !isPanelNewRequest.value
        return
      }
      isNewIssues.value = !isNewIssues.value
      store.dispatch('listRequest', {
        tableName,
        recordId
      })
      // store.dispatch('changeCurrentIssues', issues)
    }

    function editIssues(issues) {
      issues.isEdit = !issues.isEdit
      isPanelEditRequest.value = !isPanelEditRequest.value
      updateSummary.value = issues.summary
      store.dispatch('listRequest', {
        tableName,
        recordId
      })
    }

    function removeIssues(issues) {
      store.dispatch('deleteIssue', {
        ...issues,
        tableName,
        recordId
      })
      SelectionIssue()
    }

    function cancelEdit(issues) {
      isNewIssues.value = !isNewIssues.value
      store.dispatch('changeCurrentIssues', issues)
      store.dispatch('listRequest', {
        tableName,
        recordId
      })
    }

    function addNewComments(params) {
      const { id, uuid } = currentIssues.value
      store.dispatch('newIssueComment', {
        id,
        uuid,
        result: comments.value
      })
        .then(response => {
          nextTick(() => {
            scrollIssues.value.$el.scrollTop = scrollIssues.value.$el.scrollHeight
            // scrollTimeLineTabComments.value.$refs.wrap.scrollTop = 9999999
          })
        })
      clearComments()
      commentPreview.value = false
    }

    function clearComments() {
      comments.value = ''
    }

    function handleCommand(command) {
      const { comment, option } = command
      if (option === 'delete') {
        deleteComment(comment)
        return
      }
      editComment(comment)
    }

    function handleCommandIssues(command) {
      const { currentIssues, option } = command
      if (option === 'timeRecord') {
        return
      }
      if (option === 'delete') {
        removeIssues(currentIssues)
        return
      }
      if (option === lang.t('page.processActivity.zoomIn')) {
        zoomIssues(currentIssues)
        return
      }
      editIssues(currentIssues)
    }

    function editComment(comment) {
      comment.isEdit = true
      commentUpdate.value = comment.result
    }

    function deleteComment(comment) {
      const { id, uuid } = comment
      store.dispatch('deleteIssueComment', {
        id,
        uuid,
        issuesId: currentIssues.value.id,
        issuesUuid: currentIssues.value.uuid
      })
    }

    function updateComment(comment) {
      const { id, uuid } = comment
      comment.isEdit = false
      store.dispatch('updateIssueComment', {
        id,
        uuid,
        issuesId: currentIssues.value.id,
        issuesUuid: currentIssues.value.uuid,
        result: commentUpdate.value
      })
    }

    function labelDisplayChange(comment, isChange = false, isOption = false) {
      if (
        !isEmptyValue(comment.label) &&
        isChange
      ) {
        return comment.label
      }
      if (
        !isEmptyValue(comment.new_value) &&
        isOption
      ) {
        return comment.displayed_value
      }
      if (
        !isEmptyValue(comment.displayed_value) &&
        isOption
      ) {
        return comment.displayed_value
      }
      return ''
    }

    function logDisplayLanguaje(isChange = false, isOption = false) {
      if (isChange) {
        return lang.t('issues.change')
      }
      if (isOption) {
        return lang.t('issues.to')
      }
      return
    }
    function newIssues(issues) {
      isPanelNewRequest.value = !isPanelNewRequest.value
    }

    function loadListMail() {
      store.dispatch('findListMailTemplates')
    }

    function validateUser(comment) {
      return userId.value !== comment.user_id
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

    /**
     * Record TIme
     */

    const isMobile = computed(() => {
      return store.state.app.device === 'mobile'
    })

    const cssStyleButton = computed(() => {
      if (isMobile.value) {
        return 'padding-top: 20px;padding-bottom: 10px;text-align: center;margin-bottom: 0px !important;'
      }
      return 'padding-top: 35px;'
    })

    loadListMail()

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

    function defaultValueNewIssues() {
      findSalesReps(true)
        .then(() => {
          currentSalesReps.value = userId.value
        })
      newDateNextAction.value = new Date()
    }

    watch(isPanelEditIssues, (newValue, oldValue) => {
      if (!isEmptyValue(newValue) && newValue !== oldValue) {
        findRequestTypes(true)
        findSalesReps(true)
        findPriority(true)
      }
    })
    findSalesReps(true)

    return {
      // Ref
      subject,
      currentSalesReps,
      currentRequestTypes,
      currentStatus,
      currentPriority,
      currentDateNextAction,
      newDateNextAction,
      summary,
      comments,
      commentUpdate,
      commentUpdatePreview,
      commentPreview,
      summaryUpdatePreview,
      summaryNewPreview,
      updateSummary,
      isPanelEditRequest,
      scrollTimeLineTabComments,
      scrollIssues,
      isCollapseComments,
      isLoadingNewIssues,
      centerDialogVisible,
      cssStyleButton,
      loadingSales,
      // list
      listSalesReps,
      listIssuesTypes,
      listStatuses,
      listPriority,
      // Computed
      isNewIssues,
      isDisabledSave,
      currentIssues,
      listComments,
      isPanelEditIssues,
      currentRequestTypesLabel,
      currentPriorityLabel,
      currentSalesRepsLabel,
      currentStatusLabel,
      isShowTitleForm,
      isPanelNewRequest,
      getFixedHeader,
      listOption,
      isMobile,
      userId,
      // Methodos
      validateUser,
      findSalesReps,
      newIssues,
      findRequestTypes,
      findStatus,
      findPriority,
      saveIssues,
      SelectionIssue,
      cancelEdit,
      updateIssuesSalesReps,
      updateIssuesTypeRequest,
      updateIssuesPriority,
      updateIssuesStatus,
      updateIssuesDateNextAction,
      defaultValueNewIssues,
      addNewComments,
      clearComments,
      translateDateByLong,
      formatDate,
      handleCommand,
      deleteComment,
      updateComment,
      editComment,
      editIssues,
      updateIssuesSummary,
      removeIssues,
      handleCommandIssues,
      exitPopover,
      labelDisplayChange,
      logDisplayLanguaje,
      loadListMail,
      zoomIssues,
      avatarResize,
      remoteMethodSales,
      markdownContent
    }
  }
})
</script>

<style>
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
</style>
<style lang="scss">
.dialog-issues {
  // .el-dialog.is-fullscreen {
  //   height: unset;
  // }
  .el-dialog__header {
    padding: 20px;
    background: transparent;
  }
  .el-dialog--center .el-dialog__body {
    padding: 0px 10px;
  }
}
.scroll-option-from-issues {
  overflow-y: hidden;
  max-width: 545px;
}
.scroll-comments {
  max-height: 320px;
}
.scroll-comments-fixed-header {
  max-height: 320px;
}
.scroll-timeline-from {
  max-height: 240px;
}
.scroll-previwer-disable {
  max-height: 160px;
}
.divider-vertical {
  height: auto !important;
  width: 2px !important;
}
.divider-issues-horizontal {
  margin: 0px;
  padding: 0px;
}
.option-setting {
  .el-form-item--medium .el-form-item__content {
    line-height: 50px;
  }
}
.comments-card .is-always-shadow {
  border: 1px solid #e6ebf5;
  border-radius: 4px;
  padding: 0px;
}
.is-add-new-comments {
  .el-card__header{
    padding-top: 10px;
    padding-right: 0px;
    padding-bottom: 10px;
    padding-left: 10px;
  }
  .el-card__body {
    padding: 0px;
  }
}
.v-md-editor__menu--list {
  max-height: 110px;
  overflow: auto;
}
.comments-card {
  .comments-card .el-card__header {
    padding-top: 5px;
    padding-right: 0px;
    padding-bottom: 5px;
    padding-left: 0px;
    border-bottom: 1px solid #e6ebf5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border: 1px solid #e6ebf5;
    border-radius: 4px;
  }
  .el-card__header {
    padding: 5px;
    border: 1px solid #e6ebf5;
    border-radius: 4px;
  }
  .el-card__header:hover {
    border-radius: 4px;
    border: 1px solid #36a3f7;
  }
  .el-card__body {
    padding: 0px !important;
    border: 1px solid #e6ebf5;
    border-radius: 4px;
  }
}
.form-comments {
  .el-form-item--medium .el-form-item__label {
    line-height: 20px;
    padding: 0px;
  }
}
.el-card .card-summary .is-hover-shadow {
  height: 100% !important;
}
.list-comments {
  .comments-card .el-card__header {
    padding-top: 5px;
    padding-right: 10px;
    padding-bottom: 5px;
    padding-left: 10px;
    border-bottom: 1px solid #e6ebf5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .el-card__header {
    padding-top: 5px;
    padding-right: 10px;
    padding-bottom: 5px;
    padding-left: 10px;
    border-bottom: 1px solid #e6ebf5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .el-card__body {
    padding-top: 0px !important;
    padding-right: 10px;
    padding-bottom: 0px!important;
    padding-left: 10px;
  }
}
.card-summary {
  border: 1px solid #e6ebf5;
  border-radius: 4px;
}
.comments-card .el-card__body {
  height: 100% !important;
}
.card-summary:hover {
  border-radius: 4px;
  border: 1px solid #36a3f7;
}
.card-options {
  border: 1px solid #e6ebf5;
  border-radius: 4px;
}
.card-options:hover {
  border: 1px solid;
  border-radius: 4px;
  border: 1px solid #36a3f7;
}
.previwer-disable {
  width: 100%;
  .github-markdown-body {
    padding: 10px;
    width: 100%;
  }
}
</style>
