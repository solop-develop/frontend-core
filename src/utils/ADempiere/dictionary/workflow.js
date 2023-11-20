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
import store from '@/store'

// Constants
import { DOCUMENT_STATUS, PROCESSING } from '@/utils/ADempiere/constants/systemColumns'
import { DISPLAY_COLUMN_PREFIX } from '@/utils/ADempiere/dictionaryUtils'

// Utils and Helpers Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { getContext } from '@/utils/ADempiere/contextUtils'
import { convertStringToBoolean } from '@/utils/ADempiere/formatValue/booleanFormat'

/**
 * <None> = --
 */
export const ACTION_None = '--'

/**
 * Document Status is Unknown
 */
export const STATUS_Unknown = '??'

/**
 * If is end docuemnt status not change with document action
 * @param {String} documentStatus
 * @returns {Boolean}
 */
export function isEndDocumentAction(documentStatus) {
  if (['CL', 'VO', 'RE'].includes(documentStatus)) {
    return true
  }
  return false
}

export function getDocumentStatusValue({
  parentUuid,
  containerUuid
}) {
  const documentStatus = getContext({
    parentUuid,
    containerUuid,
    columnName: DOCUMENT_STATUS
  })
  return documentStatus
}

export function getCurrentDocumentDisplayedValue({
  parentUuid,
  containerUuid,
  contextColumnNames,
  uuid,
  value
}) {
  if (isEmptyValue(value)) {
    value = getDocumentStatusValue({
      parentUuid,
      containerUuid
    })
  }
  if (isEmptyValue(value)) {
    return undefined
  }
  const displayedValue = getContext({
    parentUuid,
    containerUuid,
    columnName: DISPLAY_COLUMN_PREFIX + DOCUMENT_STATUS
  })

  if (!isEmptyValue(displayedValue)) {
    return displayedValue
  }

  if (!isEmptyValue(uuid)) {
    const defaultValue = store.getters.getStoredDefaultValue({
      parentUuid,
      containerUuid,
      contextColumnNames,
      uuid,
      value
    })
    if (!isEmptyValue(defaultValue)) {
      return defaultValue.displayedValue
    }
  }

  return undefined
}

/**
 * Is Enable to Run Document Action
 * @param {String} parentUuid
 * @param {String} containerUuid
 * @returns {Boolean}
 */
export function isRunableDocumentAction({ parentUuid, containerUuid }) {
  // table not document or multi record
  const storedTab = store.getters.getStoredTab(parentUuid, containerUuid)
  if (!storedTab.isDocument || storedTab.isShowedTableRecords) {
    return false
  }

  // default values as new record
  const recordUuid = store.getters.getUuidOfContainer(containerUuid)
  if (isEmptyValue(recordUuid) || recordUuid === 'create-new') {
    return false
  }

  const processing = store.getters.getValueOfFieldOnContainer({
    parentUuid,
    containerUuid,
    columnName: PROCESSING
  })
  if (convertStringToBoolean(processing)) {
    return true
  }

  // TODO: Evalute first the document statuses list
  // document is closed
  const documentStatus = store.getters.getValueOfFieldOnContainer({
    containerUuid,
    columnName: DOCUMENT_STATUS
  })
  // Closed, Voided, Reversed
  if (isEndDocumentAction(documentStatus)) {
    return false
  }

  return true
}

/**
 * Tag Render compatible with element button
 * @param {string} documentStatus or document action
 * @returns {object}
 */
export function tagRender(documentStatus) {
  let effect = 'plain'
  let type = 'info'
  switch (documentStatus) {
    case 'AP':
      type = 'success'
      effect = 'light'
      break

    case 'CO':
      type = 'success'
      effect = 'dark'
      break

    case '??':
    case 'DR':
      type = 'info'
      effect = 'light'
      break

    case '--':
      type = 'primary'
      effect = 'light'
      break
    case 'CL':
      type = 'info'
      effect = 'dark'
      break

    case 'IP':
      type = 'warning'
      effect = 'light'
      break

    case 'WC':
    case 'WP':
      type = 'warning'
      effect = 'dark'
      break

    case 'VO':
      type = 'danger'
      effect = 'plain'
      break

    case 'NA':
    case 'IN':
    case 'RE':
      type = 'danger'
      effect = 'light'
      break
  }
  return {
    type,
    effect
  }
}

export function generateTransitions(nodesList) {
  const transitionsList = []

  nodesList.forEach(element => {
    const uuid = element.uuid
    const id = element.value

    if (!isEmptyValue(element.transitions)) {
      element.transitions.forEach((nextNode, key) => {
        if (!isEmptyValue(nextNode.node_next_uuid)) {
          transitionsList.push({
            id: id + key,
            label: nextNode.description,
            target: nextNode.node_next_uuid,
            source: uuid
          })
        }
      })
    }
  })
  const blon = nodesList.map(item => {
    return {
      uuid: item.uuid
    }
  })

  const workflowTranstitionsList = transitionsList.filter(data => {
    const isExists = blon.find(mode => mode.uuid === data.source)
    if (!isEmptyValue(isExists)) {
      return data
    }
  })

  return workflowTranstitionsList
}

export function generateStates(nodesList) {
  // TODO: Verify it filter or replace with id
  // nodesList = nodesList.filter(node => !isEmptyValue(node.uuid))
  let statesList = []

  if (!isEmptyValue(nodesList)) {
    statesList = nodesList.map((node, key) => {
      return {
        id: node.uuid,
        label: node.name,
        key,
        description: node.description,
        help: node.help
      }
    })
  }

  return statesList
}

export function generateWorkflowDiagram(workflowDefinition) {
  const stateSemanticsList = []
  if (!isEmptyValue(workflowDefinition.start_node)) {
    stateSemanticsList.push({
      classname: 'start-node',
      id: workflowDefinition.start_node.uuid
    })
  }

  const transitionsList = generateTransitions(workflowDefinition.workflow_nodes)

  const statesList = generateStates(workflowDefinition.workflow_nodes)

  return {
    stateSemanticsList,
    transitionsList,
    statesList // as node list
  }
}
