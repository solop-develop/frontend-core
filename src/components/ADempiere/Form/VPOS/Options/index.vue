<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com https://github.com/EdwinBetanc0urt
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
  <div>
    <div style="text-align: center">
      <b>{{ $t('form.pos.title') }}</b>
      <br>
      {{ $t('form.pos.optionsPoinSales.title') }}
      <el-button
        v-if="isMobile"
        type="danger"
        icon="el-icon-close"
        style="position: absolute;right: 1%;top: 2%;"
        @click="isShowedPOSOptions = !isShowedPOSOptions"
      />
      <hr>
    </div>
    <modal-dialog
      :parent-uuid="processPos"
      :container-uuid="processPos"
      panel-type="From"
    />
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item :title="$t('form.pos.optionsPoinSales.salesOrder.title')" name="salesOrder">
        <el-row :gutter="12" style="padding-right: 10px;">
          <el-col :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <p
                style="cursor: pointer; text-align: center !important; color: black;min-height: 50px;"
                @click="!allowsCreateOrder ? validateOption($t('form.pos.pinMessage.newOrder'), 'IsAllowsCreateOrder') : newOrder()"
              >
                <i class="el-icon-news" />
                <br>
                {{ $t('form.pos.optionsPoinSales.salesOrder.newOrder') }}
              </p>
            </el-card>
          </el-col>

          <el-col :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <el-popover
                v-model="showListOrdes"
                placement="right"
                trigger="click"
                width="1200"
                @show="seeOrderList"
              >
                <orders-list
                  :parent-metadata="metadata"
                  :show-field="showFieldListOrder"
                />
                <p
                  slot="reference"
                  :style="blockOption"
                >
                  <el-button
                    type="text"
                    style="min-height: 50px;width: -webkit-fill-available;white-space: normal;"
                    @click="openListOrdes()"
                  >
                    <svg-icon icon-class="list" />
                    <br>
                    {{ $t('form.pos.optionsPoinSales.salesOrder.ordersHistory') }}
                  </el-button>
                </p>
              </el-popover>
            </el-card>
          </el-col>

          <el-col :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <el-popover
                v-if="!isMobile"
                v-model="isShowResource"
                placement="right"
                trigger="click"
                width="1200"
              >
                <table-time-control
                  v-if="isShowResource"
                />
                <p
                  slot="reference"
                  :style="blockOption"
                >
                  <el-button
                    type="text"
                    style="min-height: 50px;width: -webkit-fill-available;white-space: normal;"
                    @click="openListResource()"
                  >
                    <svg-icon icon-class="list" />
                    <br>
                    {{ $t('timeControl.addResource') }}
                  </el-button>
                </p>
              </el-popover>
              <el-button
                v-else
                type="text"
                style="min-height: 50px;width: -webkit-fill-available;white-space: normal;"
                @click="openListResource(!isShowResource)"
              >
                <svg-icon icon-class="list" />
                <br>
                {{ $t('timeControl.addResource') }}
              </el-button>
            </el-card>
          </el-col>

          <!-- generateImmediateInvoice -->
          <el-col :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <p
                :class="classblockOption"
                @click="adviserPin ? validateOption($t('form.pos.optionsPoinSales.salesOrder.generateImmediateInvoice')) : generateImmediateInvoice()"
              >
                <i class="el-icon-document-add" />
                <br>
                {{ $t('form.pos.optionsPoinSales.salesOrder.generateImmediateInvoice') }}
              </p>
            </el-card>
          </el-col>

          <!-- completePreparedOrder -->
          <el-col :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <p
                :class="(isEmptyValue(currentOrder.uuid) || currentOrder.documentStatus.value !== 'DR') ? 'is-disabled-option-card' : 'is-enable-option-card'"
                @click="adviserPin ? validateOption($t('form.pos.optionsPoinSales.salesOrder.completePreparedOrder')) : completePreparedOrder()"
              >
                <i class="el-icon-success" />
                <br>
                {{ $t('form.pos.optionsPoinSales.salesOrder.completePreparedOrder') }}
              </p>
            </el-card>
          </el-col>

          <!-- cancelSaleTransaction -->
          <el-col v-if="allowsReturnOrder" :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <el-popover
                v-model="visibleReverse"
                placement="top"
                width="450"
              >
                <el-row v-if="!isLoadingReverse" :gutter="24" class="container-reverse">
                  <el-col :span="24" class="container-reverse">
                    <p class="container-popover">
                      <b class="container-popover">
                        {{ $t('data.addDescription') }}
                      </b>
                    </p>
                  </el-col>
                  <el-col :span="24">
                    <el-input
                      v-model="messageReverseSales"
                      type="textarea"
                      :rows="2"
                      :placeholder="$t('data.addDescription')"
                      style=""
                    />
                  </el-col>
                  <el-col :span="24">
                    <samp class="spam-button">
                      <el-button
                        type="danger"
                        icon="el-icon-close"
                        style="background: #ff6d6d;border-color: #ff6d6d;background-color: #ff6d6d;"
                        @click="messageReverseSales = false"
                      />
                      <el-button
                        type="primary"
                        style="background: #46a6ff;border-color: #46a6ff;background-color: #46a6ff;"
                        icon="el-icon-check"
                        @click="reverseSalesTransaction()"
                      />
                    </samp>
                  </el-col>
                </el-row>
                <div
                  v-else
                  key="form-loading"
                  v-loading="isLoadingReverse"
                  :element-loading-text="$t('notifications.loading')"
                  :element-loading-spinner="'el-icon-loading'"
                  element-loading-background="rgba(255, 255, 255, 0.8)"
                  class="view-loading"
                />
                <el-button
                  slot="reference"
                  type="text"
                  :class="isEmptyValue(currentOrder.uuid) ? 'is-disabled-option-popover' : 'is-enable-option-popover'"
                >
                  <i class="el-icon-error" />
                  <br>
                  {{ $t('form.pos.optionsPoinSales.salesOrder.cancelSaleTransaction') }}
                </el-button>
              </el-popover>
            </el-card>
          </el-col>

          <!-- printTicket -->
          <el-col v-if="isAllowsPrintDocument" :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <el-button
                type="text"
                :disabled="isEmptyValue(currentOrder.uuid) || !isAllowsPrintDocument || isLoadingPrintTicket"
                :loading="isLoadingPrintTicket"
                style="overflow: hidden; text-overflow: ellipsis; white-space: normal;"
                @click="printTicket()"
              >
                <i class="el-icon-printer" />
                <br><br>
                {{ $t('form.pos.optionsPoinSales.salesOrder.print') }}
              </el-button>
            </el-card>
          </el-col>

          <!-- printTicketPreviwer -->
          <el-col v-if="IsAllowsPreviewDocument" :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <el-button
                type="text"
                :disabled="isEmptyValue(currentOrder.uuid) || !IsAllowsPreviewDocument || isLoadingPrintPreview"
                :loading="isLoadingPrintPreview"
                style="overflow: hidden; text-overflow: ellipsis; white-space: normal;"
                @click="printPreview()"
              >
                <i class="el-icon-printer" />
                <br><br>
                {{ $t('form.pos.optionsPoinSales.salesOrder.preview') }}
              </el-button>
            </el-card>
          </el-col>

          <!-- createNewReturnOrder -->
          <el-col :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <p
                :class="classblockOption"
                @click="adviserPin ? validateOption($t('form.pos.optionsPoinSales.salesOrder.createNewReturnOrder')) : createNewCustomerReturnOrder()"
              >
                <i class="el-icon-refresh-left" />
                <br>
                {{ $t('form.pos.optionsPoinSales.salesOrder.createNewReturnOrder') }}
              </p>
            </el-card>
          </el-col>

          <!-- copyOrder -->
          <el-col :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <p
                :class="classblockOption"
                @click="adviserPin ? validateOption($t('form.pos.optionsPoinSales.salesOrder.copyOrder')) : copyOrder()"
              >
                <i class="el-icon-document-copy" />
                <br>
                {{ $t('form.pos.optionsPoinSales.salesOrder.copyOrder') }}
              </p>
            </el-card>
          </el-col>

          <!-- cancelOrder -->
          <el-col :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <p
                :style="blockOption"
                :class="(isEmptyValue(currentOrder.uuid) || isProcessed) ? 'is-disabled-option-card' : 'is-enable-option-card'"
                @click="adviserPin ? validateOption($t('form.pos.optionsPoinSales.salesOrder.cancelOrder')) : deleteOrder()"
              >
                <i class="el-icon-close" />
                <br>
                {{ $t('form.pos.optionsPoinSales.salesOrder.cancelOrder') }}
              </p>
            </el-card>
          </el-col>

          <!-- confirmDelivery -->
          <el-col :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <el-popover
                v-model="popoverConfirmDelivery"
                placement="right"
                trigger="click"
                width="900"
                :disabled="!isProcessed"
              >
                <confirm-delivery
                  :is-selectable="false"
                  :is-visible="popoverConfirmDelivery"
                  popover-name="isShowPopoverMenu"
                />
                <div
                  slot="reference"
                  :class="classOptionPopoverConfirmDelivery"
                  @click="openDelivery()"
                >
                  <svg-icon icon-class="shopping" />
                  <br>
                  {{ $t('form.pos.optionsPoinSales.salesOrder.confirmDelivery') }}
                </div>
              </el-popover>
            </el-card>
          </el-col>

          <!-- confirmDelivery -->
          <el-col :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <el-popover
                v-model="popoverDeliverAllProducts"
                placement="right"
                trigger="click"
                width="900"
              >
                <confirm-delivery
                  :is-selectable="false"
                  :is-visible="popoverDeliverAllProducts"
                  :is-complete-products="true"
                  popover-name="isShowPopoverMenu"
                />
                <div
                  slot="reference"
                  :class="(isEmptyValue(currentOrder.uuid) || !isProcessed || !isAllowsConfirmShipmentByOrder) ? 'is-disabled-option-card' : 'is-enable-option-card'"
                  @click="openAllProducts()"
                >
                  <svg-icon icon-class="shopping" />
                  <br>
                  {{ $t('form.pos.optionsPoinSales.salesOrder.deliverAllProducts') }}
                </div>
              </el-popover>
            </el-card>
          </el-col>

          <!-- applyDiscountOnOrder -->
          <el-col :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <el-popover
                v-model="showCount"
                width="350"
                :title="$t('form.pos.applyDiscountOnOrder')"
                placement="top"
              >
                <div style="padding: 20px;">
                  <discount-order
                    ref="applyDiscountOnOrder"
                    v-shortkey="showCount ? {close: ['esc'], enter: ['enter']} : {}"
                    @shortkey.native="theActionDiscount"
                  />
                </div>
                <div style="text-align: right; margin: 0">
                  <el-button
                    type="danger"
                    class="custom-button-create-bp"
                    icon="el-icon-close"
                    @click="showCount = false"
                  />
                  <el-button
                    type="primary"
                    class="custom-button-create-bp"
                    icon="el-icon-check"
                    @click="applyDiscount(discountAmount)"
                  />
                </div>
                <el-button
                  slot="reference"
                  type="text"
                  :class="classOptionPopoverDiscuent"
                >
                  <i class="el-icon-document-remove" />
                  <br>
                  {{ $t('form.pos.applyDiscountOnOrder') }}
                </el-button>
              </el-popover>
            </el-card>
          </el-col>

          <!-- salesDiscountOff -->
          <el-col v-if="isAllowsApplyDiscount" :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover">
              <el-popover
                v-model="showSalesDiscount"
                width="350"
                :title="$t('form.pos.salesDiscountOff')"
                placement="top"
              >
                <div style="padding: 20px;">
                  <sales-discount-off
                    ref="salesDiscountOff"
                    v-shortkey="showSalesDiscount ? {close: ['esc'], enter: ['enter']} : {}"
                    @shortkey.native="theActionSalesDiscountOff"
                  />
                </div>
                <div style="text-align: right; margin: 0">
                  <el-button
                    type="danger"
                    class="custom-button-create-bp"
                    icon="el-icon-close"
                    @click="showSalesDiscount = false"
                  />
                  <el-button
                    type="primary"
                    class="custom-button-create-bp"
                    icon="el-icon-check"
                    @click="salesDiscount(discountRateOff)"
                  />
                </div>
                <el-button
                  slot="reference"
                  type="text"
                  :disabled="isOptionPopoverDiscuent"
                  :class="classOptionPopoverDiscuent"
                >
                  <i class="el-icon-document-remove" />
                  <br>
                  {{ $t('form.pos.salesDiscountOff') }}
                </el-button>
              </el-popover>
            </el-card>
          </el-col>
          <!-- applyDiscountToAllLines -->
          <el-col v-if="isAllowsApplyDiscount" :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover">
              <el-popover
                v-model="showDiscountAllLines"
                width="350"
                :title="$t('form.pos.applyDiscountToAllLines')"
                placement="top"
              >
                <div style="padding: 20px;">
                  <apply-discount-to-all-lines
                    ref="applyDiscountToAllLines"
                    v-shortkey="showDiscountAllLines ? {close: ['esc'], enter: ['enter']} : {}"
                    @shortkey.native="theActionDiscountAllLines"
                  />
                </div>
                <div style="text-align: right; margin: 0">
                  <el-button
                    type="danger"
                    class="custom-button-create-bp"
                    icon="el-icon-close"
                    @click="showDiscountAllLines = false"
                  />
                  <el-button
                    type="primary"
                    class="custom-button-create-bp"
                    icon="el-icon-check"
                    @click="applyDiscountToAllLines(discountRateAllLines)"
                  />
                </div>
                <el-button
                  slot="reference"
                  type="text"
                  :disabled="isOptionPopoverDiscuent"
                  :class="classOptionPopoverDiscuent"
                >
                  <i class="el-icon-document-remove" />
                  <br>
                  {{ $t('form.pos.applyDiscountToAllLines') }}
                </el-button>
              </el-popover>
            </el-card>
          </el-col>
          <el-col v-if="allowsReturnOrder" :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <p
                style="cursor: pointer; text-align: center !important; color: black;min-height: 50px;max-width: 100px;"
                @click="openReturnProduct()"
              >
                <el-dialog
                  :title="$t('form.pos.returnProduct')"
                  :visible.sync="showReturnProduct"
                  :center="true"
                  :modal="false"
                  :append-to-body="true"
                  custom-class="dialog-return-product"
                  width="90%"
                >
                  <return-product />
                </el-dialog>
                <i class="el-icon-box" />
                <svg-icon icon-class="undo" />
                <br>
                {{ $t('form.pos.returnProduct') }}
              </p>
            </el-card>
          </el-col>
          <!-- Create New Order RMA -->
          <el-col v-if="isOnlyRMA" :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <p
                :class="classblockOption"
                @click="adviserPin ? validateOption($t('form.pos.optionsPoinSales.salesOrder.newOrderFromRMA')) : newOrderRMA()"
              >
                <i class="el-icon-document-copy" />
                <br>
                {{ $t('form.pos.optionsPoinSales.salesOrder.newOrderFromRMA') }}
              </p>
            </el-card>
          </el-col>
        </el-row>
      </el-collapse-item>

      <el-collapse-item :title="$t('form.pos.optionsPoinSales.cashManagement.title')" name="cashManagement">
        <el-row :gutter="12" style="padding-right: 10px;">
          <el-col v-if="isAllowsCashOpening" :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <p
                style="cursor: pointer; text-align: center !important; color: black;min-height: 50px;max-width: 100px;"
                @click="openCashOpening()"
              >
                <i class="el-icon-sell" />
                <br>
                {{ $t('form.pos.optionsPoinSales.cashManagement.cashOpening') }}
              </p>
            </el-card>
          </el-col>
          <el-col v-if="isAllowsCashWithdrawal" :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <p
                style="cursor: pointer; text-align: center !important; color: black;min-height: 50px;"
                @click="openCashWithdrawal()"
              >
                <i class="el-icon-money" />
                <br>
                {{ $t('form.pos.optionsPoinSales.cashManagement.cashwithdrawal') }}
              </p>
            </el-card>
          </el-col>
          <el-col v-if="isAllowsCashClosing" :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <p
                style="cursor: pointer; text-align: center !important; color: black;min-height: 50px;"
                @click="openCashClosing()"
              >
                <i class="el-icon-sold-out" />
                <br>
                {{ $t('form.pos.optionsPoinSales.cashManagement.closeBox') }}
              </p>
            </el-card>
          </el-col>
          <el-col v-if="isAllowsDetailCashClosing" :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <p
                style="cursor: pointer; text-align: center !important; color: black;min-height: 50px;"
                @click="openCashDetailsClosing()"
              >
                <i class="el-icon-sold-out" />
                <br>
                {{ $t('form.pos.optionsPoinSales.cashManagement.detailedCloseBox') }}
              </p>
            </el-card>
          </el-col>
          <el-col v-if="isAllowsAllocateSeller" :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <p
                style="cursor: pointer; text-align: center !important; color: black;min-height: 50px;"
                @click="adviserPin ? validateOption($t('form.pos.optionsPoinSales.cashManagement.assignSeller')) : assignSeller()"
              >
                <svg-icon icon-class="peoples" />
                <i class="el-icon-bottom-right" />
                <br>
                {{ $t('form.pos.optionsPoinSales.cashManagement.assignSeller') }}
              </p>
            </el-card>
          </el-col>
          <el-col v-if="isAllowsAllocateSeller" :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <p
                style="cursor: pointer; text-align: center !important; color: black;min-height: 50px;"
                @click="adviserPin ? validateOption($t('form.pos.optionsPoinSales.cashManagement.unassignSeller')) : unassignSeller()"
              >
                <svg-icon icon-class="peoples" />
                <i class="el-icon-top-right" />
                <br>
                {{ $t('form.pos.optionsPoinSales.cashManagement.unassignSeller') }}
              </p>
            </el-card>
          </el-col>
          <el-col v-if="isAllowsAllocateSeller" :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <p
                style="cursor: pointer; text-align: center !important; color: black;min-height: 50px;"
                @click="adviserPin ? validateOption($t('form.pos.optionsPoinSales.cashManagement.moneyIncome')) : moneyIncome()"
              >
                <i class="el-icon-money" />
                <br>
                {{ $t('form.pos.optionsPoinSales.cashManagement.moneyIncome') }}
              </p>
            </el-card>
          </el-col>
          <el-col :span="size" style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;">
            <el-card shadow="hover" style="height: 100px">
              <p
                style="cursor: pointer; text-align: center !important; color: black;min-height: 50px;"
                @click="isMnemonicCommand = !isMnemonicCommand"
              >
                <svg-icon icon-class="keyboard" />
                <br>
                {{ $t('form.mnemonicCommand.title') }}
              </p>
            </el-card>
          </el-col>
        </el-row>
      </el-collapse-item>

      <el-collapse-item :title="$t('form.pos.optionsPoinSales.generalOptions.title')" name="generalOptions">
        <general-options :metadata="metadata" />
      </el-collapse-item>
    </el-collapse>

    <el-dialog
      ref="dialog"
      class="options-dialog-pin"
      :title="$t('form.pos.pinMessage.pin') + attributePin.label"
      width="40%"
      :visible.sync="visible"
      :append-to-body="true"
    >
      <el-form autocomplete="off">
        <el-input
          id="pin"
          ref="pin"
          v-model="pin"
          v-shortkey="visible ? {close: ['esc'], enter: ['enter']} : {}"
          autofocus
          type="password"
          :placeholder="$t('form.pos.tableProduct.pin')"
          :focus="true"
          autocomplete="off"
          @shortkey.native="theAction"
        />
        <span style="float: right;">
          <el-button
            type="danger"
            icon="el-icon-close"
            @click="closePin"
          />
          <el-button
            type="primary"
            icon="el-icon-check"
            :loading="isLoadingPin"
            :disabled="isLoadingPin"
            @click="openPin(pin)"
          />
        </span>
      </el-form>
    </el-dialog>

    <el-dialog
      :title="$t('form.mnemonicCommand.title')"
      :visible.sync="isMnemonicCommand"
      close-on-press-escape
      width="70%"
      center
      class="dialog-seller"
    >
      <mnemonic-command />
    </el-dialog>
    <el-dialog
      v-shortkey="isComputedRender ? {close: ['esc'], enter: ['enter']} : {}"
      :title="$t(isLabelPanel)"
      :visible.sync="isComputedRender"
      :is-loaded-panel="isComputedRender"
      close-on-press-escape
      width="80%"
      center
      class="dialog-seller"
      @shortkey.native="cashManagementModal"
    >
      <component
        :is="isComponentRender"
        :shortkey-action="isAction"
        :label-panel="isLabelPanel"
        :current-panel="isOpenPanel"
      />
    </el-dialog>
    <el-drawer
      v-if="isMobile"
      :title="$t('timeControl.addResource')"
      :visible.sync="whatShowResource"
      :with-header="false"
      :before-close="closeResource"
      :modal-append-to-body="false"
      size="100%"
    >
      <table-time-control />
    </el-drawer>
    <el-dialog
      :visible.sync="showCashOpeningSummary"
      :append-to-body="true"
      :center="true"
      :title="summaryCashOpen.title"
    >
      <el-result
        v-if="!isEmptyValue(summaryCashOpen)"
        :icon="summaryCashOpen.type"
        :title="summaryCashOpen.label"
      />
      <div v-if="!isEmptyValue(summaryCashOpen)" style="border: 1px solid rgb(54, 163, 247);padding-left: 10px;padding-right: 10px;">
        <p class="total">
          <b>
            {{ $t('form.pos.collect.collectionAgent') }}:
          </b>
          <!-- {{ summaryCashOpen }} -->
          {{ summaryCashOpen.collectingAgentUuid.name }}
        </p>
        <p class="total">
          <b>
            {{ $t('field.container.description') }}:
          </b>
          {{ summaryCashOpen.description }}
        </p>
      </div>
      <el-container style="border: 1px solid rgb(211, 232, 248);padding-left: 10px;padding-right: 10px;">
        <el-main style="min-height: 150px;">
          <el-row :gutter="24">
            <template v-for="(payment) in summaryCashOpen.payments">
              <el-col :key="payment.uuid" :span="12" style="padding-left: 5px; padding-right: 5px;">
                <el-card :body-style="{ padding: '0px' }" style="max-height: 120px;">
                  <el-row>
                    <el-col :span="6" style="padding: 10px">
                      <el-image style="width: 100px; height: 100px" :src="imageCard(payment)" fit="contain" />
                    </el-col>
                    <el-col :span="18" style="padding-right: 0px;padding-left: 40px;">
                      <div style="padding-right: 10px; padding-top: 5%;">
                        <div class="top clearfix">
                          <span>
                            {{
                              payment.paymentMethod.name
                            }}
                          </span>
                        </div>
                        <div class="bottom clearfix" style="margin-top: 0px !important!">
                          <el-button
                            type="text"
                            class="button"
                            style="color: rgb(50, 54, 58); font-size: 13px; text-align: left; float: unset; padding-top: 5px;"
                          >
                            {{ payment.documentNo }}
                          </el-button>
                          <el-button
                            v-if="!isEmptyValue(payment.paymentDate)"
                            type="text"
                            class="button"
                            style="color: rgb(50, 54, 58); font-size: 13px; text-align: left; float: unset; padding-top: 5px;"
                          >
                            {{ formatDate(payment.paymentDate) }}
                          </el-button>
                          <div
                            slot="header"
                            class="clearfix"
                            style="padding-bottom: 20px;"
                          >
                            <p class="total">
                              <b style="float: right;">
                                {{ formatPrice(payment.amount, payment.currency.iso_code) }}
                              </b>
                            </p>
                          </div>
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                </el-card>
              </el-col>
            </template>
          </el-row>
        </el-main>
      </el-container>
      <span style="float: right;margin-top: 10px;">
        <el-button
          type="danger"
          class="custom-button-create-bp"
          icon="el-icon-close"
          @click="showCashOpeningSummary = !showCashOpeningSummary"
        />
        <el-button
          type="primary"
          class="custom-button-create-bp"
          icon="el-icon-check"
          @click="showCashOpeningSummary = !showCashOpeningSummary"
        />
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="showCashClose"
      :append-to-body="true"
      :center="true"
      width="80%"
      :title="$t(summaryCashClose.title)"
    >
      <el-result
        v-if="!isEmptyValue(summaryCashClose)"
        :icon="summaryCashClose.type"
        :title="$t(summaryCashClose.label)"
      />
      <el-card class="box-card" style="padding-left: 0px; padding-right: 0px">
        <el-table
          :data="summaryCashClose.listCashSummary"
          border
          height="250"
          style="width: 100%"
        >
          <el-table-column
            prop="payment_method_name"
            :label="$t('form.pos.collect.paymentMethods')"
          />
          <el-table-column
            prop="currency.iso_code"
            :label="$t('form.pos.collect.Currency')"
          />
          <el-table-column
            label="Monto"
            align="right"
          >
            <template slot-scope="scope">
              {{ formatPrice(scope.row.amount, scope.row.currency.iso_code) }}
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <span style="float: right;margin-top: 10px;">
        <el-button
          type="danger"
          class="custom-button-create-bp"
          icon="el-icon-close"
          @click="showCashClose = !showCashClose"
        />
        <el-button
          type="primary"
          class="custom-button-create-bp"
          icon="el-icon-check"
          @click="showCashClose = !showCashClose"
        />
      </span>
    </el-dialog>
    <!-- showReverseOrder -->
    <el-dialog
      :visible.sync="showReverseOrder"
      :append-to-body="true"
      :title="summaryReverseOrder.title"
    >
      <el-result
        v-if="!isEmptyValue(summaryReverseOrder)"
        :icon="summaryReverseOrder.type"
        :title="summaryReverseOrder.title"
      />
      <el-card class="box-card" style="padding-left: 0px; padding-right: 0px">
        <p class="total">
          <b>
            {{ $t('form.pos.collect.orderTotal') }}:
            {{ summaryReverseOrder.documentNo }}
          </b>
        </p>
      </el-card>
      <span style="float: right;margin-top: 10px;">
        <el-button
          type="danger"
          class="custom-button-create-bp"
          icon="el-icon-close"
          @click="showReverseOrder = !showReverseOrder"
        />
        <el-button
          type="primary"
          class="custom-button-create-bp"
          icon="el-icon-check"
          @click="showReverseOrder = !showReverseOrder"
        />
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="showSummaryReturnProduct"
      :append-to-body="true"
      :center="true"
      :title="$t('form.pos.returnProduct')"
      width="80%"
      custom-class="dialog-return-product"
    >
      <el-result
        v-if="!isEmptyValue(summaryReturnProduct)"
        :icon="summaryReturnProduct.type"
        :title="summaryReturnProduct.label"
      />
      <el-card class="box-card" style="padding-left: 0px; padding-right: 0px">
        <return-product-previwer
          :is-previwer="true"
        />
      </el-card>
      <span style="float: right;margin-top: 10px;">
        <el-checkbox
          v-model="isCreateNewSubstituteOrder"
          :label="$t('form.pos.orderRMA.createNewSubstituteOrder')"
          :border="true"
          style="margin-right: 10px"
        />
        <el-button
          type="danger"
          class="custom-button-create-bp"
          icon="el-icon-close"
          @click="showSummaryReturnProduct = !showSummaryReturnProduct"
        />
        <el-button
          type="primary"
          class="custom-button-create-bp"
          icon="el-icon-check"
          @click="closeReturnProductPreviwer()"
        />
      </span>
    </el-dialog>
    <el-dialog
      :title="$t('form.pos.optionsPoinSales.salesOrder.confirmDelivery')"
      :visible.sync="showDialogDelivery"
      :center="true"
      :modal="false"
      :append-to-body="true"
    >
      <span v-if="!isEmptyValue(summaryConfirmDelivery)">
        <el-result
          v-if="!isEmptyValue(summaryConfirmDelivery)"
          :icon="summaryConfirmDelivery.type"
          :title="$t('form.pos.optionsPoinSales.salesOrder.confirmDelivery')"
        />
        <p class="total">
          {{ $t('form.pos.order.BusinessPartnerCreate.businessPartner') }}:
          <b class="order-info">
            {{ summaryConfirmDelivery.businessPartner }}
          </b>
        </p>
        <p class="total">
          {{ $t('form.pos.order.order') }}:
          <b class="order-info">
            {{ summaryConfirmDelivery.documentNo }}
          </b>
        </p>
        <p class="total">
          {{ $t('form.pos.order.itemQuantity') }}:
          <b v-if="!isEmptyValue(summaryConfirmDelivery)" class="order-info">
            {{ summaryConfirmDelivery.getItemQuantity }}
          </b>
        </p>
        <p class="total">
          {{ $t('form.pos.order.numberLines') }}:
          <b v-if="!isEmptyValue(summaryConfirmDelivery)" class="order-info">
            {{ summaryConfirmDelivery.numberOfLines }}
          </b>
        </p>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-row :gutter="24">
          <el-col :span="24">
            <samp style="float: right; padding-right: 10px;">
              <el-button
                type="danger"
                class="custom-button-create-bp"
                icon="el-icon-close"
                @click="showDialogDelivery = !showDialogDelivery"
              />
              <el-button
                type="primary"
                class="custom-button-create-bp"
                icon="el-icon-check"
                @click="showDialogDelivery = !showDialogDelivery"
              />
            </samp>
          </el-col>
        </el-row>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// Components and Mixins
