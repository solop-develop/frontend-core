/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com https://github.com/EdwinBetanc0urt
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import language from '@/lang'
import store from '@/store'

export const ACCOUTING_ELEMENT_COLUMNS = [
  // {
  //   elementType: 'OO',
  //   columnName: 'AD_Org_ID',
  //   name: language.t('form.accountingViewer.organization'),
  //   isMandatory: true,
  // },
  // {
  //   elementType: 'AC',
  //   name: language.t('form.accountingViewer.account'),
  //   columnName: 'Account_ID',
  //   isMandatory: true
  // },
  {
    elementType: 'PR',
    columnName: 'M_Product_ID',
    name: language.t('form.accountingViewer.product'),
    isMandatory: false
  },
  {
    elementType: 'BP',
    columnName: 'C_BPartner_ID',
    name: language.t('form.accountingViewer.businessPartner'),
    isMandatory: false
  },
  {
    elementType: 'PJ',
    columnName: 'C_Project_ID',
    name: language.t('form.accountingViewer.project'),
    isMandatory: false
  },
  {
    elementType: 'MC',
    columnName: 'C_Campaign_ID',
    name: language.t('form.accountingViewer.campaign'),
    isMandatory: false
  },
  {
    elementType: 'SR',
    columnName: 'C_SalesRegion_ID',
    name: language.t('form.accountingViewer.salesRegion'),
    isMandatory: false
  },
  {
    elementType: 'OT',
    columnName: 'AD_OrgTrx_ID',
    name: language.t('form.accountingViewer.organizationTransaction'),
    isMandatory: false
  },
  {
    elementType: 'LF',
    columnName: 'C_LocFrom_ID',
    name: language.t('form.accountingViewer.locationFrom'),
    isMandatory: false
  },
  {
    elementType: 'LT',
    columnName: 'C_LocTo_ID',
    name: language.t('form.accountingViewer.locationTo'),
    isMandatory: false
  },
  {
    elementType: 'U1',
    columnName: 'User1_ID',
    name: language.t('form.accountingViewer.userList1'),
    isMandatory: false
  },
  {
    elementType: 'U2',
    columnName: 'User2_ID',
    name: language.t('form.accountingViewer.userList2'),
    isMandatory: false
  },
  {
    elementType: 'AY',
    columnName: 'C_Activity_ID',
    name: language.t('form.accountingViewer.activity'),
    isMandatory: false
  },
  {
    elementType: 'SA',
    columnName: 'C_SubAcct_ID',
    name: language.t('form.accountingViewer.subAccount'),
    isMandatory: false
  },
  {
    elementType: 'X1',
    columnName: 'UserElement1_ID',
    name: language.t('form.accountingViewer.userElement1'),
    isMandatory: false
  },
  {
    elementType: 'X2',
    columnName: 'UserElement2_ID',
    name: language.t('form.accountingViewer.userElement2'),
    isMandatory: false
  },
  {
    elementType: 'U3',
    columnName: 'User1_ID',
    name: language.t('form.accountingViewer.userList3'),
    isMandatory: false
  },
  {
    elementType: 'U4',
    columnName: 'User4_ID',
    name: language.t('form.accountingViewer.userList4'),
    isMandatory: false
  }
]

const ACCOUTING_ELEMENT_PREFIX = '$Element_'

export function getAvaliableAccountingElements() {
  const availableAccoutingElements = ACCOUTING_ELEMENT_COLUMNS.filter(acctElemnt => {
    const { elementType, isMandatory } = acctElemnt
    if (isMandatory) {
      return true
    }
    const isEnableContext = store.getters.getSessionContext({
      columnName: ACCOUTING_ELEMENT_PREFIX + elementType
    })
    return Boolean(isEnableContext)
  })
  return availableAccoutingElements
}