import OrdersList from '@/components/ADempiere/Form/VPOS/OrderList/index'
import ConfirmDelivery from '@/components/ADempiere/Form/VPOS/ConfirmDelivery'
import orderLineMixin from '@/components/ADempiere/Form/VPOS/Order/orderLineMixin.js'
import CashOpening from './CashOpening'
import ReturnProduct from './ReturnProduct'
import ReturnProductPreviwer from './ReturnProduct/previwer'
import CashSummaryMovements from './CashSummaryMovements'
import CashWithdrawal from './Cashwithdrawal'
import DiscountOrder from './DiscountOrder'
import AssignSeller from './AssignSeller'
import SalesDiscountOff from './SalesDiscountOff'
import applyDiscountToAllLines from './applyDiscountToAllLines'
import MnemonicCommand from './MnemonicCommand'
import ModalDialog from '@/components/ADempiere/Dialog'
import GeneralOptions from '@/components/ADempiere/Form/VPOS/Options/generalOptions.vue'
import TableTimeControl from '@/components/ADempiere/Form/TimeControl/table.vue'
import ComponentDialgo from '@/components/ADempiere/Form/VPOS/Options/MnemonicCommand/component.vue'

// API Request Methods
import {
  generateImmediateInvoice,
  withdrawal,
  createNewReturnOrder,
  deleteOrder,
  reverseSales,
  copyOrder,
  processOrder
} from '@/api/ADempiere/form/point-of-sales.js'
import {
  newOrderFromRMA
} from '@/api/ADempiere/form/ReturnRMA.js'
import { createShipment, shipments } from '@/api/ADempiere/form/point-of-sales.js'
import { validatePin } from '@/api/ADempiere/form/point-of-sales.js'

// Constants
import { REPORT_VIEWER_NAME } from '@/utils/ADempiere/constants/report'
// import posProcess from '@/utils/ADempiere/constants/posProcess'

// Utils and Helper Methods
import {
  buildLinkHref
} from '@/utils/ADempiere/resource.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { formatPrice, formatDate } from '@/utils/ADempiere/valueFormat.js'

export default {
  name: 'PointOfSalesOptions',

  components: {
    AssignSeller,
    CashOpening,
    CashSummaryMovements,
    CashWithdrawal,
    ConfirmDelivery,
    GeneralOptions,
    ModalDialog,
    SalesDiscountOff,
    applyDiscountToAllLines,
    DiscountOrder,
    OrdersList,
    TableTimeControl,
    MnemonicCommand,
    ComponentDialgo,
    ReturnProduct,
    ReturnProductPreviwer
  },

  mixins: [
    orderLineMixin
  ],

  props: {
    metadata: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      activeName: '',
      processPos: '',
      pin: '',
      isCreateNewSubstituteOrder: true,
      isAction: false,
      attributePin: {},
      validatePin: true,
      visible: false,
      showCount: false,
      showDiscountAllLines: false,
      showSalesDiscount: false,
      visibleReverse: false,
      isLoadingReverse: false,
      isLoadingPrintPreview: false,
      isLoadingPrintTicket: false,
      showFieldListOrder: false,
      messageReverseSales: '',
      showConfirmDelivery: false,
      isShowResource: false,
      isLoadingPin: false
      // isMnemonicCommand: false
    }
  },

  computed: {
    showSummaryReturnProduct: {
      get() {
        return this.$store.getters.getShowSummaryRMA
      },
      set(value) {
        this.$store.commit('setShowSummaryRMA', value)
      }
    },
    summaryReturnProduct() {
      return this.$store.getters.getSummaryRMA
    },
    showDialogDelivery: {
      get() {
        return this.$store.getters.getShowConfirmDelivery
      },
      set(value) {
        this.$store.commit('setShowConfirmDelivery', value)
      }
    },
    summaryConfirmDelivery: {
      get() {
        return this.$store.getters.getSummaryConfirmDelivery
      },
      set(value) {
        this.$store.commit('setSummaryConfirmDelivery', value)
      }
    },
    showReverseOrder: {
      get() {
        return this.$store.getters.getShowSummaryReverseOrder
      },
      set(value) {
        this.$store.commit('setShowSummaryReverseOrder', value)
      }
    },
    summaryReverseOrder: {
      get() {
        return this.$store.getters.getSummaryReverseOrder
      },
      set(value) {
        this.$store.commit('setSummaryReverseOrder', value)
      }
    },
    showCashClose: {
      get() {
        return this.$store.getters.getShowSummaryCashClose
      },
      set(value) {
        this.$store.commit('setShowSummaryCashClose', value)
      }
    },
    summaryCashClose: {
      get() {
        return this.$store.getters.getSummaryCashClose
      },
      set(value) {
        this.$store.commit('setSummaryCashClose', value)
      }
    },
    showCashOpeningSummary: {
      get() {
        return this.$store.getters.getShowSummaryCashOpen
      },
      set(value) {
        this.$store.commit('setShowSummaryCashOpen', value)
      }
    },
    summaryCashOpen: {
      get() {
        return this.$store.getters.getSummaryCashOpen
      },
      set(value) {
        this.$store.commit('setSummaryCashOpen', value)
      }
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    isShowedPOSOptions: {
      get() {
        return this.$store.getters.getIsShowPOSOptions
      },
      set(val) {
        this.$store.commit('setShowPOSOptions', val)
      }
    },
    isMnemonicCommand: {
      get() {
        return this.$store.getters.getModifyCommand
      },
      set(val) {
        this.$store.commit('setModifyCommand', val)
      }
    },
    isComputedRender: {
      get() {
        return this.$store.getters[this.isOpenPanel.getters]
      },
      set(value) {
        this.$store.commit(this.isOpenPanel.commit, value)
      }
    },
    isOpenPanel() {
      const isOpen = {}
      switch (true) {
        case this.isShowCashSummaryMovements:
          isOpen.getters = 'getIsShowCashSummaryMovements'
          isOpen.commit = 'setIsShowCashSummaryMovements'
          break
        case this.showCashOpen:
          isOpen.getters = 'getShowCashOpen'
          isOpen.commit = 'setshowCashOpen'
          break
        case this.showCashWithdrawl:
          isOpen.getters = 'getShowCashWithdrawl'
          isOpen.commit = 'setShowCashWithdrawl'
          break
        case this.showCashSummaryMovements:
          isOpen.getters = 'getShowCashSummaryMovements'
          isOpen.commit = 'setShowCashSummaryMovements'
          break
        case this.showAssignSeller:
          isOpen.getters = 'getShowAssignSeller'
          isOpen.commit = 'setShowAssignSeller'
          break
        case this.showUnassignSeller:
          isOpen.getters = 'getShowUnassignSeller'
          isOpen.commit = 'setShowUnassignSeller'
          break
        case this.showTransfer:
          isOpen.getters = 'getShowTransfer'
          isOpen.commit = 'setShowTransfer'
          break
        case this.showMoneyIncome:
          isOpen.getters = 'getShowMoneyIncome'
          isOpen.commit = 'setShowMoneyIncome'
          break
      }
      return isOpen
    },
    isLabelPanel() {
      let isLabel
      const baseTag = 'form.pos.optionsPoinSales.cashManagement.'
      switch (true) {
        case this.isShowCashSummaryMovements:
          isLabel = baseTag + 'detailedCloseBox'
          break
        case this.showCashOpen:
          isLabel = baseTag + 'cashOpening'
          break
        case this.showCashWithdrawl:
          isLabel = baseTag + 'cashwithdrawal'
          break
        case this.showCashSummaryMovements:
          isLabel = baseTag + 'closeBox'
          break
        case this.showAssignSeller:
          isLabel = baseTag + 'assignSeller'
          break
        case this.showUnassignSeller:
          isLabel = baseTag + 'unassignSeller'
          break
        case this.showTransfer:
          isLabel = baseTag + 'transfer'
          break
        case this.showMoneyIncome:
          isLabel = baseTag + 'moneyIncome'
          break
        default:
          isLabel = ''
          break
      }
      return isLabel
    },
    isComponentRender() {
      let component
      switch (true) {
        case this.showCashOpen:
        case this.showMoneyIncome:
          component = () => import('@/components/ADempiere/Form/VPOS/Options/CashOpening')
          this.clearField('Cash-Opening')
          break
        case this.showCashWithdrawl:
        case this.showTransfer:
          component = () => import('@/components/ADempiere/Form/VPOS/Options/Cashwithdrawal')
          this.clearField('Cash-Withdrawal')
          break
        case this.isShowCashSummaryMovements:
        case this.showCashSummaryMovements:
          component = () => import('@/components/ADempiere/Form/VPOS/Options/CashSummaryMovements')
          break
        case this.showAssignSeller:
        case this.showUnassignSeller:
          component = () => import('@/components/ADempiere/Form/VPOS/Options/AssignSeller')
          break
      }
      return component
    },
    isAllowsCashOpening() {
      const { isAllowsCashOpening } = this.currentPointOfSales
      return isAllowsCashOpening
    },
    isAllowsCashClosing() {
      return this.currentPointOfSales.isAllowsCashClosing
    },
    isAllowsDetailCashClosing() {
      return this.currentPointOfSales.isAllowsDetailCashClosing
    },
    isAllowsCashWithdrawal() {
      return this.currentPointOfSales.isAllowsCashWithdrawal
    },
    isAllowsAllocateSeller() {
      return this.currentPointOfSales.isAllowsAllocateSeller
    },
    isOnlyRMA() {
      return this.currentOrder.isRma
    },
    allowsConfirmShipment() {
      return this.currentPointOfSales.isAllowsConfirmShipment
    },
    isAllowsPrintDocument() {
      return this.currentPointOfSales.isAllowsPrintDocument
    },
    IsAllowsPreviewDocument() {
      return this.currentPointOfSales.isAllowsPreviewDocument
    },
    isAllowsConfirmShipmentByOrder() {
      return this.currentPointOfSales.isConfirmCompleteShipment
    },
    isDisplayCount() {
      return this.currentPointOfSales.isDisplayDiscount
    },
    infowOverdrawnInvoice() {
      if (this.$store.getters.getOverdrawnInvoice.attributePin) {
        return this.$store.getters.getOverdrawnInvoice.attributePin
      }
      return ''
    },
    allowsReturnOrder() {
      const { isAllowsReturnOrder } = this.$store.getters.posAttributes.currentPointOfSales
      if (isAllowsReturnOrder) {
        if (this.currentOrder.documentStatus.value === 'CO') return true
        return false
      }
      return isAllowsReturnOrder
      // return this.$store.getters.posAttributes.currentPointOfSales.isAllowsReturnOrder
    },
    allowsCreateOrder() {
      return this.$store.getters.posAttributes.currentPointOfSales.isAllowsCreateOrder
    },
    isShowOrdersList: {
      get() {
        return this.ordersList.isShowPopover
      },
      set(value) {
        if (!isEmptyValue(this.$route.query.pos)) {
          this.$store.commit('showListOrders', value)
        }
      }
    },
    showCashWithdrawl() {
      return this.$store.getters.getShowCashWithdrawl
    },
    showCashOpen() {
      return this.$store.getters.getShowCashOpen
    },
    showReturnProduct: {
      get() {
        return this.$store.getters.getShowReturnProduct
      },
      set(value) {
        this.$store.commit('setShowReturnProduct', value)
      }
    },
    isShowCashSummaryMovements() {
      return this.$store.getters.getIsShowCashSummaryMovements
    },
    showCashSummaryMovements() {
      return this.$store.getters.getShowCashSummaryMovements
    },
    showAssignSeller() {
      return this.$store.getters.getShowAssignSeller
    },
    showUnassignSeller() {
      return this.$store.getters.getShowUnassignSeller
    },
    showTransfer() {
      return this.$store.getters.getShowTransfer
    },
    showMoneyIncome() {
      return this.$store.getters.getShowMoneyIncome
    },
    adviserPin() {
      return this.$store.getters.posAttributes.currentPointOfSales.isPosRequiredPin
    },
    blockOption() {
      if (!isEmptyValue(this.currentOrder.uuid)) {
        return 'cursor: pointer; text-align: center !important; color: black;min-height: 50px;'
      }
      return 'cursor: not-allowed; text-align: center !important; color: gray;min-height: 50px;'
    },
    blockOptionIsProcess() {
      if (!isEmptyValue(this.currentOrder.uuid)) {
        return this.currentOrder.isProcessed
      }
      return true
    },
    isAllowsApplyDiscount() {
      if (!isEmptyValue(this.currentPointOfSales.isAllowsApplyDiscount)) return this.currentPointOfSales.isAllowsApplyDiscount
      return false
    },
    isOptionPopoverDiscuent() {
      if (!isEmptyValue(this.currentOrder.uuid) && this.currentOrder.grandTotal > 0) return this.currentOrder.isProcessed
      return true
    },
    classOptionPopoverDiscuent() {
      if (this.isOptionPopoverDiscuent) return 'is-disabled-option-popover'
      return 'is-enable-option-popover'
    },
    classOptionPopoverConfirmDelivery() {
      if (!this.isOptionPopoverDiscuent || !this.isProcessed || this.currentOrder.isDelivered) return 'is-disabled-option-popover'
      return 'is-enable-option-popover'
    },
    classblockOption() {
      if (!isEmptyValue(this.currentOrder.uuid)) return 'is-enable-option-card'
      return 'is-disabled-option-card'
    },
    size() {
      const size = this.$store.getters.getWidthLeft
      return 24 / size
    },
    discountAmount() {
      return this.$store.getters.getValueOfField({
        containerUuid: 'Discount-Order',
        columnName: 'Discount'
      })
    },
    discountRateOff() {
      return this.$store.getters.getValueOfField({
        containerUuid: 'Sales-Discount-Off',
        columnName: 'Discount'
      })
    },
    discountRateAllLines() {
      return this.$store.getters.getValueOfField({
        containerUuid: 'Sales-Discount-All-Lines',
        columnName: 'Discount'
      })
    },
    currentPointOfSales() {
      return this.$store.getters.posAttributes.currentPointOfSales
    },
    ordersList() {
      if (isEmptyValue(this.currentPointOfSales)) {
        return []
      }
      return this.currentPointOfSales.listOrder
    },
    currentOrder() {
      if (isEmptyValue(this.currentPointOfSales)) {
        return {
          documentType: {},
          documentStatus: {
            value: ''
          },
          totalLines: 0,
          grandTotal: 0,
          salesRepresentative: {},
          businessPartner: {
            value: '',
            uuid: ''
          }
        }
      }
      return this.currentPointOfSales.currentOrder
    },
    showListOrdes: {
      get() {
        return this.$store.getters.getShowList
      },
      set(value) {
        this.$store.commit('showListOrders', value)
      }
    },
    whatShowResource() {
      return this.$store.getters.getIsShowResource
    },
    // isShowResource: {
    //   get() {
    //     return this.$store.getters.getIsShowResource
    //   },
    //   set(value) {
    //     this.$store.commit('showListResources', value)
    //   }
    // },
    popoverConfirmDelivery: {
      get() {
        return this.$store.getters.getConfirmDelivery
      },
      set(value) {
        if (!isEmptyValue(this.currentOrder.uuid)) {
          this.$store.commit('setConfirmDelivery', value)
        }
      }
    },
    // deliverAllProducts
    popoverDeliverAllProducts: {
      get() {
        return this.$store.getters.getDeliverAllProducts
      },
      set(value) {
        if (!isEmptyValue(this.currentOrder.uuid)) {
          this.$store.commit('setDeliverAllProducts', value)
        }
      }
    },
    isProcessed() {
      if (!isEmptyValue(this.currentOrder.documentStatus.value) && this.currentOrder.documentStatus.value === 'CO') {
        return true
      }
      return false
    },
    isAllowsModifyDiscount() {
      return this.$store.getters.posAttributes.currentPointOfSales.isAllowsModifyDiscount
    }
  },

  watch: {
    visible(value) {
      if (value && !isEmptyValue(this.$refs)) {
        setTimeout(() => {
          this.focusPin()
        }, 300)
      }
    },
    showCount(value) {
      if (value && !isEmptyValue(this.$refs)) {
        setTimeout(() => {
          this.focusDiscount(value, 'applyDiscountOnOrder')
        }, 300)
      }
    },
    showDiscountAllLines(value) {
      if (value && !isEmptyValue(this.$refs)) {
        setTimeout(() => {
          this.focusDiscount(value, 'applyDiscountToAllLines')
        }, 300)
      }
    },
    showSalesDiscount(value) {
      if (value && !isEmptyValue(this.$refs)) {
        setTimeout(() => {
          this.focusDiscount(value, 'salesDiscountOff')
        }, 300)
      }
    }
  },

  methods: {
    formatDate,
    formatPrice,
    imageCard(typePayment) {
      let image
      switch (typePayment.tenderTypeCode) {
        case 'D':
          image = 'MobilePayment.jpg'
          break
        case 'P':
          image = 'Mobile.jpg'
          break
        case 'X':
          image = 'Cash.jpg'
          break
        case 'A':
          image = 'ACH.jpg'
          break
        case 'M':
          image = 'GiftCard.jpg'
          break
        case 'Z':
          image = 'Zelle.jpg'
          break
        default:
          image = 'Default.jpg'
          break
      }
      return require('@/image/ADempiere/pos/typePayment/' + image)
    },
    closeResource() {
      this.$store.commit('showListResources', false)
      if (this.isShowResource && this.isMobile) {
        this.isShowResource = false
      }
    },
    clearField(containerUuid) {
      this.$store.commit('updateValuesOfContainer', {
        containerUuid,
        attributes: [{
          columnName: 'PayAmt',
          value: 0
        }, {
          columnName: 'CollectingAgent_ID',
          value: undefined
        }, {
          columnName: 'Description',
          value: undefined
        }]
      })
    },
    openAllProducts() {
      if (!this.isProcessed || !this.isAllowsConfirmShipmentByOrder) {
        return
      }
      createShipment({
        posUuid: this.currentPointOfSales.uuid,
        orderUuid: this.currentOrder.uuid,
        salesRepresentativeUuid: this.currentPointOfSales.salesRepresentative.uuid,
        isCreateLinesFromOrder: true
      })
        .then(shipment => {
          this.$store.commit('setShipment', shipment)
          shipments({ shipmentUuid: shipment.uuid })
            .then(response => {
              this.$store.commit('setDeliveryList', response.records)
            })
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: error.message,
            duration: 1500,
            showClose: true
          })
        })
    },
    openDelivery() {
      if (!this.isProcessed) {
        return
      }
      createShipment({
        posUuid: this.currentPointOfSales.uuid,
        orderUuid: this.currentOrder.uuid,
        salesRepresentativeUuid: this.currentPointOfSales.salesRepresentative.uuid,
        isCreateLinesFromOrder: false
      })
        .then(shipment => {
          this.$store.commit('setShipment', shipment)
          shipments({ shipmentUuid: shipment.uuid })
            .then(response => {
              this.$store.commit('setDeliveryList', response.records)
            })
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: error.message,
            duration: 1500,
            showClose: true
          })
        })
    },
    theAction(event) {
      if (this.visible) {
        switch (event.srcKey) {
          case 'enter':
            this.openPin(this.pin)
            break
          case 'close':
            this.closePin()
            break
        }
      }
    },
    focusDiscount(value, ref) {
      this.$refs[ref].$children[0].$children[0].$children[0].$children[0].$children[1].isShowed = value
      this.$refs[ref].$children[0].$children[0].$children[0].$children[0].$children[1].$children[0].$children[0].focus()
    },
    theActionDiscount(event) {
      if (this.showCount) {
        switch (event.srcKey) {
          case 'enter':
            if (this.discountAmount > 1) this.applyDiscount(this.discountAmount)
            break
          case 'close':
            this.showCount = false
            this.$store.commit('updateValueOfField', {
              containerUuid: 'Discount-Order',
              columnName: 'Discount',
              value: ''
            })
            break
        }
      }
    },
    theActionDiscountAllLines(event) {
      if (this.showDiscountAllLines) {
        switch (event.srcKey) {
          case 'enter':
            if (this.discountRateAllLines > 1) this.applyDiscountToAllLines(this.discountRateAllLines)
            break
          case 'close':
            this.showDiscountAllLines = false
            this.$store.commit('updateValueOfField', {
              containerUuid: 'Sales-Discount-All-Lines',
              columnName: 'Discount',
              value: ''
            })
            break
        }
      }
    },
    theActionSalesDiscountOff(event) {
      if (this.showSalesDiscount) {
        switch (event.srcKey) {
          case 'enter':
            if (this.discountAmount > 0) this.salesDiscount(this.discountRateOff)
            break
          case 'close':
            this.showSalesDiscount = false
            this.$store.commit('updateValueOfField', {
              containerUuid: 'Sales-Discount-Off',
              columnName: 'Discount',
              value: ''
            })
            break
        }
      }
    },
    cashManagementModal(event) {
      if (this.isComputedRender) {
        switch (event.srcKey) {
          case 'close':
            this.$store.commit(this.isOpenPanel.commit, false)
            break
          case 'enter': {
            this.isAction = true
            break
          }
        }
      }
    },
    openReturnProduct() {
      this.$store.commit('setShowReturnProduct', true)
      this.$store.dispatch('openRMA', {
        sourceOrderId: this.currentPointOfSales.currentOrder.id,
        posId: this.currentPointOfSales.id
      })
    },
    openCashOpening() {
      if (!isEmptyValue(this.currentPointOfSales.displayCurrency)) {
        this.$store.dispatch('searchConversion', {
          conversionTypeUuid: this.currentPointOfSales.conversionTypeUuid,
          currencyFromUuid: this.currentPointOfSales.priceList.currency.uuid,
          currencyToUuid: this.currentPointOfSales.displayCurrency.uuid,
          conversionDate: this.formatDateToSend(this.currentPointOfSales.currentOrder.dateOrdered)
        })
      }
      const posUuid = this.currentPointOfSales.uuid
      this.$store.dispatch('listPaymentOpen', posUuid)
      this.$store.commit('setshowCashOpen', true)
    },
    openCashWithdrawal() {
      if (!isEmptyValue(this.currentPointOfSales.displayCurrency)) {
        this.$store.dispatch('searchConversion', {
          conversionTypeUuid: this.currentPointOfSales.conversionTypeUuid,
          currencyFromUuid: this.currentPointOfSales.priceList.currency.uuid,
          currencyToUuid: this.currentPointOfSales.displayCurrency.uuid,
          conversionDate: this.formatDateToSend(this.currentPointOfSales.currentOrder.dateOrdered)
        })
      }
      const posUuid = this.currentPointOfSales.uuid
      this.$store.dispatch('listPaymentWithdrawal', posUuid)
      this.$store.commit('setShowCashWithdrawl', true)
    },
    openCashClosing() {
      const posUuid = this.currentPointOfSales.uuid
      this.$store.dispatch('listCashSummary', posUuid)
      this.$store.commit('setShowCashSummaryMovements', true)
    },
    openCashDetailsClosing() {
      const posUuid = this.currentPointOfSales.uuid
      this.$store.dispatch('listCashMovementsSummary', posUuid)
      this.$store.commit('setIsShowCashSummaryMovements', true)
    },
    assignSeller() {
      this.$store.commit('setShowAssignSeller', true)
    },
    unassignSeller() {
      this.$store.commit('setShowUnassignSeller', true)
    },
    moneyIncome() {
      if (!isEmptyValue(this.currentPointOfSales.displayCurrency)) {
        this.$store.dispatch('searchConversion', {
          conversionTypeUuid: this.currentPointOfSales.conversionTypeUuid,
          currencyFromUuid: this.currentPointOfSales.priceList.currency.uuid,
          currencyToUuid: this.currentPointOfSales.displayCurrency.uuid,
          conversionDate: this.formatDateToSend(this.currentPointOfSales.currentOrder.dateOrdered)
        })
      }
      this.$store.commit('setShowMoneyIncome', true)
    },
    transfer() {
      this.$store.commit('setShowTransfer', true)
    },
    openListOrdes() {
      this.showFieldListOrder = true
    },
    openListResource(value) {
      if (this.isMobile) {
        this.isShowResource = value
        this.$store.commit('showListResources', value)
      }
      this.$store.commit('showListResources', true)
    },
    closePin() {
      this.visible = false
      this.$store.dispatch('changePopoverOverdrawnInvoice', { visible: false })
      this.pin = ''
    },
    focusPin() {
      this.$refs.pin.focus()
    },
    openPin(pin) {
      if (this.isLoadingPin) return
      const { value } = this.attributePin
      this.isLoadingPin = true
      this.focusPin()
      const attributePin = isEmptyValue(this.$store.getters.getOverdrawnInvoice.attributePin) ? this.attributePin : this.$store.getters.getOverdrawnInvoice.attributePin
      const { requestedAccess } = attributePin
      validatePin({
        posUuid: this.currentPointOfSales.uuid,
        pin,
        requestedAccess,
        orderId: this.currentOrder.id,
        requestedAmount: value
      })
        .then(response => {
          this.validatePin = true
          this.pin = ''
          this.visible = false
          this.optionPin(this.attributePin)
          this.$message({
            type: 'success',
            message: this.$t('pointOfSales.pin.validateSuccessfully'),
            showClose: true
          })
        })
        .catch(error => {
          console.error(error.message)
          this.$message({
            type: 'error',
            message: error.message,
            showClose: true
          })
          this.pin = ''
        })
        .finally(() => {
          this.pin = ''
          this.visible = false
          this.isLoadingPin = false
        })
    },
    validateOption(name, requestedAccess, value) {
      this.visible = true
      this.attributePin = {
        type: 'updateOrder',
        label: name,
        requestedAccess,
        value
      }
    },
    optionPin(action) {
      switch (action.label) {
        case this.$t('form.pos.optionsPoinSales.salesOrder.createNewReturnOrder'):
          this.createNewCustomerReturnOrder()
          break
        case this.$t('form.pos.optionsPoinSales.salesOrder.completePreparedOrder'):
          this.completePreparedOrder()
          break
        case this.$t('form.pos.optionsPoinSales.salesOrder.generateImmediateInvoice'):
          this.generateImmediateInvoice()
          break
        case this.$t('form.pos.optionsPoinSales.salesOrder.cancelSaleTransaction'):
          this.reverseSalesTransaction()
          break
        case this.$t('form.pos.optionsPoinSales.salesOrder.createPos'):
          this.withdrawal()
          break
        case this.$t('form.pos.optionsPoinSales.salesOrder.print'):
          this.printTicket()
          break
        case this.$t('form.pos.optionsPoinSales.salesOrder.preview'):
          this.printPreview()
          break
        case this.$t('form.pos.optionsPoinSales.salesOrder.copyOrder'):
          this.copyOrder()
          break
        case this.$t('form.pos.optionsPoinSales.salesOrder.cancelOrder'):
          this.deleteOrder()
          break
        case this.$t('form.pos.optionsPoinSales.generalOptions.changePos'):
          this.changePos()
          break
        case this.$t('form.pos.pinMessage.newOrder'):
          this.newOrder()
          break
        case this.$t('form.pos.returnProduct'):
          this.openReturnProduct()
          break
        case this.$t('form.pos.optionsPoinSales.cashManagement.cashOpening'):
          this.openCashOpening()
          break
        case this.$t('form.pos.optionsPoinSales.cashManagement.cashwithdrawal'):
          this.openCashWithdrawal()
          break
        case this.$t('form.pos.optionsPoinSales.cashManagement.closeBox'):
          this.openCashClosing()
          break
        case this.$t('form.pos.optionsPoinSales.cashManagement.detailedCloseBox'):
          this.openCashDetailsClosing()
          break
        case this.$t('form.pos.optionsPoinSales.cashManagement.assignSeller'):
          this.assignSeller()
          break
        case this.$t('form.pos.optionsPoinSales.cashManagement.unassignSeller'):
          this.unassignSeller()
          break
        case this.$t('form.pos.optionsPoinSales.cashManagement.moneyIncome'):
          this.moneyIncome()
          break
        case this.$t('form.pos.optionsPoinSales.cashManagement.transfer'):
          this.transfer()
          break
        case this.$t('form.pos.applyDiscountOnOrder'):
          this.applyDiscount(action.value, true)
          break
        case this.$t('form.pos.salesDiscountOff'):
          this.salesDiscount(action.value, true)
          break
      }
    },
    printPreview() {
      const posUuid = this.currentPointOfSales.uuid
      const orderUuid = this.currentOrder.uuid

      this.isLoadingPrintPreview = true
      this.$store.dispatch('printTicketPreviwer', {
        posUuid,
        orderUuid
      })
        .then(response => {
          const { processLog } = response
          if (!isEmptyValue(processLog.output)) {
            const link = buildLinkHref({
              fileName: processLog.output.file_name,
              outputStream: processLog.output.output_stream,
              mimeType: processLog.output.mime_type
            })
            this.$store.commit('setReportOutput', {
              download: link.download,
              format: processLog.output.report_type,
              fileName: processLog.output.file_name,
              link,
              content: processLog.output.output,
              mimeType: processLog.output.mime_type,
              name: processLog.output.name,
              output: processLog.output,
              outputStream: processLog.output.output_stream,
              outputStream_asB64: processLog.output.output_stream_asB64,
              outputStream_asU8: processLog.output.output_stream_asU8,
              reportType: processLog.output.report_type,
              reportUuid: processLog.uuid,
              reportViewUuid: processLog.uuid,
              tableName: 'C_Order',
              url: link.href,
              uuid: processLog.uuid,
              instanceUuid: processLog.instance_uuid
            })
            this.$router.push({
              name: REPORT_VIEWER_NAME,
              params: {
                processId: 110,
                reportUuid: processLog.uuid,
                tableName: 'C_Order',
                menuParentUuid: '',
                instanceUuid: processLog.instance_uuid,
                fileName: processLog.output.name,
                name: processLog.output.name,
                mimeType: processLog.output.mime_type
              }
            }, () => {})
          }
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
        .finally(() => {
          this.isLoadingPrintPreview = false
        })
    },
    printTicket() {
      const posId = this.currentPointOfSales.id
      const orderId = this.currentOrder.id

      this.isLoadingPrintTicket = true
      this.$store.dispatch('printTicket', {
        posId,
        orderId
      })
        .finally(() => {
          this.isLoadingPrintTicket = false
        })
    },
    generateImmediateInvoice() {
      // TODO: Add BPartner
      const { uuid: posUuid, id: posId } = this.currentPointOfSales
      generateImmediateInvoice({
        posId,
        posUuid
      })
      // close panel lef
      this.$store.commit('setShowPOSOptions', false)
    },
    completePreparedOrder() {
      if (this.$store.getters.getProcessLoading) return
      if (isEmptyValue(this.currentOrder.uuid) || this.currentOrder.documentStatus.value !== 'DR') {
        return ''
      }
      const orderUuid = this.currentOrder.uuid
      const posUuid = this.currentPointOfSales.uuid
      this.$store.dispatch('updateOrderPos', true)
      this.$store.dispatch('updatePaymentPos', true)
      this.$message({
        type: 'info',
        message: this.$t('notifications.processing'),
        showClose: true
      })
      this.$store.commit('setProcessLoading', true)
      processOrder({
        posUuid,
        orderUuid,
        isOpenRefund: !isEmptyValue(this.$store.getters.getListRefundReference),
        createPayments: false,
        payments: []
      })
        .then(response => {
          this.$store.dispatch('printTicket', { posId: this.currentPointOfSales.id, orderId: this.currentOrder.id })
          this.$store.dispatch('reloadOrder', response.uuid)
            .then(() => {
              if (this.IsAllowsPreviewDocument) this.printPreview()
            })
          this.$message({
            type: 'success',
            message: this.$t('notifications.completed'),
            showClose: true
          })
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
        .finally(() => {
          this.$store.dispatch('listOrdersFromServer', {
            posUuid: this.currentPointOfSales.uuid
          })
          this.$store.dispatch('updateOrderPos', false)
          this.$store.dispatch('updatePaymentPos', false)
          // close panel lef
          this.$store.commit('setProcessLoading', false)
          this.$store.commit('setShowPOSOptions', false)
        })
    },
    reverseSalesTransaction() {
      this.isLoadingReverse = true
      reverseSales({
        posUuid: this.currentPointOfSales.uuid,
        orderUuid: this.currentOrder.uuid,
        description: this.messageReverseSales
      })
        .then(response => {
          this.$store.dispatch('printTicket', { posId: this.currentPointOfSales.id, orderId: response.id })
          this.$store.dispatch('reloadOrder', response.uuid)
            .then(() => {
              if (this.IsAllowsPreviewDocument) this.printPreview()
            })
          this.$store.dispatch('setCurrentPOS', this.currentPointOfSales)
          // this.clearOrder()
          this.summaryReverseOrder = {
            type: 'success',
            title: this.$t('form.pos.optionsPoinSales.salesOrder.cancelSaleTransaction'),
            documentNo: response.document_no
          }
        })
        .catch(error => {
          console.error(error.message)
          this.showReverseOrder = true
          this.summaryReverseOrder = {
            type: 'error',
            title: this.$t('form.pos.optionsPoinSales.salesOrder.cancelSaleTransaction'),
            documentNo: this.currentOrder.documentNo
          }
          this.$message({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
        .finally(() => {
          this.showReverseOrder = true
          this.isLoadingReverse = false
          this.visibleReverse = false
          this.messageReverseSales = ''
        })
    },
    withdrawal() {
      const { uuid: posUuid, id: posId } = this.currentPointOfSales
      // TODO: Add BParner, C_BankAccount_ID (caja), CashTransferBankAccount_ID, PAY_C_BankAccount_ID
      withdrawal({
        posId,
        posUuid
      })
      // close panel lef
      this.$store.commit('setShowPOSOptions', false)
    },
    createNewCustomerReturnOrder() {
      // TODO: New Customer Return Order
      if (isEmptyValue(this.currentOrder.uuid)) {
        return ''
      }

      createNewReturnOrder({
        orderUuid: this.currentOrder.uuid
      })
      // close panel lef
      this.$store.commit('setShowPOSOptions', false)
    },
    showModal(action) {
      // this.$store.dispatch('setShowDialog', {
      //   type: action.type,
      //   action: {
      //     ...action,
      //     containerUuid: action.uuid
      //   }
      // })
    },
    closeReturnProductPreviwer() {
      if (this.isCreateNewSubstituteOrder) {
        newOrderFromRMA({
          posId: this.currentPointOfSales.id,
          sourceRmaId: this.$store.getters.getSummaryRMA.order.id,
          salesRepresentativeId: this.$store.getters.getSummaryRMA.order.salesRepresentative.id
        })
          .then(response => {
            this.$store.dispatch('reloadOrder', { orderUuid: response.uuid })
            this.$message({
              type: 'success',
              message: 'Ok',
              showClose: true
            })
          })
          .catch(error => {
            this.$message({
              type: 'error',
              message: error.message,
              showClose: true
            })
          })
      }
      this.showSummaryReturnProduct = false
    },
    newOrderRMA() {
      if (isEmptyValue(this.currentOrder.id)) {
        return ''
      }
      newOrderFromRMA({
        posId: this.currentPointOfSales.id,
        sourceRmaId: this.currentOrder.id,
        salesRepresentativeId: this.currentPointOfSales.salesRepresentative.id
      })
        .then(response => {
          this.$store.dispatch('reloadOrder', { orderUuid: response.uuid })
          this.$message({
            type: 'success',
            message: 'Ok',
            showClose: true
          })
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
    },
    copyOrder() {
      // TODO: Support Copy Order
      if (isEmptyValue(this.currentOrder.uuid)) {
        return ''
      }
      copyOrder({
        posId: this.currentPointOfSales.id,
        orderId: this.currentOrder.id,
        salesRepresentativeId: this.currentPointOfSales.salesRepresentative.id
      })
        .then(response => {
          this.$store.dispatch('reloadOrder', { orderUuid: response.uuid })
          this.$message({
            type: 'success',
            message: 'Ok',
            showClose: true
          })
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
    },
    copyLineOrder() {
      const process = this.$store.getters.getProcess(this.posProcess[1].uuid)
      this.showModal(process)
    },
    deleteOrder() {
      if (isEmptyValue(this.currentOrder.uuid) || this.isProcessed) {
        return ''
      }
      this.$store.dispatch('updateOrderPos', true)
      deleteOrder({
        orderUuid: this.currentOrder.uuid
      })
        .then(response => {
          this.changePos(this.currentPointOfSales)
          this.$message({
            type: 'success',
            message: this.$t('form.pos.optionsPoinSales.salesOrder.orderRemoved'),
            showClose: true
          })
          this.$store.dispatch('listOrdersFromServer', {
            posUuid: this.currentPointOfSales.uuid
          })
          this.$store.dispatch('updateOrderPos', false)
          // close panel lef
          this.$store.commit('setShowPOSOptions', false)
          this.newOrder()
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
    },
    applyDiscount(discountAmount, isValidatePin = false) {
      if (discountAmount > this.currentPointOfSales.maximumLineDiscountAllowed && !isValidatePin || !this.isAllowsModifyDiscount) {
        this.validateOption(this.$t('form.pos.applyDiscountOnOrder'), 'applyDiscount', discountAmount)
        return
      }
      // maximum_discount_allowed
      this.$store.dispatch('updateOrder', {
        orderUuid: this.currentOrder.uuid,
        posUuid: this.currentPointOfSales.uuid,
        discountAmount,
        isDiscountOrder: true
      })
        .then(response => {
          this.$message({
            type: 'success',
            showClose: true,
            message: 'ok'
          })
          this.$store.commit('updateValueOfField', {
            containerUuid: 'Discount-Order',
            columnName: 'Discount',
            value: ''
          })
        })
        .catch(error => {
          console.warn(error)
          this.$message({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
      this.showCount = false
    },
    salesDiscount(discountRateOff, isValidatePin = false) {
      if (discountRateOff > this.currentPointOfSales.maximumDiscountAllowed && !isValidatePin || !this.isAllowsApplyDiscount) {
        this.validateOption(this.$t('form.pos.applyDiscountOnOrder'), 'applyDiscount', discountRateOff)
        return
      }
      this.$store.dispatch('updateOrder', {
        orderUuid: this.currentOrder.uuid,
        posUuid: this.currentPointOfSales.uuid,
        discountRateOff,
        isDiscountOrder: true
      })
        .then(response => {
          setTimeout(() => {
            this.$message({
              type: 'success',
              showClose: true,
              message: 'ok'
            })
          }, 2000)
        })
        .catch(error => {
          console.warn(error)
          this.$message({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
      this.$store.commit('updateValueOfField', {
        containerUuid: 'Sales-Discount-Off',
        columnName: 'Discount',
        value: ''
      })
      this.showSalesDiscount = false
    },
    applyDiscountToAllLines(discountRateAllLines, isValidatePin = false) {
      if (discountRateAllLines > this.currentPointOfSales.maximumDiscountAllowed && !isValidatePin || !this.isAllowsApplyDiscount) {
        this.validateOption(this.$t('form.pos.applyDiscountOnOrder'), 'applyDiscount', discountRateAllLines)
        return
      }
      this.$store.dispatch('updateOrder', {
        orderUuid: this.currentOrder.uuid,
        posUuid: this.currentPointOfSales.uuid,
        discountAllLine: discountRateAllLines
      })
        .then(response => {
          setTimeout(() => {
            this.$message({
              type: 'success',
              showClose: true,
              message: 'ok'
            })
          }, 2000)
        })
        .catch(error => {
          console.warn(error)
          this.$message({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
      this.$store.commit('updateValueOfField', {
        containerUuid: 'Sales-Discount-All-Lines',
        columnName: 'Discount',
        value: ''
      })
      this.showDiscountAllLines = false
    },
    seeOrderList() {
      if (this.ordersList.recordCount <= 0) {
        this.$store.dispatch('listOrdersFromServer', {})
      }
    },
    changePos(posElement) {
      if (this.isMobile) {
        this.isShowedPOSOptions = false
      }
      if (this.adviserPin) {
        this.validateOption(this.$t('form.pos.optionsPoinSales.generalOptions.changePos'))
        return
      }

      this.$store.dispatch('setCurrentPOS', posElement)
      this.clearOrder()
    },
    newOrder() {
      const posUuid = this.currentPointOfSales.uuid
      const bpartner = this.$store.getters.getValueOfField({
        containerUuid: this.$route.meta.uuid,
        columnName: 'C_BPartner_ID_UUID'
      })
      const id = this.$store.getters.getValueOfField({
        containerUuid: this.$route.meta.uuid,
        columnName: 'C_BPartner_ID'
      })
      // const documentTypeUuid = this.$store.getters.getValueOfField({
      //   containerUuid: this.$route.meta.uuid,
      //   columnName: 'C_DocTypeTarget_ID_UUID'
      // })
      let customerUuid = isEmptyValue(bpartner) ? this.$store.getters.getNewCustomer.uuid : bpartner
      // TODO: Validate this static identifier
      if (isEmptyValue(customerUuid) || id === 1000006) {
        customerUuid = this.currentPointOfSales.templateCustomer.uuid
      }
      this.$store.dispatch('createOrder', {
        posUuid,
        customerUuid: this.currentPointOfSales.templateCustomer.uuid,
        salesRepresentativeUuid: this.currentPointOfSales.salesRepresentative.uuid,
        documentTypeUuid: this.currentPointOfSales.documentType.uuid
      })
        .then(response => {
          this.$store.dispatch('reloadOrder', { orderUuid: response.uuid })
          this.$router.push({
            params: {
              ...this.$route.params
            },
            query: {
              ...this.$route.query,
              action: response.uuid
            }
          }).then(() => {
            this.$store.commit('setShowPOSCollection', false)
            this.$store.dispatch('listOrdersFromServer', {
              posUuid: this.currentPointOfSales.uuid
            })
          }).catch(() => {})
        })
      this.$store.dispatch('changeFocusNewOrder', true)
    },
    clearOrder() {
      this.$router.push({
        params: {
          ...this.$route.params
        },
        query: {
          pos: this.currentPointOfSales.id
        }
      }).catch(() => {
      }).finally(() => {
        this.$store.commit('setListPayments', {})
        const { templateCustomer } = this.currentPointOfSales
        this.$store.commit('updateValuesOfContainer', {
          containerUuid: this.metadata.containerUuid,
          attributes: [{
            columnName: 'UUID',
            value: undefined
          },
          {
            columnName: 'ProductValue',
            value: undefined
          },
          {
            columnName: 'C_BPartner_ID',
            value: templateCustomer.id
          },
          {
            columnName: 'DisplayColumn_C_BPartner_ID',
            value: templateCustomer.name
          },
          {
            columnName: ' C_BPartner_ID_UUID',
            value: templateCustomer.uuid
          }]
        })
        this.$store.dispatch('setOrder', {
          documentType: {},
          documentStatus: {
            value: ''
          },
          totalLines: 0,
          grandTotal: 0,
          salesRepresentative: {},
          businessPartner: {
            value: '',
            uuid: ''
          }
        })
        this.$store.commit('setShowPOSCollection', false)
        this.$store.dispatch('listOrderLine', [])
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .is-disabled-option-popover {
    cursor: not-allowed;
    text-align: center !important;
    color: gray !important;
    min-height: 50px;
    width: -webkit-fill-available;
    white-space: normal;
  }
  .is-enable-option-popover {
    cursor: pointer;
    text-align: center !important;
    color: black;
    min-height: 50px;
    width: -webkit-fill-available;
    white-space: normal;
  }
  .is-disabled-option-card {
    cursor: not-allowed;
    text-align: center !important;
    color: gray !important;
    min-height: 50px;
  }
  .is-enable-option-card {
    cursor: pointer;
    text-align: center !important;
    color: black !important;
    min-height: 50px;
  }
  .el-button--text {
    border-color: transparent;
    color: black;
    background: transparent;
    padding-left: 0;
    padding-right: 0;
  }
  .el-button--text:hover, .el-button--text:focus {
    color: #46a6ff !important;
    border-color: transparent;
    background-color: transparent;
  }
  .el-col :hover {
    background-color: rgba(209, 233, 255, 0.719);
  }
  .title-of-option {
    cursor: pointer;
    text-align: center !important;
  }
  .spam-button {
    float: right;
    padding-top: 5px;
    background-color:white;
    background:white;
  }
  .container-reverse {
    background-color:white;
    background:white;
  }
  .container-popover {
    padding-right: 10px;
    background-color:white;
    background:white;
  }
  .dialog-seller {
    overflow: hidden;
  }
</style>
<style>
  .el-textarea__inner:hover {
    background-color: #FFFFFF!important;
  }
  .dialog-return-product {
    height: 70%;
    .el-dialog__body {
      height: -webkit-fill-available;
    }
  }
</style>
